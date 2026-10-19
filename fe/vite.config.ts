import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	resolve: { tsconfigPaths: true },

	server: {
		port: 5173,
		strictPort: true,
		/**
		 * `/api` is proxied so the dev server is one origin with the backend, exactly as
		 * Caddy makes it in docker: a session cookie stays first-party and nothing needs
		 * CORS. Without it, Vite would answer `/api/...` with its own index.html — a 200
		 * of HTML that every response schema rejects.
		 */
		proxy: {
			"/api": { target: "http://localhost:3000", changeOrigin: false },
		},
	},

	build: {
		outDir: "dist",
		sourcemap: true,
	},

	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./vitest.setup.ts"],
		include: ["src/**/*.test.{ts,tsx}"],
		/**
		 * Vitest's default is 5 s, which several screen tests exceed only when the whole
		 * suite runs at once and the files compete for the machine — the Info guide alone
		 * renders every chapter and every check card. In isolation those tests finish in
		 * well under a second, so the budget here is headroom against contention, not an
		 * allowance for slow tests: a real hang still fails the run.
		 */
		testTimeout: 15_000,
		// Toronto, the user's zone — deliberately not UTC: at UTC the local clock equals
		// the absolute one, so a test that confuses the two passes by coincidence.
		env: { TZ: "America/Toronto" },
	},
});
