import { MapPin, CloudRain, Sprout, Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/LanguageProvider";

type LocationPermissionDialogProps = {
	onAllow: () => void;
	onDismiss: () => void;
};

export function LocationPermissionDialog({ onAllow, onDismiss }: LocationPermissionDialogProps) {
	const { t } = useLanguage();

	const benefits = [
		{ icon: CloudRain, text: t("locationPermission.benefit1") as string },
		{ icon: Sprout,    text: t("locationPermission.benefit2") as string },
		{ icon: Bell,      text: t("locationPermission.benefit3") as string },
	];

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
				onClick={onDismiss}
				aria-hidden
			/>

			{/* Card */}
			<div className="relative z-10 w-full max-w-sm animate-in fade-in zoom-in-95 duration-300 rounded-3xl bg-white dark:bg-[var(--background-dark)] shadow-2xl overflow-hidden">

				{/* Dismiss button */}
				<button
					type="button"
					onClick={onDismiss}
					aria-label="Dismiss"
					className="absolute top-4 right-4 z-10 h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
				>
					<X className="h-4 w-4" />
				</button>

				{/* Top accent bar */}
				<div className="h-1 w-full bg-gradient-to-r from-[var(--primary)] to-indigo-400" />

				<div className="px-6 pb-7 pt-6">
					{/* Icon */}
					<div className="flex justify-center mb-5">
						<div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/50">
							<div className="absolute inset-0 rounded-full bg-indigo-100/60 dark:bg-indigo-900/40 animate-ping opacity-40" />
							<MapPin className="h-9 w-9 text-[var(--primary)]" strokeWidth={1.8} />
						</div>
					</div>

					{/* Title & subtitle */}
					<div className="text-center mb-6">
						<h2 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">
							{t("locationPermission.title") as string}
						</h2>
						<p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed px-2">
							{t("locationPermission.subtitle") as string}
						</p>
					</div>

					{/* Benefits */}
					<ul className="mb-7 space-y-3">
						{benefits.map(({ icon: Icon, text }) => (
							<li key={text} className="flex items-center gap-3">
								<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/50">
									<Icon className="h-4 w-4 text-[var(--primary)]" strokeWidth={1.8} />
								</span>
								<span className="text-sm text-gray-700 dark:text-gray-300">{text}</span>
							</li>
						))}
					</ul>

					{/* Actions */}
					<Button
						className="h-12 w-full rounded-2xl bg-[var(--primary)] text-white font-semibold text-sm hover:bg-[var(--primary)]/90 transition-colors"
						onClick={onAllow}
					>
						<MapPin className="mr-2 h-4 w-4" />
						{t("locationPermission.allowBtn") as string}
					</Button>

					<button
						type="button"
						onClick={onDismiss}
						className="mt-3 w-full py-2 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
					>
						{t("locationPermission.skipBtn") as string}
					</button>
				</div>
			</div>
		</div>
	);
}
