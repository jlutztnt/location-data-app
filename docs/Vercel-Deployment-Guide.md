# Vercel Deployment Guide

## 🚀 Deploy Frontend to Vercel

### 1. Import Project from GitHub

1. **Go to Vercel.com** and sign in with your GitHub account
2. **Click "New Project"** or "Import Project"
3. **Select Repository**: Choose `jlutztnt/location-data-app` from your GitHub repositories
4. **Click "Import"**

### 2. Configure Project Settings

**IMPORTANT**: Configure these settings before deploying:

- **Framework Preset**: Next.js (should auto-detect)
- **Root Directory**: `frontend` ⚠️ **CRITICAL: Set this to `frontend`**
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### 3. Environment Variables

Add these environment variables in the Vercel dashboard:

```env
JWT_SECRET=2e69abaa8c76ecb15c8a7cad203c710c90fd5504b10d0a0f95b46179cd834705
BACKEND_URL=http://localhost:8787
NODE_ENV=production
```

**Important Notes**:
- Replace `your-vercel-app-domain.vercel.app` with your actual Vercel domain
- You'll update `BACKEND_URL` to your Cloudflare Workers URL after backend deployment
- The `JWT_SECRET` above is the one generated for this project

### 4. Deploy

1. **Click "Deploy"**
2. **Wait for build to complete** (usually 1-2 minutes)
3. **Test the deployment** by visiting your Vercel URL

### 5. Update Environment Variables After Backend Deployment

Once you deploy the Cloudflare Workers backend:

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables
2. **Update `BACKEND_URL`** to your Cloudflare Workers URL (e.g., `https://your-worker.your-subdomain.workers.dev`)
3. **Redeploy** the frontend to pick up the new environment variable

## 🔧 Cloudflare Workers Backend Deployment

### Prerequisites

1. **Install Wrangler CLI**:
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

### Deploy Backend

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Deploy the Worker**:
   ```bash
   wrangler deploy
   ```

3. **Note the Worker URL** for updating frontend environment variables

### Create Production Database

1. **Create D1 database**:
   ```bash
   wrangler d1 create location-data-prod
   ```

2. **Update `wrangler.toml`** with production database ID

3. **Run migrations**:
   ```bash
   wrangler d1 migrations apply location-data-prod
   ```

4. **Create admin user**:
   ```bash
   wrangler d1 execute location-data-prod --command "INSERT INTO user (id, email, emailVerified, name, createdAt, updatedAt) VALUES ('admin-001', 'jlutz@tootntotum.com', 1, 'Admin User', datetime('now'), datetime('now'))"
   ```

## 🧪 Testing Production Deployment

### 1. Test Frontend
- Visit your Vercel URL
- Verify the login page loads correctly
- Check that environment variables are working

### 2. Test Authentication Flow
- Try logging in with admin credentials
- Verify dashboard loads after login
- Test sign out functionality

### 3. Test API Integration
- Check that frontend can communicate with backend
- Verify location API endpoints are accessible
- Test system status indicators

## 🔒 Security Considerations

### Environment Variables
- **Never commit `.env.local`** to git (it's in .gitignore)
- **Use different secrets** for production vs development
- **Rotate secrets regularly** in production

### CORS Configuration
- Update CORS origins in backend for production domain
- Remove localhost origins from production backend

### Database Security
- Use production D1 database for live deployment
- Implement proper backup strategy
- Monitor database access logs

## 📋 Post-Deployment Checklist

- [ ] Frontend deployed to Vercel successfully
- [ ] Backend deployed to Cloudflare Workers
- [ ] Production database created and migrated
- [ ] Admin user created in production database
- [ ] Environment variables updated with production URLs
- [ ] Authentication flow tested end-to-end
- [ ] API endpoints responding correctly
- [ ] CORS configured for production domains
- [ ] SSL certificates working (automatic with Vercel/Cloudflare)

## 🆘 Troubleshooting

### Common Issues

1. **Build fails on Vercel**:
   - Check that Root Directory is set to `frontend`
   - Verify all environment variables are set
   - Check build logs for specific errors

2. **Authentication not working**:
   - Check that `JWT_SECRET` is set correctly
   - Ensure backend CORS allows your frontend domain

3. **API calls failing**:
   - Verify `BACKEND_URL` points to your Cloudflare Workers URL
   - Check that backend is deployed and responding
   - Verify CORS configuration in backend

4. **Database connection issues**:
   - Ensure D1 database is created and migrated
   - Check wrangler.toml configuration
   - Verify database binding name matches code

## 🎯 Success Metrics

Your deployment is successful when:
- ✅ Frontend loads at your Vercel URL
- ✅ Login page displays correctly
- ✅ Admin can log in successfully
- ✅ Dashboard shows system status as "Online"
- ✅ API endpoints respond correctly
- ✅ Session management works properly

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Cloudflare Workers logs via `wrangler tail`
3. Verify all environment variables are set correctly
4. Test API endpoints directly using curl or Postman
