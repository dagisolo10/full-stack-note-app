# Deployment Checklist

## ✅ Pre-Deployment Checks

### Backend Environment Variables (Set in your hosting platform)

-   `PORT` - Server port (usually auto-set by hosting platform)
-   `MONGO_DB_URI` - MongoDB connection string
-   `UPSTASH_REDIS_REST_URL` - Redis URL
-   `UPSTASH_REDIS_REST_TOKEN` - Redis token
-   `JWT_SECRET` - Secret key for JWT tokens
-   `CLIENT_URL` - Your frontend URL (e.g., `https://your-app.vercel.app`)

### Frontend Environment Variables (Set in your hosting platform)

-   `VITE_API_URL` - Your backend API URL (e.g., `https://your-api.vercel.app`)

## ✅ Code is Ready

1. ✅ CORS properly configured - filters out undefined values
2. ✅ API URL has fallback for localhost development
3. ✅ PORT has fallback for localhost development
4. ✅ No hardcoded URLs in code
5. ✅ .env files are in .gitignore

## 📝 Notes

-   The code will work on localhost with defaults (port 5000, http://localhost:5000)
-   In production, make sure to set all environment variables in your hosting platform
-   Never commit `.env` files to git
