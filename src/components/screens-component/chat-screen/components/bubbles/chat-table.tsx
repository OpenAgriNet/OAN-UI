import { useEffect, useRef, useState, type ComponentProps } from "react";
import type { Element } from "hast";
import { cn } from "@/lib/utils";

/** Tables up to this many columns fit the bubble and wrap; wider ones scroll sideways. */
const MAX_FIT_COLUMNS = 2;

type ChatTableProps = ComponentProps<"table"> & { node?: Element };

/**
 * Markdown table for assistant bubbles (columns and numeric cells are annotated by
 * `rehypeChatTables`).
 *
 * Narrow tables stretch to the bubble width. Wider tables keep each column at its natural width
 * on phones (capped, so long text wraps to a few lines instead of squeezing every column) and scroll inside
 * the bubble, with the first column pinned so the row label stays visible. A fade on the right edge
 * shows there is more to scroll to.
 */
export function ChatTable({ node, className, ...props }: ChatTableProps) {
	const scrollerRef = useRef<HTMLDivElement>(null);
	const [edges, setEdges] = useState({ left: false, right: false });
	const scrolls = Number(node?.properties.dataColumns ?? 0) > MAX_FIT_COLUMNS;

	useEffect(() => {
		const el = scrollerRef.current;
		if (!el) return;
		const update = () =>
			setEdges({
				left: el.scrollLeft > 1,
				right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1
			});
		update();
		el.addEventListener("scroll", update, { passive: true });
		const observer = new ResizeObserver(update);
		observer.observe(el);
		if (el.firstElementChild) observer.observe(el.firstElementChild);
		return () => {
			el.removeEventListener("scroll", update);
			observer.disconnect();
		};
	}, []);

	return (
		<div className="relative my-2 overflow-hidden rounded-lg border border-[#E5E7EB]">
			<div ref={scrollerRef} className="overflow-x-auto overscroll-x-contain">
				<table
					data-scrolled={edges.left || undefined}
					className={cn(
						"border-collapse text-sm",
						scrolls
							? [
								"w-max min-w-full sm:w-full",
								"[&_:is(th,td)>div]:max-w-[13rem] [&_tr>:first-child>div]:max-w-[7.5rem]",
								"[&_tr>:first-child]:sticky [&_tr>:first-child]:left-0 [&_tr>:first-child]:z-[1]",
								"[&_tr>:first-child]:shadow-[1px_0_0_#E5E7EB]",
								"data-[scrolled]:[&_tr>:first-child]:shadow-[1px_0_0_#E5E7EB,6px_0_10px_-6px_rgba(0,0,0,0.25)]"
							]
							: "w-full",
						className
					)}
					{...props}
				/>
			</div>
			{edges.right ? (
				<div
					aria-hidden
					className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent"
				/>
			) : null}
		</div>
	);
}

type CellProps<T extends "th" | "td"> = ComponentProps<T> & { node?: Element };

// Cell content sits in a div so the scrolling layout can cap column width: browsers ignore
// max-width on the table cells themselves.
export function ChatTableHeaderCell({ node, children, className, ...props }: CellProps<"th">) {
	return (
		<th
			className={cn(
				"bg-[#F9FAFB] px-3 py-2 text-left align-bottom text-xs font-semibold tracking-wide text-[#111827]",
				// a long header ("Modal Price (Rs./Qtl)") wraps rather than widening a column of short numbers
				"data-[numeric]:text-right data-[numeric]:[&>div]:ml-auto data-[numeric]:[&>div]:max-w-[7rem]",
				className
			)}
			{...props}
		>
			<div>{children}</div>
		</th>
	);
}

export function ChatTableCell({ node, children, className, ...props }: CellProps<"td">) {
	return (
		<td
			className={cn(
				"bg-white px-3 py-2 align-top text-sm text-[#111827]",
				"data-[numeric]:whitespace-nowrap data-[numeric]:text-right data-[numeric]:tabular-nums",
				className
			)}
			{...props}
		>
			<div>{children}</div>
		</td>
	);
}
