import { X, Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/LanguageProvider";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const bellIcon = "/assets/bell.svg";

interface NotificationsDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

interface Notification {
	id: string;
	title: string;
	message: string;
	timestamp: string;
	read: boolean;
	type: "info" | "warning" | "success";
}

export function NotificationsDrawer({ open, onOpenChange }: NotificationsDrawerProps) {
	const { t } = useLanguage();
	
	// Sample notifications - this would come from your state management or API
	const notifications: Notification[] = [
		{
			id: "1",
			title: "Welcome to OAN",
			message: "Thank you for using our agricultural assistance platform.",
			timestamp: "2 hours ago",
			read: false,
			type: "info"
		},
		{
			id: "2",
			title: "New Feature Available",
			message: "Check out our new crop recommendation feature.",
			timestamp: "1 day ago",
			read: true,
			type: "success"
		},
		{
			id: "3",
			title: "Weather Alert",
			message: "Heavy rainfall expected in your region this week.",
			timestamp: "2 days ago",
			read: true,
			type: "warning"
		}
	];

	const unreadCount = notifications.filter(n => !n.read).length;

	const getNotificationIcon = (type: Notification["type"]) => {
		switch (type) {
			case "success":
				return "✅";
			case "warning":
				return "⚠️";
			default:
				return "ℹ️";
		}
	};

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				className="flex h-full w-full flex-col border-l border-gray-200 bg-[#f1f3ff] p-0 sm:max-w-[50%] dark:border-[var(--border-dark)] dark:bg-[var(--background-dark)]"
			>
				{/* Header */}
				<div className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-[var(--border-dark)] dark:bg-[var(--headerBg-dark)]">
					<div className="flex items-center gap-3">
						<img src={bellIcon} alt="Notifications" className="h-5 w-5" />
						<h2 className="text-xl font-bold text-gray-900 dark:text-[var(--headerText-dark)]">
							Notifications
						</h2>
						{unreadCount > 0 && (
							<span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
								{unreadCount}
							</span>
						)}
					</div>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => onOpenChange(false)}
						className="h-10 w-10 text-gray-500 hover:bg-indigo-50 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
					>
						<X className="h-6 w-6" />
					</Button>
				</div>

				{/* Notifications List */}
				<div className="flex-1 overflow-y-auto p-6">
					{notifications.length > 0 ? (
						<div className="space-y-3">
							{notifications.map((notification) => (
								<div
									key={notification.id}
									className={`rounded-xl border p-4 transition-all ${
										notification.read
											? "border-gray-200 bg-white dark:border-[var(--border-dark)] dark:bg-[var(--background-dark)]"
											: "border-[var(--primary)]/30 bg-indigo-50/50 dark:border-[var(--primary)]/30 dark:bg-indigo-900/10"
									}`}
								>
									<div className="flex items-start gap-3">
										<span className="text-2xl">{getNotificationIcon(notification.type)}</span>
										<div className="flex-1 space-y-1">
											<div className="flex items-start justify-between gap-2">
												<h3 className="font-bold text-gray-900 dark:text-gray-100">
													{notification.title}
												</h3>
												{notification.read && (
													<CheckCheck className="h-4 w-4 flex-shrink-0 text-gray-400" />
												)}
											</div>
											<p className="text-sm text-gray-600 dark:text-gray-400">
												{notification.message}
											</p>
											<p className="text-xs text-gray-400 dark:text-gray-500">
												{notification.timestamp}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="flex h-full flex-col items-center justify-center text-center">
							<img src={bellIcon} alt="No notifications" className="h-16 w-16 opacity-30" />
							<p className="mt-4 text-lg font-semibold text-gray-500 dark:text-gray-400">
								No notifications yet
							</p>
							<p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
								You'll be notified about important updates here
							</p>
						</div>
					)}
				</div>

				{/* Footer */}
				{notifications.length > 0 && (
					<div className="border-t border-gray-100 bg-gray-50/50 p-6 dark:border-gray-900 dark:bg-gray-900/30">
						<Button
							variant="outline"
							className="w-full rounded-full border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
							onClick={() => {
								// Handle mark all as read
								console.log("Mark all as read");
							}}
						>
							<CheckCheck className="mr-2 h-4 w-4" />
							Mark all as read
						</Button>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}
