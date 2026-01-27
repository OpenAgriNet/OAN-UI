import { createFileRoute } from "@tanstack/react-router";
import ChatScreen from ".";

export const Route = createFileRoute("/_public-chat/_chat-layout/chat")({
	component: ChatScreen
});
