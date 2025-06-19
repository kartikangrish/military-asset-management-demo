# Military Asset Management System - Technical Documentation

## 1. Project Overview

### Description
The Military Asset Management System is a comprehensive web application designed for managing military assets across multiple bases with enterprise-grade security and role-based access control.

### Key Features
- Dashboard with real-time metrics and filtering
- Complete CRUD operations for military assets
- Inter-base asset transfer system
- Personnel asset assignments
- Asset expenditure tracking
- JWT authentication with audit logging

### Assumptions
- Multi-base military operations requiring asset tracking
- Role-based access control for different personnel levels
- Comprehensive audit requirements for compliance
- PostgreSQL database for ACID compliance

### Limitations
- Single tenant design (not multi-tenant)
- Limited advanced analytics and reporting
- Primarily desktop/tablet optimized
- No offline functionality
- Limited file attachment support

## 2. Tech Stack & Architecture

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **Security**: bcryptjs, zod validation, CORS
- **Logging**: Morgan middleware

### Frontend
- **Framework**: Next.js 15 with TypeScript
- **Styling**: TailwindCSS
- **State Management**: React Query (@tanstack/react-query)
- **HTTP Client**: Axios
- **UI Components**: Headless UI, Heroicons, Recharts

### Architecture Rationale
- TypeScript for type safety across the stack
- PostgreSQL for ACID compliance and audit trails
- Prisma ORM for type-safe database operations
- Next.js for production optimization and SSR
- JWT for stateless authentication

## 3. Data Models / Schema

### Core Entities

#### User Management
```
User {
  id: Primary Key
  email: Unique
  name: String
  password: Hashed
  roleId: Foreign Key
  baseId: Foreign Key (optional)
}

Role {
  id: Primary Key  
  name: String (Admin, Base Commander, Logistics Officer)
}
```

#### Base Operations
```
Base {
  id: Primary Key
  name: Unique
  location: String
}
```

#### Asset Management
```
Asset {
  id: Primary Key
  type: String (Vehicle, Weapon, Ammunition, Equipment)
  serial: Unique
  description: String
  baseId: Foreign Key
}
```

#### Transaction Tables
```
Purchase {
  id, assetId, baseId, quantity, date, createdById
}

Transfer {
  id, assetId, fromBaseId, toBaseId, quantity, date, createdById
}

Assignment {
  id, assetId, baseId, personnelId, quantity, date, assignedById
}

Expenditure {
  id, assetId, baseId, personnelId, quantity, date, expendedById
}
```

#### Audit Logging
```
ApiLog {
  id, userId, action, entity, entityId, timestamp, details
}
```

## 4. RBAC Explanation

### Role Hierarchy

#### Admin Role
- Full system access across all bases
- Create, modify, delete assets
- View all transactions and audit logs
- User management capabilities

#### Base Commander Role  
- Limited to assigned base operations
- View/manage assets within assigned base only
- Create purchases, transfers, assignments for own base
- Dashboard metrics filtered to assigned base

#### Logistics Officer Role
- Cross-base logistics operations
- View assets across all bases
- Process purchases and transfers
- Cannot create/modify assets directly

### Implementation

#### Authentication Middleware
```typescript
export function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
}
```

#### Authorization Middleware
```typescript
export function authorize(roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    next();
  };
}
```

### Enforcement Methods
- Route-level protection with middleware
- Data-level filtering based on user role and base assignment
- Business logic validation for cross-base operations

## 5. API Logging

### Logging Strategy

#### HTTP Request Logging
```typescript
app.use(morgan('dev')); // Logs: METHOD URL STATUS RESPONSE_TIME
```

#### Business Action Logging
Every significant operation logged to ApiLog table:
```typescript
await prisma.apiLog.create({
  data: {
    userId: req.user.id,
    action: 'CREATE',
    entity: 'ASSET',
    entityId: asset.id,
    details: `Created ${type} asset with serial ${serial}`
  }
});
```

#### Logged Actions
- CREATE: New assets, purchases, transfers, assignments
- UPDATE: Asset modifications, user changes
- DELETE: Asset deletion, user deactivation  
- LOGIN: Authentication events
- ACCESS: Sensitive data access

### Audit Trail Features
- Immutable log entries
- User attribution for all actions
- Contextual details for audit review
- Timestamp precision for sequence reconstruction

## 6. Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- npm 8+

### Database Setup
```bash
createdb -U postgres military_asset_db
psql -U postgres -d military_asset_db < database_dump.sql
```

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with database credentials
npx prisma generate
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Default Credentials
- Email: admin@military.local
- Password: admin123

### Environment Variables
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/military_asset_db"
JWT_SECRET="your-secure-secret-key"
PORT=4000
```

## 7. API Endpoints

### Authentication
```
POST /api/auth/login - User authentication
```

### Asset Management
```
GET /api/assets - Retrieve assets (role-filtered)
POST /api/assets - Create asset (Admin only)
PUT /api/assets/:id - Update asset (Admin only)
GET /api/assets/:id - Get asset by ID
```

### Dashboard
```
GET /api/dashboard/metrics - Dashboard metrics with filtering
Query params: startDate, endDate, baseId, assetType
```

### Transactions
```
POST /api/purchases - Record asset purchase
POST /api/transfers - Create inter-base transfer
POST /api/assignments - Assign assets to personnel
POST /api/expenditures - Record asset expenditure
```

### Reference Data
```
GET /api/bases - Retrieve all military bases
```

### Sample Request/Response

#### Login Request
```json
POST /api/auth/login
{
  "email": "admin@military.local",
  "password": "admin123"
}
```

#### Login Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@military.local",
    "name": "System Administrator",
    "role": "Admin"
  }
}
```

#### Dashboard Metrics Response
```json
{
  "openingBalance": 150,
  "closingBalance": 175,
  "netMovement": {
    "total": 25,
    "purchases": 50,
    "transfersIn": 15,
    "transfersOut": 40
  },
  "assigned": 30,
  "expended": 12
}
```

### Error Responses
```json
{
  "message": "Error description",
  "error": "Detailed error information"
}
```

### HTTP Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

---

## Conclusion

The Military Asset Management System provides a robust, secure solution for managing military assets across multiple bases. The system emphasizes security, audit compliance, and role-based access control while maintaining high performance and usability.
