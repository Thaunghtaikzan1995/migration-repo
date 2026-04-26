import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatCard from "./components/StatCard";

const stats = [
  { label: "Active Migrations", value: "3", trend: "+1" },
  { label: "Items Migrated", value: "128,430", trend: "+8%" },
  { label: "Errors", value: "2", trend: "-1" },
  { label: "Queued", value: "14", trend: "+4" },
];

export default function App() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6 space-y-6">
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((item) => (
              <StatCard key={item.label} {...item} />
            ))}
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Migration Plans</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                <div>
                  <div className="font-medium">Mailbox → Mailbox (M365)</div>
                  <div className="text-sm text-slate-500">Tenant A to Tenant B · 42 users</div>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-sm">View</button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                <div>
                  <div className="font-medium">OneDrive → OneDrive</div>
                  <div className="text-sm text-slate-500">Tenant A to Tenant B · 19 users</div>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-sm">View</button>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button className="rounded-lg border border-slate-200 p-4 text-left hover:border-slate-400">
                <div className="font-medium">Create Migration</div>
                <div className="text-sm text-slate-500">Mailbox, OneDrive, SharePoint, Teams</div>
              </button>
              <button className="rounded-lg border border-slate-200 p-4 text-left hover:border-slate-400">
                <div className="font-medium">Connect Tenant</div>
                <div className="text-sm text-slate-500">Entra ID (Azure AD) auth</div>
              </button>
              <button className="rounded-lg border border-slate-200 p-4 text-left hover:border-slate-400">
                <div className="font-medium">View Logs</div>
                <div className="text-sm text-slate-500">Audit and error details</div>
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
