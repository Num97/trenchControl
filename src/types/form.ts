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
    trench_id: number;
    date: Date | null;
    season: number;
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