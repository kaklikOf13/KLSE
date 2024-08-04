export default {
  build:{
    outDir:"../../dist/client",
    emptyOutDir:false
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