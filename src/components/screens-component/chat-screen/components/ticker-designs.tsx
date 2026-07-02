/**
 * Ticker Feature — BharatVistaar Homepage Announcement Banners
 *
 * Controlled by VITE_UI_TICKER in .env  (values: 1 | 2 | 3 | 4)
 *
 * Variant 1 placement: Below the ChatHeader (full-width persistent strip)
 * Variants 2-4 placement: Welcome panel, between avatar & quick-action cards
 *
 * All text and announcement content is fully localised via useLanguage().
 */

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Zap, IndianRupee, CalendarDays, ChevronRight as ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { env } from "@/config/env";
import { useLanguage } from "@/components/LanguageProvider";

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = "feature" | "payment" | "event";

export interface Announcement {
	id: string;
	category: Category;
	titleKey: string;
	bodyKey?: string;
	date: string;
	isNew?: boolean;
}

// ─── Static announcement list (titles/bodies resolved via t() at render time) ─

export const ANNOUNCEMENTS: Announcement[] = [
	{ id: "1", category: "payment", titleKey: "ticker.sample.1_title", bodyKey: "ticker.sample.1_body", date: "Jun 18, 2025", isNew: true },
	{ id: "2", category: "feature", titleKey: "ticker.sample.2_title", bodyKey: "ticker.sample.2_body", date: "Jun 15, 2025", isNew: true },
	{ id: "3", category: "event",   titleKey: "ticker.sample.3_title", bodyKey: "ticker.sample.3_body", date: "Jun 25, 2025" },
	{ id: "4", category: "feature", titleKey: "ticker.sample.4_title", date: "Jun 10, 2025" },
];

// Keep the old export name working for any imports that used it
export const SAMPLE_ANNOUNCEMENTS = ANNOUNCEMENTS;

// ─── Category meta (icon component — not localised) ────────────────────────

const META: Record<Category, {
	labelKey: string;
	text: string;
	bg: string;
	border: string;
	leftBorder: string;
	icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}> = {
	payment: {
		labelKey: "ticker.labels.payment",
		text: "text-emerald-700 dark:text-emerald-300",
		bg: "bg-emerald-50 dark:bg-emerald-900/20",
		border: "border-emerald-200 dark:border-emerald-800",
		leftBorder: "border-l-emerald-500",
		icon: IndianRupee,
	},
	feature: {
		labelKey: "ticker.labels.feature",
		text: "text-blue-700 dark:text-blue-300",
		bg: "bg-blue-50 dark:bg-blue-900/20",
		border: "border-blue-200 dark:border-blue-800",
		leftBorder: "border-l-blue-500",
		icon: Zap,
	},
	event: {
		labelKey: "ticker.labels.event",
		text: "text-amber-700 dark:text-amber-300",
		bg: "bg-amber-50 dark:bg-amber-900/20",
		border: "border-amber-200 dark:border-amber-800",
		leftBorder: "border-l-amber-500",
		icon: CalendarDays,
	},
};

// ─────────────────────────────────────────────────────────────────────────────
//  VARIANT 1 — Scrolling News Ticker Strip
// ─────────────────────────────────────────────────────────────────────────────

interface TickerVariant1Props {
	announcements?: Announcement[];
	inLayout?: boolean;
}

