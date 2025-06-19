# Military Asset Management System - Deployment Guide

## Prerequisites Installation

### 1. Install Node.js
- Download and install Node.js 18+ from [nodejs.org](https://nodejs.org/)
- Verify installation: `node --version` and `npm --version`

### 2. Install PostgreSQL
- Download PostgreSQL 13+ from [postgresql.org](https://www.postgresql.org/download/)
- During installation, remember the password for the `postgres` user
- Verify installation: `psql --version`

## Step-by-Step Setup Guide

### Step 1: Extract Project Files
1. Extract the provided ZIP file to your desired location
2. Open terminal/command prompt and navigate to the project directory

### Step 2: Database Setup
```bash
# Create the database
createdb -U postgres military_asset_db

# Import the database dump
psql -U postgres -d military_asset_db < database_dump.sql
```

### Step 3: Backend Configuration
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your database credentials
# DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/military_asset_db"
# JWT_SECRET="your-secure-secret-key"
```

### Step 4: Frontend Setup
```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

### Step 5: Start the Application

#### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
```
Backend should start on http://localhost:4000

#### Terminal 2 - Frontend Application
```bash
cd frontend
npm run dev
```
Frontend should start on http://localhost:3000

### Step 6: Access the Application
1. Open your browser and go to http://localhost:3000
2. Login with default admin credentials:
   - Email: `admin@military.local`
   - Password: `admin123`

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check if the database exists: `psql -U postgres -l`
- Verify credentials in the .env file

### Port Conflicts
- Backend default port: 4000
- Frontend default port: 3000
- Change ports in package.json if needed

### Dependencies Issues
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

## Production Deployment

### Database
1. Create production PostgreSQL database
2. Import database dump
3. Update DATABASE_URL in production environment

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

## Default Users and Data

The system comes with pre-populated data:
- **Admin User**: admin@military.local / admin123
- **5 Military Bases**: HQ, Northern, Southern, Eastern, Western
- **Sample Assets**: 10 assets across different types
- **Transaction History**: Sample purchases, transfers, assignments

## Security Notes

1. **Change Default Passwords**: Update the admin password after first login
2. **JWT Secret**: Use a strong, unique JWT secret in production
3. **Database Credentials**: Use strong database passwords
4. **HTTPS**: Enable HTTPS in production environments

## Support

For issues or questions:
1. Check the main README.md for detailed documentation
2. Verify all prerequisites are installed correctly
3. Ensure database is running and accessible
4. Check console logs for error messages 