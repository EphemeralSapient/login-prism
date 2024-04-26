import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  base: 'http://localhost/prism_login/',
  plugins: [react()],
  esbuild: { 
    legalComments: 'none',
    treeShaking : true
  },

})
