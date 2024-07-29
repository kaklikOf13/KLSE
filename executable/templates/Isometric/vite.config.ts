import path from "path"
export default {
  build:{
    outDir:"./dist",
    emptyOutDir:false
  },
  resolve: {
    alias: {
      /*"KLSE/CLIENT":"https://deno.land/x/klse@0.3.0/client_side/bundle.js",
      "KLSE":"https://deno.land/x/klse@0.3.0/bundle.js"*/

      "KLSE/CLIENT":path.resolve(__dirname,"../../../client_side/bundle.js"),
      "KLSE":path.resolve(__dirname,"../../../bundle.js"),
    },
  },
  server:{
    port:3000,
    strictPort: true,
    host: "0.0.0.0",
  },
  preview: {
    port: 3000,
    strictPort: true,
    host: "0.0.0.0"
  },
  root:"src",
  base:""
}