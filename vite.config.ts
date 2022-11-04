import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

export default defineConfig({
    plugins: [solidPlugin()],
    server: {
        port: 3000,
    },
    build: {
        target: "esnext",
    },
    optimizeDeps: {
        esbuildOptions: {
            define: {
                global: "globalThis"
            },
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    buffer: true,
                    process: true
                })
            ]
        }
    },
    resolve: {
        alias: {
            process: "process/browser",
            util: "util"
        }
    }
});
