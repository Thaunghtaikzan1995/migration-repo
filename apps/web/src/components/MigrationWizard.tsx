import { useState } from "react";

const migrationTypes = [
  { id: "mailbox", label: "Mailbox" },
  { id: "onedrive", label: "OneDrive" },
  { id: "sharepoint", label: "SharePoint" },
  { id: "teams", label: "Teams" },
];

const steps = [
  "Select type",
  "Connect tenants",
  "Scope",
  "Schedule",
  "Review",
];

export default function MigrationWizard() {
  const [step, setStep] = useState(0);
  const [type, setType] = useState(migrationTypes[0].id);

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Create Migration</h2>
          <p className="text-sm text-slate-500">Guided setup for M365 to M365 migrations</p>
        </div>
        <span className="text-xs text-slate-400">Step {step + 1} of {steps.length}</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {steps.map((label, index) => (
          <div
            key={label}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
              index === step
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-slate-50 text-slate-600 border-slate-200"
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {migrationTypes.map((item) => (
            <button
              key={item.id}
              onClick={() => setType(item.id)}
              className={`rounded-lg border p-4 text-left transition ${
                type === item.id
                  ? "border-slate-900 ring-1 ring-slate-900"
                  : "border-slate-200 hover:border-slate-400"
              }`}
            >
              <div className="font-medium">{item.label}</div>
              <div className="text-xs text-slate-500">M365 → M365</div>
            </button>
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Source tenant</label>
            <input
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
              placeholder="tenant-a.onmicrosoft.com"
            />
            <p className="text-xs text-slate-500 mt-1">Use Entra ID connection</p>
          </div>
          <div>
            <label className="text-sm font-medium">Target tenant</label>
            <input
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
              placeholder="tenant-b.onmicrosoft.com"
            />
            <p className="text-xs text-slate-500 mt-1">Use Entra ID connection</p>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Users or groups</label>
            <input
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
              placeholder="e.g. marketing@, sales@"
            />
            <p className="text-xs text-slate-500 mt-1">Comma-separated list</p>
          </div>
          <div>
            <label className="text-sm font-medium">Include archives</label>
            <div className="mt-2 flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4" />
              <span className="text-sm text-slate-600">Migrate archive mailboxes</span>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Start time</label>
            <input
              type="datetime-local"
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
            />
            <p className="text-xs text-slate-500 mt-1">Leave empty to start immediately</p>
          </div>
          <div>
            <label className="text-sm font-medium">Throttle policy</label>
            <select className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2">
              <option>Balanced</option>
              <option>High throughput</option>
              <option>Low impact</option>
            </select>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
          <div className="text-sm text-slate-500">Summary</div>
          <div className="mt-2 font-medium">Type: {migrationTypes.find((item) => item.id === type)?.label}</div>
          <div className="text-sm text-slate-500">Source → Target tenants (to be connected)</div>
          <div className="text-sm text-slate-500">Scope: users/groups selection</div>
          <div className="text-sm text-slate-500">Schedule: immediate or set time</div>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => setStep((prev) => Math.max(0, prev - 1))}
          className="px-4 py-2 rounded-lg border border-slate-200 text-sm"
          disabled={step === 0}
        >
          Back
        </button>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg border border-slate-200 text-sm">Save draft</button>
          <button
            onClick={() => setStep((prev) => Math.min(steps.length - 1, prev + 1))}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm"
          >
            {step === steps.length - 1 ? "Create" : "Next"}
          </button>
        </div>
      </div>
    </section>
  );
}
