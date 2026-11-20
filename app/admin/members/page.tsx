import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/member-admin/auth";
import MemberDirectory from "./member-directory";

export const metadata: Metadata = {
  title: "Member directory · Pivotech admin",
  robots: { index: false, follow: false },
};

export default async function MemberAdminPage() {
  if (!(await isAdminSession())) redirect("/admin/members/login");
  return <MemberDirectory />;
}
