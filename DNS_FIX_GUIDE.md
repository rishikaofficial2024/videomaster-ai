# 🌐 How to Fix "Site Can't Be Reached" (NXDOMAIN)

Bhaai, aapka domain `videomaster-ai.tech` resolve nahi ho raha hai. Iska matlab internet ko nahi pata ki aapki site kahan hai. Ise 2 minute mein fix karein:

### Step 1: Firebase Hosting se IP lein
1. [Firebase Hosting Console](https://console.firebase.google.com/project/studio-9489287013-59986/hosting/main) par jayein.
2. "Add Custom Domain" par click karein agar pehle nahi kiya.
3. Google aapko do **IP Addresses** dega (Example: `199.36.158.100`).

### Step 2: Domain Registrar (GoDaddy/Hostinger) mein settings badlein
1. Apne domain provider ke dashboard mein **DNS Management** kholiye.
2. Purane saare "A" records delete kar dein.
3. Naye do "A" records banayein:
   - **Type**: A | **Name**: @ | **Value**: (Firebase se mili pehli IP)
   - **Type**: A | **Name**: @ | **Value**: (Firebase se mili doosri IP)

### Step 3: Deployment Run karein
Terminal mein ye command chalayein:
```bash
npm run web:deploy
```

**Note**: DNS badalne ke baad usey poori duniya mein update hone mein 1-2 ghante lagte hain. Tab tak aapka app `studio-9489287013-59986.web.app` par perfectly chalega! 🚀💎
