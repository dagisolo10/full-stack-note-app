# Environment Setup Guide

## Backend Setup

1. Create a `.env` file in the `backend` folder
2. Copy the variables from `backend/.env.example` and fill in your values:

```env
PORT=5000
MONGO_DB_URI=your_mongodb_connection_string
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
```

## Frontend Setup

1. Create a `.env` file in the `frontend` folder
2. Copy the variables from `frontend/.env.example` and fill in your values:

```env
VITE_API_URL=http://localhost:5000
```

**For local development:**

-   Use `http://localhost:5000` (or whatever port your backend runs on)

**For production:**

-   Use your deployed backend URL (e.g., `https://your-backend.vercel.app` or `https://api.yourdomain.com`)

## Quick Start

### Backend

```bash
cd backend
npm install
# Create .env file with your values
npm run dev  # or npm start for production
```

### Frontend

```bash
cd frontend
npm install
# Create .env file with VITE_API_URL pointing to your backend
npm run dev
```

## Notes

-   The frontend axios config now has a fallback to `http://localhost:5000` if `VITE_API_URL` is not set
-   Make sure your backend CORS includes your frontend URL
-   Never commit `.env` files to git (they should be in `.gitignore`)
