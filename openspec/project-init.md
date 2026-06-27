# OpenSpec Project Initialization - ai4devs-backend-2604

This file establishes the project profile, stack definition, test suite configuration, and linting/formatting standards.

## Project Profile
- **Project Name:** ai4devs-backend-2604
- **Root Directory:** `/Users/develop/Workspace/Courses/LidrCo/AI4Devs/AI4Devs-backend-2604`
- **Monorepo Structure:** 
  - `backend/`: Express.js TypeScript application
  - `frontend/`: React TypeScript application (Create React App/`react-scripts`)
- **Package Manager:** `pnpm` (based on root `pnpm-lock.yaml`, though subdirectories have duplicate package locks)

---

## Tech Stack & Configurations

### 1. Backend Stack (`backend/`)
- **Framework:** Express.js (`^4.19.2`)
- **Language:** TypeScript (`^4.9.5`)
- **Database / ORM:** Prisma ORM (`^5.13.0`)
- **Transpiler/Runtime:** `ts-node` & `ts-node-dev` for development
- **Key Modules:**
  - `cors`: Express CORS middleware
  - `multer`: File uploads
  - `swagger-ui-express` & `swagger-jsdoc`: API documentation
- **Build Output:** Compiled to `./dist` using `tsc`
- **Port:** `3010`

### 2. Frontend Stack (`frontend/`)
- **Framework:** React (`^18.3.1`)
- **Language:** TypeScript (`^4.9.5`)
- **Harness:** Create React App (`react-scripts 5.0.1`)
- **UI Libraries:** Bootstrap (`^5.3.3`), React Bootstrap (`^2.10.2`)
- **Routing:** React Router DOM (`^6.23.1`)
- **Port:** Configured to integrate with backend running on `http://localhost:3010` (CORS-allowed)

---

## Test Runner & Validation Harnesses

### Backend Test Suite
- **Test Runner:** Jest (`^29.7.0`) via `ts-jest`
- **Environment:** Node (`testEnvironment: 'node'`)
- **Configuration File:** `backend/jest.config.js`
- **Execution Command:** `pnpm --filter backend test` (or `npm run test` inside `backend/`)
- **Coverage Status:** Coverage is not configured by default in Jest config.

### Frontend Test Suite
- **Test Runner:** Jest (wrapped by `react-scripts test`)
- **Environment:** JSDOM
- **Execution Command:** `pnpm --filter frontend test` (runs `jest --config jest.config.js`)
- **Libraries:** `@testing-library/react`, `@testing-library/jest-dom`

---

## Code Quality Standards

### Linter & Type-Checker
- **Backend Linter:** ESLint (`^9.2.0`) with Prettier integration
  - Configuration: `backend/.eslintrc.js` extends `plugin:prettier/recommended`
- **Type Checking:** Strict mode TypeScript is enabled (`"strict": true` in both tsconfig files).

### Formatter
- **Prettier:** Managed via `backend/.prettierrc`
  - Settings: Single quotes (`true`), Trailing commas (`all`).

---

## Database Schema & Migrations
- **Prisma Schema:** `backend/prisma/schema.prisma`
- **Database Engine:** Postgres (configured in schema/docker-compose)
- **Seed Script:** `backend/prisma/seed.ts`
