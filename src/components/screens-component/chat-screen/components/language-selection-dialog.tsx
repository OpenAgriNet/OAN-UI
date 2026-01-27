import { useState } from "react";
import { cn } from "@/lib/utils";
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover";
import { LANGUAGES } from "../config";
import { useLanguage } from "@/components/LanguageProvider";

type LanguageSelectionDropdownProps = {
	children: React.ReactNode;
};

export function LanguageSelectionDropdown({
	children
}: LanguageSelectionDropdownProps) {
	const { language: selectedLanguage, setLanguage } = useLanguage();
	const [open, setOpen] = useState(false);

	const handleLanguageSelect = (code: any) => {
		setLanguage(code);
		setOpen(false);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				{children}
			</PopoverTrigger>
			<PopoverContent 
				className="w-[200px] p-0 rounded-2xl border border-gray-100 overflow-hidden shadow-xl"
				align="end"
				sideOffset={8}
			>
				<div className="bg-white flex flex-col">
					{Object.values(LANGUAGES).map((language) => {
						const isActive = selectedLanguage === language.code;
						return (
							<button
								key={language.code}
								onClick={() => handleLanguageSelect(language.code)}
								className={cn(
									"w-full flex items-center px-5 py-3.5 transition-colors text-left cursor-pointer",
									isActive 
										? "bg-[#FEF2B2] text-gray-900 font-bold" 
										: "bg-white text-gray-800 font-medium hover:bg-gray-50"
								)}
							>
								<span className="text-sm font-medium">
									{language.nativeName}
								</span>
							</button>
						);
					})}
				</div>
			</PopoverContent>
		</Popover>
	);
}
