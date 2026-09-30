import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { isUnlocked } from "@/lib/gate.functions";

// Everything under /bulkemailsender sits behind the shared password.
export const Route = createFileRoute("/bulkemailsender")({
  beforeLoad: async () => {
    const { unlocked } = await isUnlocked();
    if (!unlocked) throw redirect({ to: "/bulkemailsender-unlock" });
  },
  component: () => <Outlet />,
});
