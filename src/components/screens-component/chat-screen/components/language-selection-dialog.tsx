import { useState } from "react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LANGUAGES, type LanguageCode } from "../config";
import { useLanguage } from "@/components/LanguageProvider";

type LanguageSelectionDropdownProps = {
	children: React.ReactNode;
	align?: "start" | "center" | "end";
	languageCodes?: LanguageCode[];
};

export function LanguageSelectionDropdown({
	children,
	align = "end",
	languageCodes
}: LanguageSelectionDropdownProps) {
	const { language: selectedLanguage, setLanguage } = useLanguage();
	const [open, setOpen] = useState(false);
	const languages = languageCodes
		? languageCodes.map((code) => LANGUAGES[code]).filter(Boolean)
		: Object.values(LANGUAGES);

	const handleLanguageSelect = (code: LanguageCode) => {
		setLanguage(code);
		setOpen(false);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent
				className="w-[200px] overflow-hidden rounded-2xl border border-gray-100 p-0 shadow-xl"
				align={align}
				sideOffset={8}
			>
				<div className="flex flex-col bg-white">
					{languages.map((language) => {
						const isActive = selectedLanguage === language.code;
						return (
							<button
								key={language.code}
								onClick={() => handleLanguageSelect(language.code)}
								className={cn(
									"flex w-full cursor-pointer items-center px-5 py-3.5 text-left transition-colors",
									isActive
										? "border-l-[3px] border-[#F65151] bg-[#FFE2E2] font-bold text-gray-900"
										: "border-l-[3px] border-transparent bg-white font-medium text-gray-800 hover:bg-gray-50"
								)}
							>
								<span className="text-sm font-medium">{language.nativeName}</span>
							</button>
						);
					})}
				</div>
			</PopoverContent>
		</Popover>
	);
}
