import type { Farms, Trenches, Sieve, TrenchControl, FossData } from '../types/form'

const API_BASE_URL = 'api/v1/trench';

export async function getFarms(): Promise<Farms[]> {
    const url = `${API_BASE_URL}/farms`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Ошибка запроса: ${response.status}`)
        }

        const data: Farms[] = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        throw error;
    }
}

export async function getTrenches(): Promise<Trenches[]> {
    const url = `${API_BASE_URL}/trenches`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Ошибка запроса: ${response.status}`)
        }

        const data: Trenches[] = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        throw error;
    }
}

export async function getSieve(): Promise<Sieve[]> {
    const url = `${API_BASE_URL}/sieve`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Ошибка запроса: ${response.status}`)
        }

        const data: Sieve[] = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        throw error;
    }
}

export async function getTrenchControl(season: number = new Date().getFullYear()): Promise<TrenchControl[]> {
    const url = `${API_BASE_URL}/trench_control?season=${season}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Ошибка запроса: ${response.status}`)
        }

        const rawData = await response.json();

        const data: TrenchControl[] = rawData.map((item: any) => ({
        ...item,
        date: item.date ? new Date(item.date) : null,
        }));
        return data;
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        throw error;
    }
}

export async function getFossData(): Promise<FossData[]> {
    const url = `${API_BASE_URL}/foss_data`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Ошибка запроса: ${response.status}`)
        }

        // const data: FossData[] = await response.json();
        const rawData = await response.json();

        const data: FossData[] = rawData.map((item: any) => ({
        ...item,
        date_time: item.date_time ? new Date(item.date_time) : null,
        }));
        return data;
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        throw error;
    }
}