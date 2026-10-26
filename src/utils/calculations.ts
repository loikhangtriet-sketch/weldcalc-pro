import {
  FilletDimensionMode,
  JointGeometryInput,
  JointType,
  PROCESS_PRESETS,
  ProjectSettings,
  UnitSystem,
  WeldBOMItem,
  WeldCalculationResult,
  WeldingProcess,
} from '../types/welding';
import { getLocalizedSampleData } from '../i18n/wpsAndTechnicalTranslations';

/**
 * Conversion constants
 */
export const MM_PER_INCH = 25.4;
export const M_PER_FT = 0.3048;
export const KG_PER_LB = 0.45359237;
export const CM3_PER_IN3 = 16.387064;
export const M3_PER_CF = 0.0283168;

/**
 * Calculates theoretical cross-sectional area (mm²), reinforcement area (mm²),
 * volume (cm³), net/gross weights (kg), consumables (gas/flux), labor hours, and costs.
 */
export function calculateWeldJoint(
  input: JointGeometryInput,
  settings: ProjectSettings
): WeldCalculationResult {
  const {
    jointType,
    process,
    weldLengthM,
    quantity,
    reinforcementPct,
    filletMode,
    filletSizeMm,
    isDoubleFillet,
    plateThicknessMm,
    grooveAngleDeg,
    rootGapMm,
    rootFaceMm,
    rootRadiusMm,
    depositionEfficiencyPct,
    depositionRateKgH,
    operatingFactorPct,
    gasFlowLMin,
    fluxToWireRatio,
  } = input;

  let theoreticalAreaMm2 = 0;
  let effectiveLegZMm = filletSizeMm;
  let effectiveThroatAMm = filletSizeMm / Math.SQRT2;

  const t = Math.max(1, plateThicknessMm);
  const f = Math.min(Math.max(0, rootFaceMm), t * 0.9);
  const R = Math.max(0, rootGapMm);
  const d = Math.max(0, t - f); // bevel depth

  switch (jointType) {
    case JointType.FILLET: {
      if (filletMode === FilletDimensionMode.THROAT_A) {
        effectiveThroatAMm = Math.max(0.5, filletSizeMm);
        effectiveLegZMm = effectiveThroatAMm * Math.SQRT2;
      } else {
        effectiveLegZMm = Math.max(0.5, filletSizeMm);
        effectiveThroatAMm = effectiveLegZMm / Math.SQRT2;
      }
      // Single fillet right-triangle area = 0.5 * z^2 = a^2
      const singleFilletArea = 0.5 * effectiveLegZMm * effectiveLegZMm;
      theoreticalAreaMm2 = isDoubleFillet ? singleFilletArea * 2 : singleFilletArea;
      break;
    }

    case JointType.SINGLE_V: {
      const halfAngleRad = ((Math.max(5, Math.min(120, grooveAngleDeg)) / 2) * Math.PI) / 180;
      // Area = Root gap rectangle (R * t) + V-triangle (d^2 * tan(alpha/2))
      theoreticalAreaMm2 = R * t + d * d * Math.tan(halfAngleRad);
      break;
    }

    case JointType.DOUBLE_V: {
      const halfAngleRad = ((Math.max(5, Math.min(120, grooveAngleDeg)) / 2) * Math.PI) / 180;
      // Symmetric Double-V: two V-grooves each of depth d/2 -> 2 * (d/2)^2 * tan(alpha/2) = 0.5 * d^2 * tan(alpha/2)
      theoreticalAreaMm2 = R * t + 0.5 * d * d * Math.tan(halfAngleRad);
      break;
    }

    case JointType.SINGLE_BEVEL: {
      const bevelRad = (Math.max(5, Math.min(75, grooveAngleDeg)) * Math.PI) / 180;
      // Single-Bevel: R * t + 0.5 * d^2 * tan(beta)
      theoreticalAreaMm2 = R * t + 0.5 * d * d * Math.tan(bevelRad);
      break;
    }

    case JointType.DOUBLE_BEVEL: {
      const bevelRad = (Math.max(5, Math.min(75, grooveAngleDeg)) * Math.PI) / 180;
      // Symmetric Double-Bevel (K-joint): R * t + 2 * [0.5 * (d/2)^2 * tan(beta)] = R * t + 0.25 * d^2 * tan(beta)
      theoreticalAreaMm2 = R * t + 0.25 * d * d * Math.tan(bevelRad);
      break;
    }

    case JointType.SINGLE_U: {
      const rRoot = Math.max(1, Math.min(rootRadiusMm, d));
      const bevelRad = (Math.max(2, Math.min(45, grooveAngleDeg)) * Math.PI) / 180;
      const hUpper = Math.max(0, d - rRoot);
      // Root gap + Semi-circle at bottom (0.5 * pi * r^2) + Upper trapezoid (2 * r * hUpper + hUpper^2 * tan(beta))
      const semiCircleArea = 0.5 * Math.PI * rRoot * rRoot;
      const upperTrapezoidArea = 2 * rRoot * hUpper + hUpper * hUpper * Math.tan(bevelRad);
      theoreticalAreaMm2 = R * t + semiCircleArea + upperTrapezoidArea;
      break;
    }

    case JointType.SINGLE_J: {
      const rRoot = Math.max(1, Math.min(rootRadiusMm, d));
      const bevelRad = (Math.max(2, Math.min(45, grooveAngleDeg)) * Math.PI) / 180;
      const hUpper = Math.max(0, d - rRoot);
      // Root gap + Quarter-circle at bottom (0.25 * pi * r^2) + Upper one-sided trapezoid (r * hUpper + 0.5 * hUpper^2 * tan(beta))
      const quarterCircleArea = 0.25 * Math.PI * rRoot * rRoot;
      const upperArea = rRoot * hUpper + 0.5 * hUpper * hUpper * Math.tan(bevelRad);
      theoreticalAreaMm2 = R * t + quarterCircleArea + upperArea;
      break;
    }

    case JointType.SQUARE: {
      // Square groove butt weld: root gap R * t + minimum cap fusion allowance if R == 0
      const effectiveGap = Math.max(0.8, R);
      theoreticalAreaMm2 = effectiveGap * t;
      break;
    }
  }

  const safeReinfPct = Math.max(0, Math.min(40, reinforcementPct));
  const reinforcementAreaMm2 = theoreticalAreaMm2 * (safeReinfPct / 100);
  const totalAreaMm2 = theoreticalAreaMm2 + reinforcementAreaMm2;

  const totalLengthM = Math.max(0.01, weldLengthM) * Math.max(1, quantity);

  // Volume: Area (mm²) * Length (m) -> 1 mm² * 1 m = 1 mm² * 1000 mm = 1000 mm³ = 1 cm³!
  // Wait: 1 cm³ = 1000 mm³. And 1 m = 1000 mm.
  // Therefore: Area (in mm²) * Length (in m) * 1000 mm/m / 1000 mm³/cm³ = Area (mm²) * Length (m) in cm³!
  // Let's double check: 10 mm² * 1 m = 10 mm² * 1000 mm = 10,000 mm³ = 10 cm³.
  // Yes! V (cm³) = A_total (mm²) * totalLength (m).
  const volumeCm3 = totalAreaMm2 * totalLengthM;

  // Net weld weight: W_net (kg) = V (cm³) * rho (g/cm³) / 1000
  const density = Math.max(0.5, settings.customDensityGcm3);
  const netWeldWeightKg = (volumeCm3 * density) / 1000;

  // Gross consumables weight: W_gross (kg) = W_net / (eta / 100)
  const eta = Math.max(20, Math.min(100, depositionEfficiencyPct)) / 100;
  const grossConsumableWeightKg = netWeldWeightKg / eta;

  // Arc-on time (hours): W_net / depositionRate (kg/h)
  const depRate = Math.max(0.1, depositionRateKgH);
  const arcOnTimeHours = netWeldWeightKg / depRate;

  // Total labor hours: Arc-on time / (operatingFactor / 100)
  const opFactor = Math.max(10, Math.min(100, operatingFactorPct)) / 100;
  const totalLaborHours = arcOnTimeHours / opFactor;

  // Shielding Gas (for GMAW, FCAW, GTAW): Flow (L/min) * Arc-on time (hours) * 60 min/h
  const preset = PROCESS_PRESETS[process];
  const shieldingGasLiters = preset.usesShieldingGas
    ? Math.max(0, gasFlowLMin) * arcOnTimeHours * 60
    : 0;
  const shieldingGasM3 = shieldingGasLiters / 1000;

  // SAW Flux (kg): Gross wire weight * fluxToWireRatio
  const fluxWeightKg = preset.usesFlux
    ? grossConsumableWeightKg * Math.max(0, fluxToWireRatio)
    : 0;

  // Electrical energy (kWh): machine power (kW) * arc-on hours
  const powerEnergyKwh = preset.powerConsumptionKw * arcOnTimeHours;

  // Costs
  const consumableUnitPrice = settings.unitPrices.consumablePerKg[process] || 0;
  const consumableCost = grossConsumableWeightKg * consumableUnitPrice;
  const gasCost = shieldingGasM3 * settings.unitPrices.shieldingGasPerM3;
  const fluxCost = fluxWeightKg * settings.unitPrices.sawFluxPerKg;
  const laborCost = totalLaborHours * settings.unitPrices.laborPerHour;
  const powerCost = powerEnergyKwh * settings.unitPrices.electricityPerKwh;
  const totalCost = consumableCost + gasCost + fluxCost + laborCost + powerCost;

  return {
    theoreticalAreaMm2,
    reinforcementAreaMm2,
    totalAreaMm2,
    EffectiveLegZMm: effectiveLegZMm,
    EffectiveThroatAMm: effectiveThroatAMm,
    totalLengthM,
    volumeCm3,
    netWeldWeightKg,
    grossConsumableWeightKg,
    shieldingGasM3,
    shieldingGasLiters,
    fluxWeightKg,
    arcOnTimeHours,
    totalLaborHours,
    powerEnergyKwh,
    consumableCost,
    gasCost,
    fluxCost,
    laborCost,
    powerCost,
    totalCost,
  };
}

