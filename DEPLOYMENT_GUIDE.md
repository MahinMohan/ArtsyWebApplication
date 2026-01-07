# 🚀 Vercel Deployment Guide - Artsy Web Application

## ✅ All Issues Fixed!

### Fixed Issues:

1. ✅ Fixed typo: `brcypt` → `bcrypt`
2. ✅ Moved hardcoded credentials to environment variables
3. ✅ Updated CORS for production
4. ✅ Fixed cookie security settings for HTTPS
5. ✅ Added proper `package.json` scripts
6. ✅ Created `vercel.json` configuration
7. ✅ Updated `.gitignore` files

---

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI** (optional but recommended):
   ```bash
   npm install -g vercel
   ```
3. **Git Repository**: Your code should be pushed to GitHub/GitLab/Bitbucket

---

## 🔧 Step-by-Step Deployment

### **Step 1: Prepare Your MongoDB Connection**

Your current MongoDB URI is already in the code. You'll add it as an environment variable in Vercel.

**MongoDB URI:**

```
mongodb+srv://mahinmoh:XQFKsVjGQy2w0ThT@artistapp27112000.tgkia.mongodb.net/?retryWrites=true&w=majority&appName=artistapp27112000
```

---

### **Step 2: Push Code to GitHub**

If not already done:

```bash
# Initialize git (if not already initialized)
git init

# Add all files
git add .

# Commit changes
git commit -m "Prepare for Vercel deployment"

# Add remote repository (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

---

### **Step 3: Deploy to Vercel**

#### **Option A: Deploy via Vercel Dashboard (Recommended for Beginners)**

1. **Go to [vercel.com](https://vercel.com)** and log in

2. **Click "Add New Project"**

3. **Import your GitHub repository**

   - Connect your GitHub account if not already connected
   - Select your repository
   - Click "Import"

4. **Configure Project Settings:**

   - **Framework Preset:** Select "Other"
   - **Root Directory:** Leave as `./` (root)
   - **Build Command:** Leave empty (we're serving pre-built frontend)
   - **Output Directory:** Leave empty
   - **Install Command:** `cd backend && npm install`

5. **Add Environment Variables** (Click "Environment Variables"):

   Add these variables one by one:

   | Name                  | Value                                                                                                                                |
   | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
   | `MONGO_URI`           | `mongodb+srv://mahinmoh:XQFKsVjGQy2w0ThT@artistapp27112000.tgkia.mongodb.net/?retryWrites=true&w=majority&appName=artistapp27112000` |
   | `JWT_SECRET`          | `A256ygh#1223luos` (or generate a new secure random string)                                                                          |
   | `ARTSY_CLIENT_ID`     | `0a77160e9a2a4a299043`                                                                                                               |
   | `ARTSY_CLIENT_SECRET` | `b4e8e053b9ffe81da44ba61a31003d4c`                                                                                                   |
   | `NODE_ENV`            | `production`                                                                                                                         |
   | `PORT`                | `3000`                                                                                                                               |
   | `FRONTEND_URL`        | (Leave empty for now, add after deployment)                                                                                          |

6. **Click "Deploy"**

7. **Wait for deployment** (usually takes 1-3 minutes)

8. **Get Your Live URL:**

   - After deployment, you'll get a URL like: `https://your-app-name.vercel.app`
   - Copy this URL

9. **Update FRONTEND_URL:**
   - Go to your project settings in Vercel
   - Navigate to "Environment Variables"
   - Add or update `FRONTEND_URL` with your deployed URL: `https://your-app-name.vercel.app`
   - Redeploy the project (click "Redeploy" in the deployments tab)

---

#### **Option B: Deploy via Vercel CLI**

