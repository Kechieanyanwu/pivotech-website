"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./member-admin.module.css";

type Member = {
  personId: string; name: string; email: string; linkedin: string; building: string;
  goals: string; strengths: string; events: string[]; registrationCount: number;
};
type TagRecord = {
  personId: string; tag: string; category: string; source: string;
  status: "confirmed" | "rejected"; evidence: string; updatedAt: string;
};
type Interaction = {
  interactionId: string; personId: string; date: string; type: "Note" | "Introduction" | "Follow-up";
  summary: string; followUpDate: string; followUpStatus: "Pending" | "Done" | ""; createdAt: string;
};
type EventResponse = {
  responseId: string; personId: string; event: string; approvalStatus: string; checkedInAt: string; submittedAt: string;
  linkedinAnswer: string; building: string; goals: string; strengths: string;
};
type Talk = {
  talkId: string; personId: string; presenterName: string; linkedin: string; location: string;
  title: string; why: string; format: string; submittedAt: string;
};
type DirectoryData = { members: Member[]; tags: TagRecord[]; interactions: Interaction[]; responses: EventResponse[]; talks: Talk[]; talksError: string };

const TOPIC_RULES: Array<{ tag: string; pattern: RegExp }> = [
  { tag: "AI & automation", pattern: /\b(ai|artificial intelligence|machine learning|\bml\b|llm|voice agent|automation|automating|agentic)\b/i },
  { tag: "Fintech & payments", pattern: /\b(fintech|payment|banking|bank|finance|financial|currency|currencies|credit|money|remittance)\b/i },
  { tag: "Accessibility & inclusion", pattern: /\b(accessib|deaf|hearing|sign language|bsl|disability|inclusive|inclusion)\b/i },
  { tag: "Health & wellbeing", pattern: /\b(health|healthcare|wellbeing|wellness|medical|patient|mental health)\b/i },
  { tag: "Education & learning", pattern: /\b(education|learning|teach|teaching|school|student|university|skills training)\b/i },
  { tag: "Community & networks", pattern: /\b(community|communities|network|networking|ecosystem|connections|salon|meetup)\b/i },
  { tag: "Product & design", pattern: /\b(product|design|user experience|\bux\b|prototype|prototyping)\b/i },
  { tag: "Content & media", pattern: /\b(content|writing|writer|storytelling|media|creator|podcast|journalism)\b/i },
  { tag: "Operations & delivery", pattern: /\b(operations|operation|workflow|process|delivery|project management|execution)\b/i },
  { tag: "Partnerships & growth", pattern: /\b(partnership|partnerships|sales|business development|go.to.market|marketing|growth|distribution)\b/i },
  { tag: "Software & engineering", pattern: /\b(software|engineering|engineer|developer|coding|code|technical|programming)\b/i },
  { tag: "Climate & sustainability", pattern: /\b(climate|sustainab|energy|environment|carbon|renewable)\b/i },
  { tag: "Transport & infrastructure", pattern: /\b(transport|infrastructure|mobility|transit|logistics)\b/i },
  { tag: "Music & creator economy", pattern: /\b(music|artist|creator economy|royalt|entertainment)\b/i },
];
const ROLE_RULES: Array<{ tag: string; pattern: RegExp }> = [
  { tag: "Founder", pattern: /\b(founder|co.founder|entrepreneur)\b/i },
  { tag: "Engineer", pattern: /\b(engineer|engineering|developer|software|programmer)\b/i },
  { tag: "Product", pattern: /\b(product manager|product management|product lead|product thinking)\b/i },
  { tag: "Designer", pattern: /\b(designer|design lead|ux|user experience)\b/i },
  { tag: "Operator", pattern: /\b(operations|operator|project manager)\b/i },
  { tag: "Partnerships", pattern: /\b(partnerships|business development|sales|account manager)\b/i },
  { tag: "Community builder", pattern: /\b(community|communities|community builder|community manager)\b/i },
  { tag: "Investor", pattern: /\b(investor|venture capital|angel investor|\bvc\b)\b/i },
  { tag: "Creative", pattern: /\b(writer|writing|content|creator|journalist|storytelling)\b/i },
];
const initials = (name: string) => name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] || "").join("").toUpperCase();
const unique = (items: string[]) => [...new Set(items.filter(Boolean))];
const safeLinkedIn = (value: string) => /^https:\/\/(www\.)?linkedin\.com\//i.test(value) ? value : "";
const localDate = () => { const now = new Date(); return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
const displayDate = (value: string) => { const date = new Date(value); return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); };