export function TickerVariant1({ announcements = ANNOUNCEMENTS, inLayout = false }: TickerVariant1Props) {
	const { t } = useLanguage();
	const [dismissed, setDismissed] = useState(false);
	if (dismissed) return null;

	const scrollText = announcements
		.map((a) => {
			const emoji = a.category === "payment" ? "💰" : a.category === "feature" ? "✨" : "📅";
			return `${emoji}  ${t(a.titleKey) as string}`;
		})
		.join("          •          ");

	if (inLayout) {
		return (
			<div className="relative flex w-full items-center gap-0 overflow-hidden border-b border-[var(--primary)]/15 bg-[var(--primary)]/6 dark:bg-[var(--primary)]/12">
				<span className="flex shrink-0 items-center gap-1.5 border-r border-[var(--primary)]/15 bg-[var(--primary)] px-3 py-1.5 text-[10px] font-bold tracking-wider text-white">
					<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
					{t("ticker.live") as string}
				</span>
				<div className="min-w-0 flex-1 overflow-hidden px-3 py-1.5">
					<span className="ticker-v1-layout inline-block whitespace-nowrap text-[13px] font-medium text-[var(--primary)] dark:text-blue-200">
						{scrollText}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{scrollText}
					</span>
				</div>
				<button
					onClick={() => setDismissed(true)}
					aria-label={t("ticker.dismiss") as string}
					className="shrink-0 border-l border-[var(--primary)]/15 px-3 py-1.5 text-[var(--primary)]/40 transition hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]"
				>
					<X className="h-3.5 w-3.5" />
				</button>
				<style>{`
					@keyframes ticker-v1-layout-scroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
					.ticker-v1-layout { animation: ticker-v1-layout-scroll 38s linear infinite; }
					.ticker-v1-layout:hover { animation-play-state: paused; }
				`}</style>
			</div>
		);
	}

	return (
		<div className="mb-5 flex w-full max-w-2xl items-center gap-2 overflow-hidden rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 px-3 py-2.5 dark:border-[var(--primary)]/30 dark:bg-[var(--primary)]/10">
			<span className="flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--primary)] px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-white">
				<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
				{t("ticker.live") as string}
			</span>
			<div className="min-w-0 flex-1 overflow-hidden">
				<span className="ticker-v1 inline-block whitespace-nowrap text-sm font-medium text-[var(--primary)] dark:text-blue-200">
					{scrollText}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{scrollText}
				</span>
			</div>
			<button onClick={() => setDismissed(true)} aria-label={t("ticker.dismiss") as string}
				className="shrink-0 rounded-full p-1 text-[var(--primary)]/40 transition hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]">
				<X className="h-3.5 w-3.5" />
			</button>
			<style>{`
				@keyframes ticker-v1-scroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
				.ticker-v1 { animation: ticker-v1-scroll 36s linear infinite; }
				.ticker-v1:hover { animation-play-state: paused; }
			`}</style>
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
//  VARIANT 2 — Pinned Banner Card
// ─────────────────────────────────────────────────────────────────────────────

export function TickerVariant2({ announcements = ANNOUNCEMENTS }: { announcements?: Announcement[] }) {
	const { t } = useLanguage();
	const [dismissed, setDismissed] = useState(false);
	const [idx, setIdx] = useState(0);
	if (dismissed || !announcements.length) return null;

	const ann = announcements[idx]!;
	const meta = META[ann.category];
	const Icon = meta.icon;
	const prev = () => setIdx((i) => (i - 1 + announcements.length) % announcements.length);
	const next = () => setIdx((i) => (i + 1) % announcements.length);

	return (
		<div className={cn("mb-5 w-full max-w-2xl rounded-xl border-l-4 p-4 shadow-sm", meta.leftBorder, meta.bg, meta.border)}>
			<div className="mb-2 flex items-start justify-between gap-2">
				<div className="flex items-center gap-2">
					<span className={cn("flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-bold tracking-wider dark:bg-black/20", meta.text)}>
						<Icon className="h-3 w-3" />
						{t(meta.labelKey) as string}
					</span>
					{ann.isNew && (
						<span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white">{t("ticker.new") as string}</span>
					)}
				</div>
				<button onClick={() => setDismissed(true)} aria-label={t("ticker.dismiss") as string}
					className="shrink-0 rounded-full p-1 text-gray-400 transition hover:bg-gray-200/60 hover:text-gray-600 dark:hover:bg-white/10">
					<X className="h-3.5 w-3.5" />
				</button>
			</div>

			<p className="text-sm font-semibold leading-snug text-gray-900 dark:text-white">{t(ann.titleKey) as string}</p>
			{ann.bodyKey && <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">{t(ann.bodyKey) as string}</p>}
			<p className={cn("mt-2 text-[11px] font-bold", meta.text)}>{ann.date}</p>

			{announcements.length > 1 && (
				<div className="mt-3 flex items-center justify-between">
					<div className="flex gap-1.5">
						{announcements.map((_, i) => (
							<button key={i} onClick={() => setIdx(i)}
								className={cn("h-1.5 rounded-full transition-all", i === idx ? "w-4 bg-[var(--primary)]" : "w-1.5 bg-gray-300 dark:bg-gray-600")} />
						))}
					</div>
					<div className="flex gap-1">
						<button onClick={prev} className="rounded-full p-1 text-gray-400 transition hover:bg-gray-200/60 dark:hover:bg-white/10">
							<ChevronLeft className="h-4 w-4" />
						</button>
						<button onClick={next} className="rounded-full p-1 text-gray-400 transition hover:bg-gray-200/60 dark:hover:bg-white/10">
							<ChevronRight className="h-4 w-4" />
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
//  VARIANT 3 — Smart Alert Feed
//
//  Category filter tabs (All / Payment / Feature / Event) with item counts.
//  Tap a row to expand its body inline. Unread dot + NEW badge. Dismissable.
// ─────────────────────────────────────────────────────────────────────────────

type TabFilter = "all" | Category;

const ALERT_COLORS: Record<Category, { bar: string; iconBg: string; iconText: string; badge: string; badgeText: string }> = {
	payment: { bar: "#10b981", iconBg: "#ecfdf5", iconText: "#065f46", badge: "#d1fae5", badgeText: "#065f46" },
	feature: { bar: "#3b82f6", iconBg: "#eff6ff", iconText: "#1e3a8a", badge: "#dbeafe", badgeText: "#1e3a8a" },
	event:   { bar: "#f59e0b", iconBg: "#fffbeb", iconText: "#92400e", badge: "#fef3c7", badgeText: "#92400e" },
};

export function TickerVariant3({ announcements = ANNOUNCEMENTS }: { announcements?: Announcement[] }) {
	const { t } = useLanguage();
	const [activeTab, setActiveTab] = useState<TabFilter>("all");
	const [expandedId, setExpandedId] = useState<string | null>(null);
	// Use a plain string[] so React always detects the state change
	const [readIds, setReadIds] = useState<string[]>([]);
	const [dismissed, setDismissed] = useState(false);

	if (dismissed || !announcements.length) return null;

	const TAB_CONFIG: { id: TabFilter; label: string; emoji: string }[] = [
		{ id: "all",     label: t("ticker.tabs.all") as string,     emoji: "🔔" },
		{ id: "payment", label: t("ticker.tabs.payment") as string, emoji: "💰" },
		{ id: "feature", label: t("ticker.tabs.feature") as string, emoji: "✨" },
		{ id: "event",   label: t("ticker.tabs.event") as string,   emoji: "📅" },
	];

	const filtered = activeTab === "all" ? announcements : announcements.filter((a) => a.category === activeTab);
	// Count unread items in the currently active tab only
	const unreadCount = filtered.filter((a) => !readIds.includes(a.id)).length;

	const handleRowClick = (id: string) => {
		// Toggle expand; mark as read with a new array reference so React re-renders reliably
		setExpandedId((prev) => (prev === id ? null : id));
		setReadIds((prev) => prev.includes(id) ? prev : [...prev, id]);
	};

	const unreadLabel = unreadCount === 1
		? (t("ticker.unread_one") as string).replace("[count]", String(unreadCount))
		: (t("ticker.unread_many") as string).replace("[count]", String(unreadCount));

	return (
		<div className="mb-5 w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md dark:border-white/10 dark:bg-[#1a1a2e]">

			{/* Header */}
			<div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-white/10">
				<div className="flex items-center gap-2">
					<span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary)] text-xs text-white">🔔</span>
					<span className="text-sm font-bold text-gray-800 dark:text-white">{t("ticker.announcements") as string}</span>
					{unreadCount > 0 && (
						<span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
							{unreadCount}
						</span>
					)}
				</div>
				<button
					onClick={() => setDismissed(true)}
					className="rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/10"
					aria-label={t("ticker.dismiss") as string}
				>
					<X className="h-3.5 w-3.5" />
				</button>
			</div>

			{/* Filter tabs */}
			<div className="flex border-b border-gray-100 dark:border-white/10">
				{TAB_CONFIG.map((tab) => {
					const count = tab.id === "all" ? announcements.length : announcements.filter((a) => a.category === tab.id).length;
					const isActive = activeTab === tab.id;
					return (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={cn(
								"relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold transition-colors",
								isActive ? "text-[var(--primary)]" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
							)}
						>
							<span>{tab.emoji} {tab.label}</span>
							<span className={cn(
								"rounded-full px-1.5 py-px text-[9px] font-bold",
								isActive ? "bg-[var(--primary)] text-white" : "bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400"
							)}>{count}</span>
							{isActive && <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[var(--primary)]" />}
						</button>
					);
				})}
			</div>

			{/* Alert rows */}
			<div className="divide-y divide-gray-50 dark:divide-white/5">
				{filtered.length === 0 ? (
					<p className="py-6 text-center text-xs text-gray-400">{t("ticker.empty") as string}</p>
				) : (
					filtered.map((ann) => {
						const ac = ALERT_COLORS[ann.category];
						const meta = META[ann.category];
						const Icon = meta.icon;
						const isExpanded = expandedId === ann.id;
						const isRead = readIds.includes(ann.id);

						return (
							<button
								key={ann.id}
								onClick={() => handleRowClick(ann.id)}
								className="w-full text-left transition-colors hover:bg-gray-50 dark:hover:bg-white/5 focus:outline-none"
							>
								<div className="flex items-start gap-3 px-4 py-3">
									<div className="mt-0.5 w-1 self-stretch rounded-full shrink-0" style={{ background: ac.bar, minHeight: "36px" }} />
									<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl" style={{ background: ac.iconBg }}>
										<Icon className="h-4 w-4" style={{ color: ac.iconText }} />
									</div>
									<div className="min-w-0 flex-1">
										<div className="flex items-center gap-1.5 flex-wrap">
											<span className="rounded-full px-2 py-px text-[9px] font-bold tracking-wide" style={{ background: ac.badge, color: ac.badgeText }}>
												{t(meta.labelKey) as string}
											</span>
											{ann.isNew && !isRead && (
												<span className="animate-pulse rounded-full bg-red-500 px-1.5 py-px text-[9px] font-bold text-white">
													{t("ticker.new") as string}
												</span>
											)}
											{!isRead && <span className="ml-auto h-2 w-2 rounded-full shrink-0" style={{ background: ac.bar }} />}
										</div>
										<p className={cn("mt-1 text-xs font-semibold leading-snug", isRead ? "text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-white")}>
											{t(ann.titleKey) as string}
										</p>
										{isExpanded && ann.bodyKey && (
											<p className="mt-1.5 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
												{t(ann.bodyKey) as string}
											</p>
										)}
										<p className="mt-1 text-[10px] text-gray-400">{ann.date}</p>
									</div>
									<ChevronDown className={cn("mt-1 h-3.5 w-3.5 shrink-0 text-gray-300 transition-transform duration-200", isExpanded && "rotate-90")} />
								</div>
							</button>
						);
					})
				)}
			</div>

			{/* Footer */}
			<div className="border-t border-gray-100 px-4 py-2 dark:border-white/10">
				<p className="text-center text-[10px] text-gray-400">
					{unreadCount > 0 ? unreadLabel : t("ticker.allCaughtUp") as string}
				</p>
			</div>
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
//  VARIANT 4 — Auto-rotating Carousel Card
// ─────────────────────────────────────────────────────────────────────────────

export function TickerVariant4({ announcements = ANNOUNCEMENTS }: { announcements?: Announcement[] }) {
	const { t } = useLanguage();
	const [idx, setIdx] = useState(0);
	const [paused, setPaused] = useState(false);
	const [dismissed, setDismissed] = useState(false);

	useEffect(() => {
		if (paused || dismissed || !announcements.length) return;
		const timer = setInterval(() => setIdx((i) => (i + 1) % announcements.length), 4000);
		return () => clearInterval(timer);
	}, [paused, dismissed, announcements.length]);

	if (dismissed || !announcements.length) return null;

	const ann = announcements[idx]!;
	const meta = META[ann.category];
	const Icon = meta.icon;

	return (
		<div className="mb-5 w-full max-w-2xl" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
			<div className={cn("relative flex items-start gap-3 rounded-2xl border p-4 shadow-sm transition-all duration-500", meta.bg, meta.border)}>
				<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/70 shadow-sm dark:bg-black/20">
					<Icon className={cn("h-5 w-5", meta.text)} />
				</div>
				<div className="min-w-0 flex-1">
					<div className="mb-1 flex flex-wrap items-center gap-1.5">
						<span className={cn("rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-bold tracking-wider dark:bg-black/20", meta.text)}>
							{t(meta.labelKey) as string}
						</span>
						{ann.isNew && (
							<span className="animate-pulse rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
								{t("ticker.new") as string}
							</span>
						)}
					</div>
					<p className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900 dark:text-white">{t(ann.titleKey) as string}</p>
					<p className={cn("mt-1 text-[11px] font-bold", meta.text)}>{ann.date}</p>
				</div>
				<button onClick={() => setDismissed(true)} aria-label={t("ticker.dismiss") as string}
					className="shrink-0 rounded-full p-1 text-gray-500/60 transition hover:bg-white/50 dark:hover:bg-black/20">
					<X className="h-3.5 w-3.5" />
				</button>
			</div>
			<div className="mt-2 flex justify-center gap-1.5">
				{announcements.map((_, i) => (
					<button key={i} onClick={() => setIdx(i)}
						className={cn("h-1.5 rounded-full transition-all duration-300", i === idx ? "w-5 bg-[var(--primary)]" : "w-1.5 bg-gray-300 dark:bg-gray-600")} />
				))}
			</div>
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
//  TickerBanner — master switch, reads VITE_UI_TICKER from env
// ─────────────────────────────────────────────────────────────────────────────

interface TickerBannerProps {
	variant?: 1 | 2 | 3 | 4;
	announcements?: Announcement[];
}

export function TickerBanner({ variant, announcements }: TickerBannerProps) {
	const v = variant ?? env.uiTicker;
	const props = { announcements };

	if (v === 1) return <TickerVariant1 {...props} />;
	if (v === 2) return <TickerVariant2 {...props} />;
	if (v === 3) return <TickerVariant3 {...props} />;
	if (v === 4) return <TickerVariant4 {...props} />;

	return null;
}
