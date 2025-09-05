
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


# 🧭 Onboarding Guide: `user_profile` Schema by Role

This guide outlines the required fields for each user role in the `user_profile` table. The schema uses a single-table design with role-based nulls, allowing flexible onboarding while maintaining centralized access and security.

---

## 📘 Role-Based Field Requirements

| **Field**               | **Farmer 👨🏾‍🌾** | **FermentaryOwner 🧪** | **Warehouse 🏢** | **Organization 🏛️** |
|-------------------------|------------------|------------------------|------------------|----------------------|
| `id` (UUID)             | ✅               | ✅                     | ✅               | ✅                   |
| `email`                 | ✅               | ✅                     | ✅               | ✅                   |
| `full_name`             | ✅               | ✅                     | ❌               | ❌                   |
| `role`                 | ✅               | ✅                     | ✅               | ✅                   |
| `province_id`           | ✅               | ✅                     | ✅               | ✅                   |
| `district_id`           | ✅               | ✅                     | ❌               | ❌                   |
| `llg_id`                | ✅               | ✅                     | ❌               | ❌                   |
| `ward_id`               | ✅               | ✅                     | ❌               | ❌                   |
| `registration_number`   | ❌               | ✅                     | ❌               | ❌                   |
| `organization_name`     | ❌               | ❌                     | ✅               | ✅                   |
| `created_at`            | ✅               | ✅                     | ✅               | ✅                   |

✅ = Required  
❌ = Not required (should be `null` or omitted)

---

## 🧠 Developer Notes

- `full_name` is required for individual roles (Farmer, FermentaryOwner).
- `organization_name` is required for entity roles (Warehouse, Organization).
- Location hierarchy (`district_id`, `llg_id`, `ward_id`) applies only to field-level roles.
- `registration_number` is specific to FermentaryOwner for traceability.
- All fields should be validated before submission to ensure onboarding clarity and schema integrity.

---

## 🔐 Security & Validation

- Use app-level validation to enforce role-specific requirements before calling `submitProfile`.
- Consider adding Supabase `CHECK` constraints or RLS policies to enforce field integrity.
- Index `role`, `id`, and `province_id` for faster filtering and querying.

---

## 📦 Example Payloads

### Farmer

```ts
{
  id: 'uuid',
  email: 'farmer@example.com',
  full_name: 'John Farmer',
  role: 'Farmer',
  province_id: 'uuid',
  district_id: 'uuid',
  llg_id: 'uuid',
  ward_id: 'uuid',
  created_at: 'timestamp'
}