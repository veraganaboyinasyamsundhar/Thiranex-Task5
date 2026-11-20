# Morrow Goods — Task 5 Capstone

A responsive, client-side home and lifestyle goods storefront built with semantic HTML, CSS, and modular vanilla JavaScript. Product catalog content and original small SVG illustrations are bundled locally. Cart and saved items persist in browser local storage. Checkout is a clearly labeled demo with no payment collection.

## Run locally

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite. To create and preview the optimized production build:

```powershell
npm run build
npm run preview
```

## Architecture

- `src/products.js` — catalog data and product utilities
- `src/store.js` — cart and saved-item state with local storage persistence
- `src/router.js` — History API client-side routes
- `src/views.js` — reusable page and product-card views
- `src/main.js` — navigation, delegated interactions, and view updates
- `assets/products/` — small local SVG product artwork

Vite bundles and minifies JavaScript/CSS, hashes build assets, and inlines small SVGs. SPA fallback configuration is included for Vercel and Netlify.
