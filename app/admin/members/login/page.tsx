import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/member-admin/auth";
import LoginForm from "./login-form";
import styles from "../member-admin.module.css";

export const metadata: Metadata = {
  title: "Admin sign in · Pivotech",
  robots: { index: false, follow: false },
};

export default async function MemberAdminLoginPage() {
  if (await isAdminSession()) redirect("/admin/members");
  return (
    <main className={styles.loginRoot}>
      <section className={styles.loginCard}>
        <a className={styles.loginBrand} href="/">PIVOTECH</a>
        <p className={styles.eyebrow}>PRIVATE ADMIN</p>
        <h1>Welcome to the room.</h1>
        <p>Sign in to search the member directory and curate interests.</p>
        <LoginForm />
        <a className={styles.loginBack} href="/">Back to Pivotech</a>
      </section>
    </main>
  );
}