function profileTopics(member: Member) {
  const text = `${member.building} ${member.goals} ${member.strengths}`;
  return TOPIC_RULES.filter((rule) => rule.pattern.test(text)).map((rule) => rule.tag);
}
function profileRoles(member: Member) {
  const text = `${member.building} ${member.strengths}`;
  return ROLE_RULES.filter((rule) => rule.pattern.test(text)).map((rule) => rule.tag);
}
function latestTags(records: TagRecord[]) {
  const result = new Map<string, TagRecord>();
  for (const record of records) {
    const key = `${record.personId}\u0000${record.tag.toLowerCase()}`;
    const prior = result.get(key);
    if (!prior || String(record.updatedAt).localeCompare(String(prior.updatedAt)) >= 0) result.set(key, record);
  }
  return [...result.values()];
}

export default function MemberDirectory() {
  const router = useRouter();
  const [data, setData] = useState<DirectoryData>({ members: [], tags: [], interactions: [], responses: [], talks: [], talksError: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState<"directory" | "interests" | "talks">("directory");
  const [selectedId, setSelectedId] = useState("");
  const [query, setQuery] = useState("");
  const [eventFilter, setEventFilter] = useState("");
  const [interestFilter, setInterestFilter] = useState("");
  const [includeDrafts, setIncludeDrafts] = useState(true);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedResponseId, setSelectedResponseId] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newCategory, setNewCategory] = useState("Interest");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [interactionType, setInteractionType] = useState<Interaction["type"]>("Note");
  const [interactionDate, setInteractionDate] = useState(localDate);
  const [interactionSummary, setInteractionSummary] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  const reload = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/admin/members", { cache: "no-store" });
      if (response.status === 401) { router.replace("/admin/members/login"); return; }
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Member data could not be loaded.");
      setData(body as DirectoryData);
      setSelectedId((current) => current || [...body.members].sort((a: Member,b: Member)=>a.name.localeCompare(b.name))[0]?.personId || "");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Member data could not be loaded.");
    } finally { setLoading(false); }
  }, [router]);

  useEffect(() => { void reload(); }, [reload]);

  const currentTags = useMemo(() => latestTags(data.tags), [data.tags]);
  const customTopics = useMemo(() => currentTags.filter((record) => record.status === "confirmed").map((record) => record.tag), [currentTags]);
  const topicOptions = useMemo(() => unique([...TOPIC_RULES.map((rule) => rule.tag), ...customTopics]).sort((a,b)=>a.localeCompare(b)), [customTopics]);
  const events = useMemo(() => unique(data.members.flatMap((member) => member.events)).sort(), [data.members]);
  const selectedMember = data.members.find((member) => member.personId === selectedId);
  const memberResponses = selectedMember ? data.responses.filter((response) => response.personId === selectedMember.personId).sort((a,b)=>b.submittedAt.localeCompare(a.submittedAt)) : [];
  const selectedResponse = memberResponses.find((response) => response.responseId === selectedResponseId) || memberResponses[0];
  const memberTalks = selectedMember ? data.talks.filter((talk) => talk.personId === selectedMember.personId) : [];

  const savedFor = (member: Member) => currentTags.filter((record) => record.personId === member.personId);
  const savedStatus = (member: Member, tag: string) => savedFor(member).find((record) => record.tag.toLowerCase() === tag.toLowerCase());
  const draftsFor = (member: Member) => profileTopics(member).filter((tag) => savedStatus(member, tag)?.status !== "rejected" && savedStatus(member, tag)?.status !== "confirmed");
  const tagsFor = (member: Member, drafts = true) => unique([...savedFor(member).filter((record) => record.status === "confirmed").map((record) => record.tag), ...(drafts ? draftsFor(member) : [])]);
  const roleFor = (member: Member) => profileRoles(member).slice(0, 2);

  const visibleMembers = useMemo(() => {
    const term = query.trim().toLowerCase();
    return data.members.filter((member) => {
      const topicTags = tagsFor(member).join(" ");
      const text = [member.name, member.email, member.building, member.goals, member.strengths, member.linkedin, topicTags, roleFor(member).join(" ")].join(" ").toLowerCase();
      return (!term || text.includes(term)) && (!eventFilter || member.events.includes(eventFilter)) && (!interestFilter || tagsFor(member).includes(interestFilter));
    }).sort((a,b)=>a.name.localeCompare(b.name));
  }, [data.members, query, eventFilter, interestFilter, currentTags]);

  async function saveTag(input: { personId: string; tag: string; category: string; source: string; status?: "confirmed" | "rejected"; evidence?: string }) {
    setSaving(true); setNotice("");
    try {
      const response = await fetch("/api/admin/interests", {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...input, status: input.status || "confirmed" }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "The interest could not be saved.");
      await reload(); setNotice(input.status === "rejected" ? "Suggestion dismissed." : "Interest saved to the member sheet.");
    } catch (reason) { setNotice(reason instanceof Error ? reason.message : "The interest could not be saved."); }
    finally { setSaving(false); }
  }

  async function saveInteraction(personId: string) {
    const summary = interactionSummary.trim();
    if (!summary || saving) return;
    setSaving(true); setNotice("");
    try {
      const response = await fetch("/api/admin/interactions", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ personId, type: interactionType, date: interactionDate, summary, followUpDate, followUpStatus: followUpDate ? "Pending" : "" }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "The interaction could not be saved.");
      setInteractionSummary(""); setFollowUpDate(""); setInteractionDate(localDate());
      await reload(); setNotice("Interaction saved to the member sheet.");
    } catch (reason) { setNotice(reason instanceof Error ? reason.message : "The interaction could not be saved."); }
    finally { setSaving(false); }
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    router.replace("/admin/members/login"); router.refresh();
  }

  const membersForInterests = (interests: string[]) => data.members.filter((member) => interests.every((tag) => tagsFor(member, includeDrafts).includes(tag))).sort((a,b)=>a.name.localeCompare(b.name));
  const intersectionMembers = selectedInterests.length ? membersForInterests(selectedInterests) : [];
  const interestCounts = Object.fromEntries(topicOptions.map((tag) => [tag, membersForInterests([tag]).length]));
  const visibleTalks = data.talks.filter((talk) => !query.trim() || [talk.presenterName,talk.title,talk.why,talk.location].join(" ").toLowerCase().includes(query.trim().toLowerCase()));

  function toggleInterest(tag: string) {
    setNotice("");
    if (selectedInterests.includes(tag)) setSelectedInterests(selectedInterests.filter((item) => item !== tag));
    else if (selectedInterests.length >= 3) setNotice("Choose up to three interests at a time.");
    else setSelectedInterests([...selectedInterests, tag]);
  }

  if (loading && data.members.length === 0) return <main className={styles.adminRoot}><p className={styles.loading}>Opening the member directory…</p></main>;

  return (
    <main className={styles.adminRoot}>
      <header className={styles.topbar}>
        <a className={styles.wordmark} href="/" aria-label="Pivotech home"><Image src="/blue-logo.png" alt="" width={140} height={35} priority /></a>
        <div className={styles.topbarRight}><span>PRIVATE ADMIN</span><button type="button" onClick={logout}>Sign out</button></div>
      </header>
      <section className={styles.hero}>
        <div><p className={styles.eyebrow}>CONNECT · BUILD · GROW</p><h1>People worth<br/><em>building with.</em></h1><p className={styles.heroCopy}>Find the people, ideas, and strengths that can move a useful product forward.</p></div>
        <div className={styles.stats}><div><strong>{data.members.length}</strong><span>people</span></div><div><strong>{data.members.reduce((sum, member) => sum + member.registrationCount, 0)}</strong><span>event registrations</span></div><div><strong>{topicOptions.length}</strong><span>topics to explore</span></div></div>
      </section>
      <nav className={styles.tabs} aria-label="Member views">
        <button type="button" className={view === "directory" ? styles.activeTab : ""} onClick={() => setView("directory")}>Directory <span>{data.members.length}</span></button>
        <button type="button" className={view === "interests" ? styles.activeTab : ""} onClick={() => setView("interests")}>Explore interests</button>
        <button type="button" className={view === "talks" ? styles.activeTab : ""} onClick={() => setView("talks")}>Talks <span>{data.talks.length}</span></button>
      </nav>
      {error && <div className={styles.errorNotice} role="alert">{error}<button type="button" onClick={() => void reload()}>Try again</button></div>}
      {notice && <p className={styles.notice} role="status">{notice}</p>}
      {view === "directory" ? (
        <section className={styles.viewPanel}>
          <div className={styles.sectionHeading}><div><h2>Members</h2><p>Search the room. Notice what people are building and where they can help.</p></div><span className={styles.sheetState}>LIVE FROM GOOGLE SHEETS</span></div>
          <div className={styles.filters}>
            <label className={styles.search}><span aria-hidden="true">⌕</span><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Search people, interests, skills…" aria-label="Search members"/></label>
            <label><span className={styles.srOnly}>Filter by event</span><select value={eventFilter} onChange={(event)=>setEventFilter(event.target.value)}><option value="">All events</option>{events.map((event)=> <option key={event}>{event}</option>)}</select></label>
            <label><span className={styles.srOnly}>Filter by interest</span><select value={interestFilter} onChange={(event)=>setInterestFilter(event.target.value)}><option value="">All topics</option>{topicOptions.map((tag)=><option key={tag}>{tag}</option>)}</select></label>
          </div>
          <div className={styles.directoryLayout}>
            <div className={styles.listColumn}>
              <div className={styles.listCaption}><span>{visibleMembers.length} {visibleMembers.length === 1 ? "member" : "members"}</span><span>NAME · BUILDING · INTERESTS</span></div>
              {visibleMembers.map((member)=>{
                const roles=roleFor(member); const tags=tagsFor(member).slice(0,3);
                return <button type="button" key={member.personId} onClick={()=>setSelectedId(member.personId)} className={`${styles.memberRow} ${selectedId===member.personId?styles.selectedRow:""}`} aria-pressed={selectedId===member.personId}>
                  <span className={styles.initials}>{initials(member.name)}</span><span className={styles.memberBody}><strong>{member.name}</strong><span className={styles.memberSnippet}>{roles[0] || "Builder"} · {member.building || member.strengths || "Profile answers not yet available."}</span><span className={styles.tags}>{tags.map((tag)=><i key={tag}>{tag}</i>)}</span></span><small>{member.registrationCount} {member.registrationCount===1?"event":"events"}</small>
                </button>;
              })}
              {!visibleMembers.length && <p className={styles.empty}>No members match those filters. Clear a filter to widen the room.</p>}
            </div>
            {selectedMember && <aside className={styles.profile} aria-label="Selected member profile">
              <div className={styles.profileTop}><span className={styles.profileInitials}>{initials(selectedMember.name)}</span><div><h3>{selectedMember.name}</h3><small>{selectedMember.personId} · {selectedMember.registrationCount} registrations</small></div></div>
              <div className={styles.contact}>{safeLinkedIn(selectedMember.linkedin) && <a href={safeLinkedIn(selectedMember.linkedin)} target="_blank" rel="noreferrer">LinkedIn profile</a>}<span>{selectedMember.email}</span></div>
              {roleFor(selectedMember).length>0 && <div className={styles.tags}>{roleFor(selectedMember).map((role)=><i className={styles.roleTag} key={role}>{role}</i>)}</div>}
              <div className={styles.profileBlock}><h4>Past event answers</h4>{selectedResponse ? <>
                <label className={styles.responseSelect}>Choose a submitted response<select value={selectedResponse.responseId} onChange={(event)=>setSelectedResponseId(event.target.value)}>{memberResponses.map((response)=><option key={response.responseId} value={response.responseId}>{response.event} · {displayDate(response.submittedAt)} · {response.approvalStatus}{response.checkedInAt?" · checked in":""}</option>)}</select></label>
                <p className={styles.responseStatus}>Luma status: <strong>{selectedResponse.approvalStatus}</strong>{selectedResponse.checkedInAt?" · Checked in":""}</p>
                <ProfileBlock title="Building / learning" text={selectedResponse.building}/>
                <ProfileBlock title="What they’re looking for" text={selectedResponse.goals}/>
                <ProfileBlock title="Strengths and experience" text={selectedResponse.strengths}/>
                {selectedResponse.linkedinAnswer&&<p className={styles.responseLink}><a href={safeLinkedIn(selectedResponse.linkedinAnswer)} target="_blank" rel="noreferrer">LinkedIn answer</a></p>}
              </> : <><p className={styles.hint}>No populated event answers are linked to this person yet.</p><ProfileBlock title="Latest profile on file" text={[selectedMember.building,selectedMember.goals,selectedMember.strengths].filter(Boolean).join("\n\n")}/></>}</div>
              <div className={styles.profileBlock}><h4>Confirmed interests</h4><div className={styles.tags}>{savedFor(selectedMember).filter((record)=>record.status==="confirmed").map((record)=><span className={styles.manualTag} key={`${record.tag}-${record.updatedAt}`}>{record.tag}</span>)}</div>
                <form className={styles.addInterest} onSubmit={(event)=>{event.preventDefault();const tag=newTag.trim();if(!tag||saving)return;void saveTag({personId:selectedMember.personId,tag,category:newCategory,source:"manual"});setNewTag("");}}>
                  <label className={styles.srOnly} htmlFor="new-interest">Add a member interest</label><input id="new-interest" value={newTag} onChange={(event)=>setNewTag(event.target.value)} maxLength={64} placeholder="Add a tag…"/>
                  <label className={styles.srOnly} htmlFor="tag-category">Tag category</label><select id="tag-category" value={newCategory} onChange={(event)=>setNewCategory(event.target.value)}><option>Interest</option><option>Role</option><option>Strength</option><option>Looking for</option></select>
                  <button type="submit" disabled={saving||!newTag.trim()}>Add</button>
                </form>
                <p className={styles.hint}>Saved to the Member Interests tab in the Google Sheet.</p>
              </div>
              <div className={styles.profileBlock}><h4>Suggested from their answers</h4>{draftsFor(selectedMember).length?draftsFor(selectedMember).slice(0,6).map((tag)=><div className={styles.suggestion} key={tag}><span>{tag}</span><div><button type="button" disabled={saving} onClick={()=>void saveTag({personId:selectedMember.personId,tag,category:"Interest",source:"profile-suggestion",status:"confirmed"})}>Confirm</button><button type="button" disabled={saving} onClick={()=>void saveTag({personId:selectedMember.personId,tag,category:"Interest",source:"profile-suggestion",status:"rejected",evidence:"Dismissed by admin"})}>Dismiss</button></div></div>):<p className={styles.hint}>No draft topic suggestions found. You can add interests manually.</p>}</div>
              <div className={styles.profileBlock}><h4>Notes, introductions & follow-ups</h4>
                <form className={styles.interactionForm} onSubmit={(event)=>{event.preventDefault();void saveInteraction(selectedMember.personId);}}>
                  <label>Type<select value={interactionType} onChange={(event)=>setInteractionType(event.target.value as Interaction["type"])}><option>Note</option><option>Introduction</option><option>Follow-up</option></select></label>
                  <label>Date<input type="date" value={interactionDate} onChange={(event)=>setInteractionDate(event.target.value)} required/></label>
                  <label className={styles.interactionWide}>Summary<textarea value={interactionSummary} onChange={(event)=>setInteractionSummary(event.target.value)} maxLength={2000} rows={3} placeholder="What happened, or who should meet?" required/></label>
                  <label>Follow-up date<input type="date" value={followUpDate} onChange={(event)=>setFollowUpDate(event.target.value)}/></label>
                  <button type="submit" disabled={saving||!interactionSummary.trim()}>{saving?"Saving…":"Log interaction"}</button>
                </form>
                <div className={styles.interactionList}>{data.interactions.filter((item)=>item.personId===selectedMember.personId).sort((a,b)=>String(b.createdAt||b.date).localeCompare(String(a.createdAt||a.date))).map((item)=><article className={styles.interactionItem} key={item.interactionId}><div><strong>{item.type}</strong><time>{item.date}</time></div><p>{item.summary}</p>{item.followUpDate&&<small>Follow-up {item.followUpDate} · {item.followUpStatus||"Pending"}</small>}</article>)}{!data.interactions.some((item)=>item.personId===selectedMember.personId)&&<p className={styles.hint}>No interactions logged yet.</p>}</div>
                <p className={styles.hint}>Saved in the Member Interactions tab of the Google Sheet.</p>
              </div>
              <div className={styles.profileBlock}><h4>Talk submissions</h4>{memberTalks.length?memberTalks.map((talk)=><article className={styles.profileTalk} key={talk.talkId}><strong>{talk.title}</strong><small>{displayDate(talk.submittedAt)}{talk.location?` · ${talk.location}`:""}</small><p>{talk.why||"No motivation details provided."}</p>{talk.format&&<small>{talk.format}</small>}</article>):<p className={styles.hint}>No talk submissions matched to this person.</p>}</div>
              <div className={styles.profileBlock}><h4>Event history</h4><div className={styles.events}>{selectedMember.events.map((event)=><span key={event}>{event}</span>)}</div></div>
            </aside>}
          </div>
        </section>
      ) : view === "interests" ? (
        <section className={styles.viewPanel}>
          <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>FIND PEOPLE THROUGH SHARED INTERESTS</p><h2>Choose what connects them.</h2><p>Select one, two, or three interests. Results match every selected interest.</p></div><span className={styles.sheetState}>LIVE FROM GOOGLE SHEETS</span></div>
          <div className={styles.interestToolbar}>
            <label className={styles.includeDrafts}><input type="checkbox" checked={includeDrafts} onChange={(event)=>setIncludeDrafts(event.target.checked)}/> Include unreviewed suggestions</label>
            <button type="button" className={styles.clearInterests} disabled={!selectedInterests.length} onClick={()=>setSelectedInterests([])}>Clear selection</button>
          </div>
          <div className={styles.interestChoices} aria-label="Choose up to three interests">
            {topicOptions.map((tag)=>{const selected=selectedInterests.includes(tag);return <button type="button" key={tag} className={`${styles.interestChoice} ${selected?styles.interestChoiceSelected:""}`} aria-pressed={selected} onClick={()=>toggleInterest(tag)}><span>{tag}</span><small>{interestCounts[tag]||0}</small></button>;})}
          </div>
          <div className={styles.intersectionResults}>
            <div className={styles.selectionSummary}><div><span className={styles.eyebrow}>SELECTED ({selectedInterests.length}/3)</span><div className={styles.selectedChips}>{selectedInterests.map((tag)=><button key={tag} type="button" onClick={()=>toggleInterest(tag)}>{tag}<span aria-hidden="true"> ×</span></button>)}</div></div><strong>{selectedInterests.length?`${intersectionMembers.length} ${intersectionMembers.length===1?"person":"people"}`:"Choose an interest"}</strong></div>
            {selectedInterests.length===0?<p className={styles.empty}>Select an interest above to see who shares it.</p>:intersectionMembers.length?intersectionMembers.map((member)=><button type="button" className={styles.intersectionMember} key={member.personId} onClick={()=>{setSelectedId(member.personId);setView("directory");}}><span className={styles.initials}>{initials(member.name)}</span><span><strong>{member.name}</strong><small>{tagsFor(member,includeDrafts).filter((tag)=>selectedInterests.includes(tag)).join(" · ")}</small></span><span className={styles.memberEvents}>{member.events.join(" · ")}</span></button>):<p className={styles.empty}>No one matches every selected interest yet. Try removing one.</p>}
            {includeDrafts&&<p className={styles.mapNote}>Unreviewed suggestions are included in these results.</p>}
          </div>
        </section>
      ) : (
        <section className={styles.viewPanel}>
          <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>IDEAS FROM THE COMMUNITY</p><h2>Talk submissions.</h2><p>Speaker proposals from the connected response sheet.</p></div><span className={styles.sheetState}>LIVE FROM GOOGLE SHEETS</span></div>
          {data.talksError&&<div className={styles.errorNotice} role="status">{data.talksError}</div>}
          <div className={styles.filters}><label className={styles.search}><span aria-hidden="true">⌕</span><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Search speakers, talk titles, or ideas…" aria-label="Search talk submissions"/></label></div>
          <div className={styles.talkGrid}>{visibleTalks.map((talk)=><article className={styles.talkCard} key={talk.talkId}><div className={styles.talkMeta}><span>{displayDate(talk.submittedAt)}</span><span>{talk.personId?"MEMBER MATCH":"NEEDS MEMBER MATCH"}</span></div><h3>{talk.title}</h3><p className={styles.talkPresenter}>{talk.personId?<button type="button" onClick={()=>{setSelectedId(talk.personId);setView("directory");}}>{talk.presenterName}</button>:talk.presenterName}{talk.location?` · ${talk.location}`:""}</p><div className={styles.talkAnswer}><h4>Why it matters</h4><p>{talk.why||"No response provided."}</p></div><div className={styles.talkBottom}>{safeLinkedIn(talk.linkedin)&&<a href={safeLinkedIn(talk.linkedin)} target="_blank" rel="noreferrer">LinkedIn</a>}<span>{talk.format||"Format not specified"}</span></div></article>)}{!visibleTalks.length&&!data.talksError&&<p className={styles.empty}>No talk submissions match that search.</p>}</div>
        </section>
      )}
      <footer className={styles.footer}><span>PEOPLE ARE THE ECOSYSTEM.</span><span>ADMIN DIRECTORY · PRIVATE</span></footer>
    </main>
  );
}

function ProfileBlock({ title, text }: { title: string; text: string }) {
  return <div className={styles.profileBlock}><h4>{title}</h4><p>{text || "No answer on file yet."}</p></div>;
}
