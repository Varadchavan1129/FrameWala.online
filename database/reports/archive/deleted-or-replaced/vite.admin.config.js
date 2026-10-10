import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// Vite configurations for Admin Portal
export default defineConfig({
  plugins: [react()],
  define: {
    __ADMIN__: true,
  },
  server: {
    port: 5174,
    open: true,
  }
})
