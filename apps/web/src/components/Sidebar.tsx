const navItems = [
  "Dashboard",
  "Migrations",
  "Tenants",
  "Users",
  "Logs",
  "Settings",
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
      <div className="px-6 py-5 text-xl font-semibold">THZ Migration</div>
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700"
          >
            {item}
          </button>
        ))}
      </nav>
      <div className="p-4 text-xs text-slate-500">v0.1 MVP</div>
    </aside>
  );
}
