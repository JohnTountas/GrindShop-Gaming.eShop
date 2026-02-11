# 🏪 Luxora E-Shop - Complete Full-Stack E-Commerce Platform

A production-ready e-commerce platform built with modern technologies, designed as a portfolio project for junior to mid-level developers.

## ✨ Features

### Customer Features
- 🔐 **Authentication & Authorization** - Secure JWT-based auth with refresh tokens
- 🛍️ **Product Catalog** - Browse products with search, filters, and pagination
- 🛒 **Shopping Cart** - Persistent cart with real-time updates
- 💳 **Checkout** - Complete checkout flow with address validation
- 📦 **Order History** - View past orders and track status
- 📱 **Responsive Design** - Mobile-first, works on all devices

### Admin Features
- 📊 **Admin Dashboard** - Manage products and orders
- ➕ **Product Management** - Full CRUD operations for products
- 📋 **Order Management** - View and update order statuses
- 🖼️ **Image Upload** - Multiple image support per product

### Technical Features
- ⚡ **Fast & Optimized** - Built with performance in mind
- 🔒 **Secure** - Input validation, rate limiting, CSRF protection
- 📚 **Well Documented** - Swagger API docs, inline comments
- 🧪 **Tested** - Unit and integration tests
- 🐳 **Docker Ready** - One-command setup with Docker Compose
- 🚀 **CI/CD** - GitHub Actions workflow included

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand + React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors

### Backend
- **Runtime**: Node.js 20
- **Framework**: Express + TypeScript
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Authentication**: JWT + httpOnly cookies
- **Validation**: Zod
- **API Docs**: Swagger/OpenAPI
- **Testing**: Jest

### DevOps
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Linting**: ESLint + Prettier
- **Version Control**: Git

## 🚀 Quick Start

### Option 1: Docker (Recommended)

1. **Prerequisites**
   - Docker and Docker Compose installed

2. **Setup and Run**
   ```bash
   # Navigate to project directory
   cd luxora

   # Copy environment files
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env

   # Start all services
   docker-compose up --build

   # In another terminal, run migrations and seed
   docker-compose exec backend npx prisma migrate deploy
   docker-compose exec backend npm run seed
   ```

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Docs: http://localhost:5000/docs

4. **Login Credentials**
   - Admin: `admin@luxora.com` / `admin123`
   - User: `user@example.com` / `user123`

### Option 2: Manual Setup

1. **Prerequisites**
   - Node.js 20+
   - PostgreSQL 16+
   - npm or yarn

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your PostgreSQL credentials
   npx prisma migrate deploy
   npm run seed
   npm run dev
   ```

3. **Frontend Setup** (in new terminal)
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
   ```

## 📁 Project Structure

```
luxora/
├── backend/
│   ├── src/
│   │   ├── modules/           # Feature modules
│   │   │   ├── auth/          # Authentication
│   │   │   ├── products/      # Product management
│   │   │   ├── cart/          # Shopping cart
│   │   │   ├── orders/        # Order processing
│   │   │   └── categories/    # Product categories
│   │   ├── middleware/        # Express middleware
│   │   ├── config/            # Configuration files
│   │   └── utils/             # Utility functions
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Seed data
│   └── tests/                 # Test files
│
├── frontend/
│   └── src/
│       ├── components/        # Reusable components
│       ├── features/          # Feature modules
│       ├── lib/               # Libraries & API clients
│       ├── hooks/             # Custom React hooks
│       └── types/             # TypeScript definitions
│
├── docker-compose.yml         # Docker orchestration
└── README.md                  # This file
```

## 🌐 API Documentation

Once the backend is running, visit http://localhost:5000/docs for interactive API documentation.

### Key Endpoints

**Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

**Products**
- `GET /api/products` - List products (supports filters)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Admin)

**Cart**
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add to cart

**Orders**
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders
- `GET /api/admin/orders` - All orders (Admin)

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
npm test
npm run test:coverage
```

### Run Frontend Tests
```bash
cd frontend
npm test
```

## 🚢 Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Connect repository in Vercel
3. Set environment variables
4. Deploy

### Backend (Render/Fly.io)
1. Create web service
2. Configure environment variables
3. Set build: `npm run build`
4. Set start: `npm start`

### Database (Neon/Supabase)
1. Create PostgreSQL instance
2. Update DATABASE_URL
3. Run migrations: `npx prisma migrate deploy`

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/luxora
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

## 🎓 Portfolio Pitch

This project demonstrates:

### **Technical Competence**
- Modern full-stack development with TypeScript
- RESTful API design and implementation
- Database modeling and optimization
- Authentication and authorization patterns
- State management and data fetching
- Form validation and error handling

### **Professional Practices**
- Clean code architecture with separation of concerns
- Type safety throughout the stack
- Comprehensive error handling
- API documentation with Swagger
- Testing strategy (unit + integration)
- Git workflow and commit conventions

### **Production Readiness**
- Docker containerization
- Environment-based configuration
- Security best practices (JWT, input validation, rate limiting)
- CI/CD pipeline
- Deployment guides for major platforms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for learning or portfolio purposes.

## 🙏 Acknowledgments

- Built as a comprehensive portfolio project
- Designed to showcase junior-to-mid level full-stack capabilities
- Ready for use in job applications and technical interviews

---

**Built with ❤️ for developers looking to level up their portfolio**
