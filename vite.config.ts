import { defineConfig } from "vite";

const PORT = 4000;

export default defineConfig(({ command }) => {
  if (command === "serve") {
    return {
      base: `/proxy/${PORT}/`,
      server: {
        port: PORT,
        strictPort: true,
        hmr: {
          host: "ws",
          port: PORT,
          clientPort: PORT,
        },
      },
    };
  }

  return {
    base: "/metaball-interaction/",
  };
});
