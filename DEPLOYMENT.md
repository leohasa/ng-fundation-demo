# Cloudflare Pages Deployment Guide

This guide explains how to deploy the Foundation Demo project to Cloudflare Pages.

## Prerequisites

- A Cloudflare account
- Git repository (GitHub, GitLab, or Bitbucket)
- Node.js 18+ installed locally (for testing)

## Project Configuration

The project is already configured for Cloudflare Pages deployment:

### 1. Build Configuration
- **Build command**: `npm run build:prod`
- **Build output directory**: `dist/foundation-demo/browser`
- **Node version**: 18 or higher

### 2. Files Configured
- ✅ `_redirects` file in `public/` directory (handles SPA routing)
- ✅ `angular.json` configured to copy assets and public files
- ✅ Production build script in `package.json`
- ✅ Translation files in `src/assets/i18n/`

## Deployment Steps

### Option 1: Deploy via Cloudflare Dashboard (Recommended)

1. **Push your code to a Git repository**
   ```bash
   git add .
   git commit -m "Prepare for Cloudflare Pages deployment"
   git push origin main
   ```

2. **Connect to Cloudflare Pages**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Pages** in the sidebar
   - Click **Create a project**
   - Click **Connect to Git**

3. **Select your repository**
   - Choose your Git provider (GitHub, GitLab, or Bitbucket)
   - Authorize Cloudflare to access your repository
   - Select the `FundationDemo` repository

4. **Configure build settings**
   ```
   Project name: foundation-demo (or your preferred name)
   Production branch: main
   Build command: npm run build:prod
   Build output directory: dist/foundation-demo/browser
   ```

5. **Environment variables** (Optional)
   - No environment variables are required for this project
   - You can add them later if needed

6. **Deploy**
   - Click **Save and Deploy**
   - Wait for the build to complete (typically 2-5 minutes)
   - Your site will be available at `https://foundation-demo.pages.dev`

### Option 2: Deploy via Wrangler CLI

1. **Install Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**
   ```bash
   wrangler login
   ```

3. **Build the project**
   ```bash
   npm run build:prod
   ```

4. **Deploy**
   ```bash
   wrangler pages deploy dist/foundation-demo/browser --project-name=foundation-demo
   ```

## Build Settings Summary

For quick reference when setting up Cloudflare Pages:

| Setting | Value |
|---------|-------|
| Framework preset | None (or Angular) |
| Build command | `npm run build:prod` |
| Build output directory | `dist/foundation-demo/browser` |
| Root directory | `/` |
| Node version | 18 or higher |

## Post-Deployment Configuration

### Custom Domain
1. Go to your Pages project in Cloudflare Dashboard
2. Navigate to **Custom domains**
3. Click **Set up a custom domain**
4. Follow the instructions to add your domain

### Environment Variables (if needed)
1. Go to your Pages project settings
2. Navigate to **Environment variables**
3. Add any necessary variables for production

## Automatic Deployments

Cloudflare Pages automatically deploys:
- **Production**: When you push to your main branch
- **Preview**: When you create a pull request

Each commit and PR gets its own preview URL for testing.

## Troubleshooting

### Build Fails
- Check the build logs in Cloudflare Dashboard
- Verify Node version is 18 or higher
- Ensure all dependencies are in `package.json` (not `devDependencies` only)

### 404 Errors on Refresh
- Verify `_redirects` file exists in `public/` directory
- Content should be: `/* /index.html 200`
- Check build output: `dist/foundation-demo/browser/_redirects` should exist

### Translation Files Not Loading
- Check that `src/assets/i18n/*.json` files exist
- Verify `angular.json` includes `src/assets` in assets configuration
- Check browser Network tab for 404 errors

### Styles Not Loading
- Ensure `src/styles/styles.css` exists
- Check that Tailwind CSS is properly configured
- Verify build completed without errors

## Rollback

To rollback to a previous deployment:
1. Go to your Pages project in Cloudflare Dashboard
2. Navigate to **Deployments**
3. Find the deployment you want to rollback to
4. Click **Rollback to this deployment**

## Performance Optimization

The production build includes:
- ✅ Code minification and tree-shaking
- ✅ Asset optimization
- ✅ Gzip compression (handled by Cloudflare)
- ✅ Lazy loading for routes
- ✅ Bundle size: ~118 KB (gzipped)

## Monitoring

- View analytics in Cloudflare Dashboard under **Analytics**
- Monitor Web Vitals and performance metrics
- Check deployment logs for errors

## Support

For issues specific to Cloudflare Pages:
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages)
- [Cloudflare Community](https://community.cloudflare.com/)

For project-specific issues:
- Check the build logs
- Review the Angular build output
- Verify all files are committed to Git
