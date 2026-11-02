import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const proxy = read("../../chat-vistaar-da.gov.in.conf");
const container = read("../nginx.conf");
// ponytail: Check our literal header layout; use nginx -t for full configuration validation.
const browserPolicy = proxy.match(/default "(default-src[^"]+)";/)[1];
const webviewPolicy = proxy.match(/1\s+"(default-src[^"]+)";/)[1];
const containerPolicy = container.match(/add_header Content-Security-Policy "([^"]+)"/)[1];
const directives = (policy) =>
	new Map(policy.split(";").filter((part) => part.trim()).map((part) => {
		const [name, ...sources] = part.trim().split(/\s+/);
		return [name, sources];
	}));

const sonner = readFileSync(require.resolve("sonner"), "utf8");
const injectedCSS = sonner.match(/__insertCSS\(("(?:[^"\\]|\\.)*")\)/);
assert.ok(injectedCSS, "Review Sonner's stylesheet injection after upgrading the dependency");
const styleHash = `'sha256-${createHash("sha256").update(JSON.parse(injectedCSS[1])).digest("base64")}'`;

for (const [name, policy, nonce] of [
	["browser", browserPolicy, "$upstream_http_x_csp_nonce"],
	["WebView", webviewPolicy, "$upstream_http_x_csp_nonce"],
	["container", containerPolicy, "$request_id"]
]) {
	assert.doesNotMatch(policy, /'unsafe-inline'|'unsafe-eval'/, `${name}: unsafe CSP keyword`);
	const parsed = directives(policy);
	assert.deepEqual(parsed.get("style-src"), ["'self'", `'nonce-${nonce}'`, styleHash]);
	assert.deepEqual(parsed.get("object-src"), ["'none'"]);
	assert.deepEqual(parsed.get("base-uri"), ["'self'"]);
	assert.ok(parsed.get("frame-ancestors")?.includes("'self'"), `${name}: missing framing protection`);
}

assert.deepEqual(
	directives(webviewPolicy).get("frame-ancestors"),
	directives(browserPolicy).get("frame-ancestors"),
	"WebViews must keep the browser's partner embedding allowlist"
);
assert.match(proxy, /add_header X-Frame-Options "SAMEORIGIN" always;/);
assert.match(proxy, /proxy_hide_header X-CSP-Nonce;/);
assert.match(container, /add_header X-CSP-Nonce \$request_id always;/);
assert.match(container, /sub_filter '__CSP_NONCE__' '\$request_id';/);
assert.match(container, /if_modified_since off;/);
assert.match(container, /etag off;/);
assert.match(container, /max_ranges 0;/);
assert.match(container, /~\^text\/html\s+"no-store";/);
assert.match(read("../index.html"), /<meta name="csp-nonce" content="__CSP_NONCE__"\s*\/>/);
assert.match(read("../vite.config.ts"), /lottie-web\/build\/player\/lottie_light\.js/);

const animation = JSON.parse(read("../src/assets/Dot loader.json"));
const referenceLayer = animation.layers.find((layer) => layer.nm === "Null 2");
const rotation = referenceLayer.ks.r;
for (const layer of animation.layers.slice(1)) {
	assert.deepEqual(layer.ks.r, rotation, "Bake the loader's shared rotation instead of evaluating expressions");
	assert.equal(layer.st, referenceLayer.st, "Shared rotation must use the same timeline");
	assert.equal(layer.sr, referenceLayer.sr, "Shared rotation must use the same playback speed");
}
for (const file of ["Loading.json", "Dot loader.json"]) {
	const data = read(`../src/assets/${file}`);
	assert.doesNotMatch(data, /"x"\s*:\s*"/, `${file}: Lottie expressions require unsafe-eval`);
}
for (const component of ["chat-input", "recording-controls", "ticker-designs"]) {
	assert.doesNotMatch(
		read(`../src/components/screens-component/chat-screen/components/${component}.tsx`),
		/<style\b/,
		"Keep static animation rules in the external stylesheet"
	);
}
const styles = read("../src/styles/global.css");
assert.match(styles, /@keyframes ticker-scroll\b/);
assert.match(styles, /\.ticker-v1,\s*\.ticker-v1-layout\s*\{\s*animation: ticker-scroll 36s linear infinite;/);
assert.match(styles, /\.ticker-v1-layout\s*\{\s*animation-duration: 38s;/);
assert.match(styles, /\.ticker-v1:hover,\s*\.ticker-v1-layout:hover\s*\{\s*animation-play-state: paused;/);
console.log("CSP configuration, trusted style hash, and animation checks passed.");
