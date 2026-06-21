# 📈 Step 1: Fix Verification Error (100% Works)

Your screenshot shows that the verification failed because Google couldn't find your site. Follow these **exact** steps to fix it.

### ✅ Step 1: Change Verification Method
1. Go back to [Google Search Console](https://search.google.com/search-console).
2. On the failure screen, click **'Settings'** or start over.
3. Choose the **'URL Prefix'** box and type: `https://videomaster-ai.tech`
4. **IMPORTANT**: Do NOT use 'HTML File'. Instead, find and click on **'HTML Tag'** in the list of other verification methods.
5. Google will give you a code that looks like this: `<meta name="google-site-verification" content="ABC123XYZ..." />`
6. **Action**: Copy ONLY the code inside the quotes (e.g., `ABC123XYZ...`).

### ✅ Step 2: Update the Code in this Studio
1. Open `src/app/layout.tsx` in this studio.
2. Look for the `verification` section in the `metadata` object (around line 24).
3. Replace `'YOUR_VERIFICATION_CODE_HERE'` with your actual code.
4. Open the Terminal and run: **`npm run mobile:push`**

### ✅ Step 3: Verify & Rank
1. Once the terminal command finishes, wait 2 minutes.
2. Go back to Google Search Console and click **'VERIFY'** under the **HTML Tag** section.
3. Success! Your site is now live on Google.

**Note**: If it still says "Could not find your site", make sure you have added `videomaster-ai.tech` to your **Firebase Hosting** console and updated your **A Records** in GoDaddy/Namecheap. 🚀📈