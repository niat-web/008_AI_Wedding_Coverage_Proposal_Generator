# Production Deployment Guide

This guide details the step-by-step process of deploying the **AI Wedding Coverage Proposal Generator** to production:
- **Backend**: Deployed to **Render**
- **Frontend**: Deployed to **Vercel**

---

## Part 1: Backend Deployment on Render

Render is ideal for hosting Node.js Express APIs.

### 1. Set Up Code Repository
Ensure your project is pushed to a Git repository (e.g. GitHub or GitLab). It is recommended to put the backend in its own repository, or use Render's Monorepo support (setting the **Root Directory** as `backend`).

### 2. Create Render Web Service
1. Log in to your **Render Dashboard** ([dashboard.render.com](https://dashboard.render.com/)).
2. Click **New +** and select **Web Service**.
3. Connect your Git repository.
4. Configure the Web Service settings:
   - **Name**: `thereelshoot-proposal-api`
   - **Environment**: `Node`
   - **Root Directory**: `backend` (if in a monorepo, otherwise leave blank)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Select the **Free** tier (or higher)

### 3. Configure Environment Variables
In the Render Web Service settings, navigate to the **Environment** tab and add the following variables:

| Key | Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5001` | Server port (Render automatically overrides this, but good to define). |
| `GEMINI_API_KEY` | `AIzaSy...` | Your production Google Gemini API key. |
| `FIREBASE_PROJECT_ID` | `your-prod-id` | Your production Firebase Project ID. |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk...` | Your Firebase Service Account Email. |
| `FIREBASE_PRIVATE_KEY` | `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----` | Your Firebase Service Account Private Key. Make sure to paste it with double quotes if it has newlines. |

4. Click **Save Changes** and Render will trigger a deployment. Copy the generated Web Service URL (e.g. `https://thereelshoot-proposal-api.onrender.com`).

---

## Part 2: Frontend Deployment on Vercel

Vercel is perfect for hosting high-performance Vite React static frontends.

### 1. Add Vercel Rewrite Configuration
To route API requests correctly in production without facing CORS issues or changing frontend fetch paths, we utilize a `vercel.json` rewrite file in the frontend folder.

Create a file named `vercel.json` inside the `frontend` directory:
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://thereelshoot-proposal-api.onrender.com/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
*Note: Replace `https://thereelshoot-proposal-api.onrender.com` with the actual Render URL obtained in Part 1.*

### 2. Create Vercel Project
1. Log in to your **Vercel Dashboard** ([vercel.com](https://vercel.com/)).
2. Click **Add New** -> **Project**.
3. Import your Git repository.
4. Configure Project settings:
   - **Framework Preset**: `Vite` (Vercel detects this automatically)
   - **Root Directory**: `frontend` (if in a monorepo, click Edit and select `frontend`)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**.
6. Once deployed, Vercel will provide you with a production URL (e.g. `https://thereelshoot-proposal.vercel.app`).

---

## Part 3: Production Firebase Cloud Firestore Setup

If you wish to use a live Firestore database in production instead of local file fallback:

1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Create or select a project.
3. Click on **Firestore Database** in the left menu and click **Create Database**.
4. Set database location and select **Start in production mode**.
5. Enable the database.
6. Go to **Project Settings** -> **Service Accounts**.
7. Click **Generate New Private Key**. A JSON file will download.
8. Extract `project_id`, `client_email`, and `private_key` from this JSON and add them to the Render environment variables as configured in Part 1.
