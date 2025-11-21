# Walkthrough - Deployment Fixes

I have analyzed the deployment process and implemented fixes to address the failures.

## Changes

### 1. Environment Variables Documentation
I updated `README.md` to explicitly list the environment variables required for deployment. These are critical for the application to function.

### 2. Build Script (Reverted)
I initially updated the build script to include `tinacms build`, but this caused a "500: INTERNAL_SERVER_ERROR" on Vercel. I have **reverted** this change to ensure the site deploys correctly.
The current script is:
```json
"scripts": {
  "build": "next build"
}
```
*Note: The TinaCMS admin dashboard may require a separate build step or local development flow until the specific Vercel error is resolved.*

## Verification Results

### Local Build Verification
I verified that `tinacms build` requires valid credentials to run, which confirms that the environment variables are essential. By reverting to `next build`, we rely on the standard Next.js build process which is more stable for your current Vercel setup.

## Next Steps

1.  **Push Changes:** Push the reverted `package.json` and updated `README.md` to GitHub.
2.  **Deploy:** With the environment variables you added to Vercel, the standard deployment should now succeed without the 500 error.
