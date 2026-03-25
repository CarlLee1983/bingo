# Phase 5 Research: Static Deployment

## Objective
Identify and verify the necessary configurations and files for a production-ready static deployment of the American Bingo game to GitHub Pages.

## Findings

### 1. Base Path Configuration
- **Current State**: `vite.config.ts` does not specify a `base` property, defaulting to `/`.
- **Requirement**: GitHub Pages hosted at `https://<username>.github.io/bingo/` requires `base: '/bingo/'`.
- **Reference**: [Vite Documentation on Base Path](https://vitejs.dev/config/shared-options.html#base)

### 2. SPA Refresh Handling (404.html Hack)
- **Problem**: GitHub Pages does not natively support client-side routing. Refreshing a path like `/bingo/session` would return a 404 from GitHub's server.
- **Solution**: 
  - A `404.html` in the `public/` directory will capture the path, store it in `sessionStorage`, and redirect back to `index.html`.
  - A small script in `index.html`'s `<head>` will check for a stored path and use it to restore the correct URL/state.
- **Reference**: [rafgraph/spa-github-pages](https://github.com/rafgraph/spa-github-pages)

### 3. Automated Deployment (GitHub Actions)
- **Current State**: No `.github/workflows` directory exists.
- **Plan**: Use `actions/deploy-pages` with Vite's static build output.
- **Workflow Steps**:
  1. Checkout `main`.
  2. Setup Node.js.
  3. `npm install`.
  4. `npm run build`.
  5. Upload `dist/` artifact.
  6. Deploy to GitHub Pages environment.

### 4. Environment Variables Support
- **Current State**: No `.env` files or environment variable types defined.
- **Plan**: 
  - Create a `src/vite-env.d.ts` file to provide type safety for `import.meta.env`.
  - Add a `.env` template to demonstrate how to add future variables.

## Verification Strategy
- **Local Build Test**: Run `npm run build` locally and inspect the `dist/index.html` to ensure asset paths are prefixed with `/bingo/`.
- **Manual 404 Simulation**: Test the `404.html` redirection logic locally by serving the `dist/` folder.
- **CI/CD Dry Run**: Verify the `.github/workflows/deploy.yml` syntax using `action-validator` (if available) or by inspection.
