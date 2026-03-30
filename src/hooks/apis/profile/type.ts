export interface AnimalRecord {
  tagNumber?: string;
  animalType?: string;
  breed?: string;
  milkingStage?: string;
  pregnancyStage?: string;
  dateOfBirth?: string;
  lactationNo?: number | string;
  lastBreedingActivity?: string;
  lastHealthActivity?: string;
  lastPD?: string;
  lastCalvingDate?: string;
  farmerComplaint?: string;
  diagnosis?: string;
  medicineGiven?: string;
  [key: string]: unknown;
}

export interface FarmerRecord {
  farmerName?: string;
  societyName?: string;
  farmerCode?: string;
  totalAnimals?: number;
  tagNo?: string;
  tagNumbers?: string;
  // Extended fields from API
  farmer_name?: string;
  society_name?: string;
  farmer_code?: string;
  union_name?: string;
  union_code?: string;
  district?: string;
  sub_district?: string;
  village?: string;
  state?: string;
  mobile_number?: string;
  total_animals?: number;
  total_cow?: number;
  total_buffalo?: number;
  total_milking_animals?: number;
  avg_milk_per_day_cow?: number;
  avg_milk_per_day_buffalo?: number;
  cow_fat?: number;
  cow_snf?: number;
  buff_fat?: number;
  buff_snf?: number;
  [key: string]: unknown;
}

export interface FarmerSummary {
  farmerName?: string;
  societyName?: string;
  farmerCode?: string;
  totalAnimals?: number;
  recordCount: number;
}

export interface FarmerDataEnvelope {
  farmers: FarmerRecord[];
  fetchedAt?: string;
  source?: string;
}

export interface UserMeResponse {
  status: "ok" | "not_found" | "error" | "anonymous";
  farmer: FarmerDataEnvelope | null;
}
