"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "../member-admin.module.css";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Sign in was unsuccessful.");
      router.replace("/admin/members");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Sign in was unsuccessful.");
      setPending(false);
    }
  }

  return (
    <form className={styles.loginForm} onSubmit={submit}>
      <label htmlFor="admin-password">Admin password</label>
      <input
        id="admin-password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />
      {error && <p className={styles.formError} role="alert">{error}</p>}
      <button type="submit" disabled={pending}>{pending ? "Signing in…" : "Enter member directory"}</button>
    </form>
  );
}