/**
 * Formatting helpers for Metric vs Imperial display
 */
export function formatCurrency(amount: number, symbol: string): string {
  const isVndLike = symbol.toUpperCase().includes('VN') || symbol.includes('₫') || amount >= 10000;
  const formatted = new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: isVndLike ? 0 : 2,
    maximumFractionDigits: isVndLike ? 0 : 2,
  }).format(Number.isFinite(amount) ? amount : 0);
  return `${formatted} ${symbol}`;
}

export function formatNumber(val: number, decimals = 2): string {
  if (!Number.isFinite(val)) return '0';
  return new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}

export function displayLengthMm(mm: number, unitSystem: UnitSystem): { value: number; unit: string } {
  if (unitSystem === UnitSystem.IMPERIAL) {
    return { value: mm / MM_PER_INCH, unit: 'in' };
  }
  return { value: mm, unit: 'mm' };
}

export function displayWeldLengthM(m: number, unitSystem: UnitSystem): { value: number; unit: string } {
  if (unitSystem === UnitSystem.IMPERIAL) {
    return { value: m / M_PER_FT, unit: 'ft' };
  }
  return { value: m, unit: 'm' };
}

export function displayWeightKg(kg: number, unitSystem: UnitSystem): { value: number; unit: string } {
  if (unitSystem === UnitSystem.IMPERIAL) {
    return { value: kg / KG_PER_LB, unit: 'lb' };
  }
  return { value: kg, unit: 'kg' };
}

