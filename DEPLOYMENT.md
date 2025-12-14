# Deployment Guide for Linkly

Linkly is a Monorepo with a Node.js Backend and React Frontend.

## 🚀 Easy Deployment (Render/Railway) - Recommended

Since the backend serves the frontend, the easiest way to deploy is to host the **Server** as a web service.

1. **Commit & Push** your code to GitHub.
2. Create a new Web Service on **Render** (or Railway).
3. Connect your GitHub repository.
4. **Build Command**: `npm install && npm run build` (This installs root dependencies, bootstraps workspaces, and builds both client/server).
5. **Start Command**: `npm start`
6. **Environment Variables**:
   Add these in your host's dashboard:
   - `DATABASE_URL`: `postgres://...` (The one you have)
   - `JWT_SECRET`: `any-secure-string`
   - `GEMINI_API_KEY`: `your-key`
   - `NODE_ENV`: `production`

## ⚡ Vercel Deployment (Frontend Only)

If you strictly want to use Vercel for the frontend:

1. **Backend Must Be Deployed**: You must deploy the server (using steps above) to get a backend URL (e.g., `https://linkly-api.onrender.com`).
2. **Frontend Config**:
   - In Vercel, set the Environment Variable:
     - `VITE_API_URL`: `https://linkly-api.onrender.com/api`
   - This tells the React app where to send requests.

## 🗄️ Database

Your application is already configured to use the online database via `DATABASE_URL`.
Ensure you run `npx prisma db push` locally (or in build command) if you make schema changes.
