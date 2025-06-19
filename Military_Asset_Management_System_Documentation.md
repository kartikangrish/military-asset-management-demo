# Military Asset Management System - Technical Documentation

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Tech Stack & Architecture](#2-tech-stack--architecture)
3. [Data Models / Schema](#3-data-models--schema)
4. [RBAC Explanation](#4-rbac-explanation)
5. [API Logging](#5-api-logging)
6. [Setup Instructions](#6-setup-instructions)
7. [API Endpoints](#7-api-endpoints)

---

## 1. Project Overview

### Description
The Military Asset Management System is a comprehensive web application designed for managing military assets across multiple bases with enterprise-grade security and role-based access control. The system provides real-time tracking, inter-base transfers, personnel assignments, and comprehensive audit trails for military equipment, weapons, ammunition, and vehicles.

### Key Features
- **Dashboard**: Real-time metrics with filters (Date, Base, Equipment Type)
- **Asset Management**: Complete CRUD operations for military assets
- **Purchases**: Record and track asset purchases by base
- **Transfers**: Inter-base asset transfer system with validation
- **Assignments**: Assign assets to personnel with tracking
- **Expenditures**: Track consumed/expended assets
- **Security**: JWT authentication with comprehensive audit logging

### Assumptions
- **Multi-Base Operations**: System assumes military operations across multiple bases requiring asset tracking
- **Role-Based Access**: Different personnel have different access levels based on their roles
- **Audit Requirements**: All operations must be logged for compliance and audit purposes
- **Real-Time Updates**: System provides real-time asset tracking and status updates
- **PostgreSQL Database**: System assumes PostgreSQL as the primary database for ACID compliance

### Limitations
- **Single Tenant**: Currently designed for single military organization (not multi-tenant)
- **Basic Reporting**: Advanced analytics and reporting features are limited
- **Mobile Optimization**: Primarily designed for desktop/tablet use
- **Offline Capability**: No offline functionality for disconnected operations
- **File Attachments**: Limited support for asset documentation and image attachments

### Business Value
- **Accountability**: Complete audit trail for all asset movements and assignments
- **Efficiency**: Streamlined processes for asset management across multiple bases
- **Compliance**: Built-in logging and tracking for regulatory compliance
- **Cost Control**: Better visibility into asset utilization and expenditure patterns

---

## 2. Tech Stack & Architecture

### Backend Architecture
**Framework**: Express.js with TypeScript
- **Rationale**: Mature, lightweight framework with extensive middleware ecosystem
- **Benefits**: Fast development, extensive community support, excellent for RESTful APIs

**Database**: PostgreSQL with Prisma ORM
- **Rationale**: ACID compliance essential for financial and asset tracking
- **Benefits**: Excellent for audit trails, robust relational capabilities, JSON support
- **Prisma ORM**: Type-safe database access, automatic migrations, excellent developer experience

**Authentication**: JWT (JSON Web Tokens)
- **Rationale**: Stateless authentication suitable for distributed systems
- **Benefits**: Scalable, no server-side session storage required

**Security Libraries**:
- `bcryptjs`: Password hashing with salt
- `jsonwebtoken`: JWT token generation and verification
- `zod`: Runtime type validation and sanitization
- `morgan`: HTTP request logging middleware

### Frontend Architecture
**Framework**: Next.js 15 with TypeScript
- **Rationale**: React-based framework with SSR capabilities, excellent developer experience
- **Benefits**: Production-optimized, automatic code splitting, built-in routing

**Styling**: TailwindCSS
- **Rationale**: Utility-first CSS framework for rapid UI development
- **Benefits**: Responsive design, maintainable styling, consistent design system

**State Management**: React Query (@tanstack/react-query)
- **Rationale**: Powerful server state management with caching
- **Benefits**: Background updates, optimistic updates, request deduplication

**HTTP Client**: Axios
- **Rationale**: Feature-rich HTTP client with interceptors
- **Benefits**: Request/response interceptors, automatic JSON parsing

**UI Components**:
- `@headlessui/react`: Accessible UI components
- `@heroicons/react`: Icon library
- `recharts`: Data visualization for dashboard metrics

### Architecture Patterns
- **RESTful API Design**: Clear resource-based endpoints
- **Middleware Pattern**: Authentication, authorization, and logging middleware
- **Repository Pattern**: Prisma ORM abstracts database operations
- **Component-Based Architecture**: Reusable React components
- **Context Pattern**: Authentication state management

### Why This Stack Was Chosen
1. **Developer Productivity**: TypeScript across the stack for type safety
2. **Scalability**: Node.js and PostgreSQL can handle enterprise loads
3. **Security**: Multiple layers of security with JWT, RBAC, and input validation
4. **Maintainability**: Strong typing, clear separation of concerns
5. **Community Support**: Popular technologies with extensive documentation

---

## 3. Data Models / Schema

### Core Entities and Relationships

#### User Management
```sql
-- Users table with role-based access
User {
  id: Primary Key
  email: Unique identifier
  name: Full name
  password: Hashed password
  roleId: Foreign Key to Role
  baseId: Foreign Key to Base (optional)
}

Role {
  id: Primary Key
  name: Role name (Admin, Base Commander, Logistics Officer)
}
```

#### Base Operations
```sql
Base {
  id: Primary Key
  name: Base name (unique)
  location: Geographic location
}
```

#### Asset Management
```sql
Asset {
  id: Primary Key
  type: Asset category (Vehicle, Weapon, Ammunition, Equipment)
  serial: Unique serial number
  description: Asset details
  baseId: Current location (Foreign Key)
}
```

#### Transaction Tables
```sql
-- Asset purchases/procurement
Purchase {
  id: Primary Key
  assetId: Foreign Key to Asset
  baseId: Purchasing base
  quantity: Number of units
  date: Purchase date
  createdById: User who recorded purchase
}

-- Inter-base transfers
Transfer {
  id: Primary Key
  assetId: Foreign Key to Asset
  fromBaseId: Source base
  toBaseId: Destination base
  quantity: Transfer quantity
  date: Transfer date
  createdById: User who initiated transfer
}

-- Personnel assignments
Assignment {
  id: Primary Key
  assetId: Foreign Key to Asset
  baseId: Assignment base
  personnelId: Assigned personnel (Foreign Key to User)
  quantity: Assigned quantity
  date: Assignment date
  assignedById: User who made assignment
}

-- Asset consumption/expenditure
Expenditure {
  id: Primary Key
  assetId: Foreign Key to Asset
  baseId: Expenditure base
  personnelId: Personnel responsible
  quantity: Expended quantity
  date: Expenditure date
  expendedById: User who recorded expenditure
}
```

#### Audit and Logging
```sql
ApiLog {
  id: Primary Key
  userId: User performing action
  action: Type of action (CREATE, UPDATE, DELETE)
  entity: Entity type (ASSET, PURCHASE, etc.)
  entityId: ID of affected entity
  timestamp: Action timestamp
  details: Additional details
}
```

### Key Relationships
- **User ↔ Role**: Many-to-One (Users have one role)
- **User ↔ Base**: Many-to-One (Users assigned to one base)
- **Asset ↔ Base**: Many-to-One (Assets located at one base)
- **Transactions ↔ Asset**: Many-to-One (Multiple transactions per asset)
- **Transactions ↔ User**: Many-to-One (Users create transactions)
- **ApiLog ↔ User**: Many-to-One (Users generate log entries)

### Data Integrity Constraints
- **Unique Constraints**: Asset serial numbers, user emails, base names
- **Foreign Key Constraints**: All relationships enforced at database level
- **Cascade Rules**: Soft deletes implemented to maintain audit trail
- **Check Constraints**: Quantity fields must be positive integers

---

## 4. RBAC Explanation

### Role Hierarchy
The system implements a three-tier role-based access control system:

#### 1. Admin Role
- **Access Level**: Full system access across all bases
- **Permissions**:
  - Create, read, update, delete assets
  - View all transactions across all bases
  - Manage users and assign roles
  - Access complete audit logs
  - Dashboard metrics for all bases

#### 2. Base Commander Role
- **Access Level**: Limited to assigned base operations
- **Permissions**:
  - View assets only within assigned base
  - Create purchases for assigned base
  - Initiate transfers from assigned base
  - Make assignments within assigned base
  - Record expenditures for assigned base
  - Dashboard metrics filtered to assigned base only

#### 3. Logistics Officer Role
- **Access Level**: Cross-base logistics operations
- **Permissions**:
  - View assets across all bases
  - Process purchases and transfers
  - Cannot create or modify assets
  - Limited user management capabilities
  - Dashboard access with base filtering

### RBAC Implementation

#### Authentication Middleware (`auth.ts`)
```typescript
export function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains user.id, user.role, user.baseId
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
```

#### Authorization Middleware (`rbac.ts`)
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

#### 1. Route-Level Protection
```typescript
// Admin-only routes
router.post('/assets', authenticateJWT, authorize(['Admin']), createAsset);

// Multi-role access
router.get('/dashboard/metrics', authenticateJWT, authorize(['Admin', 'Base Commander', 'Logistics Officer']), getDashboardMetrics);
```

#### 2. Data-Level Filtering
```typescript
// Base Commander sees only their base's data
if (userRole === 'Base Commander' && userBaseId) {
  assets = await prisma.asset.findMany({
    where: { baseId: userBaseId }
  });
}
```

#### 3. Business Logic Enforcement
```typescript
// Prevent Base Commanders from accessing other bases' assets
if (req.user.role === 'Base Commander' && req.user.baseId !== asset.baseId) {
  return res.status(403).json({ message: 'Access denied to this asset' });
}
```

### Security Features
- **JWT Token Expiration**: Tokens expire after set duration
- **Role Validation**: Every protected route validates user role
- **Base Isolation**: Base Commanders cannot access other bases' data
- **Audit Trail**: All RBAC decisions are logged for compliance

---

## 5. API Logging

### Logging Strategy
The system implements comprehensive API logging for audit trails, compliance, and debugging purposes.

#### Logging Levels
1. **HTTP Request Logging**: Using Morgan middleware
2. **Business Action Logging**: Custom audit trail in database
3. **Error Logging**: Console logging for debugging

### HTTP Request Logging
```typescript
// Morgan middleware configuration
app.use(morgan('dev')); // Logs: METHOD URL STATUS RESPONSE_TIME - CONTENT_LENGTH
```

**Example Output**:
```
GET /api/assets 200 45.123 ms - 1847
POST /api/purchases 201 12.456 ms - 156
PUT /api/assets/5 200 23.789 ms - 234
```

### Business Action Logging (ApiLog Table)
Every significant business operation is logged to the `ApiLog` table:

```typescript
// Example from asset creation
await prisma.apiLog.create({
  data: {
    userId: req.user.id,
    action: 'CREATE',
    entity: 'ASSET',
    entityId: asset.id,
    details: `Created ${type} asset with serial ${serial}`,
    timestamp: new Date()
  }
});
```

#### Logged Actions
- **CREATE**: New asset, purchase, transfer, assignment, expenditure
- **UPDATE**: Asset modifications, user profile changes
- **DELETE**: Asset deletion, user deactivation
- **LOGIN**: User authentication events
- **ACCESS**: Sensitive data access attempts

#### Log Data Structure
```typescript
ApiLog {
  id: Auto-increment primary key
  userId: User performing the action
  action: Action type (CREATE, UPDATE, DELETE, LOGIN, ACCESS)
  entity: Entity type (ASSET, PURCHASE, TRANSFER, etc.)
  entityId: ID of the affected entity (nullable)
  timestamp: Exact timestamp of action
  details: Human-readable description of action
}
```

### Audit Trail Features
- **Immutable Logs**: ApiLog entries are never modified, only created
- **User Attribution**: Every log entry tied to authenticated user
- **Contextual Details**: Descriptive messages for easy audit review
- **Timestamp Precision**: Exact timing for sequence reconstruction
- **Entity Linking**: Direct references to affected database records

### Compliance Benefits
- **SOX Compliance**: Complete audit trail for financial transactions
- **Military Regulations**: Asset movement tracking for compliance
- **Security Audits**: User action history for security reviews
- **Forensic Analysis**: Detailed logs for incident investigation

### Example Log Entries
```json
[
  {
    "id": 1,
    "userId": 2,
    "action": "CREATE",
    "entity": "PURCHASE",
    "entityId": 15,
    "timestamp": "2024-03-15T10:30:00Z",
    "details": "Purchased 50 units of M4 Rifles for Northern Base"
  },
  {
    "id": 2,
    "userId": 3,
    "action": "TRANSFER",
    "entity": "TRANSFER",
    "entityId": 8,
    "timestamp": "2024-03-15T14:45:00Z",
    "details": "Transferred 20 units of Body Armor from HQ to Eastern Base"
  }
]
```

---

## 6. Setup Instructions

### Prerequisites
- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher
- **PostgreSQL**: Version 13 or higher
- **Git**: For version control

### Environment Setup

#### 1. Database Setup
```bash
# Create PostgreSQL database
createdb -U postgres military_asset_db

# Import provided database dump
psql -U postgres -d military_asset_db < database_dump.sql
```

#### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment configuration
cp .env.example .env
```

**Backend Environment Variables** (`.env`):
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/military_asset_db"
JWT_SECRET="your-super-secure-jwt-secret-key-minimum-32-characters"
PORT=4000
```

```bash
# Generate Prisma client
npx prisma generate

# Start backend development server
npm run dev
```

#### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start frontend development server
npm run dev
```

### Default Access Credentials
- **Email**: `admin@military.local`
- **Password**: `admin123`
- **Role**: Admin (full system access)

### Development Scripts

#### Backend Scripts
```bash
npm run dev        # Start development server with hot reload
npm run build      # Compile TypeScript to JavaScript
npm start          # Run production build
npm run seed       # Populate database with sample data
npx prisma studio  # Open Prisma database browser
```

#### Frontend Scripts
```bash
npm run dev        # Start Next.js development server
npm run build      # Build production-optimized application
npm start          # Serve production build
npm run lint       # Run ESLint for code quality
```

### Database Migration
```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Deploy migrations to production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

### Production Deployment

#### Backend Production
```bash
cd backend
npm run build
npm start
```

#### Frontend Production
```bash
cd frontend
npm run build
npm start
```

### Troubleshooting Common Issues

#### Database Connection Issues
- Verify PostgreSQL is running: `pg_ctl status`
- Check database exists: `psql -U postgres -l`
- Validate DATABASE_URL format and credentials

#### Port Conflicts
- Backend default: http://localhost:4000
- Frontend default: http://localhost:3000
- Modify PORT in `.env` (backend) or `package.json` (frontend)

#### Dependency Issues
```bash
# Clear npm cache
npm cache clean --force

# Remove and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 7. API Endpoints

### Authentication Endpoints

#### POST `/api/auth/login`
**Purpose**: User authentication
**Access**: Public
**Request Body**:
```json
{
  "email": "admin@military.local",
  "password": "admin123"
}
```
**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@military.local",
    "name": "System Administrator",
    "role": "Admin",
    "baseId": null
  }
}
```

### Asset Management Endpoints

#### GET `/api/assets`
**Purpose**: Retrieve assets with optional filtering
**Access**: All authenticated users (filtered by role)
**Query Parameters**:
- `baseId`: Filter by base (optional)
- `type`: Filter by asset type (optional)
**Response**:
```json
[
  {
    "id": 1,
    "type": "Weapon",
    "serial": "M4-001",
    "description": "M4 Carbine Rifle",
    "baseId": 1,
    "base": {
      "id": 1,
      "name": "Headquarters",
      "location": "Washington DC"
    }
  }
]
```

#### POST `/api/assets`
**Purpose**: Create new asset
**Access**: Admin only
**Request Body**:
```json
{
  "type": "Vehicle",
  "serial": "HMMWV-005",
  "description": "High Mobility Multipurpose Wheeled Vehicle",
  "baseId": 2
}
```

### Transaction Endpoints

#### GET `/api/dashboard/metrics`
**Purpose**: Retrieve dashboard metrics with filtering
**Access**: All authenticated users (data filtered by role)
**Query Parameters**:
- `startDate`: Start date for metrics (YYYY-MM-DD)
- `endDate`: End date for metrics (YYYY-MM-DD)
- `baseId`: Filter by base (optional, ignored for Base Commanders)
- `assetType`: Filter by asset type (optional)
**Response**:
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

#### POST `/api/purchases`
**Purpose**: Record asset purchase
**Access**: Admin, Base Commander (own base), Logistics Officer
**Request Body**:
```json
{
  "assetId": 1,
  "baseId": 2,
  "quantity": 25,
  "date": "2024-03-15"
}
```

#### POST `/api/transfers`
**Purpose**: Create inter-base transfer
**Access**: Admin, Base Commander (from own base), Logistics Officer
**Request Body**:
```json
{
  "assetId": 1,
  "fromBaseId": 1,
  "toBaseId": 2,
  "quantity": 10,
  "date": "2024-03-15"
}
```

#### POST `/api/assignments`
**Purpose**: Assign assets to personnel
**Access**: Admin, Base Commander (own base)
**Request Body**:
```json
{
  "assetId": 1,
  "baseId": 1,
  "personnelId": 5,
  "quantity": 1,
  "date": "2024-03-15"
}
```

#### POST `/api/expenditures`
**Purpose**: Record asset expenditure/consumption
**Access**: Admin, Base Commander (own base)
**Request Body**:
```json
{
  "assetId": 3,
  "baseId": 1,
  "personnelId": 5,
  "quantity": 50,
  "date": "2024-03-15"
}
```

### Reference Data Endpoints

#### GET `/api/bases`
**Purpose**: Retrieve all military bases
**Access**: All authenticated users
**Response**:
```json
[
  {
    "id": 1,
    "name": "Headquarters",
    "location": "Washington DC"
  },
  {
    "id": 2,
    "name": "Northern Base",
    "location": "Alaska"
  }
]
```

### Error Response Format
All endpoints return consistent error responses:
```json
{
  "message": "Error description",
  "error": "Detailed error information (development only)"
}
```

### Common HTTP Status Codes
- **200**: Success
- **201**: Created successfully
- **400**: Bad request (validation error)
- **401**: Unauthorized (invalid/missing token)
- **403**: Forbidden (insufficient permissions)
- **404**: Resource not found
- **500**: Internal server error

---

## Conclusion

This Military Asset Management System provides a robust, secure, and scalable solution for managing military assets across multiple bases. The system's architecture emphasizes security, audit compliance, and role-based access control while maintaining high performance and usability.

The comprehensive logging system ensures full audit trail compliance, while the flexible RBAC system accommodates different organizational roles and responsibilities. The technology stack has been carefully chosen to provide enterprise-grade reliability, security, and maintainability.

For additional support or questions, refer to the project's README files or contact the development team.

---

**Document Version**: 1.0  
**Last Updated**: March 2024  
**Prepared for**: Military Asset Management System Stakeholders 