export function displayVolumeCm3(cm3: number, unitSystem: UnitSystem): { value: number; unit: string } {
  if (unitSystem === UnitSystem.IMPERIAL) {
    return { value: cm3 / CM3_PER_IN3, unit: 'in³' };
  }
  return { value: cm3, unit: 'cm³' };
}

export function displayAreaMm2(mm2: number, unitSystem: UnitSystem): { value: number; unit: string } {
  if (unitSystem === UnitSystem.IMPERIAL) {
    return { value: mm2 / (MM_PER_INCH * MM_PER_INCH), unit: 'in²' };
  }
  return { value: mm2, unit: 'mm²' };
}

/**
 * Default Industrial Sample BOM Items so the engineer has rich realistic data immediately
 */
export function createInitialSampleBOM(settings: ProjectSettings): WeldBOMItem[] {
  const sampleMeta = getLocalizedSampleData(settings.language);
  const rawSamples: Array<{
    id: string;
    weldTag: string;
    structuralMember: string;
    wpsRef: string;
    input: JointGeometryInput;
  }> = [
    {
      id: 'sample-1',
      weldTag: 'W-01',
      structuralMember: sampleMeta.samples['sample-1'],
      wpsRef: 'WPS-SAW-HB-02',
      input: {
        jointType: JointType.FILLET,
        process: WeldingProcess.SAW,
        weldLengthM: 12.0,
        quantity: 8,
        reinforcementPct: 10,
        filletMode: FilletDimensionMode.LEG_Z,
        filletSizeMm: 10,
        isDoubleFillet: true,
        plateThicknessMm: 12,
        grooveAngleDeg: 60,
        rootGapMm: 2,
        rootFaceMm: 2,
        rootRadiusMm: 6,
        depositionEfficiencyPct: 98,
        depositionRateKgH: 7.5,
        operatingFactorPct: 60,
        gasFlowLMin: 0,
        fluxToWireRatio: 1.1,
      },
    },
    {
      id: 'sample-2',
      weldTag: 'W-02',
      structuralMember: sampleMeta.samples['sample-2'],
      wpsRef: 'WPS-FCAW-CJP-03',
      input: {
        jointType: JointType.SINGLE_V,
        process: WeldingProcess.FCAW,
        weldLengthM: 0.3,
        quantity: 32,
        reinforcementPct: 10,
        filletMode: FilletDimensionMode.LEG_Z,
        filletSizeMm: 8,
        isDoubleFillet: false,
        plateThicknessMm: 20,
        grooveAngleDeg: 60,
        rootGapMm: 3,
        rootFaceMm: 2,
        rootRadiusMm: 6,
        depositionEfficiencyPct: 86,
        depositionRateKgH: 4.5,
        operatingFactorPct: 45,
        gasFlowLMin: 20,
        fluxToWireRatio: 0,
      },
    },
    {
      id: 'sample-3',
      weldTag: 'W-03',
      structuralMember: sampleMeta.samples['sample-3'],
      wpsRef: 'WPS-GMAW-CS-01',
      input: {
        jointType: JointType.SINGLE_BEVEL,
        process: WeldingProcess.GMAW,
        weldLengthM: 1.6,
        quantity: 16,
        reinforcementPct: 12,
        filletMode: FilletDimensionMode.LEG_Z,
        filletSizeMm: 8,
        isDoubleFillet: false,
        plateThicknessMm: 18,
        grooveAngleDeg: 45,
        rootGapMm: 2.5,
        rootFaceMm: 2,
        rootRadiusMm: 6,
        depositionEfficiencyPct: 90,
        depositionRateKgH: 3.8,
        operatingFactorPct: 45,
        gasFlowLMin: 18,
        fluxToWireRatio: 0,
      },
    },
    {
      id: 'sample-4',
      weldTag: 'W-04',
      structuralMember: sampleMeta.samples['sample-4'],
      wpsRef: 'WPS-SAW-HB-02',
      input: {
        jointType: JointType.DOUBLE_V,
        process: WeldingProcess.SAW,
        weldLengthM: 6.5,
        quantity: 4,
        reinforcementPct: 10,
        filletMode: FilletDimensionMode.LEG_Z,
        filletSizeMm: 8,
        isDoubleFillet: false,
        plateThicknessMm: 28,
        grooveAngleDeg: 60,
        rootGapMm: 2,
        rootFaceMm: 3,
        rootRadiusMm: 6,
        depositionEfficiencyPct: 98,
        depositionRateKgH: 7.5,
        operatingFactorPct: 60,
        gasFlowLMin: 0,
        fluxToWireRatio: 1.1,
      },
    },
    {
      id: 'sample-5',
      weldTag: 'W-05',
      structuralMember: sampleMeta.samples['sample-5'],
      wpsRef: 'WPS-SMAW-SITE-04',
      input: {
        jointType: JointType.FILLET,
        process: WeldingProcess.SMAW,
        weldLengthM: 0.45,
        quantity: 64,
        reinforcementPct: 12,
        filletMode: FilletDimensionMode.THROAT_A,
        filletSizeMm: 6,
        isDoubleFillet: true,
        plateThicknessMm: 12,
        grooveAngleDeg: 60,
        rootGapMm: 2,
        rootFaceMm: 2,
        rootRadiusMm: 6,
        depositionEfficiencyPct: 60,
        depositionRateKgH: 1.6,
        operatingFactorPct: 30,
        gasFlowLMin: 0,
        fluxToWireRatio: 0,
      },
    },
  ];

  return rawSamples.map((item) => ({
    ...item,
    result: calculateWeldJoint(item.input, settings),
  }));
}
