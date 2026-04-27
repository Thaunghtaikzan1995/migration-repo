import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "thz-migration-api" });
});

app.get("/api/migrations", (_req, res) => {
  res.json([
    { id: "mig-001", type: "Mailbox", status: "In Progress" },
    { id: "mig-002", type: "OneDrive", status: "Queued" },
  ]);
});

app.get("/api/tenants/status", (_req, res) => {
  res.json({
    source: {
      tenantId: "1111-2222",
      domain: "source.onmicrosoft.com",
      status: "connected",
      connectedAt: "2026-04-27T08:30:00Z",
    },
    target: {
      tenantId: "3333-4444",
      domain: "target.onmicrosoft.com",
      status: "pending",
      connectedAt: null,
    },
  });
});

app.get("/api/inventory/summary", (_req, res) => {
  res.json({
    users: 128,
    groups: 42,
    apps: 15,
    licenses: {
      total: 150,
      consumed: 128,
    },
    sharedMailboxes: 12,
    devices: 64,
    lastSyncAt: "2026-04-27T09:10:00Z",
  });
});

app.get("/api/audit/checks", (_req, res) => {
  res.json({
    score: 72,
    severityCounts: {
      high: 3,
      medium: 7,
      low: 12,
    },
    checks: [
      {
        id: "upn-conflict",
        title: "UPN conflict detected",
        severity: "high",
        affected: 5,
        recommendation: "Rename users or pre-stage target accounts.",
      },
      {
        id: "license-gap",
        title: "License gap on target tenant",
        severity: "medium",
        affected: 12,
        recommendation: "Purchase additional licenses.",
      },
    ],
  });
});

app.get("/api/planning/timeline", (_req, res) => {
  res.json({
    projectId: "proj-001",
    phases: [
      {
        name: "Pre-migration",
        start: "2026-05-01",
        end: "2026-05-05",
        status: "completed",
      },
      {
        name: "Migration",
        start: "2026-05-06",
        end: "2026-05-10",
        status: "in_progress",
      },
      {
        name: "Post-migration",
        start: "2026-05-11",
        end: "2026-05-13",
        status: "pending",
      },
    ],
  });
});

app.get("/api/projects", (_req, res) => {
  res.json({
    projects: [
      {
        id: "proj-001",
        name: "Tenant A → Tenant B",
        status: "in_progress",
        progress: 64,
        users: 42,
        lastUpdated: "2026-04-27T10:02:00Z",
      },
      {
        id: "proj-002",
        name: "Contoso → Fabrikam",
        status: "planning",
        progress: 15,
        users: 19,
        lastUpdated: "2026-04-26T16:40:00Z",
      },
    ],
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