```bash
# Navigate to project root
cd "C:\Users\madhu\OneDrive\Desktop\Web Tech- Assignment-3"

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (Select your account)
# - Link to existing project? No
# - What's your project's name? artsy-web-app (or your preferred name)
# - In which directory is your code located? ./
# - Want to override settings? No

# After first deployment, get the URL and add environment variables:
vercel env add MONGO_URI
# Paste: mongodb+srv://mahinmoh:XQFKsVjGQy2w0ThT@artistapp27112000.tgkia.mongodb.net/?retryWrites=true&w=majority&appName=artistapp27112000

vercel env add JWT_SECRET
# Paste: A256ygh#1223luos

vercel env add ARTSY_CLIENT_ID
# Paste: 0a77160e9a2a4a299043

vercel env add ARTSY_CLIENT_SECRET
# Paste: b4e8e053b9ffe81da44ba61a31003d4c

vercel env add NODE_ENV
# Paste: production

vercel env add FRONTEND_URL
# Paste: https://your-app-name.vercel.app (your actual Vercel URL)

# Deploy to production
vercel --prod
```

---

## 🔒 Security Recommendations

### **IMPORTANT: Change Your Credentials!**

For production, you should:

1. **Generate a new JWT Secret:**

   ```bash
   # In Node.js console or online tool
   require('crypto').randomBytes(64).toString('hex')
   ```

2. **Consider creating a new MongoDB user** with limited permissions for production

3. **Rotate Artsy API credentials** if they've been exposed

4. **Never commit `.env` files** to Git (already in `.gitignore`)

---

## 🧪 Testing Your Deployment

After deployment:

1. **Visit your Vercel URL:** `https://your-app-name.vercel.app`

2. **Test Registration:**

   - Go to `/register`
   - Create a new account
   - Check if you're logged in

3. **Test Search:**

   - Search for an artist (e.g., "Picasso")
   - Verify results load

4. **Test Favourites:**

   - Add an artist to favourites
   - Check if it persists

5. **Check Browser Console:**
   - Open Developer Tools (F12)
   - Look for any errors in the Console tab

---

## 🐛 Troubleshooting

### **Issue: "Access denied no token" or Cookie Issues**

**Solution:** This is common with cross-origin cookies. Make sure:

- `FRONTEND_URL` environment variable is set correctly
- Cookies are set with `sameSite: "none"` and `secure: true` in production (already fixed)

### **Issue: CORS Errors**

**Solution:**

- Verify `FRONTEND_URL` matches your actual Vercel URL
- Check that `NODE_ENV=production` is set in Vercel

### **Issue: MongoDB Connection Failed**

**Solution:**

- Verify `MONGO_URI` is correctly set in Vercel environment variables
- Check MongoDB Atlas allows connections from anywhere (0.0.0.0/0) or add Vercel IPs

### **Issue: 404 on Routes**

**Solution:**

- The `vercel.json` should handle this, but verify it exists in your root directory
- Check that all routes go through `backend/server.js`

### **Issue: Build Fails**

**Solution:**

- Check Vercel build logs
- Ensure `backend/package.json` has all dependencies
- Verify Node.js version compatibility (using Node 18+)

---

## 📊 Monitoring Your App

1. **Vercel Dashboard:**

   - View deployment logs
   - Monitor function invocations
   - Check error rates

2. **MongoDB Atlas:**
   - Monitor database connections
   - Check query performance

---

## 🔄 Updating Your Deployment

Whenever you make changes:

```bash
# Commit changes
git add .
git commit -m "Your commit message"
git push origin main
```

Vercel will automatically redeploy! 🎉

Or using CLI:

```bash
vercel --prod
```

---

## 📝 Environment Variables Summary

Here's a quick reference of all environment variables needed:

```env
MONGO_URI=mongodb+srv://mahinmoh:XQFKsVjGQy2w0ThT@artistapp27112000.tgkia.mongodb.net/?retryWrites=true&w=majority&appName=artistapp27112000
JWT_SECRET=A256ygh#1223luos
ARTSY_CLIENT_ID=0a77160e9a2a4a299043
ARTSY_CLIENT_SECRET=b4e8e053b9ffe81da44ba61a31003d4c
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-actual-vercel-url.vercel.app
```

---

## ✨ Your App is Ready!

Once deployed, share your live URL:

- `https://your-app-name.vercel.app`

**Features Available:**

- ✅ User Registration & Login
- ✅ Artist Search (Artsy API)
- ✅ Artist Details & Artworks
- ✅ Favourites Management
- ✅ Secure Authentication
- ✅ Responsive Design

---

## 🆘 Need Help?

If you encounter any issues:

1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Check MongoDB connection in Atlas

---

**Happy Deploying! 🚀**
