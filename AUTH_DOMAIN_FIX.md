
# 🔑 "unauthorized-domain" Error Solution

Your **Authorized Domain** is the URL shown in your browser's address bar (e.g., `videomaster-ai.tech`). Without this, social login and phone auth will not function.

### Steps to Resolve:

1.  **Copy Domain**: 
    - Go to your app's **Login Page**. 
    - Click the **Troubleshoot** button or look at the error card.
    - Click the **Copy** button next to the domain name.

2.  **Open Firebase Console**:
    - 👉 **[Direct Link: Authorized Domains Page](https://console.firebase.google.com/project/studio-9489287013-59986/authentication/settings)**

3.  **Register Domain**:
    - In the **"Authorized domains"** section, click **"Add domain"**.
    - Paste the domain you copied.
    - Click **Add**.

4.  **Verification**:
    - Refresh your login page. Authentication should now work 100% correctly!

**Note**: You may need to do this once for every new workspace or custom domain you add.
