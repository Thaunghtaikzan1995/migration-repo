# THZ Migration (MVP)

Clean admin dashboard MVP for M365-to-M365 migration orchestration.

## Apps
- **web**: React + Vite + Tailwind (admin dashboard UI)
- **api**: Node.js + Express (API scaffold)

## Prerequisites
- Node.js 18+

## Quick start

```bash
# Web
cd apps/web
npm install
npm run dev

# API
cd ../api
npm install
npm run dev
```

Web runs on http://localhost:5173
API runs on http://localhost:4000

## Notes
- Entra ID (Azure AD) auth integration placeholders are prepared in the web app.
- Azure deployment configuration can be added next (App Service + managed identity).
