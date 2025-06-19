# 🎯 Get Your Working Demo Link - Step by Step

## ⚡ 5-Minute Deployment Guide

### Step 1: Create GitHub Repository (30 seconds)
1. Go to **https://github.com/new**
2. Repository name: `military-asset-management-demo`
3. Set to **Public**
4. **Don't** initialize with README
5. Click **Create Repository**

### Step 2: Push Code to GitHub (1 minute)
In your terminal, run these commands:

```bash
# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/military-asset-management-demo.git

# Push the code
git branch -M main
git push -u origin main
```

### Step 3: Deploy Backend to Railway (2 minutes)
1. Go to **https://railway.app**
2. Sign in with GitHub
3. Click **"Deploy from GitHub repo"**
4. Select your `military-asset-management-demo` repository
5. **Important**: Set **Root Directory** to `backend`
6. Railway will auto-detect Node.js and PostgreSQL
7. Add environment variables:
   ```
   JWT_SECRET=military-asset-jwt-secret-key-2024-secure
   NODE_ENV=production
   ```
8. Click **Deploy**
9. **Copy the generated Railway URL** (e.g., `https://backend-production-xxxx.up.railway.app`)

### Step 4: Import Database (1 minute)
1. In Railway dashboard, go to **PostgreSQL service**
2. Click **Query** tab
3. Copy and paste the entire contents of `database_dump.sql`
4. Click **Run** to import sample data

### Step 5: Deploy Frontend to Vercel (1 minute)
1. Go to **https://vercel.com**
2. Sign in with GitHub
3. Click **"New Project"**
4. Import your `military-asset-management-demo` repository
5. **Important Settings**:
   - **Framework**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
6. **Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=<your-railway-backend-url>
   ```
   (Use the Railway URL from Step 3)
7. Click **Deploy**

### Step 6: Get Your Demo Links! 🎉

After deployment completes:

- **🌐 Live Demo**: `https://your-project-name.vercel.app`
- **🔧 API**: `https://your-backend.up.railway.app`
- **👤 Admin Login**: 
  - Email: `admin@military.local`
  - Password: `admin123`

## 🎯 Expected Demo Features

✅ **Dashboard** with real-time metrics
✅ **Asset Management** (Add, Edit, Delete assets)
✅ **Purchase Tracking** with base allocation
✅ **Inter-base Transfers** with validation
✅ **Personnel Assignments** with history
✅ **Expenditure Tracking** for consumed items
✅ **Role-based Access Control** (Admin, Base Commander, Logistics)
✅ **Audit Trails** for all operations

## 🔧 Sample Demo Data Included

- **5 Military Bases**: HQ, Northern, Southern, Eastern, Western
- **10+ Assets**: Vehicles, Weapons, Ammunition, Equipment
- **3 User Roles** with different permissions
- **Transaction History** across all modules

## 🚨 Troubleshooting

**CORS Error?**
- Update backend CORS in Railway environment variables:
  ```
  FRONTEND_URL=https://your-vercel-app.vercel.app
  ```

**Build Failed?**
- Ensure Node.js version 18+ in deployment settings
- Check that environment variables are set correctly

**Database Connection Error?**
- Verify PostgreSQL service is running in Railway
- Check if database schema was imported correctly

## 💰 Cost
- **Railway**: Free tier (sufficient for demo)
- **Vercel**: Free tier (generous limits)
- **Total**: **$0** for demonstration purposes

---

🎉 **You'll have a working demo URL in under 5 minutes!**

Share your demo link to showcase:
- Modern military asset management
- Full-stack TypeScript application
- Production-ready deployment
- Role-based security system 