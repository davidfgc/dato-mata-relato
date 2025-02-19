# Dato Mata Relato

## Technical Architecture
### Frontend
- React with Vite as the build tool
- UI Library: Material-UI (MUI)
- Routing: Using HashRouter from react-router-dom

### Deployment
- GitHub Pages with automated deployment via GitHub Actions

### Data Storage
- Static JSON files served from GitHub Pages

#### Data Structure
- Bills (legislative proposals)
- Political parties and their information
- Representatives and their details
- Voting records
- Voting steps (the legislative process stages)

## Environments

### Development
- 'http://localhost:5173'

### Production

- https://davidfgc.github.io/dato-mata-relato
- https://votos.progres.website/

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
