# Quick Deployment Guide - Military Asset Management System

## 🚀 One-Click Deployment Instructions

### Step 1: Deploy Backend to Railway (Free)

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "Deploy from GitHub repo"
4. Connect this repository
5. Select the `backend` folder as the source
6. Add these environment variables:
   ```
   DATABASE_URL=<will be auto-generated>
   JWT_SECRET=your-super-secure-jwt-secret-key-here-make-it-long
   NODE_ENV=production
   ```
7. Railway will automatically provision a PostgreSQL database
8. Import the database schema:
   - Go to Railway dashboard > Database > Query
   - Copy contents from `database_dump.sql` and execute

### Step 2: Deploy Frontend to Vercel (Free)

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import this repository
5. Configure deployment:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
6. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=<your-railway-backend-url>
   ```
7. Deploy!

### Step 3: Update CORS (Important!)

After deployment, update the backend CORS configuration to allow your Vercel frontend domain.

## Alternative: Deploy to Netlify

### Backend (Use Railway as above)

### Frontend on Netlify:
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `frontend` folder or connect GitHub
3. Build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/.next`
4. Add environment variables in Netlify dashboard

## Expected Results

- ✅ **Backend API**: Railway will provide a URL like `https://your-app.railway.app`
- ✅ **Frontend**: Vercel will provide a URL like `https://your-app.vercel.app`
- ✅ **Database**: PostgreSQL hosted on Railway with sample data
- ✅ **Authentication**: Login with `admin@military.local` / `admin123`

## Sample URLs (After Deployment)

- **Live Demo**: `https://your-frontend-url.vercel.app`
- **API Docs**: `https://your-backend-url.railway.app/health`
- **Admin Login**: Use the demo credentials from the database

## Features Available in Demo

✅ **Dashboard** with real-time metrics and filters
✅ **Asset Management** (CRUD operations)
✅ **Purchases** tracking
✅ **Inter-base Transfers**
✅ **Personnel Assignments**
✅ **Expenditure Tracking**
✅ **Role-based Access Control**
✅ **Audit Trails**

## Troubleshooting

- **CORS Issues**: Update backend CORS to include your frontend domain
- **Database Connection**: Ensure Railway PostgreSQL is running
- **Build Failures**: Check node version compatibility (Node 18+)
- **API Errors**: Verify environment variables are set correctly

## Cost

- **Railway**: Free tier (up to $5/month usage)
- **Vercel**: Free tier (generous limits)
- **Total**: $0 for demo purposes

---

🎯 **Ready to deploy?** Follow the steps above and you'll have a working demo in under 10 minutes! 