# Reforge Frontend

This is the frontend for the Reforge project, built with Next.js and Tailwind CSS.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   - Copy `.env.local.example` to `.env.local` and fill in your values.
   - `NEXT_PUBLIC_BACKEND_URL` should point to your backend (e.g., http://localhost:5000)
   - `NEXT_PUBLIC_GEMINI_API_KEY` is required for Gemini AI features (if used)

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open** [http://localhost:3000](http://localhost:3000) in your browser.

## Connecting to the Backend
- The frontend expects the backend to be running and accessible at the URL specified in `NEXT_PUBLIC_BACKEND_URL`.
- Make sure CORS is enabled on the backend for your frontend URL.

## Features
- Authentication (Firebase)
- Habits, Todos, Tasks management
- AI-powered scheduling (Gemini)

## Learn More
See the original Next.js documentation for more details.
