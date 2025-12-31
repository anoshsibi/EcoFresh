// Type definitions for Analytics component

export interface DataPoint {
  time: string;
  value: number;
  aqi?: number;
  pm25?: number;
  pm10?: number;
  o3?: number;
  no2?: number;
  so2?: number;
  co?: number;
}

export interface CityChartData {
  city: string;
  values: DataPoint[];
  source?: string;
  timestamp?: string;
}

export interface ChartTypeOption {
  id: string;
  name: string;
  icon: string;
}

export interface MetricOption {
  id: string;
  name: string;
  unit: string;
}

export interface LocationData {
  countries: Array<{
    id: string;
    name: string;
    states: string[];
  }>;
  states: {
    [key: string]: {
      name: string;
      cities: string[];
    };
  };
}

export interface AIAnalysisState {
  isLoading: boolean;
  report: string | null;
  anomalies: any[];
  insights: string[];
  recommendations: string[];
  error: string | null;
}

export interface PresetPrompt {
  id: string;
  name: string;
  description: string;
  icon: string;
}