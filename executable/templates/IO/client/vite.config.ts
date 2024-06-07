import path from "path"
export default {
  build:{
    outDir:"../../dist/client",
    emptyOutDir:false
  },
  resolve: {
    alias: {
      "common":path.resolve(__dirname,"../common"),
      "KLSE/CLIENT":"https://deno.land/x/klse@0.1.5/client_side/bundle.js",
      "KLSE":"https://deno.land/x/klse@0.1.5/bundle.js"
    },
  },
  server:{
    port:3000,
    strictPort: true,
    host: "0.0.0.0",
    warmup: {
      clientFiles: ['../common/*'],
      ssrFiles: ['../common/*'],
    },
  },
  preview: {
    port: 3000,
    strictPort: true,
    host: "0.0.0.0"
  },
  root:"src",
  base:""
}