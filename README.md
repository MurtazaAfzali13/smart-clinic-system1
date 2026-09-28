# Smart Clinic System & AI Medical Assistant 🏥🤖

A modern, bilingual (FA/EN) comprehensive clinic management system powered by AI. This platform integrates a robust appointment booking system with autonomous medical AI agents to assist patients and analyze medical documents.

## 🚀 Tech Stack

### Frontend (`/clinic-frontend`)
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling & UI:** Tailwind CSS, shadcn/ui
- **i18n:** Custom nested routing (`/fa`, `/en`)
- **Auth & DB Client:** Supabase SSR

### Backend (`/clinic-backend`)
- **Framework:** FastAPI
- **Language:** Python 3.11+
- **Dependency Management:** Poetry
- **AI Agents:** LangGraph, LangChain
- **Vector Database:** Pinecone
- **Database:** Supabase (PostgreSQL)

## 📁 Repository Structure
This is a monorepo containing both the frontend and backend services:
- `clinic-frontend/`: The Next.js web application.
- `clinic-backend/`: The FastAPI and AI agent server.

## 🛠️ Getting Started

### 1. Frontend Setup
```bash
cd clinic-frontend
npm install
npm run dev