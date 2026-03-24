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
