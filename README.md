# OneAtlas — AI Model Discovery & Intelligence Platform

> **A centralized intelligence and comparison platform where developers, researchers, and enterprises discover, explore, compare, and evaluate AI models from multiple AI labs and inference providers.**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?style=flat&logo=postgresql)](https://www.postgresql.org/)

---

## 1. Project Overview & Problem Statement

Modern AI developers and engineering teams face a fragmented landscape when selecting foundation models:
- **Pricing Discrepancies**: Token pricing varies wildly across direct lab APIs and inference aggregators.
- **Scattered Benchmarks**: Critical evaluations (Chatbot Arena Elo, HumanEval, MMLU-Pro, MATH-500, GPQA) are dispersed across different papers, websites, and leaderboards.
- **Obscure Technical Capabilities**: Context limits, reasoning support, tool-calling readiness, temperature control, and modality specs require tedious manual research.

**OneAtlas** solves this by offering a unified, high-density intelligence catalog and side-by-side comparison engine.

---

## 2. Key Features

- **Models Discovery Hub (`/`)**:
  - Live technical specifications table and card views.
  - Multi-field search across model names, slugs, labs, and descriptions.
  - Combined dropdown filters for labs, providers, and model types.
  - Capability filter chips: *Reasoning*, *Tool calling*, *Structured output*, *Vision*, *Open weights*, *1M+ context*, *Free tier*, and *Hide deprecated*.
  - Multi-column sorting (Pricing, Context length, Intelligence Elo, Updated date).
  - Dynamic release distribution chart and capability coverage metrics.
- **Model Details (`/models/[slug]`)**:
  - In-depth technical specifications, modality badges, and temperature controls.
  - Token economics: input, output, and cached token pricing per 1M tokens.
  - Comprehensive list of inference providers hosting the model.
  - Verified benchmark scores with source attribution.
- **Side-by-Side Model Comparison (`/compare`)**:
  - Compare 2 to 3 models simultaneously.
  - Highlights meaningful differences and identifies cheaper models per token tier.
  - Persistent selection powered by `localStorage` and shareable URL query parameters (`?models=slug1,slug2`).
- **Rankings Leaderboard (`/rankings`)**:
  - Filterable by domain: *Overall Intelligence*, *Frontier Reasoning*, *Code & Software*, *Competition Mathematics*, and *General Knowledge*.
- **Standardized Benchmarks (`/benchmarks` & `/benchmarks/[slug]`)**:
  - Benchmark suites explaining evaluation methodologies and ranking participating models.
- **Labs & Providers Directories (`/labs`, `/providers`)**:
  - Separate database entities distinguishing model developers (e.g., Anthropic, DeepSeek, OpenAI) from API access platforms (e.g., OpenRouter, Together AI, Groq).

---

## 3. Technology Stack & Architecture

```mermaid
graph TD
    Client["Client / Browser (React 18, Tailwind CSS, Lucide Icons)"] --> AppRouter["Next.js 14 App Router"]
    
    subgraph "Application Layer"
        AppRouter --> Pages["Pages (/ , /compare, /rankings, /benchmarks, /labs, /providers)"]
        AppRouter --> Handlers["Route Handlers (/api/models, /api/stats, /api/rankings, etc.)"]
    end

    subgraph "Data & Persistence Layer"
        Handlers --> PrismaClient["Prisma ORM Client"]
        PrismaClient --> PostgreSQL["PostgreSQL Database (Neon / Local)"]
        Handlers -.-> Fallback["Resilient Fallback Engine"]
    end
```

### Technology Breakdown:
- **Framework**: Next.js 14.2 (App Router)
- **Language**: TypeScript 5.6
- **Styling**: Tailwind CSS 3.4
- **ORM**: Prisma 5.22
- **Database**: PostgreSQL (Compatible with Neon Serverless Postgres)
- **Validation**: Zod 3.23
- **Icons**: Lucide React

---

## 4. Database Schema Overview

```mermaid
erDiagram
    Company ||--o{ Model : develops
    Model ||--o{ ModelProvider : "available via"
    Provider ||--o{ ModelProvider : hosts
    Model ||--o{ ModelCapability : possesses
    Capability ||--o{ ModelCapability : categorized
    Model ||--o{ ModelBenchmark : evaluated
    Benchmark ||--o{ ModelBenchmark : scores

    Company {
        string id PK
        string name
        string slug UK
        string website
    }
    Model {
        string id PK
        string name
        string slug UK
        string modelId UK
        string modelType
        int contextLength
        int maxOutput
        boolean reasoning
        boolean toolCalling
        boolean openWeights
    }
    Provider {
        string id PK
        string name
        string slug UK
        string website
    }
    ModelProvider {
        string id PK
        float inputPrice
        float outputPrice
        float cachePrice
        string availability
    }
    Benchmark {
        string id PK
        string name
        string slug UK
        string category
    }
    ModelBenchmark {
        string id PK
        float score
        string source
    }
```

---

## 5. API Documentation

| Route | Method | Description | Query Parameters |
| :--- | :--- | :--- | :--- |
| `/api/models` | `GET` | Paginated models with filters | `q`, `lab`, `provider`, `type`, `capability`, `openWeights`, `hideDeprecated`, `sort`, `order`, `page`, `limit` |
| `/api/models/[slug]` | `GET` | Full model technical record | — |
| `/api/rankings` | `GET` | Benchmark-based leaderboard | `category` (`overall`, `reasoning`, `coding`, `mathematics`, `knowledge`), `q` |
| `/api/benchmarks` | `GET` | Industry benchmarks directory | `category` |
| `/api/benchmarks/[slug]` | `GET` | Participating models & scores | — |
| `/api/labs` | `GET` | AI research labs directory | `q` |
| `/api/labs/[slug]` | `GET` | Lab profile and developed models| — |
| `/api/providers` | `GET` | Inference platforms directory | `q` |
| `/api/providers/[slug]`| `GET` | Supported models & pricing tiers| — |
| `/api/stats` | `GET` | Catalog statistics & coverage | — |

---

## 6. Installation & Local Development

### Prerequisites
- Node.js >= 18 (Tested on Node v25.0.0)
- npm or pnpm
- PostgreSQL (or Neon connection string)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/SanikaSalunkhe1/OneAtlas.git
cd OneAtlas
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/oneatlas?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/oneatlas?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Generate Prisma Client & Run Migrations
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build & Start
```bash
npm run build
npm run start
```

---

## 7. Deployment Instructions (Vercel + Neon)

1. **Database Setup**:
   - Create a serverless PostgreSQL database on [Neon](https://neon.tech).
   - Copy the pooled connection string as `DATABASE_URL` and direct connection string as `DIRECT_URL`.
2. **Deploy to Vercel**:
   - Push repository to GitHub.
   - Import project in Vercel.
   - Configure Environment Variables: `DATABASE_URL` and `DIRECT_URL`.
   - Vercel automatically runs `npm run build` and deploys the Next.js serverless functions.
