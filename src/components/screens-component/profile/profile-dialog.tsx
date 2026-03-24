import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { useUserProfile } from "@/hooks/apis/profile";
import { Loader2, AlertTriangle, User, MapPin, Tag } from "lucide-react";
import type { FarmerRecord } from "@/hooks/apis/profile/type";

interface ProfileDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

function FarmerCard({ farmer, index }: { farmer: FarmerRecord; index: number }) {
	return (
		<div className="rounded-lg border border-[#E3E3E3] p-4 space-y-2">
			<div className="flex items-center gap-2">
				<div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
					<User className="h-4 w-4 text-green-700" />
				</div>
				<div className="min-w-0">
					<p className="font-semibold text-foreground truncate">
						{farmer.farmerName || `Farmer ${index + 1}`}
					</p>
					{farmer.farmerCode && (
						<p className="text-xs text-muted-foreground">Code: {farmer.farmerCode}</p>
					)}
				</div>
			</div>

			{farmer.societyName && (
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<MapPin className="h-3.5 w-3.5 shrink-0" />
					<span className="truncate">{farmer.societyName}</span>
				</div>
			)}

			{(farmer.totalAnimals !== undefined && farmer.totalAnimals !== null) && (
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Tag className="h-3.5 w-3.5 shrink-0" />
					<span>{farmer.totalAnimals} animal{farmer.totalAnimals !== 1 ? "s" : ""} registered</span>
				</div>
			)}

			{(farmer.tagNo || farmer.tagNumbers) && (
				<div className="text-xs text-muted-foreground bg-gray-50 dark:bg-gray-900 rounded px-2 py-1">
					Tags: {farmer.tagNo || farmer.tagNumbers}
				</div>
			)}
		</div>
	);
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
	const { data, isLoading } = useUserProfile();

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Your Farm Profile</DialogTitle>
					<DialogDescription>
						Information from your registered farm records
					</DialogDescription>
				</DialogHeader>

				{isLoading && (
					<div className="flex items-center justify-center py-8">
						<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
					</div>
				)}

				{!isLoading && data?.status === "ok" && data.farmer && (
					<div className="space-y-3">
						{data.farmer.farmers.map((farmer, i) => (
							<FarmerCard key={farmer.farmerCode || i} farmer={farmer} index={i} />
						))}
						{data.farmer.fetchedAt && (
							<p className="text-xs text-muted-foreground text-right">
								Last updated: {new Date(data.farmer.fetchedAt).toLocaleDateString()}
							</p>
						)}
					</div>
				)}

				{!isLoading && data?.status === "not_found" && (
					<div className="flex flex-col items-center gap-2 py-6 text-center">
						<AlertTriangle className="h-8 w-8 text-amber-500" />
						<p className="text-sm text-muted-foreground">
							No farm records found for your account.
						</p>
					</div>
				)}

				{!isLoading && data?.status === "error" && (
					<div className="flex flex-col items-center gap-2 py-6 text-center">
						<AlertTriangle className="h-8 w-8 text-red-500" />
						<p className="text-sm text-muted-foreground">
							Unable to load your farm data. Please try again later.
						</p>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
