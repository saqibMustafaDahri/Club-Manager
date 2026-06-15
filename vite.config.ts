import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackStart as TanStackStartVite } from '@tanstack/react-start/plugin/vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    TanStackStartVite(),
    react(),
    tailwindcss(),
    tsConfigPaths(),
  ],
})