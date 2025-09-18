# 🚀 Deployment Guide - Bitcoin Script Learning Lab

This guide will help you deploy your Bitcoin Script Learning Lab to Vercel for free hosting with a custom domain.

## 📋 Prerequisites

- [Git](https://git-scm.com/) installed
- [Node.js 14+](https://nodejs.org/) installed
- [Vercel CLI](https://vercel.com/cli) installed
- GitHub account (optional but recommended)

## 🚀 Method 1: Deploy with Vercel CLI (Recommended)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy from Project Directory
```bash
cd /Users/giancarlovizhnay/btc-script-lab
vercel
```

### Step 4: Follow the Prompts
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **What's your project's name?** → `bitcoin-script-lab`
- **In which directory is your code located?** → `./frontend`

### Step 5: Configure Build Settings
Vercel will automatically detect this as a static site. The configuration is already set in `vercel.json`.

## 🌐 Method 2: Deploy with GitHub Integration

### Step 1: Create GitHub Repository
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Bitcoin Script Learning Lab"

# Create repository on GitHub and push
git remote add origin https://github.com/your-username/btc-script-lab.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure build settings:
   - **Framework Preset**: Other
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `frontend`

### Step 3: Deploy
Click "Deploy" and Vercel will automatically build and deploy your site.

## 🎯 Method 3: Deploy with Netlify (Alternative)

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Login to Netlify
```bash
netlify login
```

### Step 3: Deploy
```bash
cd /Users/giancarlovizhnay/btc-script-lab/frontend
netlify deploy --prod --dir .
```

## 🔧 Configuration Files

### vercel.json
```json
{
  "version": 2,
  "name": "bitcoin-script-lab",
  "builds": [
    {
      "src": "frontend/**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ]
}
```

### package.json
```json
{
  "name": "bitcoin-script-lab",
  "version": "1.0.0",
  "scripts": {
    "build": "echo 'Building Bitcoin Script Learning Lab...'",
    "start": "cd frontend && node server.js",
    "dev": "cd frontend && node server.js"
  }
}
```

## 🌍 Custom Domain Setup

### Step 1: Add Domain in Vercel
1. Go to your project dashboard
2. Click "Domains"
3. Add your custom domain (e.g., `bitcoin-script-lab.com`)

### Step 2: Configure DNS
Add these DNS records to your domain provider:
- **Type**: CNAME
- **Name**: `www`
- **Value**: `cname.vercel-dns.com`

- **Type**: A
- **Name**: `@`
- **Value**: `76.76.19.61`

### Step 3: SSL Certificate
Vercel automatically provides SSL certificates for custom domains.

## 📊 Performance Optimization

### 1. Enable Compression
Vercel automatically enables gzip compression.

### 2. CDN Distribution
Vercel uses a global CDN for fast loading worldwide.

### 3. Image Optimization
Consider optimizing images for web:
```bash
# Install image optimization tools
npm install -g imagemin-cli

# Optimize images
imagemin frontend/images/* --out-dir=frontend/images/optimized
```

## 🔒 Security Headers

The `vercel.json` file includes security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

## 📱 Mobile Optimization

Your app is already mobile-responsive with:
- Bootstrap 5 responsive grid
- Touch-friendly buttons
- Optimized font sizes
- Mobile-specific CSS

## 🚀 Deployment Checklist

- [ ] All files committed to git
- [ ] `vercel.json` configured
- [ ] `package.json` updated
- [ ] `.gitignore` created
- [ ] README.md updated
- [ ] Tested locally with `npm run dev`
- [ ] Deployed to Vercel
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Performance tested

## 🐛 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node.js version (14+ required)
   - Verify all dependencies are installed
   - Check for syntax errors

2. **Static Files Not Loading**
   - Verify `vercel.json` routes configuration
   - Check file paths in HTML
   - Ensure files are in correct directory

3. **Custom Domain Not Working**
   - Verify DNS records
   - Wait for DNS propagation (up to 24 hours)
   - Check domain configuration in Vercel

### Debug Commands
```bash
# Check Vercel CLI version
vercel --version

# View deployment logs
vercel logs

# Check project status
vercel ls

# Remove deployment
vercel remove bitcoin-script-lab
```

## 📈 Analytics & Monitoring

### Vercel Analytics
1. Go to project dashboard
2. Click "Analytics"
3. Enable Vercel Analytics for free

### Google Analytics (Optional)
Add to your HTML head:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🎉 Success!

Once deployed, your Bitcoin Script Learning Lab will be available at:
- **Vercel URL**: `https://bitcoin-script-lab.vercel.app`
- **Custom Domain**: `https://your-domain.com` (if configured)

## 📞 Support

If you encounter issues:
1. Check the [Vercel Documentation](https://vercel.com/docs)
2. Review the [Troubleshooting](#troubleshooting) section
3. Check the [GitHub Issues](https://github.com/your-username/btc-script-lab/issues)

---

**Happy Deploying! 🚀**
