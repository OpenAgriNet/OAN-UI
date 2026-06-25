import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const markdownComponents: Components = {
	p: ({ children }) => <p className="m-0 leading-relaxed whitespace-pre-line">{children}</p>,
	a: ({ href, children }) => (
		<a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline">
			{children}
		</a>
	),
	pre: ({ children }) => (
		<pre className="bg-muted/50 p-2 rounded-lg overflow-x-auto">{children}</pre>
	),
	code: ({ className, children, ...props }) => {
		const match = /language-(\w+)/.exec(className || "");
		const isInline = !match;
		return isInline ? (
			<code className="bg-muted/50 rounded px-1 py-0.5" {...props}>{children}</code>
		) : (
			<code className={className} {...props}>{children}</code>
		);
	},
	hr: () => (
		<hr className="border-none h-px my-4 bg-primary/30 dark:bg-primary/40" />
	),
};

export function SafeMarkdown({ children }: { readonly children: string }) {
	return (
		<ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
			{children}
		</ReactMarkdown>
	);
}
