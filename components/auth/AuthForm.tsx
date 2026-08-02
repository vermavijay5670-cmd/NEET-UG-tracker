"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AuthFormProps {
  mode?: "login" | "signup";
}

export function AuthForm({ mode = "login" }: AuthFormProps) {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(mode === "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch(`/api/auth/${isLogin ? "login" : "signup"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      router.refresh();
      router.replace("/today");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md rounded-[28px] border border-white/10 bg-white/8 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
      <div className="mb-6">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#D8B4FE]">Secure access</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">{isLogin ? "Sign in" : "Create account"}</h2>
        <p className="mt-2 text-sm text-white/60">Use your email to protect your study tracker data.</p>
      </div>

      {!isLogin && (
        <label className="mb-4 block text-sm text-white/70">
          <span className="mb-1 block">Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-white outline-none"
            placeholder="Your name"
          />
        </label>
      )}

      <label className="mb-4 block text-sm text-white/70">
        <span className="mb-1 block">Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-white outline-none"
          placeholder="you@example.com"
        />
      </label>

      <label className="mb-4 block text-sm text-white/70">
        <span className="mb-1 block">Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-full border border-white/10 bg-black/25 px-4 py-3 text-white outline-none"
          placeholder="At least 6 characters"
        />
      </label>

      {error ? <p className="mb-4 text-sm text-rose-300">{error}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-[#D8B4FE] px-4 py-3 font-medium text-[#0F0B18] transition-opacity disabled:opacity-70"
      >
        {submitting ? "Working..." : isLogin ? "Sign in" : "Create account"}
      </button>

      <div className="mt-4 flex flex-col gap-2 text-sm text-white/60">
        <button
          type="button"
          onClick={() => setIsLogin((value) => !value)}
          className="underline"
        >
          {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="self-start underline"
        >
          ← Back to landing page
        </button>
      </div>
    </form>
  );
}
