const navItems = ["Dashboard", "Migrations", "Tenants", "Users", "Logs", "Settings"];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col">
      <div className="px-6 py-5 text-xl font-semibold text-slate-900 dark:text-slate-50">THZ Migration</div>
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200"
          >
            {item}
          </button>
        ))}
      </nav>
      <div className="p-4 text-xs text-slate-500 dark:text-slate-400">v0.1 MVP</div>
    </aside>
  );
}
