import { IStorageService } from '@core/storage/storage.interface';
import { SavedCalculation } from '@core/types/hydraulic.types';

export class WebStorageService implements IStorageService {
  private readonly STORAGE_KEY = 'hydraulic_calculations';

  async saveCalculation(calculation: SavedCalculation): Promise<void> {
    const calculations = await this.getCalculations();
    calculations.push(calculation);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(calculations));
  }

  async getCalculations(): Promise<SavedCalculation[]> {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  async deleteCalculation(id: string): Promise<void> {
    const calculations = await this.getCalculations();
    const filtered = calculations.filter(calc => calc.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }

  async clearCalculations(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
