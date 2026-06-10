# AI Wedding Coverage Proposal Generator - thereelshoot

This is a production-ready, full-stack web application designed for **thereelshoot** (a luxury wedding photography and videography studio). The application enables the studio to generate, customize, download, and log high-end personalized wedding photography proposals within 2 minutes using Google Gemini AI and Cloud Firestore.

---

## Key Features

1. **Luxury Wedding-Themed UI**: An elegant obsidian dark theme with champagne gold accents, responsive cards, micro-animations, and glassmorphism.
2. **AI Proposal Engine (Gemini 1.5 Flash)**: Generates 4 tailored proposal sections (Photographer Introduction, Event-by-Event Coverage Plan, What to Expect deliverables list, and a Creative Pre-Wedding Concept photoshoot storyline) returned in rigid structured JSON format.
3. **Interactive Tabs**: An intuitive tab selector displaying each generated section with instant "Copy to Clipboard" capabilities.
4. **Branded PDF Export**: Generates a downloadable, beautifully styled and formatted print-ready PDF matching **thereelshoot** luxury studio branding.
5. **Proposal History Log**: A searchable history database allowing users to view, search, and reload previously generated proposals.
6. **Admin Analytics Dashboard**: Computes real-time business metrics including:
   - Total Proposals Generated
   - Most Popular Package Tier
   - Most Popular City Market
   - Daily Proposal Generation Trend represented via a custom-designed SVG area chart.
7. **Dual-Database Failover**: Automatically runs locally using an out-of-the-box local JSON database (`mockDb.json`) if Firebase Firestore credentials are not yet configured.

---

## Folder Structure

```
ai-wedding-proposal-generator/
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── server.js
│   └── mockDb.json (Local file database fallback)
├── frontend/
│   ├── dist/ (Production build files)
│   ├── src/
│   │   ├── components/
│   │   │   ├── DashboardView.jsx
│   │   │   ├── Form.jsx
│   │   │   ├── HistoryView.jsx
│   │   │   ├── ProposalView.jsx
│   │   │   └── Spinner.jsx
│   │   ├── App.css (Reset boilerplate styles)
│   │   ├── App.jsx (Main coordinator/router view)
│   │   ├── index.css (Tailwind v4 directive & fonts)
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js (Proxy to backend port 5001)
├── database_schema.md (Database structural documentation)
├── deployment_guide.md (Vercel & Render step-by-step guidelines)
└── README.md
```

---

## Setup & Running Guide

### Prerequisites
- Node.js (version >= 18.0.0)
- Google Gemini API key (Obtain one at [Google AI Studio](https://aistudio.google.com/))

### 1. Backend Setup
1. Open the backend folder:
   ```bash
   cd backend
   ```
2. Create your `.env` file by copying the template:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and fill in your `GEMINI_API_KEY`:
   ```env
   GEMINI_API_KEY=your_actual_key_here
   ```
   *(Optional: If you wish to connect to a remote Cloud Firestore database, fill in the `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` values).*
4. Run the backend server in development mode:
   ```bash
   npm run dev
   ```
   The backend API will run on `http://localhost:5001`.

### 2. Frontend Setup
1. Open the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Run the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend app will launch at `http://localhost:5173`.
3. Open your browser and navigate to `http://localhost:5173`.

---

## API Endpoints Reference

The backend Express application exposes the following `/api` endpoints:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/generate` | Generates a 4-section wedding proposal using the Gemini API. |
| `POST` | `/api/proposals` | Saves a generated proposal record to Firestore / local file database. |
| `GET` | `/api/proposals` | Fetches the list of all saved proposals (sorted by date descending). |
| `GET` | `/api/analytics` | Computes aggregate totals, package percentages, and chronological trends. |

---

## Production Build & Check
To compile a highly optimized build of the frontend for deployment:
```bash
npm run build
```
This output is saved to the `dist/` folder.
