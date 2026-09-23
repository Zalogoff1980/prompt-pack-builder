import { DemoBadge } from "@/components/ui";

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 md:px-10 py-10 md:py-14">
      <h1 className="font-display text-2xl font-medium text-graphite-100 mb-8">Settings</h1>

      <section className="rounded-2xl border border-graphite-700/60 bg-graphite-900/40 p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-sm font-medium text-graphite-200">Generation mode</h2>
          <DemoBadge />
        </div>
        <p className="text-[13px] text-graphite-400 leading-relaxed">
          No <code className="font-mono text-graphite-300">OPENAI_API_KEY</code> is configured on this deployment, so every
          pack is generated from the built-in template engine — no external requests are made. The full workflow (Create →
          Generate → Edit → Package → Export) works exactly the same either way.
        </p>
      </section>

      <section className="rounded-2xl border border-graphite-700/60 bg-graphite-900/40 p-6 mb-6">
        <h2 className="font-display text-sm font-medium text-graphite-200 mb-3">Enable real AI generation</h2>
        <p className="text-[13px] text-graphite-400 leading-relaxed mb-3">
          Set an API key as a server environment variable, then redeploy — it is never exposed to the browser.
        </p>
        <pre className="rounded-lg bg-graphite-950 border border-graphite-800 p-3 font-mono text-[12px] text-graphite-300 overflow-x-auto">
{`OPENAI_API_KEY=sk-...\nOPENAI_MODEL=gpt-4o-mini`}
        </pre>
      </section>

      <section className="rounded-2xl border border-graphite-700/60 bg-graphite-900/40 p-6">
        <h2 className="font-display text-sm font-medium text-graphite-200 mb-3">Data storage</h2>
        <p className="text-[13px] text-graphite-400 leading-relaxed">
          Packs and product packages are stored locally in this browser. See the README for how to move storage to
          Supabase/Postgres for multi-device access.
        </p>
      </section>
    </div>
  );
}
