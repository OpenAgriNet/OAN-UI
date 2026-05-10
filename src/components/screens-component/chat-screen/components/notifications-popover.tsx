import { useCallback, useMemo, useState } from "react";
import { CheckCheck, Cloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useChatStore, type WeatherForecastMatch } from "@/hooks/store/chat";
import { cn } from "@/lib/utils/index";

const bellIcon = "/assets/bell.svg";

function previewMessage(text: string, maxLen = 100): string {
	const line = text.split(/\r?\n/).find((l) => l.trim().length > 0) ?? text;
	const trimmed = line.trim();
	if (trimmed.length <= maxLen) return trimmed;
	return `${trimmed.slice(0, maxLen - 1)}…`;
}

export function NotificationsPopover() {
	const weatherForecastMatches = useChatStore((s) => s.weatherForecastMatches);
	const [popoverOpen, setPopoverOpen] = useState(false);
	const [detailOpen, setDetailOpen] = useState(false);
	const [selected, setSelected] = useState<WeatherForecastMatch | null>(null);
	const [readIds, setReadIds] = useState<Set<string>>(() => new Set());

	const idOf = useCallback((m: WeatherForecastMatch) => String(m.unique_id_pm_kisan), []);

	const unreadCount = useMemo(() => {
		return weatherForecastMatches.filter((m) => !readIds.has(idOf(m))).length;
	}, [weatherForecastMatches, readIds, idOf]);

	const openDetail = useCallback(
		(m: WeatherForecastMatch) => {
			setSelected(m);
			setReadIds((prev) => new Set(prev).add(idOf(m)));
			setPopoverOpen(false);
			setDetailOpen(true);
		},
		 [idOf]
	);

	const markAllRead = useCallback(() => {
		setReadIds(
			new Set(weatherForecastMatches.map((m) => idOf(m)))
		);
	}, [weatherForecastMatches, idOf]);

	const showOutsideCoverageHint = useMemo(
		() => weatherForecastMatches.some((m) => !m.isWithinSearchRadius),
		[weatherForecastMatches]
	);

	return (
		<>
			<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="h-10 w-10 text-muted-foreground cursor-pointer hover:bg-[var(--secondary)] relative"
						aria-label="Notifications"
					>
						<img src={bellIcon} alt="" className="h-6 w-6" aria-hidden />
						{unreadCount > 0 && (
							<span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" aria-hidden />
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent
					align="end"
					side="bottom"
					sideOffset={8}
					className="z-[60] w-[min(calc(100vw-1rem),22rem)] p-0 shadow-lg border border-gray-200 dark:border-[var(--border-dark)] bg-white dark:bg-[var(--background-dark)]"
				>
					<div className="flex items-center gap-2 border-b border-gray-200 px-3 py-2 dark:border-[var(--border-dark)]">
						<img src={bellIcon} alt="" className="h-4 w-4 shrink-0" aria-hidden />
						<h2 className="text-sm font-bold text-gray-900 dark:text-[var(--headerText-dark)]">
							Notifications
						</h2>
						{unreadCount > 0 && (
							<span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold leading-none text-white">
								{unreadCount}
							</span>
						)}
					</div>

					{showOutsideCoverageHint && (
						<p className="border-b border-amber-200/80 bg-amber-50 px-3 py-1.5 text-[10px] leading-snug text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100">
							No weather cells within 75 km. PxD data in this file covers about 17°–33°N. Showing the nearest
							forecasts (by distance), not your exact coordinates.
						</p>
					)}

					<div className="max-h-[min(52vh,16rem)] overflow-y-auto px-2 py-1.5">
						{weatherForecastMatches.length > 0 ? (
							<div className="flex flex-col gap-1">
								{weatherForecastMatches.map((m) => {
									const nid = idOf(m);
									const read = readIds.has(nid);
									return (
										<button
											key={nid}
											type="button"
											onClick={() => openDetail(m)}
											className={`flex w-full cursor-pointer items-start gap-1.5 rounded-md border px-2 py-1.5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/40 ${
												read
													? "border-gray-200 bg-gray-50/30 dark:border-[var(--border-dark)] dark:bg-transparent"
													: "border-[var(--primary)]/35 bg-indigo-50/40 dark:border-[var(--primary)]/35 dark:bg-indigo-900/15"
											}`}
										>
											<Cloud className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--primary)]" aria-hidden />
											<div className="min-w-0 flex-1">
												<div className="flex items-start justify-between gap-1">
													<p className="text-[11px] font-bold leading-tight text-gray-900 dark:text-gray-100">
														{m.subdistrict_name}
														<span className="font-normal text-gray-500 dark:text-gray-400">
															{" "}
															· {m.district_name}
														</span>
													</p>
													{read && <CheckCheck className="h-3 w-3 shrink-0 text-gray-400" aria-hidden />}
												</div>
												<p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-gray-600 dark:text-gray-400">
													{previewMessage(m.forecast_message, 120)}
												</p>
												<p className="mt-0.5 text-[9px] text-gray-400 dark:text-gray-500">
													{m.isWithinSearchRadius ? (
														<>~{m.distanceKm.toFixed(1)} km away</>
													) : (
														<>Nearest cell · ~{m.distanceKm.toFixed(0)} km</>
													)}
												</p>
											</div>
										</button>
									);
								})}
							</div>
						) : (
							<div className="flex flex-col items-center justify-center py-6 text-center">
								<img src={bellIcon} alt="" className="h-10 w-10 opacity-30" aria-hidden />
								<p className="mt-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
									No weather notifications yet
								</p>
								<p className="mt-1 px-2 text-[10px] leading-snug text-gray-400 dark:text-gray-500">
									Allow location access to load rainfall season estimates for your area from PxD weather
									data.
								</p>
							</div>
						)}
					</div>

					{weatherForecastMatches.length > 0 && unreadCount > 0 && (
						<div className="border-t border-gray-100 px-2 py-1.5 dark:border-gray-800">
							<Button
								variant="outline"
								size="sm"
								className="h-7 w-full rounded-full text-[10px]"
								onClick={markAllRead}
							>
								<CheckCheck className="mr-1.5 h-3 w-3" />
								Mark all as read
							</Button>
						</div>
					)}
				</PopoverContent>
			</Popover>

			<Sheet
				open={detailOpen}
				onOpenChange={(open) => {
					setDetailOpen(open);
					if (!open) setSelected(null);
				}}
			>
				<SheetContent
					side="right"
					className={cn(
						"z-[110] flex h-full max-h-dvh flex-col gap-0 overflow-hidden p-0",
						"w-[min(22rem,calc(100vw-2.5rem))] max-w-[min(22rem,calc(100vw-2.5rem))]",
						"rounded-l-2xl border-l border-gray-200 bg-white shadow-[-8px_0_32px_rgba(15,23,42,0.12)]",
						"dark:border-[var(--border-dark)] dark:bg-[var(--background-dark)]"
					)}
				>
					{selected && (
						<>
							<SheetHeader className="shrink-0 space-y-0 border-b border-gray-200 bg-white px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] dark:border-[var(--border-dark)] dark:bg-[var(--headerBg-dark)]">
								<div className="flex items-start justify-between gap-3">
									<div className="flex min-w-0 flex-1 items-start gap-3">
										<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/50">
											<Cloud className="h-5 w-5 text-[var(--primary)]" aria-hidden />
										</div>
										<div className="min-w-0">
											<SheetTitle className="text-left text-base font-bold leading-snug text-gray-900 dark:text-[var(--headerText-dark)]">
												{selected.subdistrict_name}
											</SheetTitle>
											<SheetDescription className="mt-0.5 text-left text-xs leading-snug text-gray-600 dark:text-gray-400">
												{selected.district_name}, {selected.state_name}
											</SheetDescription>
										</div>
									</div>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="h-9 w-9 shrink-0 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
										onClick={() => setDetailOpen(false)}
										aria-label="Close"
									>
										<X className="h-5 w-5" />
									</Button>
								</div>
							</SheetHeader>

							<div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
								<div className="rounded-xl border border-gray-200 bg-gray-50/90 p-3 dark:border-[var(--border-dark)] dark:bg-gray-900/50">
									<p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
										Location details
									</p>
									<dl className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-xs">
										<div>
											<dt className="text-[10px] font-medium text-gray-500 dark:text-gray-400">Latitude</dt>
											<dd className="mt-0.5 font-mono text-[11px] tabular-nums text-gray-900 dark:text-gray-100">
												{selected.Lat}
											</dd>
										</div>
										<div>
											<dt className="text-[10px] font-medium text-gray-500 dark:text-gray-400">Longitude</dt>
											<dd className="mt-0.5 font-mono text-[11px] tabular-nums text-gray-900 dark:text-gray-100">
												{selected.Lon}
											</dd>
										</div>
										<div>
											<dt className="text-[10px] font-medium text-gray-500 dark:text-gray-400">Distance</dt>
											<dd className="mt-0.5 font-medium text-gray-900 dark:text-gray-100">
												{selected.distanceKm.toFixed(2)} km
											</dd>
										</div>
										<div>
											<dt className="text-[10px] font-medium text-gray-500 dark:text-gray-400">Template</dt>
											<dd className="mt-0.5 truncate font-mono text-[11px] text-gray-900 dark:text-gray-100">
												{selected.template_abbreviation}
											</dd>
										</div>
									</dl>
								</div>

								{!selected.isWithinSearchRadius && (
									<div
										className="mt-3 rounded-xl border border-amber-200/90 bg-amber-50 px-3 py-2.5 text-[11px] leading-relaxed text-amber-950 dark:border-amber-800/60 dark:bg-amber-950/35 dark:text-amber-100"
										role="status"
									>
										This forecast is for the nearest available PxD cell (~
										{selected.distanceKm.toFixed(0)} km from you). The bundled dataset does not include
										cells near your latitude.
									</div>
								)}

								<div className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 dark:border-indigo-900/40 dark:bg-indigo-950/25">
									<p className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)]">
										Forecast
									</p>
									<p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-800 dark:text-gray-200">
										{selected.forecast_message}
									</p>
								</div>
							</div>
						</>
					)}
				</SheetContent>
			</Sheet>
		</>
	);
}
