import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";

// Shared-password gate for the private outreach app at /bulkemailsender.
// This is a gate, not per-user authentication: one password, one owner.
// The outreach app keeps its own sign-in behind this gate.

// The expected password is read from SITE_PASSWORD when the host provides it.
// Otherwise we fall back to comparing against this SHA-256 digest, so the
// build works on any host without extra configuration while the repository
// never contains the password in readable form.
const FALLBACK_PASSWORD_SHA256 = "a6d1b96bddc6eb64c1093824efcffcc609041e55b61448e47d193aaf57e4a7f5";

// Fallback keeps cookies working if the host has no SESSION_SECRET set.
const FALLBACK_SESSION_SECRET = "bulkemailsender-gate-fallback-session-key-please-override-me";

function sessionConfig() {
  return {
    password: process.env["SESSION_SECRET"] || FALLBACK_SESSION_SECRET,
    name: "bulkemailsender-gate",
    maxAge: 60 * 60 * 24 * 30,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

type GateSession = { unlocked?: boolean };

function sha256(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

function passwordMatches(input: string): boolean {
  const expected = process.env[""];
  const expectedDigest = expected
    ? sha256(expected)
    : Buffer.from(FALLBACK_PASSWORD_SHA256, "hex");
  return timingSafeEqual(sha256(input), expectedDigest);
}

export const isUnlocked = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<GateSession>(sessionConfig());
  return { unlocked: session.data.unlocked === true };
});

export const unlockSite = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => {
    if (typeof data?.password !== "string") throw new Error("Password required");
    return { password: data.password };
  })
  .handler(async ({ data }) => {
    if (!passwordMatches(data.password)) return { ok: false as const };
    const session = await useSession<GateSession>(sessionConfig());
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const lockSite = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<GateSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});
