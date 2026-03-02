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

		// Performance Tracking
		const lastMessage = props.messages[props.messages.length - 1];
		if (
			lastMessage &&
			lastMessage.role === "assistant" &&
			lastMessage.type === "card" &&
			lastMessage.questionId &&
			!props.isAssistantTyping // Only log when fully done? Or maybe streams behave differently. 
            // In original OAN-UI it seemed to log after paint. 
            // We'll trust that isAssistantTyping false means done.
		) {
            // We need to import these functions or pass them down. 
            // Ideally we'd import them directly since they are singletons/globals basically.
            import("@/lib/telemetry").then(({ markAnswerRendered, logResponseEvent }) => {
                // We need the session ID, which isn't in props. 
                // But the store has it. Or we can just rely on the global state in telemetry if it persists?
                // Actually `logResponseEvent` needs sessionId. 
                // Maybe we should pass sessionId to MessageList?
                // Or we can import the store to get sessionId.
                import("@/hooks/store/chat").then(({ useChatStore }) => {
                   const sessionId = useChatStore.getState().sessionId; 
                   if(sessionId && lastMessage.questionText && lastMessage.body) {
                       const pipeline = lastMessage.type === "card" && "pipeline" in lastMessage ? lastMessage.pipeline : undefined;
                       markAnswerRendered(lastMessage.questionId!, () => {
                           logResponseEvent(lastMessage.questionId!, sessionId, lastMessage.questionText!, lastMessage.body, pipeline);
                           // endTelemetryWithWait is called in store action
                       });
                   }
                });
            });
		}
	}, [props.messages.length, props.isAssistantTyping, props.messages]);

	return (
		<ScrollArea className="h-full">
			<div className="mx-auto flex max-w-3xl flex-col gap-3 px-2 pt-3 pb-14 sm:px-4">
				{props.welcome}
				{props.messages.map((m) => (
					<Bubble key={m.id} message={m} onQuickReply={props.onQuickReply} />
				))}
				{props.isAssistantTyping && props.messages[props.messages.length - 1]?.role !== "assistant" ? (
					<MessageChrome role="assistant" showLabel={true}>
						<AILoader className="px-1" />
					</MessageChrome>
				) : null}
				<div ref={bottomRef} />
			</div>
		</ScrollArea>
	);
}
