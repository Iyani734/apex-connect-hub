import { createFileRoute } from "@tanstack/react-router";

import { apexShellResponse } from "@/lib/apex-site";

// Catch-all: every root-level URL that is not part of the outreach app
// (/bulkemailsender/*) or an API route belongs to the trading site's own
// client-side router.
export const Route = createFileRoute("/$")({
  server: {
    handlers: {
      GET: () => apexShellResponse(),
    },
  },
});
