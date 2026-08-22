import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// Vite configurations for Admin Portal
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    open: true,
  }
})
