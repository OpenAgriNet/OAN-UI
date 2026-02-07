import { cn } from "@/lib/utils";
import { TextMessage } from "./chat-types";

export function TextBubble({ message }: { message: TextMessage }) {
	const isUser = message.role === "user";

	return (
		<div
			className={cn(
				"max-w-full rounded-[20px] px-4 py-3 text-base shadow-sm sm:max-w-[85%]", // Increased padding/text-size
				isUser
					? "rounded-tr-md bg-[#C1FDD6] text-black" // Custom green color #bbf7d0 (matches image), black text
					: "rounded-tl-md border bg-card text-card-foreground"
			)}
		>
			<p className="leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">{message.text}</p>
		</div>
	);
}
