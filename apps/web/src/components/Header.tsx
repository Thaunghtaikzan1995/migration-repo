export default function Header() {
  return (
    <header className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-slate-500">M365 to M365 migrations overview</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm">Docs</button>
        <button className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-sm">New Migration</button>
      </div>
    </header>
  );
}
