import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export const dynamic = "force-dynamic";

export default function AuthPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <Suspense fallback={<div className="text-white/60">Loading…</div>}>
        <AuthForm />
      </Suspense>
    </main>
  );
}
