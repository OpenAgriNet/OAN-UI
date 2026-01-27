import { cn } from "@/lib/utils";
import { TextMessage } from "./chat-types";

export function TextBubble({ message }: { message: TextMessage }) {
	const isUser = message.role === "user";

	return (
		<div
			className={cn(
				"max-w-full rounded-[20px] px-4 py-3 text-base sm:max-w-[85%]", // Increased padding/text-size
				isUser
					? "rounded-tr-md bg-[#FFE2E2] text-black shadow-[1.6px_1.6px_9.6px_0px_#00000014]" // Custom color #FFE2E2, black text, custom shadow
					: "rounded-tl-md border bg-card text-card-foreground shadow-sm"
			)}
		>
			<p className="leading-relaxed whitespace-pre-wrap">{message.text}</p>
		</div>
	);
}
