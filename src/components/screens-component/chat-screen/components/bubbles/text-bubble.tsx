import { cn } from "@/lib/utils";
import { TextMessage } from "./chat-types";

export function TextBubble({ message }: { message: TextMessage }) {
	const isUser = message.role === "user";

	return (
		<div
			className={cn(
				"max-w-full rounded-[20px] px-4 py-3 text-base shadow-sm sm:max-w-[85%]", // Increased padding/text-size
				isUser
					? "rounded-tr-md bg-[var(--secondary)] text-black dark:bg-[var(--userBubble-dark)] dark:text-[var(--userBubbleText-dark)]" // Custom blue color, black text
					: "rounded-tl-md border bg-card text-card-foreground dark:bg-[var(--aiBubble-dark)] dark:text-[var(--aiBubbleText-dark)] dark:border-[var(--border-dark)]"
			)}
		>
			<p className="leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">{message.text}</p>
		</div>
	);
}
