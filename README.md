# BuildCraft Constructions - Website & Construction Progress Management (Frontend UI)

A premium construction company website with separate **Admin** and **Client** dashboards.
**Frontend only** - React state and local mock data. There is no backend, database, API or real authentication.

## Tech stack
React 18 (JSX) - Vite - Tailwind CSS - Framer Motion - Lucide React - Recharts - React Router

## Install & run

Requires Node.js 18 or newer.

```bash
npm install
npm run dev        # starts http://localhost:5173
```

Other scripts:

```bash
npm run build      # production build into /dist
npm run preview    # preview the production build
```

## Demo credentials

| Role   | Email                  | Password   | Notes                                              |
|--------|------------------------|------------|----------------------------------------------------|
| Admin  | admin@buildcraft.com   | admin123   | Full management console                            |
| Client | ramesh@example.com     | client123  | Project at ~83% - push it past 85% from Admin to see the feedback popup trigger |
| Client | priya@example.com      | client123  | Project at ~89% - feedback popup appears on login  |
| Client | arun@example.com       | client123  | Delayed commercial project                         |
| Client | meena@example.com      | client123  | Account is **inactive** - login is rejected        |

Login pages: `/admin/login` and `/client/login`.

## Routes

**Public:** `/`, `/about`, `/services`, `/gallery`, `/contact`

**Admin (`/admin`):** dashboard, `sites`, `sites/new`, `sites/:id` (progress tracking), `materials`, `messages`, `feedback`, `reports`, `clients`

**Client (`/client`):** dashboard (with Interior Works Showcase carousel), `progress`, `materials` (read-only), `messages`

## Feature checklist

- Public site: Home, About, Services, Gallery (filters + preview), Contact (enquiry form, no phone number)
- Admin and Client login with role-based route guards (demo only)
- Admin dashboard: stats, charts, project cards, activities, notifications, status overview
- Site registration with radio/checkbox controls; optional categories can be toggled later
- Progress tracking: per-task percentages, mark complete, pending tasks, daily updates, remarks, image upload + preview, history
- Dynamic progress: every enabled category counts equally; disabled optional categories are excluded; values clamped to 0-100%
  (`src/utils/progress.js`). Donut, bar and completed-vs-remaining charts update live.
- Materials: admin checklist (category-wise, edit/save), client read-only view
- Interior Works Showcase: auto-sliding carousel, arrows, indicators, pause on hover, full-screen preview
- Messages & Corrections: client chat-style requests; admin replies and updates status (Submitted / Under Review / In Progress / Resolved)
- 85% feedback popup: appears automatically once per project; feedback is visible to Admin
- Admin notification bell with live unread count, dropdown, mark read / mark all read
- Reports: site-wise, category-wise, client-wise, daily; date filters, search, charts, preview, CSV (Excel) export, print/PDF
- Client management: add, edit, assign site, activate/deactivate

## Project structure

```
src/
  context/AppContext.jsx   # all app state (sites, clients, tickets, notifications, feedback, auth)
  data/                    # constants, mock data, public website content
  utils/                   # progress calculation and formatting helpers
  components/              # layout, charts, carousel, modals, notification bell, shared UI
  pages/                   # public, auth, admin, client pages
```

## Notes

- All data lives in React state, so it resets when you refresh the page (only the demo login is kept in `sessionStorage`).
- Images are loaded from Unsplash URLs (asset references). If an image cannot load, a graceful fallback is shown. Replace URLs in `src/data/mockData.js` with local files in `/public` if you prefer.
- **Future backend integration:** every mutation is a function in `AppContext.jsx` (e.g. `updateTask`, `createTicket`, `submitFeedback`). Replace the state updates there with API calls and the rest of the UI will not need to change.
