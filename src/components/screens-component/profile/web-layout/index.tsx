import { useUserProfile } from "@/hooks/apis/profile";
import { Loader2, AlertTriangle, User } from "lucide-react";
import { ProfileDialog } from "../profile-dialog";
import { useState } from "react";

export function ProfileWebLayout() {
	const { data, isLoading } = useUserProfile();
	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<div className="mx-auto max-w-2xl p-6 space-y-6">
			<h1 className="text-2xl font-bold text-foreground">Your Farm Profile</h1>

			{isLoading && (
				<div className="flex items-center justify-center py-12">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
				</div>
			)}

			{!isLoading && data?.status === "ok" && data.farmer && (
				<>
					<button
						type="button"
						className="w-full text-left"
						onClick={() => setDialogOpen(true)}
					>
						<p className="text-sm text-muted-foreground">
							{data.farmer.farmers.length} farm record{data.farmer.farmers.length !== 1 ? "s" : ""} found. Tap to view details.
						</p>
					</button>
					<ProfileDialog open={dialogOpen} onOpenChange={setDialogOpen} />
				</>
			)}

			{!isLoading && data?.status === "not_found" && (
				<div className="flex flex-col items-center gap-3 py-12 text-center">
					<AlertTriangle className="h-10 w-10 text-amber-500" />
					<p className="text-muted-foreground">No farm records found for your account.</p>
				</div>
			)}

			{!isLoading && data?.status === "error" && (
				<div className="flex flex-col items-center gap-3 py-12 text-center">
					<AlertTriangle className="h-10 w-10 text-red-500" />
					<p className="text-muted-foreground">Unable to load farm data. Please try again later.</p>
				</div>
			)}

			{!isLoading && data?.status === "anonymous" && (
				<div className="flex flex-col items-center gap-3 py-12 text-center">
					<User className="h-10 w-10 text-muted-foreground" />
					<p className="text-muted-foreground">Sign in to view your farm profile.</p>
				</div>
			)}
		</div>
	);
}
