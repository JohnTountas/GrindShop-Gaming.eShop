#!/bin/bash

# Luxora E-Shop Quick Start Script
# This script sets up the development environment

set -e

echo "🛍️  Luxora E-Shop - Quick Start"
echo "================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Check if .env files exist
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend .env file..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please edit backend/.env with your configuration"
fi

if [ ! -f frontend/.env ]; then
    echo "📝 Creating frontend .env file..."
    cp frontend/.env.example frontend/.env
    echo "⚠️  Please edit frontend/.env with your configuration"
fi

echo ""
echo "🚀 Starting services with Docker Compose..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

echo ""
echo "📊 Running database migrations..."
docker-compose exec backend npx prisma migrate deploy

echo ""
echo "🌱 Seeding database..."
docker-compose exec backend npm run seed

echo ""
echo "✨ Setup complete!"
echo ""
echo "📍 Services are running at:"
echo "   Frontend:  http://localhost:5173"
echo "   Backend:   http://localhost:5000"
echo "   API Docs:  http://localhost:5000/docs"
echo ""
echo "🔑 Default credentials:"
echo "   Admin: admin@luxora.com / Admin123!"
echo "   User:  user@luxora.com / User123!"
echo ""
echo "📚 To view logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 To stop services:"
echo "   docker-compose down"
echo ""
