import { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CHAT_ASSISTANT, CHAT_USER } from "../config";
import { MessageRole } from "./bubbles/chat-types";
import { useAuthStore } from "@/hooks/store/auth";

type MessageChromeProps = {
	role: MessageRole;
	children: ReactNode;
	showLabel?: boolean;
};

const ROLE_META = {
	user: CHAT_USER,
	assistant: CHAT_ASSISTANT,
	system: CHAT_ASSISTANT
};

export function MessageChrome({ role, children, showLabel = true }: MessageChromeProps) {
	const isUser = role === "user";
	const user = useAuthStore((s) => s.user);
	const meta = ROLE_META[role] ?? CHAT_ASSISTANT;
	
	const getInitials = (username: string) => {
		return username?.substring(0, 2).toUpperCase() || "U";
	};

	const initials = isUser 
		? getInitials(user?.username || user?.name || "User") 
		: meta.name.slice(0, 1).toUpperCase();

	if (isUser) {
		return (
			<div className="flex w-full flex-col items-end gap-1 mb-4">
				{/* User Header: Name and Avatar */}
				{showLabel && (
					<div className="flex items-center gap-2">
						<span className="text-sm font-semibold text-foreground">{user?.username || user?.name || meta.name}</span>
						<Avatar className="h-8 w-8 rounded-full bg-[#E2E2E2] p-[4px]">
							<AvatarImage src="/src/assets/userAmul.svg" className="object-contain" />
							<AvatarFallback className="text-[#019444] text-xs font-bold">{initials}</AvatarFallback>
						</Avatar>
					</div>
				)}
				{children}
			</div>
		);
	}

	// Assistant / System
	return (
		<div className="flex w-full flex-col items-start gap-1">
			{/* AI Header: Avatar and Name */}
			{showLabel && (
				<div className="flex items-center gap-2">
					<Avatar className="h-9 w-9">
						<AvatarImage src={meta.avatar} className="object-contain" />
						<AvatarFallback className="bg-transparent text-[#00a651] font-bold text-xs">{initials}</AvatarFallback>
					</Avatar>
					<span className="text-sm font-semibold text-foreground">{meta.name}</span>
				</div>
			)}
			<div className="pl-10 w-full">
				{children}
				{/* Loading dots for AI (if passed as children) should align here */}
			</div>
		</div>
	);
}
