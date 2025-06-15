# Product Context: Location Data Service

## Problem Statement

Toot'n Totum currently lacks a single, authoritative source for store location data. Information is scattered, leading to inconsistencies across internal systems, public-facing websites, and digital signage. This fragmentation causes operational inefficiencies, confuses customers, and makes data management difficult and error-prone.

## Vision

The Location Data Service will become the definitive source of truth for all location-related information. By centralizing data and providing secure, reliable access channels, this service will empower the entire organization to operate with consistent, accurate, and up-to-date information.

## User Personas & Needs

1.  **Internal Systems (e.g., Digital Signage, Analytics Pipelines):**
    *   **Need:** Programmatic, secure, and reliable access to the latest store data.
    *   **Solution:** Authenticated API endpoints (JWT, OAuth2, API keys).

2.  **Administrative Staff (e.g., District Managers, IT):**
    *   **Need:** A user-friendly interface to manage location data, oversee synchronization, and ensure data quality.
    *   **Solution:** A secure admin dashboard with full CRUD capabilities, GMB sync controls, and audit logs.

3.  **The Public (Customers):**
    *   **Need:** Quick access to accurate, essential store information like hours and manager names.
    *   **Solution:** A simple, read-only public website.

## Key Scenarios

*   **Data Update:** An administrator updates a store's hours through the admin dashboard. The change is immediately reflected in the database and available via the API, ensuring the public website and internal digital signage are updated simultaneously.
*   **Automated Sync:** A scheduled job runs to sync data with Google My Business, automatically correcting discrepancies without manual intervention.
*   **New System Integration:** A new internal reporting tool needs location data. It is granted a secure API key to pull data from the service, ensuring it has access to the same trusted information as all other systems.
