# Pivotech Website

Built with Next.js 16 App Router, TypeScript, Tailwind CSS 4, and Framer Motion.

## Local Development

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Before First Build

1. Place final logo assets in `public/`:
   - `pivotech-icon.png` (square icon mark — nav and footer)
   - `pivotech-banner.png` (horizontal wordmark — optional, OG image is auto-generated)

2. Verify all links are live:
   - lu.ma event URL in `Hero.tsx`
   - Notion/lu.ma URLs in `WhatWeDo.tsx` and `Engage.tsx`
   - Substack and LinkedIn URLs in `Footer.tsx`

## Deploy to Vercel

```bash
# Option A: Vercel CLI
npx vercel --prod

# Option B: GitHub import
# Push to GitHub → import at vercel.com → no env vars needed
```

**DNS (Porkbun → Vercel):**
- CNAME: `www` → `cname.vercel-dns.com`
- A record: `@` → `76.76.21.21`
- Vercel Dashboard → Project → Settings → Domains → Add `pivotech.io` and `www.pivotech.io`

## Launch Checklist

- [ ] Replace placeholder icon with final P. icon
- [ ] Verify all lu.ma and Notion links work
- [ ] Test OG image at opengraph.xyz
- [ ] Test on iOS Safari and Chrome Android
- [ ] Run Lighthouse (target: Performance > 90, Accessibility > 95)
