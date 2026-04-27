type StatCardProps = {
  label: string;
  value: string;
  trend: string;
};

export default function StatCard({ label, value, trend }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
      <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
      <div className="text-2xl font-semibold mt-2 text-slate-900 dark:text-slate-50">{value}</div>
      <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">{trend}</div>
    </div>
  );
}
