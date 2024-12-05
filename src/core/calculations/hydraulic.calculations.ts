import { HydraulicInputs, HydraulicResults } from '../types/hydraulic.types';

export class HydraulicCalculator {
  private static readonly GRAVITY = 9.81;

  static calculateResults(inputs: HydraulicInputs): HydraulicResults {
    const area = this.calculateArea(inputs);
    const wettedPerimeter = this.calculateWettedPerimeter(inputs);
    const hydraulicRadius = this.calculateHydraulicRadius(area, wettedPerimeter);
    const velocity = this.calculateVelocity(inputs, hydraulicRadius);
    const discharge = this.calculateDischarge(area, velocity);
    const froudeNumber = this.calculateFroudeNumber(velocity, inputs.depth);

    return {
      area,
      wettedPerimeter,
      hydraulicRadius,
      velocity,
      discharge,
      froudeNumber
    };
  }

  private static calculateArea(inputs: HydraulicInputs): number {
    return inputs.width * inputs.depth;
  }

  private static calculateWettedPerimeter(inputs: HydraulicInputs): number {
    return inputs.width + (2 * inputs.depth);
  }

  private static calculateHydraulicRadius(area: number, wettedPerimeter: number): number {
    return area / wettedPerimeter;
  }

  private static calculateVelocity(inputs: HydraulicInputs, hydraulicRadius: number): number {
    return (1 / inputs.roughness) * Math.pow(hydraulicRadius, 2/3) * Math.pow(inputs.slope, 0.5);
  }

  private static calculateDischarge(area: number, velocity: number): number {
    return area * velocity;
  }

  private static calculateFroudeNumber(velocity: number, depth: number): number {
    return velocity / Math.sqrt(this.GRAVITY * depth);
  }
}
