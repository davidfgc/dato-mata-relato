# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Code Style Guidelines
- Use React functional components with hooks
- TypeScript interfaces for domain models in `/src/domain`
- Follow ESLint configuration with React recommended rules
- Use JSX runtime syntax (no React imports for JSX)
- Follow component folder structure by feature
- Use Material-UI (MUI) for UI components
- Import ordering with Prettier plugins
- Prefer async/await for API calls
- Use TypeScript for type definitions when adding new code
- Error handling should use try/catch blocks where appropriate
- Use React Router (HashRouter) for navigation
- Use Recharts for data visualization

## Project Structure
- `/src/api` - API service layer
- `/src/components` - React components organized by feature
- `/src/domain` - TypeScript interfaces/types
- `/src/hooks` - Custom React hooks
- `/public/data` - JSON data sources