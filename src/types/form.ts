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
}

export interface TrenchControl {
    id: number;
    harvest_id: number | null;
    date: Date | null;
    crop: string | null;
    weather: string | null;
    temp_trench: number | null;
    left_edge_temp: number | null;
    middle_temp: number | null;
    right_edge_temp: number | null;
    weight: number | null;
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