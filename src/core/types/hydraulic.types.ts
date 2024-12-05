export interface HydraulicInputs {
  width: number;
  depth: number;
  slope: number;
  roughness: number;
}

export interface HydraulicResults {
  area: number;
  wettedPerimeter: number;
  hydraulicRadius: number;
  velocity: number;
  discharge: number;
  froudeNumber: number;
}

export interface SavedCalculation {
  id: string;
  timestamp: number;
  inputs: HydraulicInputs;
  results: HydraulicResults;
}
