# Luxora E-Shop - Complete Setup Guide

## 🚀 Quick Start (Using Docker - Recommended)

### Prerequisites
- Docker and Docker Compose installed
- Git (optional)

### Steps

1. **Clone or extract the project**
   ```bash
   cd luxora
   ```

2. **Set up environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   
   # Frontend  
   cp frontend/.env.example frontend/.env
   ```

3. **Start all services**
   ```bash
   docker-compose up --build
   ```

4. **In a new terminal, run database migrations and seed**
   ```bash
   docker-compose exec backend npx prisma migrate deploy
   docker-compose exec backend npm run seed
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/docs

6. **Login credentials (from seed)**
   - Admin: `admin@luxora.com` / `admin123`
   - User: `user@example.com` / `user123`

## 🛠️ Manual Setup (Without Docker)

### Prerequisites
- Node.js 20+
- PostgreSQL 16+
- npm or yarn

### Backend Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your PostgreSQL credentials
   ```

3. **Set up database**
   ```bash
   npx prisma migrate deploy
   npm run seed
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## 📝 Available Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with sample data
- `npm test` - Run tests
- `npm run lint` - Lint code

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run lint` - Lint code

## 🧪 Running Tests

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Admin)
- `PATCH /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/items` - Add item to cart
- `PATCH /api/cart/items/:itemId` - Update cart item
- `DELETE /api/cart/items/:itemId` - Remove from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `GET /api/admin/orders` - List all orders (Admin)
- `PATCH /api/admin/orders/:id/status` - Update order status (Admin)

### Categories
- `GET /api/categories` - List all categories

## 🚢 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables:
   - `VITE_API_URL`
   - `VITE_STRIPE_PUBLIC_KEY`
4. Deploy

### Backend (Render/Fly.io)
1. Create new web service
2. Set environment variables
3. Set build command: `npm run build`
4. Set start command: `npm start`

### Database (Neon/Supabase)
1. Create PostgreSQL instance
2. Copy connection string to `DATABASE_URL`
3. Run migrations: `npx prisma migrate deploy`
4. Run seed: `npm run seed`

## 🔧 Troubleshooting

### Port already in use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### Database connection issues
- Ensure PostgreSQL is running
- Verify DATABASE_URL in .env
- Check PostgreSQL user permissions

### Docker issues
```bash
# Reset everything
docker-compose down -v
docker-compose up --build
```

## 📚 Tech Stack

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS
- React Query (TanStack Query)
- React Hook Form + Zod
- React Router
- Zustand (state management)

**Backend:**
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Stripe (payment simulation)

**DevOps:**
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- ESLint + Prettier
- Jest (backend testing)
- Vitest (frontend testing)

## 🎯 Features

- ✅ User authentication & authorization
- ✅ Product browsing with search & filters
- ✅ Shopping cart (persisted in DB)
- ✅ Checkout flow with address validation
- ✅ Order history
- ✅ Admin panel for product/order management
- ✅ Responsive design
- ✅ Payment simulation (Stripe test mode)
- ✅ REST API with Swagger docs

## 📖 Project Structure

```
luxora/
├── backend/
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   ├── middleware/     # Express middleware
│   │   ├── config/         # Configuration
│   │   └── utils/          # Utilities
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Seed data
│   └── tests/              # Tests
│
├── frontend/
│   └── src/
│       ├── components/     # Reusable components
│       ├── features/       # Feature modules
│       ├── lib/            # Libraries & utilities
│       ├── hooks/          # Custom hooks
│       └── types/          # TypeScript types
│
└── docker-compose.yml      # Docker configuration
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open a pull request

## 📄 License

MIT License
