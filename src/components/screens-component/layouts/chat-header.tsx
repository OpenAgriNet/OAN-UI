import { ChevronDown } from "lucide-react";
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
		onOpenSettings
	} = props;

	const { language } = useLanguage();
	const currentLanguage = (LANGUAGES as any)[language] || LANGUAGES.en;

	return (
		<header className="sticky top-0 z-50 w-full bg-white dark:bg-gray-950 border-b border-[#E3E3E3] dark:border-gray-800 transition-colors duration-300">
			<div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
				{/* Left: Logo & Title */}
				<div className="flex items-center gap-2 min-w-0">
					<Avatar className="h-9 w-9 shrink-0">
						<AvatarImage src={leftAvatarUrl} alt={title} />
						<AvatarFallback>{title.slice(0, 2).toUpperCase()}</AvatarFallback>
					</Avatar>
					<span className="text-sm sm:text-lg font-medium text-foreground truncate">{title}</span>
				</div>

				{/* Right: Language + Settings */}
				<div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
					{/* Language Dropdown */}
					<LanguageSelectionDropdown>
						{/* Desktop Language Button */}
						<Button
							variant="outline"
							className="hidden h-9 w-auto gap-2 rounded-full border hover:border-[#019444] px-3 font-normal text-foreground sm:flex cursor-pointer hover:bg-[#C1FDD6]/90"
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
							className="h-9 w-9 sm:hidden cursor-pointer"
						>
							<img src={langIcon} alt="Language" className="h-6 w-6" />
						</Button>
					</LanguageSelectionDropdown>

					<Button 
						variant="ghost" 
						size="icon" 
						className="h-10 w-10 text-muted-foreground cursor-pointer hover:bg-[#C1FDD6]"
						onClick={onOpenSettings}
					>
						<img src={settingsIcon} alt="Settings" className="h-7 w-7 text-[#019444]" />
					</Button>
				</div>
			</div>
		</header>
	);
}
