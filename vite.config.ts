import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

const legacyTelemetryScripts = [
	"js/jquery.min.js",
	"js/auth-token-generator.min.js",
	"js/telemetry.min.js"
];

const legacyTelemetryScriptsPlugin: PluginOption = {
	name: "inject-legacy-telemetry-scripts",
	transformIndexHtml() {
		return legacyTelemetryScripts.map((script) => ({
			tag: "script",
			attrs: {
				src: script
			},
			injectTo: "head" as const
		}));
	}
};

const virtualRouteFileChangeReloadPlugin: PluginOption = {
	name: "watch-config-restart",
	configureServer(server) {
		server.watcher.add("./src/routes.ts");
		server.watcher.on("change", (path) => {
			if (path.endsWith("src/routes.ts")) {
				console.log("Virtual route changed");
				server.restart();
			}
		});
	}
};
// https://vite.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
			"~": path.resolve(__dirname),
			"lottie-web": path.resolve(
				__dirname,
				"node_modules/lottie-web/build/player/lottie_light.js"
			)
		}
	},
	plugins: [
		tsconfigPaths(),
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
			routesDirectory: path.resolve(__dirname, "src/pages"),
			virtualRouteConfig: "./src/routes.ts",
			generatedRouteTree: "./src/routeTree.gen.ts"
		}),
		react(),
		legacyTelemetryScriptsPlugin,
		virtualRouteFileChangeReloadPlugin
	],
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (!id.includes("node_modules")) return;

					if (id.includes("@tanstack")) return "tanstack";
					if (id.includes("lottie")) return "lottie";
					if (id.includes("@fingerprintjs") || id.includes("ua-parser-js")) {
						return "telemetry-vendor";
					}
					if (id.includes("jose") || id.includes("uuid")) return "auth-vendor";
					if (id.includes("axios")) return "network-vendor";
					if (
						id.includes("react-markdown") ||
						id.includes("remark") ||
						id.includes("rehype") ||
						id.includes("unified") ||
						id.includes("micromark") ||
						id.includes("mdast") ||
						id.includes("hast") ||
						id.includes("vfile")
					) {
						return "markdown";
					}
					if (id.includes("@radix-ui") || id.includes("lucide-react")) {
						return "ui-vendor";
					}
				}
			}
		}
	},
	server: {
		port: 3000
	}
});
