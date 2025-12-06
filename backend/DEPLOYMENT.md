# Backend API Deployment Guide

## Deploy to Railway

### Prerequisites
- GitHub account
- Railway account (sign up at https://railway.app)
- Your code pushed to a GitHub repository

### Deployment Steps

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Railway**
   - Go to https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will auto-detect the configuration

3. **Configure Environment Variables**
   
   In Railway dashboard, go to your project → Variables tab and add:
   
   ```
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<your-secure-random-string>
   NODE_ENV=production
   CORS_ORIGIN_WEB=<your-frontend-url>
   CORS_ORIGIN_MOBILE=<your-mobile-app-url>
   ```

4. **Get your deployment URL**
   - Railway will provide a public URL (e.g., `https://your-app.up.railway.app`)
   - Update your frontend to use this URL

### Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/brew` |
| `JWT_SECRET` | Secret key for JWT tokens | Use a long random string (min 32 chars) |
| `PORT` | Server port (auto-set by Railway) | `3000` |
| `NODE_ENV` | Environment mode | `production` |
| `CORS_ORIGIN_WEB` | Web app URL | `https://your-web-app.vercel.app` |
| `CORS_ORIGIN_MOBILE` | Mobile app URL | `http://localhost:8081` or production URL |

### Verify Deployment

Test your deployed API:
```bash
# Health check
curl https://your-app.up.railway.app/health

# API info
curl https://your-app.up.railway.app/
```

### Troubleshooting

**Build fails:**
- Check Railway logs for errors
- Ensure all dependencies are in `package.json`
- Verify TypeScript compiles: `npm run build`

**Can't connect to database:**
- Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check MONGODB_URI is correct
- Ensure database user has proper permissions

**CORS errors:**
- Update CORS_ORIGIN_WEB and CORS_ORIGIN_MOBILE with your actual URLs
- Check Railway logs for CORS-related errors

### Monitoring

- View logs: Railway Dashboard → Your Project → Deployments → Logs
- Check metrics: Railway Dashboard shows CPU, Memory, and Network usage

### Continuous Deployment

Railway automatically redeploys when you push to your GitHub repository:
```bash
git add .
git commit -m "Your changes"
git push
```

Railway will detect changes and redeploy automatically.

---

## Local Development

Start the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
npm start
```
