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

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
