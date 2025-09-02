export interface Farms {
    id: number;
    name: string;
}

export interface Trenches {
    id: number;
    farm_id: number;
    name: string;
}

export interface Sieve {
    id: number;
    trench_control_id: number;
    low: number | null;
    middle: number | null;
    high: number | null;
    pallet: number | null;
    date_time: Date;
    machine_operator: string | null;
}

export interface TrenchControl {
    id: number;
    harvest_id: number | null;
    date: Date | null;
    left_edge_temp: number | null;
    middle_temp: number | null;
    right_edge_temp: number | null;
    weight: number | null;
    crop_id?: number | null;
    weather_id?: number | null;
}

export interface FossData {
    id: number;
    date_time: Date;
    trench_control_id: number;
    field: string | null;
    dry_matter: number | null;
    protein: number | null;
    starch: number | null;
    adf: number | null;
    ndf: number | null;
    ash: number | null;
    raw_fat: number | null;
    mw: number | null;
}

export interface Harvest {
    id: number;
    season: number;
    harvesting: number;
    trench_id: number | null;
}

export interface LabData {
  id?: number;
  harvest_id?: number;
  dry_matter: string;
  protein: string;
  starch: string;
  raw_fat: string;
  adf: string;
  ndf: string;
  ash: string;
}

export interface Weather {
    id: number;
    name: string;
    active: boolean;
}

export interface Crops {
    id: number;
    name: string;
    active: boolean;
    template_foss_id: number | null;
    template_sieve_id: number | null;
}

export interface FossNorms {
  id?: number;
  crop_id: number;
  dry_matter_lower_limit?: number | null;
  dry_matter_upper_limit?: number | null;
  protein_lower_limit?: number | null;
  protein_upper_limit?: number | null;
  starch_lower_limit?: number | null;
  starch_upper_limit?: number | null;
  adf_lower_limit?: number | null;
  adf_upper_limit?: number | null;
  ndf_lower_limit?: number | null;
  ndf_upper_limit?: number | null;
  ash_lower_limit?: number | null;
  ash_upper_limit?: number | null;
  raw_fat_lower_limit?: number | null;
  raw_fat_upper_limit?: number | null;
  [key: string]: number | null | undefined; 
}

export interface SieveNorms {
  id?: number;
  crop_id: number;
  high_lower_limit?: number | null;
  high_upper_limit?: number | null;
  middle_lower_limit?: number | null;
  middle_upper_limit?: number | null;
  low_lower_limit?: number | null;
  low_upper_limit?: number | null;
  pallet_lower_limit?: number | null;
  pallet_upper_limit?: number | null;
  [key: string]: number | null | undefined; 
}

export interface FossTemplate {
  id?: number;
  name: string;
  dry_matter_lower_limit?: number | null;
  dry_matter_upper_limit?: number | null;
  protein_lower_limit?: number | null;
  protein_upper_limit?: number | null;
  starch_lower_limit?: number | null;
  starch_upper_limit?: number | null;
  adf_lower_limit?: number | null;
  adf_upper_limit?: number | null;
  ndf_lower_limit?: number | null;
  ndf_upper_limit?: number | null;
  ash_lower_limit?: number | null;
  ash_upper_limit?: number | null;
  raw_fat_lower_limit?: number | null;
  raw_fat_upper_limit?: number | null;
}

export interface SieveTemplate {
  id?: number;
  name: string;
  high_lower_limit?: number | null;
  high_upper_limit?: number | null;
  middle_lower_limit?: number | null;
  middle_upper_limit?: number | null;
  low_lower_limit?: number | null;
  low_upper_limit?: number | null;
  pallet_lower_limit?: number | null;
  pallet_upper_limit?: number | null;
}
