import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
    plugins: [solidPlugin()],
    resolve: {
        alias: {
            process: "process/browser",
        },
    },
    build: {
        target: "esnext",
    },
    server: {
        port: 3000,
    },
    base: "/audio-metadata-viewer/"
});
