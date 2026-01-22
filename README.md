# Tower Defence

Small turn-based tower defense simulator built with React 19, TypeScript, and Vite.

## Project Structure
- `index.html`: Vite entry HTML.
- `src/main.tsx`: app bootstrap.
- `src/components/`: feature components (`App`, `Game`, `Header`).
- `src/**/*.module.css`: CSS Modules for component styling.

## Scripts
- `npm install`: install dependencies.
- `npm run dev`: start the Vite dev server.
- `npm run build`: create a production build in `dist/`.
- `npm run preview`: serve the production build locally.
- `npm run test`: run Vitest in jsdom.

## Development Notes
- React components live in `src/components` and use `.tsx` files.
- Keep styles in colocated `*.module.css` files.
- The UI uses Google Fonts via `src/index.css`.
