import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';





export default defineConfig({
  plugins: [react()],
  base: 'https://votos.progres.website',
});