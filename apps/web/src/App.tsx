import { useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatCard from "./components/StatCard";
import MigrationWizard from "./components/MigrationWizard";

type TenantStatus = {
  tenantId: string;
  domain: string;
  status: "connected" | "pending" | "error";
  connectedAt: string | null;
};

type TenantsStatusResponse = {
  source: TenantStatus;
  target: TenantStatus;
};

type InventorySummaryResponse = {
  users: number;
  groups: number;
  apps: number;
  licenses: { total: number; consumed: number };
  sharedMailboxes: number;
  devices: number;
  lastSyncAt: string;
};

type AuditChecksResponse = {
  score: number;
  severityCounts: { high: number; medium: number; low: number };
  checks: Array<{
    id: string;
    title: string;
    severity: "high" | "medium" | "low";
    affected: number;
    recommendation: string;
  }>;
};

type PlanningTimelineResponse = {
  projectId: string;
  phases: Array<{
    name: string;
    start: string;
    end: string;
    status: "completed" | "in_progress" | "pending";
  }>;
};

type ProjectsResponse = {
  projects: Array<{
    id: string;
    name: string;
    status: "planning" | "in_progress" | "completed" | "blocked";
    progress: number;
    users: number;
    lastUpdated: string;
  }>;
};

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

function pillClasses(status: string) {
  switch (status) {
    case "connected":
    case "completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-900";
    case "in_progress":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-200 dark:border-blue-900";
    case "planning":
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-900";
    case "blocked":
    case "error":
      return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-900";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/40 dark:text-slate-200 dark:border-slate-800";
  }
}

export default function App() {
  const [tenants, setTenants] = useState<TenantsStatusResponse | null>(null);
  const [inventory, setInventory] = useState<InventorySummaryResponse | null>(null);
  const [audit, setAudit] = useState<AuditChecksResponse | null>(null);
  const [timeline, setTimeline] = useState<PlanningTimelineResponse | null>(null);
  const [projects, setProjects] = useState<ProjectsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [t, inv, a, tl, p] = await Promise.all([
          fetchJson<TenantsStatusResponse>("/api/tenants/status"),
          fetchJson<InventorySummaryResponse>("/api/inventory/summary"),
          fetchJson<AuditChecksResponse>("/api/audit/checks"),
          fetchJson<PlanningTimelineResponse>("/api/planning/timeline"),
          fetchJson<ProjectsResponse>("/api/projects"),
        ]);
        if (cancelled) return;
        setTenants(t);
        setInventory(inv);
        setAudit(a);
        setTimeline(tl);
        setProjects(p);
        setError(null);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load dashboard data");
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    if (!inventory || !audit || !projects) return [];

    const activeProjects = projects.projects.filter((p) => p.status === "in_progress").length;
    return [
      { label: "Projects", value: String(projects.projects.length), trend: `${activeProjects} active` },
      { label: "Users", value: String(inventory.users), trend: `Last sync ${new Date(inventory.lastSyncAt).toLocaleString()}` },
      { label: "Licenses", value: `${inventory.licenses.consumed}/${inventory.licenses.total}`, trend: "Consumed/Total" },
      { label: "Audit score", value: String(audit.score), trend: `${audit.severityCounts.high} high risks` },
    ];
  }, [inventory, audit, projects]);

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6 space-y-6">
          {error && (
            <section className="rounded-xl border border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/40 p-4">
              <div className="font-medium text-rose-800 dark:text-rose-200">Failed to load dashboard</div>
              <div className="text-sm text-rose-700 dark:text-rose-300 mt-1">{error}</div>
            </section>
          )}

          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {loading && stats.length === 0 ? (
              <div className="col-span-full text-sm text-slate-500 dark:text-slate-300">Loading…</div>
            ) : (
              stats.map((item) => <StatCard key={item.label} {...item} />)
            )}
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <section className="xl:col-span-2 space-y-6">
              <MigrationWizard />

              <section className="bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-lg font-semibold mb-4">Project status</h2>
                {!projects ? (
                  <div className="text-sm text-slate-500 dark:text-slate-400">Loading projects…</div>
                ) : (
                  <div className="space-y-3">
                    {projects.projects.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 p-4"
                      >
                        <div>
                          <div className="font-medium">{p.name}</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {p.users} users · Updated {new Date(p.lastUpdated).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-2 py-1 rounded-full border ${pillClasses(p.status)}`}>{p.status}</span>
                          <div className="w-32">
                            <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                              <div
                                className="h-2 bg-slate-900 dark:bg-slate-100"
                                style={{ width: `${Math.max(0, Math.min(100, p.progress))}%` }}
                              />
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{p.progress}%</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </section>

            <aside className="space-y-6">
              <section className="bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-lg font-semibold mb-4">Tenant connections</h2>
                {!tenants ? (
                  <div className="text-sm text-slate-500 dark:text-slate-400">Loading tenants…</div>
                ) : (
                  <div className="space-y-3">
                    {[{ label: "Source", t: tenants.source }, { label: "Target", t: tenants.target }].map(({ label, t }) => (
                      <div
                        key={label}
                        className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 p-4"
                      >
                        <div>
                          <div className="font-medium">{label} tenant</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">{t.domain}</div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full border ${pillClasses(t.status)}`}>{t.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-lg font-semibold mb-4">Inventory summary</h2>
                {!inventory ? (
                  <div className="text-sm text-slate-500 dark:text-slate-400">Loading inventory…</div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                      <div className="text-xs text-slate-500 dark:text-slate-400">Users</div>
                      <div className="text-lg font-semibold">{inventory.users}</div>
                    </div>
                    <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                      <div className="text-xs text-slate-500 dark:text-slate-400">Groups</div>
                      <div className="text-lg font-semibold">{inventory.groups}</div>
                    </div>
                    <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                      <div className="text-xs text-slate-500 dark:text-slate-400">Apps</div>
                      <div className="text-lg font-semibold">{inventory.apps}</div>
                    </div>
                    <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                      <div className="text-xs text-slate-500 dark:text-slate-400">Licenses</div>
                      <div className="text-lg font-semibold">
                        {inventory.licenses.consumed}/{inventory.licenses.total}
                      </div>
                    </div>
                  </div>
                )}
              </section>

              <section className="bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-lg font-semibold mb-4">Risk / audit</h2>
                {!audit ? (
                  <div className="text-sm text-slate-500 dark:text-slate-400">Loading checks…</div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-500 dark:text-slate-400">Score</div>
                      <div className="font-semibold">{audit.score}/100</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className={`rounded-lg border p-2 text-center ${pillClasses("error")}`}>
                        <div className="text-xs">High</div>
                        <div className="font-semibold">{audit.severityCounts.high}</div>
                      </div>
                      <div className={`rounded-lg border p-2 text-center ${pillClasses("pending")}`}>
                        <div className="text-xs">Medium</div>
                        <div className="font-semibold">{audit.severityCounts.medium}</div>
                      </div>
                      <div className={`rounded-lg border p-2 text-center ${pillClasses("planning")}`}>
                        <div className="text-xs">Low</div>
                        <div className="font-semibold">{audit.severityCounts.low}</div>
                      </div>
                    </div>
                    <div className="pt-2 space-y-2">
                      {audit.checks.slice(0, 3).map((c) => (
                        <div key={c.id} className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-sm">{c.title}</div>
                            <span className={`text-xs px-2 py-1 rounded-full border ${pillClasses(c.severity)}`}>{c.severity}</span>
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Affected: {c.affected}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{c.recommendation}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              <section className="bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-lg font-semibold mb-4">Planning timeline</h2>
                {!timeline ? (
                  <div className="text-sm text-slate-500 dark:text-slate-400">Loading timeline…</div>
                ) : (
                  <div className="space-y-3">
                    {timeline.phases.map((ph) => (
                      <div
                        key={ph.name}
                        className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 p-4"
                      >
                        <div>
                          <div className="font-medium">{ph.name}</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {ph.start} → {ph.end}
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full border ${pillClasses(ph.status)}`}>{ph.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </aside>
          </section>
        </main>
      </div>
    </div>
  );
}
