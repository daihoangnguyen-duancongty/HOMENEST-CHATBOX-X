import { defineConfig, Plugin } from 'vite';
import path from 'path';
import fs from 'fs-extra';

function removeReactRefreshPlugin(): Plugin {
  return {
    name: 'remove-react-refresh',
    enforce: 'post',
    transform(code: string, id: string): string | null {
      if (!/\.(js|jsx|ts|tsx)$/.test(id)) return null;

      return code
        .replace(/import\s+["']react-refresh["'];?/g, '')
        .replace(/window\.__vite_plugin_react_preamble_installed__\s*=\s*true;/g, '')
        .replace(/if\s*\(\s*import\.meta\.hot\s*\)\s*\{[\s\S]*?\}/g, '');
    }
  };
}

export default defineConfig({
  plugins: [
    removeReactRefreshPlugin(),
    {
      name: 'copy-css-and-js',
      closeBundle: async () => {
        const pluginDir = path.resolve(
          __dirname,
          '../wordpress/wp-content/plugins/chatbot/assets'
        );

        await fs.ensureDir(path.join(pluginDir, 'js'));
        await fs.ensureDir(path.join(pluginDir, 'css'));

        await fs.copyFile(
          path.resolve(__dirname, 'dist/widget.js'),
          path.join(pluginDir, 'js/widget.js')
        );

        await fs.copyFile(
          path.resolve(__dirname, 'src/styles/global.css'),
          path.join(pluginDir, 'css/widget.css')
        );

        console.log('🔥 Widget JS + CSS đã copy sang plugin WordPress!');
      }
    }
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },

  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    process: JSON.stringify({ env: { NODE_ENV: 'production' } })
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, 'src/main.tsx'),
      name: 'HomenestChatWidget',
      fileName: () => 'bundle.js',
      formats: ['iife']
    },
    rollupOptions: {
      output: { globals: {} }
    },
    commonjsOptions: {
      include: [/node_modules/]
    }
  }
});
