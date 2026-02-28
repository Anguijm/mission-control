"use client";

import Image from "next/image";

type Connection = {
  name: string;
  status: "active" | "inactive";
  description: string;
  logo: string;
  viaZapier?: boolean;
};

const connections: Connection[] = [
  {
    name: "Notion",
    status: "active",
    description: "Workspace synced for documents & meeting notes",
    logo: "/tools/notion.svg",
  },
  {
    name: "Google Drive",
    status: "active",
    description: "Contracts, transcripts, and exports stored automatically",
    logo: "/tools/google-drive.svg",
    viaZapier: true,
  },
  {
    name: "YouTube",
    status: "inactive",
    description: "Pull latest content performance every morning",
    logo: "/tools/youtube.svg",
  },
  {
    name: "Discord",
    status: "active",
    description: "Community channel pings come straight to the agent",
    logo: "/tools/discord.svg",
  },
  {
    name: "Zapier",
    status: "active",
    description: "Fallback automations & event routing",
    logo: "/tools/zapier.svg",
  },
  {
    name: "ClickUp",
    status: "inactive",
    description: "Sync human tasks with agent updates",
    logo: "/tools/clickup.svg",
    viaZapier: true,
  },
];

export default function ConnectionsPage() {
  const total = connections.length;
  const connected = connections.filter((c) => c.status === "active").length;
  const progress = Math.round((connected / total) * 100);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">Integrations</p>
        <h1 className="text-3xl font-bold">Connections</h1>
        <p className="text-secondary">Every integration your agent touches — honest status reporting included.</p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <div className="rounded-2xl border border-white/5 bg-[var(--bg-card)] p-6">
          <div className="flex items-center justify-between text-sm">
            <p className="text-muted">Connected Integrations</p>
            <span className="text-secondary">{connected} / {total}</span>
          </div>
          <div className="mt-4 h-3 rounded-full bg-[var(--bg-hover)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--color-brand-blue)] via-[var(--color-brand-green)] to-[var(--color-brand-orange)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-4 text-sm text-secondary">
            {progress >= 80 ? "Almost there — polish the disconnects." : "Connect your essentials to unlock full automation."}
          </p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[var(--bg-card)] p-6">
          <p className="text-sm text-muted">Quick Take</p>
          <p className="mt-3 text-lg font-semibold">
            {connected} systems online. {total - connected} waiting for authentication.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-secondary">
            <li>• Make sure Calendars + Content sources are first priority.</li>
            <li>• Enable YouTube to unlock the Content Intel page.</li>
            <li>• Zapier badges show indirect routes — useful for debugging.</li>
          </ul>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {connections.map((conn) => (
          <article
            key={conn.name}
            className="rounded-2xl border border-white/5 bg-[var(--bg-card)]/90 p-5 transition hover:border-white/15 hover:bg-[var(--bg-card)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10">
                  <Image src={conn.logo} alt={conn.name} fill sizes="40px" className="rounded-lg object-contain" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{conn.name}</p>
                  <p className="text-xs text-secondary">{conn.description}</p>
                </div>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                  conn.status === "active"
                    ? "text-[var(--color-brand-green)]"
                    : "text-[var(--color-brand-red)]"
                }`}
              >
                {conn.status}
              </span>
            </div>
            {conn.viaZapier && (
              <span className="mt-3 inline-block rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase text-secondary">
                via Zapier
              </span>
            )}
            <div className="mt-4 flex items-center gap-3">
              {conn.status === "active" ? (
                <button className="w-full rounded-xl border border-white/15 px-4 py-2 text-sm text-secondary transition hover:border-white/30">
                  Disconnect
                </button>
              ) : (
                <button className="w-full rounded-xl border border-dashed border-white/30 bg-[var(--bg-hover)] px-4 py-2 text-sm text-secondary transition hover:border-white/50">
                  Connect
                </button>
              )}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
