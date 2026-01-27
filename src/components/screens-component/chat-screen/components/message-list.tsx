import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageChrome } from "./message-chrome";
import { ChatMessage } from "./bubbles/chat-types";
import { Bubble } from "./bubbles";
import { AILoader } from "./ai-loader";

/* eslint-disable no-unused-vars */
type MessageListProps = {
	messages: ChatMessage[];
	isAssistantTyping?: boolean;
	welcome?: React.ReactNode;
	onQuickReply?: (payload: string) => void;
};
/* eslint-enable no-unused-vars */

export function MessageList(props: MessageListProps) {
	const bottomRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (props.messages.length > 0) {
			bottomRef.current?.scrollIntoView({ behavior: "smooth" });
		} else {
			// Scroll to top when there are no messages (WelcomePanel visible)
			const scrollArea = bottomRef.current?.closest("[data-radix-scroll-area-viewport]");
			if (scrollArea) {
				scrollArea.scrollTo({ top: 0, behavior: "smooth" });
			}
		}
	}, [props.messages.length, props.isAssistantTyping]);

	return (
		<ScrollArea className="h-full">
			<div className="mx-auto flex max-w-3xl flex-col gap-3 px-2 pt-3 pb-14 sm:px-4">
				{props.welcome}
				{props.messages.map((m) => (
					<Bubble key={m.id} message={m} onQuickReply={props.onQuickReply} />
				))}
				{props.isAssistantTyping ? (
					<MessageChrome role="assistant" showLabel={true}>
						<AILoader className="px-1" />
					</MessageChrome>
				) : null}
				<div ref={bottomRef} />
			</div>
		</ScrollArea>
	);
}
