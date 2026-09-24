import { Info, MapPin, Users } from "lucide-react";

import { useLanguage } from "@/components/LanguageProvider";

const connectedIllustration = "/assets/agristack-connected.webp";

type AgriStackProfileCardProps = {
	farmerName?: string;
	village?: string;
};

/**
 * Shown on the welcome screen once the farmer's AgriStack profile is linked:
 * confirmation, the details we hold, and why we hold them.
 */
export function AgriStackProfileCard({ farmerName, village }: AgriStackProfileCardProps) {
	const { t } = useLanguage();

	const rows = [
		{ key: "farmerName", icon: Users, label: t("agristack.connected.farmerName"), value: farmerName },
		{ key: "village", icon: MapPin, label: t("agristack.connected.village"), value: village }
	].filter((row) => Boolean(row.value));

	return (
		<div className="flex w-full max-w-2xl flex-col gap-5">
			{/* Confirmation */}
			<section className="flex items-end gap-4 overflow-hidden rounded-2xl bg-[#EDE9FE] pl-4 sm:gap-6 sm:pl-6 dark:bg-[#FFFFFF0D]">
				<img
					src={connectedIllustration}
					alt=""
					aria-hidden="true"
					className="hidden h-32 w-auto shrink-0 self-end object-contain object-bottom sm:block sm:h-40"
				/>
				<div className="py-4 pr-4 sm:py-6 sm:pr-6">
					<h2 className="text-lg font-bold text-gray-900 sm:text-xl dark:text-white">
						{t("agristack.connected.title")}{" "}
						<span className="text-[#16A34A]">{t("agristack.connected.titleHighlight")}</span>
					</h2>
					<p className="mt-1.5 text-sm leading-snug text-gray-700 dark:text-gray-300">
						{t("agristack.connected.subtitle")}
					</p>
				</div>
			</section>

			{/* Profile details */}
			{rows.length > 0 && (
				<div>
					<h3 className="mb-2 text-base font-semibold text-[var(--primary)] dark:text-white">
						{t("agristack.connected.profileHeading")}
					</h3>
					<dl className="divide-y divide-gray-100 rounded-2xl bg-[#F7F7FB] px-4 py-1 dark:divide-white/10 dark:bg-[#FFFFFF08]">
						{rows.map(({ key, icon: Icon, label, value }) => (
							<div key={key} className="flex items-center justify-between gap-4 py-3">
								<dt className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
									<Icon className="size-4 text-[var(--primary)] dark:text-gray-300" />
									{label}
								</dt>
								<dd className="text-sm text-gray-700 dark:text-gray-300">{value}</dd>
							</div>
						))}
					</dl>
				</div>
			)}

			{/* Why we hold this */}
			<p className="flex items-start gap-2 rounded-2xl bg-[#EEF0FB] px-4 py-3 text-sm leading-snug text-gray-700 dark:bg-[#FFFFFF08] dark:text-gray-300">
				<Info className="mt-0.5 size-4 shrink-0 text-[var(--primary)] dark:text-gray-300" />
				{t("agristack.connected.consentNote")}
			</p>
		</div>
	);
}
