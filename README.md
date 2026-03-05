# Project: GrindSpot - Gaming Eshop

A Full-stack gaming e-commerce platform built as a production-style monorepo.

This repository demonstrates end-to-end web development skills across product design, API architecture, database modeling, authentication, admin tooling, and deployment workflows.

## Executive Summary

GrindSpot is a complete storefront application with:

- Customer features: Authentication, Catalog browsing, Product detail, Cart, Checkout, Orders, Wishlist, Compare
- Admin features: Order status operations, Product content management (specifications and reviews), Protected admin dashboard
- Engineering focus: Modular backend architecture, Typed frontend/backend contracts, Secure auth flow, CI Automation, Docker-based local orchestration.

## Technology Stack

### Frontend.

- React 18
- TypeScript
- Vite 5
- React Router v6
- TanStack React Query v5
- Axios
- Tailwind CSS

### Backend.

- Node.js 20
- Express 4
- TypeScript
- Prisma ORM
- PostgreSQL 16
- Zod validation
- JSON Web Tokens (`jsonwebtoken`)
- Security middleware: `helmet`, `cors`, `cookie-parser`
- Rate limiting: `express-rate-limit`
- API docs: `swagger-jsdoc`, `swagger-ui-express`
- Logging: `morgan`, `winston`

### Tooling and DevOps.

- Docker and Docker Compose
- GitHub Actions CI (`.github/workflows/ci.yml`)
- ESLint
- TypeScript strict mode
- Jest (backend) and Vitest (frontend) test tooling

## --- What Is Implemented: ---

### Customer Experience.

- Account registration and login
- Access token + refresh token flow
- Product listing with search, category, sorting, price, and pagination support
- Product detail with technical specifications and reviews
- Cart item add, update, remove, and clear
- Checkout shipping capture and payment-method confirmation UX
- Order creation and order history
- Wishlist and compare list management

### Admin Experience.

- Admin-protected route access
- Order lifecycle management (`PENDING`, `PAID`, `SHIPPED`, `CANCELLED`)
- Product content operations for:
  - technical specifications
  - customer review entries
- Backend product CRUD endpoints

## Architecture Overview.

```text
grindspot/
|- backend/
|  |- prisma/
|  |- src/
|  |  |- config/
|  |  |- middleware/
|  |  |- modules/
|  |  |  |- auth/
|  |  |  |- products/
|  |  |  |- categories/
|  |  |  |- cart/
|  |  |  |- orders/
|  |  |  |- compare_wishlist/
|  |  |  |- adminCatalog/
|  |  |- app.ts
|  |  |- server.ts
|- frontend/
|  |- public/
|  |- src/
|- docker-compose.yml
|- README.md
```

## Backend Module Map.

Base path: `/api`

- Auth module: `/auth/*`
- Product module: `/products*`
- Category module: `/categories`
- Cart module: `/cart*`
- Order module: `/orders*`
- Admin order module: `/admin/orders*`
- Admin catalog module: `/admin/catalog*`
- Storefront state module: `/me*` (wishlist and compare)

Additional routes:

- Health check: `/health`
- Swagger docs: `/docs`

## API Surface (High-Level)

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Catalog and commerce.

- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/categories`
- `GET /api/cart`
- `POST /api/cart/items`
- `PATCH /api/cart/items/:itemId`
- `DELETE /api/cart/items/:itemId`
- `DELETE /api/cart`
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`

### Admin

- `GET /api/admin/orders`
- `PATCH /api/admin/orders/:id/status`
- `GET /api/admin/catalog/products`
- `GET /api/admin/catalog/products/:productId/content`
- `POST /api/admin/catalog/products/:productId/specifications`
- `PATCH /api/admin/catalog/specifications/:specificationId`
- `DELETE /api/admin/catalog/specifications/:specificationId`
- `POST /api/admin/catalog/products/:productId/reviews`
- `PATCH /api/admin/catalog/reviews/:reviewId`
- `DELETE /api/admin/catalog/reviews/:reviewId`

### Storefront state.

- `GET /api/me/storefront`
- `GET /api/me/wishlist`
- `POST /api/me/wishlist/toggle`
- `POST /api/me/compare/toggle`
- `DELETE /api/me/compare`

## Data Model.

Core Prisma models:

- `User`, `Role`
- `Category`
- `Product`
- `ProductSpecification`
- `ProductReview`
- `Cart`, `CartItem`
- `Order`, `OrderItem`, `OrderStatus`
- `WishlistItem`, `CompareItem`
- `LoyaltyProfile`

## Frontend Implementation Highlights.

- Route-based application composition with protected and admin-only routes
- API client with automatic auth header injection
- Automatic refresh-token retry strategy on 401 responses
- Storefront hooks for wishlist/compare behavior
- Guest compare fallback in localStorage
- Rich checkout validation for shipping and payment method inputs
- Feature-oriented page modules for product, order, cart, checkout, wishlist, and admin flows

## Security and Reliability Practices.

- Role-based authorization middleware (`USER` / `ADMIN`)
- Request schema validation with Zod
- Auth endpoint rate limiting
- Centralized error middleware with Prisma-aware error handling
- DB startup retry handling in backend bootstrap
- CORS and cookie handling configured for refresh token flow

## CI and Quality Controls.

GitHub Actions pipeline includes:

- Backend: install, lint, type-check, migrate, test
- Frontend: install, lint, type-check, build, test

Local quality commands:

```bash
# Backend
cd backend
npm run lint
npm run type-check
npm run build

# Frontend
cd frontend
npm run lint
npm run type-check
npm run build
```

##

## --------------------------------## Instructions for setup! --------------------------------

### Full Docker mode (frontend + backend + postgres)

1. Install Docker (If it's not already installed).

2. On Docker Navigate into project's folder.

```bash
#  (OPTIONAL) - Run this once if you had older volumes/config and want a clean DB bootstrap.
- docker compose down -v

```

3. Run command:

```bash
- docker compose up --build
```

4. That's it, The project now is up!
   On your browser you can use: 'http://localhost:3000' to check the site.

##

### You can also check:

All the URLs that you can check are:

- API root: `http://localhost:5000` -> Shows the root of all API-endpoints.
- Swagger docs: `http://localhost:5000/docs` -> Verifies auth/cart/orders routes are listed.
- Health endpoint: `http://localhost:5000/health` -> Confirm status if status: `ok`.
- Database UI URL: `http://localhost:5555` -> Renders the Database's UI.
- Frontend URL: `http://localhost:3000` -> Renders the whole FrontPage.

##

### Default Accounts:

### YOU CAN LOGIN WITH THE CREDENTIALS BELOW IF YOU WANT:

## ----------------------------------------------------------

- Admin: `admin@grindspot.com` / `admin123`
- User: `user@grindspot.com` / `user123`

## ----------------------------------------------------------

##

## Engineering Competencies Demonstrated.

This project showcases my personal skills relevant to software engineer/web developer roles:

- Full-stack feature ownership from UI to database
- API design and modular service/controller architecture
- Authentication and authorization implementation
- State management and async data handling in React
- Relational modeling and ORM usage with Prisma
- Validation, error handling, and middleware composition
- Dockerized local environments and CI pipeline integration
- Maintainable TypeScript code organization in a monorepo

## Current Limitations

- Checkout sends `paymentIntentId`, but backend payment orchestration is NOT implemented yet. !

## Project Goal

GrindSpot is designed as one of my portfolio-projects, included production-style codebase that demonstrates not only implementation ability, but also architecture clarity, maintainability, and delivery discipline expected in professional software teams.
