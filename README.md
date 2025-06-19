# Military Asset Management System

A comprehensive web application for managing military assets across multiple bases with role-based access control.

## Architecture Overview

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based authentication
- **Security**: Role-based access control (RBAC)
- **API**: RESTful APIs with comprehensive logging

### Frontend
- **Framework**: Next.js 15 with TypeScript
- **Styling**: TailwindCSS for responsive design
- **State Management**: React Query for server state
- **Authentication**: Context-based auth management

## Features Implemented

### ✅ Core Features
- **Dashboard**: Real-time metrics with filters (Date, Base, Equipment Type)
- **Asset Management**: Complete CRUD operations for military assets
- **Purchases**: Record and track asset purchases by base
- **Transfers**: Inter-base asset transfer system with validation
- **Assignments**: Assign assets to personnel with tracking
- **Expenditures**: Track consumed/expended assets

### ✅ Role-Based Access Control
- **Admin**: Full system access across all bases
- **Base Commander**: Limited to assigned base operations
- **Logistics Officer**: Access to purchases and transfers

### ✅ Security & Compliance
- JWT authentication with secure token management
- API request logging for audit trails
- Input validation and sanitization
- CORS configuration for secure cross-origin requests

## Database Schema

The system uses PostgreSQL with the following key entities:
- **Users** (with roles and base assignments)
- **Bases** (military installations)
- **Assets** (vehicles, weapons, ammunition, equipment)
- **Purchases** (asset procurement records)
- **Transfers** (inter-base movement tracking)
- **Assignments** (personnel asset allocation)
- **Expenditures** (asset consumption tracking)
- **ApiLogs** (comprehensive audit trail)

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 13+
- Git

### 1. Database Setup
```bash
# Create database
createdb -U postgres military_asset_db

# Import database dump
psql -U postgres -d military_asset_db < backend/database_dump.sql
```

### 2. Backend Setup
```bash
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma client
npm run prisma generate

# Start backend server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Start frontend development server
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Default Admin: admin@military.local / admin123

## Environment Configuration

### Backend (.env)
```
DATABASE_URL="postgresql://username:password@localhost:5432/military_asset_db"
JWT_SECRET="your-super-secure-jwt-secret-key"
PORT=4000
```

### Frontend Environment
The frontend connects to backend at `http://localhost:4000` by default.

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Core Resources
- `GET /api/dashboard/metrics` - Dashboard metrics with filters
- `GET/POST /api/assets` - Asset management
- `GET/POST /api/purchases` - Purchase operations
- `GET/POST /api/transfers` - Transfer operations
- `GET/POST /api/assignments` - Assignment operations
- `GET/POST /api/expenditures` - Expenditure operations
- `GET /api/bases` - Base information

## Deployment

### Production Database
1. Create production PostgreSQL database
2. Import the provided database dump
3. Update environment variables

### Backend Deployment
```bash
cd backend
npm run build
npm start
```

### Frontend Deployment
```bash
cd frontend
npm run build
npm start
```

## Sample Data

The database dump includes:
- Admin user: `admin@military.local` / `admin123`
- 5 military bases (HQ, Northern, Southern, Eastern, Western)
- 10 sample assets across different types
- Sample transactions (purchases, transfers, assignments, expenditures)

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based route protection
- API request logging and audit trails
- Input validation with Zod schemas
- CORS security configuration

## Technology Stack Justification

### Backend Choices
- **Express.js**: Mature, lightweight framework with extensive middleware ecosystem
- **TypeScript**: Enhanced code quality, better IDE support, compile-time error checking
- **Prisma ORM**: Type-safe database access, automatic migrations, excellent PostgreSQL integration
- **PostgreSQL**: ACID compliance, excellent for audit trails, robust relational capabilities

### Frontend Choices
- **Next.js**: SSR capabilities, excellent developer experience, production-optimized
- **TailwindCSS**: Utility-first CSS, responsive design, maintainable styling
- **React Query**: Powerful server state management, caching, background updates

## Support & Maintenance

This system provides:
- Comprehensive error handling
- Detailed logging for troubleshooting
- Scalable architecture for future enhancements
- Complete audit trail compliance
- Responsive design for mobile/desktop usage

## License

This project is developed for military asset management purposes with enterprise-grade security and compliance features. 