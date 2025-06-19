import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ["**/*.hdr"],
  // base: "/FYP_Furniture/",
  plugins: [react()],
  server: {
    host: "0.0.0.0", // This makes Vite listen on all network interfaces
    port: 3000,

    proxy: {
      "/api": {
        target: "http://localhost:5000", //specify the base url to send to if the request url starts with /api
        changeOrigin: true, //this change the origin of the request to the base url which is the above specified
      },
    },
  },
});
