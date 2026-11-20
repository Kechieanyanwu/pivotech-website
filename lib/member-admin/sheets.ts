import "server-only";
import { createSign, randomUUID } from "node:crypto";

export type Member = {
  personId: string;
  name: string;
  email: string;
  linkedin: string;
  building: string;
  goals: string;
  strengths: string;
  events: string[];
  registrationCount: number;
};

export type MemberTag = {
  personId: string;
  tag: string;
  category: string;
  source: string;
  status: "confirmed" | "rejected";
  evidence: string;
  updatedAt: string;
};

export type MemberInteraction = {
  interactionId: string;
  personId: string;
  date: string;
  type: "Note" | "Introduction" | "Follow-up";
  summary: string;
  followUpDate: string;
  followUpStatus: "Pending" | "Done" | "";
  createdAt: string;
};

export type MemberEventResponse = {
  responseId: string;
  personId: string;
  event: string;
  approvalStatus: string;
  checkedInAt: string;
  submittedAt: string;
  linkedinAnswer: string;
  building: string;
  goals: string;
  strengths: string;
};

export type TalkSubmission = {
  talkId: string;
  personId: string;
  presenterName: string;
  linkedin: string;
  location: string;
  title: string;
  why: string;
  format: string;
  submittedAt: string;
};

type SheetsValueResponse = { values?: string[][] };
type SpreadsheetMetadata = {
  sheets?: Array<{ properties?: { title?: string } }>;
};
type TokenResponse = {
  access_token?: string;
  expires_in?: number;
  error_description?: string;
};

let tokenCache: { token: string; expiresAt: number } | undefined;
const TAG_HEADERS = [
  "Person ID",
  "Tag",
  "Category",
  "Source",
  "Status",
  "Evidence",
  "Updated At",
];
const INTERACTION_HEADERS = [
  "Interaction ID",
  "Person ID",
  "Date",
  "Type",
  "Summary",
  "Follow-up date",
  "Follow-up status",
  "Created At",
];

function config() {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const talksSpreadsheetId = process.env.GOOGLE_TALKS_SPREADSHEET_ID || "1ipZzCLRP7s3ED8J0LTwHtyJ0qGk72pr5ij5jaaFM4yQ";
  const serviceEmail = process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  if (!spreadsheetId || !serviceEmail || !rawKey) {
    throw new Error(
      "Google Sheets access is not configured. Set the server-only Google Sheets variables.",
    );
  }
  return {
    spreadsheetId,
    talksSpreadsheetId,
    serviceEmail,
    privateKey: rawKey.replace(/\\n/g, "\n"),
  };
}

const b64url = (value: string | Buffer) =>
  Buffer.from(value).toString("base64url");

async function accessToken() {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000)
    return tokenCache.token;
  const { serviceEmail, privateKey } = config();
  const issuedAt = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64url(
    JSON.stringify({
      iss: serviceEmail,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: "https://oauth2.googleapis.com/token",
      iat: issuedAt,
      exp: issuedAt + 3600,
    }),
  );
  const unsigned = `${header}.${claims}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const assertion = `${unsigned}.${signer.sign(privateKey).toString("base64url")}`;
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    cache: "no-store",
  });
  const result = (await response.json()) as TokenResponse;
  if (!response.ok || !result.access_token)
    throw new Error(
      result.error_description || "Could not authenticate with Google Sheets.",
    );
  tokenCache = {
    token: result.access_token,
    expiresAt: Date.now() + (result.expires_in || 3600) * 1000,
  };
  return tokenCache.token;
}

async function sheetsRequest<T>(path: string, init?: RequestInit, spreadsheetId?: string): Promise<T> {
  const targetSpreadsheetId = spreadsheetId || config().spreadsheetId;
  const token = await accessToken();
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${targetSpreadsheetId}${path}`,
    {
      ...init,
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
        ...init?.headers,
      },
      cache: "no-store",
    },
  );
  const text = await response.text();
  let body: unknown;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = {};
  }
  if (!response.ok) {
    const message = (body as { error?: { message?: string } })?.error?.message;
    throw new Error(
      message || `Google Sheets request failed (${response.status}).`,
    );
  }
  return body as T;
}

async function readRange(range: string, spreadsheetId?: string) {
  const path = `/values/${encodeURIComponent(range)}?valueRenderOption=FORMATTED_VALUE`;
  const result = await sheetsRequest<SheetsValueResponse>(path, {
    method: "GET",
  }, spreadsheetId);
  return result.values || [];
}

async function sheetTitles() {
  const result = await sheetsRequest<SpreadsheetMetadata>(
    "?fields=sheets.properties.title",
    { method: "GET" },
  );
  return (result.sheets || []).map((sheet) => sheet.properties?.title || "");
}

