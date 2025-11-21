// import { defineConfig, Plugin } from 'vite';
// import path from 'path';
// import fs from 'fs-extra';

// function copyToWordPress(): Plugin {
//   return {
//     name: 'copy-to-wordpress',
//     closeBundle: async () => {
//       const wpDir = path.resolve(__dirname, '../wordpress/wp-content/plugins/admin-web/assets');

//       await fs.ensureDir(path.join(wpDir, 'js'));
//       await fs.ensureDir(path.join(wpDir, 'css'));

//       // Copy JS bundle
//       await fs.copyFile(
//         path.resolve(__dirname, 'dist/bundle.js'),
//         path.join(wpDir, 'js/bundle.js')
//       );

//       // Copy CSS
//       await fs.copyFile(
//         path.resolve(__dirname, 'src/styles/global.css'),
//         path.join(wpDir, 'css/style.css')
//       );

//       console.log('🔥 JS + CSS đã copy sang WordPress plugin!');
//     }
//   };
// }

// export default defineConfig({
//   resolve: {
//     alias: { '@': path.resolve(__dirname, 'src') }
//   },

//   build: {
//     outDir: 'dist',
//     emptyOutDir: true,
//     lib: {
//       entry: path.resolve(__dirname, 'src/index.tsx'),
//       name: 'AdminWebDashboard',
//       fileName: 'bundle',
//       formats: ['iife'] // iife để load trực tiếp trong WordPress
//     }
//   },

//   plugins: [copyToWordPress()]
// });
