import type { PluggableList } from "unified";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

/**
 * Markdown plugin configuration for assistant chat bubbles.
 *
 * Assistant responses are passed to react-markdown untouched — there is deliberately no pre-parse
 * normalisation of maths delimiters. `$...$` and `$$...$$` are the only maths delimiters, and
 * remark-math owns them exclusively; `\[...\]` is used by the backend for citations and source
 * attributions, so it must render as literal text.
 *
 * Exported so the rendering tests exercise exactly the configuration the bubble uses.
 */
export const chatRemarkPlugins: PluggableList = [remarkGfm, remarkMath];

export const chatRehypePlugins: PluggableList = [
	// maxSize caps user-visible dimensions: without it a response containing
	// \rule{500em}{500em} paints a screen-filling block on the farmer's phone.
	[rehypeKatex, { maxSize: 20 }]
];
