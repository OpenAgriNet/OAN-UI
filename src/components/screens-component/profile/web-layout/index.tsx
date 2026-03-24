import { useUserProfile } from "@/hooks/apis/profile";
import { Loader2, AlertTriangle, User, MapPin, Tag } from "lucide-react";
import type { FarmerRecord } from "@/hooks/apis/profile/type";

function FarmerDetailCard({ farmer, index }: { farmer: FarmerRecord; index: number }) {
	return (
		<div className="rounded-lg border border-[#E3E3E3] p-6 space-y-3">
			<div className="flex items-center gap-3">
				<div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
					<User className="h-5 w-5 text-green-700" />
				</div>
				<div className="min-w-0">
					<h3 className="font-semibold text-lg text-foreground truncate">
						{farmer.farmerName || `Farmer ${index + 1}`}
					</h3>
					{farmer.farmerCode && (
						<p className="text-sm text-muted-foreground">Code: {farmer.farmerCode}</p>
					)}
				</div>
			</div>

			{farmer.societyName && (
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<MapPin className="h-4 w-4 shrink-0" />
					<span>{farmer.societyName}</span>
				</div>
			)}

			{(farmer.totalAnimals !== undefined && farmer.totalAnimals !== null) && (
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Tag className="h-4 w-4 shrink-0" />
					<span>{farmer.totalAnimals} animal{farmer.totalAnimals !== 1 ? "s" : ""} registered</span>
				</div>
			)}

			{(farmer.tagNo || farmer.tagNumbers) && (
				<div className="text-sm text-muted-foreground bg-gray-50 dark:bg-gray-900 rounded px-3 py-2">
					<span className="font-medium">Tag Numbers:</span> {farmer.tagNo || farmer.tagNumbers}
				</div>
			)}
		</div>
	);
}

export function ProfileWebLayout() {
	const { data, isLoading } = useUserProfile();

	return (
		<div className="mx-auto max-w-2xl p-6 space-y-6">
			<h1 className="text-2xl font-bold text-foreground">Your Farm Profile</h1>

			{isLoading && (
				<div className="flex items-center justify-center py-12">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
				</div>
			)}

			{!isLoading && data?.status === "ok" && data.farmer && (
				<div className="space-y-4">
					{data.farmer.farmers.map((farmer, i) => (
						<FarmerDetailCard key={farmer.farmerCode || i} farmer={farmer} index={i} />
					))}
					{data.farmer.fetchedAt && (
						<p className="text-xs text-muted-foreground text-right">
							Last updated: {new Date(data.farmer.fetchedAt).toLocaleDateString()}
						</p>
					)}
				</div>
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
					<p className="text-muted-foreground">Unable to load your farm data. Please try again later.</p>
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
