import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/LanguageProvider";

const agristackBanner = "/assets/connect-agri.webp";

type AgriStackCardProps = {
	onConnect: () => void;
};

/**
 * Promo card shown on the welcome screen while the farmer has not linked
 * their AgriStack profile. The artwork is the full card background, with the
 * copy laid over the empty space on its left.
 */
export function AgriStackCard({ onConnect }: AgriStackCardProps) {
	const { t } = useLanguage();

	return (
		<section
			className="relative w-full overflow-hidden rounded-2xl bg-[#EDE9FE] bg-cover bg-right bg-no-repeat dark:bg-[#1E1B4B]"
			style={{ backgroundImage: `url(${agristackBanner})` }}
			aria-label={String(t("agristack.title"))}
		>
			{/* Keeps the copy readable over the artwork on narrow widths, where the
			    illustration creeps further left than it does on the design. */}
			<div className="bg-gradient-to-r from-[#EDE9FE] via-[#EDE9FE]/85 to-transparent dark:from-[#1E1B4B] dark:via-[#1E1B4B]/85">
				<div className="max-w-[60%] px-6 py-10 sm:px-8 sm:py-12">
					<h2 className="text-lg font-bold tracking-wide text-gray-900 uppercase sm:text-xl dark:text-white">
						{t("agristack.title")}
					</h2>
					<p className="mt-2 text-sm leading-snug text-gray-700 sm:text-base dark:text-gray-300">
						{t("agristack.subtitle")}
					</p>
					<Button
						className="mt-5 h-auto cursor-pointer gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 sm:text-base"
						onClick={onConnect}
					>
						{t("agristack.cta")}
						<ArrowRight className="size-4" />
					</Button>
				</div>
			</div>
		</section>
	);
}
