# Phase 5 Context: Static Deployment

## Goal
Package the American Bingo game as a production-ready static application and automate its deployment to GitHub Pages.

## Decisions

### 1. Base Path Configuration
- **Decision**: Set the application base path to `/bingo/`.
- **Rationale**: The project is intended to be hosted at `https://<username>.github.io/bingo/`.
- **Implementation**: Update `vite.config.ts` to include `base: '/bingo/'`.

### 2. SPA 404 Redirection
- **Decision**: Implement the standard GitHub Pages 404.html hack.
- **Rationale**: To prevent 404 errors on browser refresh if client-side routing is used or if URLs are manipulated.
- **Implementation**: 
  - Add a `404.html` to the `public/` directory that redirects to `index.html` with query parameters.
  - Add a script in `index.html` to handle the redirected path from the query string.

### 3. Automated Deployment (GitHub Actions)
- **Decision**: Use GitHub Actions for CI/CD.
- **Rationale**: Ensures the latest version of the `main` branch is always live and reduces manual build errors.
- **Implementation**: Create `.github/workflows/deploy.yml` using the `actions/deploy-pages` or `peaceiris/actions-gh-pages` action.

### 4. Environment Variables Architecture
- **Decision**: Standardize on Vite's built-in environment variable support.
- **Rationale**: Provides a clean way to toggle features or settings between dev and production without code changes.
- **Implementation**: 
  - Ensure `vite-env.d.ts` is correctly configured.
  - Use `import.meta.env.VITE_*` prefixes for any future variables.

## Success Criteria
- [ ] Running `npm run build` generates a `dist/` folder with correct relative paths.
- [ ] Pushing to `main` triggers a GitHub Action that successfully deploys to GitHub Pages.
- [ ] The live site at `https://<username>.github.io/bingo/` is functional and handles refreshes correctly.
- [ ] Architecture supports `.env.production` for future variables.
