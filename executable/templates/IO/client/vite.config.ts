import path from "path"
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
      /*entries:[
        { find:"common",replacement:"../common"},
        { find:"KLSE/CLIENT",replacement:"https://deno.land/x/klse@0.1.3/client_side/bundle.js"},
        { find:"KLSE",replacement:"https://deno.land/x/klse@0.1.3/bundle.js"}
      ],*/
      "common":path.resolve(__dirname,"../common"),
      "KLSE/CLIENT":"https://deno.land/x/klse@0.1.3/client_side/bundle.js",
      "KLSE":"https://deno.land/x/klse@0.1.3/bundle.js"
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