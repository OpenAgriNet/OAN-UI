import React from "react";
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
	const { language: selectedLanguage } = useLanguage();

	const disabledTrigger = React.isValidElement(children)
		? React.cloneElement(children as React.ReactElement<any>, {
			disabled: true,
			"aria-disabled": true
		})
		: children;

	return (
		<Popover open={false}>
			<PopoverTrigger asChild>
				{disabledTrigger}
			</PopoverTrigger>
			<PopoverContent 
				className="w-[200px] p-0 rounded-2xl border border-gray-100 dark:border-transparent overflow-hidden shadow-xl"
				align="end"
				sideOffset={8}
			>
				<div className="bg-white dark:bg-[#5D5D5D] flex flex-col">
					{Object.values(LANGUAGES).map((language) => {
						const isActive = selectedLanguage === language.code;
						return (
							<button
								key={language.code}
								disabled
								className={cn(
									"w-full flex items-center px-5 py-3.5 transition-colors text-left cursor-not-allowed",
									isActive 
										? "bg-[#FEF2B2] dark:bg-[#EFC300] text-gray-900 font-bold" 
										: "bg-white dark:bg-[#5D5D5D] text-gray-800 dark:text-white font-medium opacity-70"
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
