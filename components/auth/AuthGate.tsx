"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "authenticated" | "guest">("loading");
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/me", { credentials: "include" });
        const data = await response.json();
        if (data.ok && data.user) {
          setUser(data.user);
          setStatus("authenticated");
          return;
        }
      } catch {
        // ignore and fall through
      }
      setUser(null);
      setStatus("guest");
      router.replace("/auth");
    }

    checkAuth();
  }, [router]);

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center text-sm text-white/70">Checking session…</div>;
  }

  if (status === "guest") {
    return null;
  }

  return <>{children}</>;
}
