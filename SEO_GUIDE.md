
# 📈 Elite SEO & Ranking Strategy: Step-by-Step

Your VideoMaster AI app is optimized for high organic search ranking. Follow this guide to ensure Google indexes your site in under 24 hours.

### 🔍 Golden Keywords (Search these to find your app)
If you want to see your app at the top of Google, search for these exact terms:
1. **`VideoMaster AI Tech`** (Your primary brand)
2. **`videomaster-ai.tech`** (Exact domain)
3. **`Best AI Video Maker videomaster-ai`**
4. **`Viral Script Maker VideoMaster`**

### ✅ Step 1: Firebase Domain Connection
Before Google can verify your site, it must be live on your custom domain:
1.  **Firebase Console**: Go to the **Hosting** section.
2.  **Add Domain**: Click **"Add Custom Domain"** and enter `videomaster-ai.tech`.
3.  **DNS Records**: Firebase will provide two **A Records** (IP Addresses).
4.  **Provider Setup**: Go to your domain provider (GoDaddy, Namecheap, etc.) and paste these A records into your DNS management panel.
5.  **Wait for SSL**: It takes 1-2 hours for the domain to become active in the browser.

### ✅ Step 2: Google Search Console Verification
Once the domain is loading in your browser:
1.  Visit [Google Search Console](https://search.google.com/search-console).
2.  Choose the **"URL Prefix"** method and enter `https://videomaster-ai.tech`.
3.  Select the **'HTML Tag'** verification method.
4.  Google will give you a code like: `<meta name="google-site-verification" content="ABC123XYZ..." />`.
5.  **Copy ONLY the code** (the part inside `content="..."`).
6.  Open `src/app/layout.tsx` in this Studio and paste the code into the `google:` verification field (Line 24).
7.  Run **`npm run mobile:push`** in the Terminal.

### ✅ Step 3: Immediate Sitemap Submission
Once verified, tell Google to scan your entire app:
1.  In Search Console, go to **Sitemaps**.
2.  Type `sitemap.xml` into the box and click **Submit**.
3.  Google will now index all your pages (Templates, Pricing, Login) automatically.

**Pro Tip**: The **FAQ Schema** I added to your landing page will help you get "Rich Results" (larger, clickable Q&A boxes) on Google for free! 🚀📈💎
