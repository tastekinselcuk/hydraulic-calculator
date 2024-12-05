import { SavedCalculation } from '../types/hydraulic.types';

export interface IStorageService {
  saveCalculation(calculation: SavedCalculation): Promise<void>;
  getCalculations(): Promise<SavedCalculation[]>;
  deleteCalculation(id: string): Promise<void>;
  clearCalculations(): Promise<void>;
}