export async function getMembers(): Promise<Member[]> {
  const rows = await readRange("'People'!A1:J1000");
  const headers = rows[0] || [];
  const index = Object.fromEntries(
    headers.map((header, column) => [header, column]),
  );
  const cell = (row: string[], name: string) => row[index[name]] || "";
  return rows
    .slice(1)
    .filter((row) => cell(row, "Person ID"))
    .map((row) => ({
      personId: cell(row, "Person ID"),
      name: cell(row, "Name"),
      email: cell(row, "Normalized email"),
      linkedin: cell(row, "LinkedIn"),
      building: cell(row, "Building / learning"),
      goals: cell(row, "Event goals"),
      strengths: cell(row, "Skills / strengths"),
      events: cell(row, "Events")
        .split(";")
        .map((value) => value.trim())
        .filter(Boolean),
      registrationCount: Number(cell(row, "Registration count")) || 0,
    }));
}

export async function getMemberTags(): Promise<MemberTag[]> {
  const titles = await sheetTitles();
  if (!titles.includes("Member Interests")) return [];
  const rows = await readRange("'Member Interests'!A1:G1000");
  return rows
    .slice(1)
    .filter((row) => row[0] && row[1])
    .map((row) => ({
      personId: row[0] || "",
      tag: row[1] || "",
      category: row[2] || "Interest",
      source: row[3] || "manual",
      status: row[4] === "rejected" ? "rejected" : "confirmed",
      evidence: row[5] || "",
      updatedAt: row[6] || "",
    }));
}

export async function getMemberInteractions(): Promise<MemberInteraction[]> {
  const titles = await sheetTitles();
  if (!titles.includes("Member Interactions")) return [];
  const rows = await readRange("'Member Interactions'!A1:H2000");
  return rows
    .slice(1)
    .filter((row) => row[0] && row[1])
    .map((row) => ({
      interactionId: row[0] || "",
      personId: row[1] || "",
      date: row[2] || "",
      type:
        row[3] === "Introduction" || row[3] === "Follow-up" ? row[3] : "Note",
      summary: row[4] || "",
      followUpDate: row[5] || "",
      followUpStatus: row[6] === "Pending" || row[6] === "Done" ? row[6] : "",
      createdAt: row[7] || "",
    }));
}

const EVENT_SOURCES = [
  { event: "Winter Salon", sheet: "Conversations with Technologists_ Winter Salon - Guests - 2026-11-20-14-54-08", endRow: 80, endColumn: "AM" },
  { event: "Ideas Worth Building", sheet: "Conversations with Technologists_ Ideas worth building - Guests - 2026-09-24-08-36-01", endRow: 67, endColumn: "AM" },
  { event: "Demo Day", sheet: "Conversations With Technologists_ Demo day - Guests - 2026-07-24-08-55-09", endRow: 1000, endColumn: "Y" },
];

