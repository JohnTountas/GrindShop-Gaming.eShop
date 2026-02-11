# 🚀 Luxora - Quick Reference Guide

## One-Command Setup

```bash
# Make script executable and run
chmod +x quickstart.sh
./quickstart.sh
```

This will:
- Start all services with Docker
- Run database migrations
- Seed the database
- Open the app at http://localhost:5173

## Manual Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your settings
npx prisma generate
npx prisma migrate dev
npm run seed
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with API URL
npm run dev
```

## Default Credentials

**Admin Account:**
- Email: `admin@luxora.com`
- Password: `Admin123!`

**Test User:**
- Email: `user@luxora.com`
- Password: `User123!`

## Key URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Docs**: http://localhost:5000/docs
- **Health Check**: http://localhost:5000/health

## Common Commands

### Database
```bash
# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio

# Seed database
npm run seed

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Development
```bash
# Backend
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
npm test             # Run tests
npm run lint         # Run linter
npm run type-check   # TypeScript check

# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm test             # Run tests
npm run test:e2e     # Run E2E tests
npm run lint         # Run linter
```

### Docker
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild containers
docker-compose up --build

# Execute command in container
docker-compose exec backend npm run seed
docker-compose exec backend npx prisma studio
```

## Project Structure

```
luxora/
├── backend/                 # Express API
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   │   ├── auth/
│   │   │   ├── products/
│   │   │   ├── cart/
│   │   │   └── orders/
│   │   ├── middleware/     # Express middleware
│   │   ├── utils/          # Helper functions
│   │   └── config/         # Configuration
│   ├── prisma/             # Database
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── tests/              # Tests
│
├── frontend/               # React app
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── features/      # Feature modules
│   │   ├── lib/          # API client, utils
│   │   ├── hooks/        # Custom hooks
│   │   └── types/        # TypeScript types
│   └── public/           # Static assets
│
├── docker-compose.yml    # Docker setup
├── README.md            # Main documentation
└── quickstart.sh        # Setup script
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product
- `POST /api/admin/products` - Create product (admin)
- `PATCH /api/admin/products/:id` - Update product (admin)
- `DELETE /api/admin/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get cart
- `POST /api/cart/items` - Add to cart
- `PATCH /api/cart/items/:id` - Update quantity
- `DELETE /api/cart/items/:id` - Remove from cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `GET /api/admin/orders` - List all orders (admin)
- `PATCH /api/admin/orders/:id/status` - Update status (admin)

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/luxora
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

## Testing

### Backend Tests
```bash
cd backend
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
npm run test:integration # Integration tests
```

### Frontend Tests
```bash
cd frontend
npm test                 # Component tests
npm run test:e2e         # E2E tests
npm run test:e2e:headed  # E2E with browser
```

## Deployment

### Vercel (Frontend)
1. Connect GitHub repository
2. Set environment variables
3. Deploy

### Render (Backend)
1. Create Web Service
2. Build: `cd backend && npm install && npm run build`
3. Start: `cd backend && npm start`
4. Add environment variables
5. Deploy

### Database (Neon)
1. Create PostgreSQL database
2. Copy connection string
3. Update DATABASE_URL
4. Run: `npx prisma migrate deploy`

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process
lsof -ti:5000 | xargs kill
lsof -ti:5173 | xargs kill
```

### Docker Issues
```bash
# Clean up Docker
docker-compose down -v
docker system prune -a
```

### Database Connection
```bash
# Check PostgreSQL is running
docker-compose ps
docker-compose logs postgres
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Getting Help

1. Check the main [README.md](README.md)
2. Review [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)
3. Check API docs at http://localhost:5000/docs
4. Review Prisma schema in `backend/prisma/schema.prisma`

## Next Steps

1. ✅ Get the app running locally
2. ✅ Explore the codebase
3. ✅ Test user flows (browse, cart, checkout)
4. ✅ Try admin features
5. ✅ Review the implementation guide
6. ✅ Customize for your needs
7. ✅ Deploy to production
8. ✅ Add to your portfolio!

---

**Need more details?** Check the comprehensive documentation in README.md
