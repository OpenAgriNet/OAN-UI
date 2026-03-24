import { AlertTriangle, RefreshCw, X } from "lucide-react";
import { useState } from "react";

interface FarmerAlertProps {
	variant: "warning" | "error";
	message: string;
	actionLabel?: string;
	onAction?: () => void;
	dismissible?: boolean;
}

export function FarmerAlert({
	variant,
	message,
	actionLabel,
	onAction,
	dismissible = true,
}: FarmerAlertProps) {
	const [dismissed, setDismissed] = useState(false);

	if (dismissed) return null;

	const isError = variant === "error";

	return (
		<div
			className={`mx-auto max-w-3xl px-4 py-2 ${
				isError ? "" : ""
			}`}
		>
			<div
				className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm ${
					isError
						? "bg-red-50 border border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200"
						: "bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-200"
				}`}
			>
				<AlertTriangle
					className={`h-4 w-4 shrink-0 ${isError ? "text-red-500" : "text-amber-500"}`}
				/>
				<p className="flex-1 text-sm">{message}</p>
				{actionLabel && onAction && (
					<button
						onClick={onAction}
						className={`flex items-center gap-1 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
							isError
								? "bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-300"
								: "bg-amber-100 hover:bg-amber-200 text-amber-700 dark:bg-amber-900 dark:hover:bg-amber-800 dark:text-amber-300"
						}`}
					>
						<RefreshCw className="h-3 w-3" />
						{actionLabel}
					</button>
				)}
				{dismissible && (
					<button
						onClick={() => setDismissed(true)}
						className="shrink-0 rounded-md p-1 opacity-60 hover:opacity-100 transition-opacity"
					>
						<X className="h-3.5 w-3.5" />
					</button>
				)}
			</div>
		</div>
	);
}
