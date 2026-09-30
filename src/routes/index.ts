import { createFileRoute } from "@tanstack/react-router";

import { apexShellResponse } from "@/lib/apex-site";

// Domain root belongs to the trading site.
export const Route = createFileRoute("/")({
  server: {
    handlers: {
      GET: () => apexShellResponse(),
    },
  },
});
