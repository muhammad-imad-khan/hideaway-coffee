# Hideaway Coffee House — Website

A complete, mobile-first website for Hideaway Coffee House, Soho London.

## 📁 File Structure

```
hideaway-coffee/
├── index.html          ← Main page (single-page site)
├── css/
│   └── style.css       ← All styles
├── js/
│   └── main.js         ← Interactions & animations
├── vercel.json         ← Vercel deployment config
└── README.md
```

## 🚀 Deploy to Vercel

### Option A — Vercel CLI
```bash
npm i -g vercel
cd hideaway-coffee
vercel
```

### Option B — Vercel Dashboard
1. Go to https://vercel.com/new
2. Drag-and-drop the `hideaway-coffee/` folder
3. Click **Deploy** — done!

## 📬 Set Up the Contact Form (Formspree)

1. Go to https://formspree.io and sign up (free)
2. Click **New Form** → name it "Hideaway Contact"
3. Copy your form ID (looks like `xpzgkwqr`)
4. Open `index.html` and find:
   ```html
   action="https://formspree.io/f/YOUR_FORM_ID"
   ```
5. Replace `YOUR_FORM_ID` with your actual ID
6. Redeploy

## 🗺️ Update the Google Map

The current map embed uses approximate coordinates. For a precise pin:
1. Go to https://maps.google.com
2. Search for "Hideaway Coffee House London"
3. Click **Share** → **Embed a map**
4. Copy the `<iframe>` src URL
5. Replace the `src` value in the `<iframe>` inside `#find-us`

## 🎨 Customisation

CSS variables are in `:root` at the top of `style.css`:

```css
--espresso:  #1c1008   /* dark brown — primary */
--caramel:   #8b5e3c   /* mid brown — accent */
--latte:     #c9a882   /* warm tan */
--cream:     #f5ede0   /* off-white */
--sage:      #7a8c6e   /* green accent */
```

## ✅ Sections Included

- [x] Fixed header with mobile hamburger
- [x] Hero with animated blobs + grain texture
- [x] Scrolling marquee strip
- [x] About section with coffee cup illustration
- [x] Menu (4 categories)
- [x] Feature strip (dark background)
- [x] Reviews (3 real guest quotes)
- [x] Find Us with Google Map embed
- [x] Contact form (Formspree)
- [x] Footer with hours, address, socials
- [x] SEO meta tags, Open Graph, Twitter Card
- [x] LocalBusiness JSON-LD schema
- [x] Scroll-triggered reveal animations
- [x] Mobile-first responsive layout
- [x] Vercel-ready

## 📌 Business Details

- **Name:** Hideaway Coffee House
- **Address:** 7 Farrier's Passage, Smith's Court, Soho, London W1D 7DP
- **Instagram:** @hideawaycoffee
- **Hours:** Mon–Fri 7:30–17:00 | Sat 9:00–17:30 | Sun 9:00–17:00
- **Rating:** 4.7 ⭐ (716 Google reviews)
