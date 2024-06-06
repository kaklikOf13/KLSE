export default {
  build:{
    outDir:"../../dist/client",
    emptyOutDir:false,
    /*rollupOptions: {
      input: {
          main: resolve(__dirname, "./index.html"),
      }
    }*/
  },
  resolve: {
    alias: {
      'common': '../common',
      "KLSE/CLIENT":"https://deno.land/klse@0.1.3/client/bundle.js",
      "KLSE":"https://deno.land/klse@0.1.3/bundle.js",
    },
  },
  server:{
    port:3000
  },
  root:"src"
}