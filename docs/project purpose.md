# 🛠 Toot'n Totum Location Data Service

## Overview

Toot’n Totum is developing a centralized **Location Data Service** to serve as the single source of truth for store-level information such as hours of operation, store and district managers, and contact details. The platform architecture includes:

- A **serverless backend** on **Cloudflare Workers**
- A **modern frontend** hosted on **Vercel**
- **Authentication** via **Better Auth**
- **Drizzle ORM** for type-safe DB access
- **shadcn/ui** for clean and accessible component styling

This system will offer:
- A **scaled-down, public-facing web UI** (no public API)
- **Secure, authenticated API access** for trusted internal systems
- An **admin dashboard** for full CRUD access and sync operations

---

## 🔍 Goals

- Consolidate all location information into a single database
- Power internal tools and digital signage through secure APIs
- Maintain accurate public-facing data with Google My Business sync
- Provide read-only UI access to select public location data
- Enable secure system-to-system data integrations

---

## 💡 Key Features

### ✅ Data Centralization
Each store record includes:
- Store number & name
- District & assigned managers
- Phone numbers & hours
- Google Place ID for sync

### 🔁 Google My Business Sync
- Scheduled or manual sync with GMB
- Corrects data inconsistencies across locations

### ✏️ Update Mechanisms
- Secure FTP file ingestion (CSV)
- Authenticated HTTP API updates
- Manual editing via admin dashboard

### 🌐 Scaled-Down Web UI
- Public-facing site (no login required)
- Displays:
  - Store hours
  - Manager name
  - Optional directions link
- Backend APIs are **not** directly exposed

### 🔐 Admin Dashboard
- Hosted on Vercel
- Built with **shadcn/ui** and protected by **Better Auth**
- Features:
  - Full CRUD access
  - GMB sync controls
  - Audit logs
  - Role-based access

### 🔗 Secure API Integrations
- Exposes authenticated endpoints (not public)
- Protected via:
  - JWTs or OAuth2
  - API keys or IP whitelisting
- Enables:
  - Internal system data sync
  - Digital signage integration
  - Reporting and analytics pipelines

---

## 🔐 Authentication & Security

- Uses **Better Auth** for login and session management
- Token-based backend protection for APIs
- Role-based permissions for admin UI
- Logging & rate limiting for sensitive endpoints

---

## ⚙️ Tech Stack

| Layer        | Technology                   |
|--------------|-------------------------------|
| Frontend     | Vercel + React + shadcn/ui   |
| Backend      | Cloudflare Workers           |
| Database     | Internal DB1 (Toot’n Totum)  |
| ORM          | Drizzle ORM                  |
| Authentication | Better Auth                |
| Styling/UI   | shadcn/ui (Radix + Tailwind) |

---

## 🚀 Future Enhancements

- Change approval workflows
- District-level permission granularity
- Mobile-optimized store search UI
- Webhooks for outbound data sync
- Admin usage analytics

---

## 📌 Why This Matters

The Location Data Service gives Toot’n Totum a single, trusted, and scalable source of truth for location data. With modern architecture and strict security controls, it ensures that teams across the company have consistent access to high-quality data—while retaining the flexibility to scale and integrate with future systems.
