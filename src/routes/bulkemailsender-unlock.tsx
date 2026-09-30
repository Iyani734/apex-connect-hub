import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { unlockSite } from "@/lib/gate.functions";
import { supabase } from "@/integrations/supabase/client";

const WORKSPACE_EMAIL = "webd2086@gmail.com";

export const Route = createFileRoute("/bulkemailsender-unlock")({
  head: () => ({
    meta: [
      { title: "Private area" },
      { name: "description", content: "Enter the password to continue." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Private area" },
      { property: "og:description", content: "Enter the password to continue." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: UnlockPage,
});

function UnlockPage() {
  const navigate = useNavigate();
  const unlock = useServerFn(unlockSite);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(false);
    try {
      const { ok } = await unlock({ data: { password } });
      if (ok) {
        // One password: also sign into the workspace with the same password.
        await supabase.auth.signInWithPassword({ email: WORKSPACE_EMAIL, password }).catch(() => null);
        await navigate({ to: "/bulkemailsender" });
        return;
      }
      setError(true);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm"
      >
        <h1 className="text-lg font-semibold text-card-foreground">Private area</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter the password to continue.
        </p>
        <Input
          type="password"
          name="password"
          autoComplete="current-password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-4"
          placeholder="Password"
        />
        {error && (
          <p className="mt-2 text-sm text-destructive">That password is not correct.</p>
        )}
        <Button type="submit" className="mt-4 w-full" disabled={busy || !password}>
          {busy ? "Checking…" : "Enter"}
        </Button>
      </form>
    </div>
  );
}
