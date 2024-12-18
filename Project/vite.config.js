import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5174, // Porta do servidor
    open: 'src/pages/minha-conta.html',
  },
  build: {
    rollupOptions: {
      input: {
        main: './minha-conta.html', // Define o HTML principal
      },
    },
  },
});