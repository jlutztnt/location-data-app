# Project Brief: Toot'n Totum Location Data Service

## Overview

This project is to create a centralized **Location Data Service** for Toot'n Totum. It will act as the single source of truth for all store-level information, including hours, manager details, and contact information.

## Core Components

*   **Backend:** A serverless application built on Cloudflare Workers.
*   **Frontend:** A modern web application hosted on Vercel.
*   **Database:** An internal Toot'n Totum database (DB1), accessed via Drizzle ORM.
*   **Authentication:** User and API authentication managed by Better Auth.
*   **UI:** A clean, accessible component library using shadcn/ui.

## Key Objectives

1.  **Centralize Data:** Consolidate all location information into a single, reliable database.
2.  **Secure API:** Provide secure, authenticated API access for trusted internal systems and digital signage.
3.  **Public UI:** Offer a scaled-down, public-facing website with read-only access to essential store data (e.g., hours, manager).
4.  **Admin Dashboard:** Build a comprehensive admin interface for full CRUD operations, data synchronization, and user management.
5.  **Data Integrity:** Ensure data accuracy through scheduled or manual synchronization with Google My Business.
