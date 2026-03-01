# Aniket Mishra — Personal Portfolio

A stunning personal portfolio built with Next.js 14, Tailwind CSS, and Framer Motion.
Features aurora glassmorphism UI, live GitHub repos, and Spotify Now Playing widget.

## Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Fonts**: Cormorant Garamond, DM Sans, Space Grotesk

## Setup

1. Install dependencies:
   ```bash
   npm install
   npm install framer-motion
   ```

2. Fill in your `.env.local`:
   ```
   GITHUB_TOKEN=your_github_pat
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   SPOTIFY_REFRESH_TOKEN=your_spotify_refresh_token
   ```

3. Replace `YOUR_GITHUB_USERNAME` in `app/page.tsx` with your GitHub handle.

4. Run the dev server:
   ```bash
   npm run dev
   ```

## Deploy
Push to GitHub and connect to Vercel for instant deployment.
