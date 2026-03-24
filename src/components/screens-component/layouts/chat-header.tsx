import { ChevronDown, User } from "lucide-react";
import settingsIcon from "@/assets/settings.svg";
import langIcon from "@/assets/langIcon.svg";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/components/LanguageProvider";
import { LANGUAGES } from "@/components/screens-component/chat-screen/config";
import { LanguageSelectionDropdown } from "@/components/screens-component/chat-screen/components/language-selection-dialog";

export type ChatHeaderProps = {
	title: string;
	subtitle?: string;
	leftAvatarUrl?: string;
	rightAvatarUrl?: string;
	rightLabel?: string;
	onBack?: () => void;
	onOpenProfile?: () => void;
	onClearChat?: () => void;
	onOpenSettings?: () => void;
};

export function ChatHeader(props: ChatHeaderProps) {
	const {
		title,
		leftAvatarUrl,
		rightLabel,
		onOpenProfile,
		onOpenSettings,
	} = props;

	const { language } = useLanguage();
	const currentLanguage = (LANGUAGES as any)[language] || LANGUAGES.en;

	const showProfile = rightLabel && rightLabel !== "Anonymous User" && rightLabel !== "";

	return (
		<header className="sticky top-0 z-50 w-full bg-white dark:bg-gray-950 border-b border-[#E3E3E3] dark:border-gray-800 transition-colors duration-300">
			<div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
				{/* Left: Logo & Title */}
				<div className="flex items-center gap-2 min-w-0">
					<Avatar className="h-9 w-9 shrink-0 shadow-none">
						<AvatarImage src={leftAvatarUrl} alt={title} />
						<AvatarFallback>{title.slice(0, 2).toUpperCase()}</AvatarFallback>
					</Avatar>
					<span className="text-xl sm:text-lg font-bold text-foreground truncate">{title}</span>
				</div>

				{/* Right: User Profile + Language + Settings */}
				<div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
					{/* User Profile Button */}
					{showProfile && (
						<button
							onClick={onOpenProfile}
							className="flex items-center gap-1.5 rounded-full px-2 py-1 hover:bg-[#EEFFF4] transition-colors cursor-pointer"
						>
							<div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
								<User className="h-4 w-4 text-green-700" />
							</div>
							<span className="text-sm font-medium text-foreground truncate max-w-[100px] hidden sm:inline">
								{rightLabel}
							</span>
						</button>
					)}

					{/* Language Dropdown */}
					<LanguageSelectionDropdown>
						{/* Desktop Language Button */}
						<Button
							variant="outline"
							className="hidden h-9 w-auto gap-2 rounded-full bg-transparent border-transparent px-3 font-normal text-foreground sm:flex cursor-pointer border-[#CBCBCB] hover:bg-[#FFE2E2] hover:border-[#F65151]"
						>
							<img src={langIcon} alt="Language" className="h-5 w-5" />
							<span className="font-medium text-xs">{currentLanguage.name}</span>
							<ChevronDown className="ml-1 h-4 w-4 opacity-50" />
						</Button>
					</LanguageSelectionDropdown>

					{/* Mobile Language Button */}
					<LanguageSelectionDropdown>
						<Button
							variant="ghost"
							size="icon"
							className="h-9 w-9 sm:hidden cursor-pointer hover:bg-[#EEFFF4] hover:border-[#019444] border border-transparent"
						>
							<img src={langIcon} alt="Language" className="h-6 w-6" />
						</Button>
					</LanguageSelectionDropdown>

					<Button
						variant="ghost"
						size="icon"
						className="h-10 w-10 text-muted-foreground cursor-pointer hover:bg-[#FFE2E2]"
						onClick={onOpenSettings}
					>
						<img src={settingsIcon} alt="Settings" className="h-7 w-7 text-[#F65151]" />
					</Button>
				</div>
			</div>
		</header>
	);
}
