# ⚡ Quick Start - Deploy to Vercel in 5 Minutes

## 🎯 Fast Track Deployment

### Step 1: Push to GitHub (2 minutes)
```bash
git init
git add .
git commit -m "Ready for Vercel deployment"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy on Vercel (2 minutes)
1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Click **"Deploy"** (use default settings)

### Step 3: Add Environment Variables (1 minute)
In Vercel Dashboard → Your Project → Settings → Environment Variables

Add these 7 variables:

| Variable | Value |
|----------|-------|
| `MONGO_URI` | `mongodb+srv://mahinmoh:XQFKsVjGQy2w0ThT@artistapp27112000.tgkia.mongodb.net/?retryWrites=true&w=majority&appName=artistapp27112000` |
| `JWT_SECRET` | `A256ygh#1223luos` |
| `ARTSY_CLIENT_ID` | `0a77160e9a2a4a299043` |
| `ARTSY_CLIENT_SECRET` | `b4e8e053b9ffe81da44ba61a31003d4c` |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `FRONTEND_URL` | `https://your-app.vercel.app` (your actual URL) |

### Step 4: Redeploy
After adding `FRONTEND_URL`, go to **Deployments** tab → Click **"Redeploy"**

---

## ✅ Done!
Your app is live at: `https://your-app-name.vercel.app`

---

## 🧪 Quick Test
1. Visit your URL
2. Click **Register** → Create account
3. Search for "Picasso"
4. Add to favourites
5. Check favourites page

---

## 📚 Need More Details?
See `DEPLOYMENT_GUIDE.md` for comprehensive instructions and troubleshooting.

---

## 🆘 Common Issues

**Cookies not working?**
- Make sure `FRONTEND_URL` is set correctly
- Redeploy after adding environment variables

**CORS errors?**
- Verify `NODE_ENV=production` is set
- Check `FRONTEND_URL` matches your Vercel URL

**MongoDB connection failed?**
- Check `MONGO_URI` is correctly copied
- Verify MongoDB Atlas allows all IPs (0.0.0.0/0)

---

**That's it! You're deployed! 🚀**

