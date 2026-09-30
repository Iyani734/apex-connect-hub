// The trading site (apex-trade-command) is a client-rendered single-page app.
// It is built into `public/apex/` by `bun run build:apex`, and its pages are
// served from the domain root, so any root URL that the outreach app does not
// own must return the trading site's HTML shell and let its own router take
// over in the browser.
import apexIndexHtml from "../../public/apex/index.html?raw";

export function apexShellResponse(): Response {
  return new Response(apexIndexHtml, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