export async function getMemberEventResponses(members: Member[]): Promise<MemberEventResponse[]> {
  const personByEmail = new Map(members.map((member) => [member.email.trim().toLowerCase(), member.personId]));
  const sources = await Promise.all(EVENT_SOURCES.map(async (source) => ({
    ...source,
    rows: await readRange(`'${source.sheet}'!A1:${source.endColumn}${source.endRow}`),
  })));
  const responses: MemberEventResponse[] = [];
  for (const source of sources) {
    const headers = source.rows[0] || [];
    const index = (predicate: (header: string) => boolean) => headers.findIndex((header) => predicate(header));
    const col = {
      email: index((header) => header === "email"),
      status: index((header) => header === "approval_status"),
      checkin: index((header) => header === "checked_in_at"),
      submitted: index((header) => header === "created_at"),
      linkedin: index((header) => header.startsWith("What is your LinkedIn profile?")),
      building: index((header) => header.startsWith("What have you been building")),
      goals: index((header) => header.startsWith("What would make this event a success")),
      strengths: index((header) => header.startsWith("What do you do, and what are you particularly good at?")),
    };
    source.rows.slice(1).forEach((row, rowIndex) => {
      const email = (row[col.email] || "").trim().toLowerCase();
      const personId = personByEmail.get(email);
      if (!personId) return;
      const answers = [row[col.linkedin], row[col.building], row[col.goals], row[col.strengths]];
      if (!answers.some((answer) => answer?.trim())) return;
      responses.push({
        responseId: `${source.event}-${rowIndex + 2}`,
        personId,
        event: source.event,
        approvalStatus: row[col.status] || "unknown",
        checkedInAt: row[col.checkin] || "",
        submittedAt: row[col.submitted] || "",
        linkedinAnswer: row[col.linkedin] || "",
        building: row[col.building] || "",
        goals: row[col.goals] || "",
        strengths: row[col.strengths] || "",
      });
    });
  }
  return responses.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

function normalizeLinkedIn(value: string) {
  try {
    const url = new URL(value.trim());
    return `${url.hostname.replace(/^www\./i, "").toLowerCase()}${url.pathname.replace(/\/+$/, "")}`;
  } catch {
    return value.trim().toLowerCase().replace(/\/+$/, "");
  }
}

export async function getTalkSubmissions(members: Member[]): Promise<TalkSubmission[]> {
  const { talksSpreadsheetId } = config();
  const rows = await readRange("'Form Responses 1'!A1:H114", talksSpreadsheetId);
  const headers = rows[0] || [];
  const column = (name: string) => headers.indexOf(name);
  const peopleByEmail = new Map(members.map((member) => [member.email.trim().toLowerCase(), member.personId]));
  const peopleByLinkedIn = new Map<string, string[]>();
  for (const member of members) {
    const key = normalizeLinkedIn(member.linkedin);
    if (key) peopleByLinkedIn.set(key, [...(peopleByLinkedIn.get(key) || []), member.personId]);
  }
  return rows.slice(1).flatMap((row, index) => {
    if (!row.some((value) => value?.trim())) return [];
    const email = (row[column("Email")] || "").trim().toLowerCase();
    const linkedin = row[column("Linkedin profile")] || "";
    const emailMatch = peopleByEmail.get(email);
    const linkedinMatches = peopleByLinkedIn.get(normalizeLinkedIn(linkedin)) || [];
    const personId = emailMatch || (linkedinMatches.length === 1 ? linkedinMatches[0] : "");
    return [{
      talkId: `talk-${index + 2}`,
      personId,
      presenterName: row[column("Full name")] || "Name not provided",
      linkedin,
      location: row[column("Where are you located? (e.g. London, Lagos)")] || "",
      title: row[column("What will you be sharing? What's the key insight or takeaway for attendees?")] || "Talk title not provided",
      why: row[column("Why does this matter to you? We want to hear your genuine curiosity and passion")] || "",
      format: row[column("Will you be using slides or a visual aid?")] || "",
      submittedAt: row[column("Timestamp")] || "",
    }];
  }).sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

async function ensureMemberInterestsTab() {
  const titles = await sheetTitles();
  if (!titles.includes("Member Interests")) {
    await sheetsRequest(":batchUpdate", {
      method: "POST",
      body: JSON.stringify({
        requests: [{ addSheet: { properties: { title: "Member Interests" } } }],
      }),
    });
  }
  const existing = await readRange("'Member Interests'!A1:G1");
  if (!existing.length || !existing[0]?.[0]) {
    await sheetsRequest(
      `/values/${encodeURIComponent("'Member Interests'!A1:G1")}?valueInputOption=RAW`,
      {
        method: "PUT",
        body: JSON.stringify({ values: [TAG_HEADERS] }),
      },
    );
  }
}

export async function appendMemberTag(input: Omit<MemberTag, "updatedAt">) {
  const members = await getMembers();
  if (!members.some((member) => member.personId === input.personId))
    throw new Error("That member ID is not in the People tab.");
  await ensureMemberInterestsTab();
  await sheetsRequest(
    `/values/${encodeURIComponent("'Member Interests'!A:G")}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      body: JSON.stringify({
        values: [
          [
            input.personId,
            input.tag,
            input.category,
            input.source,
            input.status,
            input.evidence,
            new Date().toISOString(),
          ],
        ],
      }),
    },
  );
}

async function ensureMemberInteractionsTab() {
  const titles = await sheetTitles();
  if (!titles.includes("Member Interactions")) {
    await sheetsRequest(":batchUpdate", {
      method: "POST",
      body: JSON.stringify({
        requests: [
          { addSheet: { properties: { title: "Member Interactions" } } },
        ],
      }),
    });
  }
  const existing = await readRange("'Member Interactions'!A1:H1");
  if (!existing.length || !existing[0]?.[0]) {
    await sheetsRequest(
      `/values/${encodeURIComponent("'Member Interactions'!A1:H1")}?valueInputOption=RAW`,
      {
        method: "PUT",
        body: JSON.stringify({ values: [INTERACTION_HEADERS] }),
      },
    );
  }
}

export async function appendMemberInteraction(
  input: Omit<MemberInteraction, "interactionId" | "createdAt">,
) {
  const members = await getMembers();
  if (!members.some((member) => member.personId === input.personId))
    throw new Error("That member ID is not in the People tab.");
  await ensureMemberInteractionsTab();
  await sheetsRequest(
    `/values/${encodeURIComponent("'Member Interactions'!A:H")}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      body: JSON.stringify({
        values: [
          [
            randomUUID(),
            input.personId,
            input.date,
            input.type,
            input.summary,
            input.followUpDate,
            input.followUpStatus,
            new Date().toISOString(),
          ],
        ],
      }),
    },
  );
}
