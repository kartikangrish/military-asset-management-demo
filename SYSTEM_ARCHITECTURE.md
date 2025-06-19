# Military Asset Management System - Architecture & Code Structure

## 🏗️ System Architecture

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (Express.js)  │◄──►│  (PostgreSQL)   │
│   Port: 3000    │    │   Port: 8080    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
       │                       │                       │
       ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Vercel       │    │    Railway      │    │    Railway      │
│   (Hosting)     │    │   (Hosting)     │    │   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

#### Frontend
- **Framework**: Next.js 15.3.3 (React)
- **Styling**: TailwindCSS
- **State Management**: React Query (TanStack Query)
- **Authentication**: JWT tokens with Context API
- **Deployment**: Vercel

#### Backend
- **Framework**: Express.js with TypeScript
- **Database ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Authorization**: Role-Based Access Control (RBAC)
- **Deployment**: Railway

#### Database
- **Database**: PostgreSQL
- **Hosting**: Railway
- **Schema Management**: Prisma migrations

## 📁 Detailed Code Structure

### Frontend Structure (`/frontend`)
```
frontend/
├── public/                     # Static assets
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx          # Home page
│   │   ├── login/
│   │   │   └── page.tsx      # Login page
│   │   ├── dashboard/
│   │   │   └── page.tsx      # Dashboard page
│   │   ├── assets/
│   │   │   └── page.tsx      # Assets management
│   │   ├── purchases/
│   │   │   └── page.tsx      # Purchase tracking
│   │   ├── transfers/
│   │   │   └── page.tsx      # Asset transfers
│   │   └── assignments/
│   │       └── page.tsx      # Asset assignments
│   ├── components/
│   │   ├── Layout.tsx        # Main layout component
│   │   ├── ProtectedRoute.tsx # Auth guard component
│   │   └── Providers.tsx     # Context providers
│   ├── contexts/
│   │   └── AuthContext.tsx   # Authentication context
│   ├── lib/
│   │   └── api.ts           # API client & endpoints
│   └── types/
│       └── auth.ts          # TypeScript types
├── package.json
├── next.config.ts
└── tsconfig.json
```

### Backend Structure (`/backend`)
```
backend/
├── src/
│   ├── app.ts               # Express app configuration
│   ├── routes/              # API route handlers
│   │   ├── auth.ts         # Authentication routes
│   │   ├── assets.ts       # Asset management routes
│   │   ├── purchases.ts    # Purchase tracking routes
│   │   ├── transfers.ts    # Transfer management routes
│   │   ├── assignments.ts  # Assignment routes
│   │   ├── expenditures.ts # Expenditure routes
│   │   ├── dashboard.ts    # Dashboard metrics routes
│   │   └── bases.ts        # Military base routes
│   ├── middleware/
│   │   ├── auth.ts         # JWT authentication middleware
│   │   └── rbac.ts         # Role-based access control
│   ├── controllers/        # Request handlers (empty - using inline)
│   ├── models/            # Data models (empty - using Prisma)
│   └── utils/             # Utility functions
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.ts           # Database seeding script
│   └── migrations/       # Database migrations
│       └── 20250618091738_init/
│           └── migration.sql
├── package.json
├── tsconfig.json
└── railway.toml          # Railway deployment config
```

## 🔐 Authentication & Authorization Flow

### Authentication Process
1. User submits credentials to `/api/auth/login`
2. Backend validates credentials against database
3. If valid, JWT token is generated and returned
4. Frontend stores token in localStorage
5. Subsequent requests include token in Authorization header

### Role-Based Access Control
- **Admin**: Full system access
- **Base Commander**: Base-specific management
- **Logistics Officer**: Asset tracking and reporting

### Protected Routes
All API routes except `/api/auth/login` require authentication:
```typescript
app.use('/api/assets', assetsRouter);     // Requires auth
app.use('/api/purchases', purchasesRouter); // Requires auth
app.use('/api/transfers', transfersRouter);  // Requires auth
```

## 📊 Database Schema

### Core Entities
- **Users**: System users with roles and base assignments
- **Roles**: Admin, Base Commander, Logistics Officer
- **Bases**: Military installations
- **Assets**: Equipment, vehicles, weapons, ammunition
- **Purchases**: Asset procurement records
- **Transfers**: Asset movement between bases
- **Assignments**: Asset allocation to personnel
- **Expenditures**: Asset consumption/usage records

### Key Relationships
```
User ──► Role (Many-to-One)
User ──► Base (Many-to-One)
Asset ──► Base (Many-to-One)
Purchase ──► Asset (Many-to-One)
Purchase ──► User (Many-to-One)
Transfer ──► Asset (Many-to-One)
Transfer ──► Base (From/To)
```

## 🚀 Deployment Architecture

### Production URLs
- **Frontend**: `https://frontend-dzrjus2wz-kartiks-projects-3f634b70.vercel.app`
- **Backend**: `https://backend-production-0dc3.up.railway.app`
- **Database**: Railway PostgreSQL (internal)

### Environment Variables
#### Backend (Railway)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: JWT signing key
- `PORT`: Server port (8080)

#### Frontend (Vercel)
- `NEXT_PUBLIC_API_URL`: Backend API URL

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Assets Management
- `GET /api/assets` - List all assets
- `POST /api/assets` - Create new asset
- `PUT /api/assets/:id` - Update asset
- `DELETE /api/assets/:id` - Delete asset

### Purchases
- `GET /api/purchases` - List purchases
- `POST /api/purchases` - Record new purchase

### Transfers
- `GET /api/transfers` - List transfers
- `POST /api/transfers` - Create transfer

### Dashboard
- `GET /api/dashboard/metrics` - Get system metrics

### Other Endpoints
- `GET /api/bases` - List military bases
- `GET /api/assignments` - List asset assignments
- `GET /api/expenditures` - List expenditures

## 🎯 Key Features

1. **Multi-Role Authentication**: Different access levels for different user types
2. **Asset Lifecycle Management**: Track assets from purchase to disposal
3. **Inter-Base Transfers**: Manage asset movement between military installations
4. **Real-time Dashboard**: Metrics and KPIs for asset management
5. **Audit Trail**: Complete history of all asset transactions
6. **Responsive Design**: Works on desktop and mobile devices

## 📈 Scalability Considerations

- **Database Indexing**: Optimized queries for large datasets
- **API Pagination**: Efficient data loading for large lists
- **Caching Strategy**: Redis can be added for session management
- **Horizontal Scaling**: Railway supports auto-scaling
- **CDN Integration**: Vercel provides global CDN for frontend

This architecture provides a robust, scalable foundation for military asset management with clear separation of concerns and modern web development best practices. 