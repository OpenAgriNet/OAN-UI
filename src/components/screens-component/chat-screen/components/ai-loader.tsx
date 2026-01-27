import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Lottie from "lottie-react";
import dotLoader from "@/assets/Dot loader.json";
import { useLanguage } from "@/components/LanguageProvider";

interface AILoaderProps {
	className?: string;
}

export function AILoader({ className }: AILoaderProps) {
	const { t } = useLanguage();
	const [messageIndex, setMessageIndex] = useState(0);

	const localizedMessages = t('aiLoaderMessages') as string[];

	useEffect(() => {
		const timers = [
			setTimeout(() => setMessageIndex(1), 3000),
			setTimeout(() => setMessageIndex(2), 6000)
		];

		return () => timers.forEach(clearTimeout);
	}, []);

	return (
		<div className={cn("flex items-center gap-4 py-3 px-2", className)}>
			{/* Lottie Dot Loader */}
			<div className="h-8 w-8 shrink-0">
				<Lottie animationData={dotLoader} loop={true} />
			</div>

			{/* Message */}
			<span className="text-base text-gray-500 font-medium italic">
				{Array.isArray(localizedMessages) ? localizedMessages[messageIndex] : localizedMessages}
			</span>
		</div>
	);
}
