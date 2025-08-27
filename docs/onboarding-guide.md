
---

### 📘 `docs/onboarding-guide.md`

```md
# Onboarding Guide

Welcome to the Cocoa Farmers App! This guide will help you understand the architecture, workflows, and how to contribute effectively.

## 🧠 Architecture Overview

- **Frontend**: React Native + Expo Router
- **Backend**: Supabase with edge functions
- **State**: Context API with modular providers
- **Routing**: Role-based layouts via `app/(auth)` and `app/(tabs)`

## 🛠️ Setup

1. Clone the repo
2. Install dependencies
3. Create a `.env` file with Supabase keys
4. Run `npm run dev`

## 🧭 Contributor Workflow

- Fork → Feature Branch → PR → Review → Merge
- Use semantic commits
- Document new components and hooks

## 📊 Diagrams

Include architecture and workflow diagrams in `docs/architecture-diagram.png`

## 🤝 Stakeholder Roles

- **Farmers**: Submit posts, view prices and tips
- **Researchers**: Analyze trends, access dashboards
- **Coordinators**: Manage users, validate submissions
