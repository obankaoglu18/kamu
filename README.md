# Kamu 🌍

> A community-driven urban exploration platform. Discover hidden gems, rate local spots, and contribute to your city's map.

## Overview

**Kamu** is a full-stack monorepo application that enables users to discover and share interesting places in their city. It consists of a mobile app for exploration and a web dashboard for administration and moderation.

## Tech Stack

The project is built as a **Turborepo** monorepo:

-   **Apps**:
    -   `mobile`: React Native (Expo) app for users.
    -   `web`: Next.js app for admin dashboard & moderation.
    -   `api`: Express.js & Prisma server for backend logic.
-   **Database**: PostgreSQL
-   **Services**: Mapbox (Maps), Prisma (ORM)

## Features

-   **Mobile App**:
    -   Interactive Map with custom markers.
    -   User Location tracking.
    -   "Add Place" functionality (with "Under Inspection" status).
    -   Category filtering (Parks, Cafes, Museums, etc.).
-   **Web Admin Dashboard**:
    -   **Overview**: usage stats (Users, Places, Pending Items).
    -   **Moderation Queue**: Approve or Reject user-submitted places.
    -   **User Directory**: List all registered users.
    -   **Places Management**: View status and details of all places.

## Getting Started

### Prerequisites

-   Node.js (v18+)
-   PostgreSQL
-   Mapbox API Key

### Installation

1.  **Clone the repo**:
    ```bash
    git clone https://github.com/yourusername/kamu.git
    cd kamu
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create `.env` files in `apps/mobile` and `apps/api`.

    **`apps/mobile/.env`**:
    ```env
    EXPO_PUBLIC_MAPBOX_PUBLIC_TOKEN=pk.YOUR_PUBLIC_TOKEN
    EXPO_PUBLIC_MAPBOX_SECRET_TOKEN=sk.YOUR_SECRET_TOKEN
    ```

    **`apps/api/.env`**:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/kamu?schema=public"
    PORT=3002
    ```

4.  **Database Setup**:
    ```bash
    cd apps/api
    npx prisma migrate dev --name init
    npx prisma db seed
    ```

### Running the Project

Start all applications (API, Web, and Mobile dev server) concurrently:

```bash
npm run dev
# or with Turbo directly:
npx turbo run dev
```

-   **Web Admin**: [http://localhost:3000](http://localhost:3000)
-   **API**: [http://localhost:3002](http://localhost:3002)
-   **Mobile**: Follow Expo instructions in terminal to launch on iOS Simulator or Android Emulator.

## Security

-   All sensitive keys (Mapbox, Database) are stored in `.env` files which are git-ignored.
-   The API uses `helmet` for header security.
-   User inputs are validated via Prisma and API logic.

## License

MIT
