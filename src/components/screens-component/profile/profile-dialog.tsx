import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { useUserProfile } from "@/hooks/apis/profile";
import { Loader2, AlertTriangle, User, MapPin, Milk, PawPrint } from "lucide-react";
import type { FarmerRecord } from "@/hooks/apis/profile/type";

function titleCase(str?: string | null): string {
	if (!str) return "";
	return str
		.split(" ")
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(" ");
}

function getName(f: FarmerRecord): string {
	return titleCase(f.farmerName || f.farmer_name) || "Farmer";
}

function getSociety(f: FarmerRecord): string {
	return titleCase(f.societyName || f.society_name) || "";
}

function getLocation(f: FarmerRecord): string {
	const parts = [f.village, f.sub_district, f.district, f.state].filter(Boolean).map(titleCase);
	return parts.join(", ");
}

function getUnion(f: FarmerRecord): string {
	return titleCase(f.union_name) || "";
}

function StatBadge({ label, value }: { label: string; value: string | number }) {
	return (
		<div className="flex flex-col items-center rounded-lg bg-green-50 dark:bg-green-950/30 px-3 py-2 min-w-[70px]">
			<span className="text-lg font-bold text-green-700 dark:text-green-400">{value}</span>
			<span className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</span>
		</div>
	);
}

function FarmerCard({ farmer }: { farmer: FarmerRecord }) {
	const name = getName(farmer);
	const society = getSociety(farmer);
	const location = getLocation(farmer);
	const union = getUnion(farmer);
	const code = farmer.farmerCode || farmer.farmer_code;
	const totalAnimals = farmer.totalAnimals ?? farmer.total_animals;
	const cows = farmer.total_cow;
	const buffalo = farmer.total_buffalo;
	const milking = farmer.total_milking_animals;

	const avgCowMilk = farmer.avg_milk_per_day_cow;
	const avgBuffMilk = farmer.avg_milk_per_day_buffalo;
	const hasMilkData = (avgCowMilk != null && avgCowMilk > 0) || (avgBuffMilk != null && avgBuffMilk > 0);

	return (
		<div className="rounded-xl border border-border/60 overflow-hidden">
			{/* Header */}
			<div className="bg-green-50 dark:bg-green-950/30 px-4 py-3 flex items-center gap-3">
				<div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center shrink-0">
					<User className="h-5 w-5 text-white" />
				</div>
				<div className="min-w-0 flex-1">
					<p className="font-semibold text-base text-foreground truncate">{name}</p>
					<p className="text-xs text-muted-foreground">
						{[code && `#${code}`, union].filter(Boolean).join(" \u00B7 ")}
					</p>
				</div>
			</div>

			<div className="px-4 py-3 space-y-3">
				{/* Location */}
				{(society || location) && (
					<div className="flex items-start gap-2 text-sm text-muted-foreground">
						<MapPin className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground/70" />
						<div>
							{society && <p className="text-foreground text-sm">{society}</p>}
							{location && <p className="text-xs">{location}</p>}
						</div>
					</div>
				)}

				{/* Animal stats */}
				{totalAnimals != null && totalAnimals > 0 && (
					<div className="space-y-1.5">
						<div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
							<PawPrint className="h-3 w-3" />
							Herd
						</div>
						<div className="flex gap-2 flex-wrap">
							<StatBadge label="Total" value={totalAnimals} />
							{cows != null && cows > 0 && <StatBadge label="Cows" value={cows} />}
							{buffalo != null && buffalo > 0 && <StatBadge label="Buffalo" value={buffalo} />}
							{milking != null && milking > 0 && <StatBadge label="Milking" value={milking} />}
						</div>
					</div>
				)}

				{/* Milk metrics */}
				{hasMilkData && (
					<div className="space-y-1.5">
						<div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
							<Milk className="h-3 w-3" />
							Avg. Milk / Day
						</div>
						<div className="flex gap-2 flex-wrap">
							{avgCowMilk != null && avgCowMilk > 0 && (
								<StatBadge label="Cow" value={`${avgCowMilk.toFixed(1)}L`} />
							)}
							{avgBuffMilk != null && avgBuffMilk > 0 && (
								<StatBadge label="Buffalo" value={`${avgBuffMilk.toFixed(1)}L`} />
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

interface ProfileDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
	const { data, isLoading } = useUserProfile();

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Farm Profile</DialogTitle>
					<DialogDescription>
						Your registered farm records
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
							<FarmerCard key={farmer.farmerCode || farmer.farmer_code || i} farmer={farmer} />
						))}
						{data.farmer.source && (
							<p className="text-[10px] text-muted-foreground/60 text-right">
								{data.farmer.source === "cache" ? "Cached" : "Live"} data
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
							Unable to load farm data. Please try logging in again.
						</p>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
