export type LanguageCode =
  | 'vi'
  | 'en-US'
  | 'en-GB'
  | 'zh'
  | 'ja'
  | 'ko'
  | 'ru'
  | 'th'
  | 'hi'
  | 'de'
  | 'fr'
  | 'es';

export enum UnitSystem {
  METRIC = 'METRIC',
  IMPERIAL = 'IMPERIAL',
}

export enum WeldingStandard {
  ISO_2553 = 'ISO 2553',
  AWS_A2_4 = 'AWS A2.4',
  AWS_A3_0 = 'AWS A3.0',
}

export enum WeldingProcess {
  SMAW = 'SMAW',
  GMAW = 'GMAW',
  FCAW = 'FCAW',
  GTAW = 'GTAW',
  SAW = 'SAW',
}

export enum JointType {
  FILLET = 'fillet',
  SINGLE_V = 'single_v',
  DOUBLE_V = 'double_v',
  SINGLE_BEVEL = 'single_bevel',
  DOUBLE_BEVEL = 'double_bevel',
  SINGLE_U = 'single_u',
  SINGLE_J = 'single_j',
  SQUARE = 'square',
}

export enum FilletDimensionMode {
  THROAT_A = 'THROAT_A', // ISO 2553 throat thickness 'a'
  LEG_Z = 'LEG_Z',       // AWS A2.4 / ISO 2553 leg length 'z'
}

export interface MaterialGrade {
  id: string;
  name: string;
  code: string;
  densityGcm3: number;
  category: string;
}

export interface ProcessPreset {
  process: WeldingProcess;
  name: string;
  shortDesc: string;
  defaultEfficiency: number;       // % (e.g. 60 for SMAW, 88 for GMAW)
  efficiencyRange: [number, number];
  defaultDepositionRateKgH: number; // kg/h
  defaultOperatingFactor: number;   // % (e.g. 35)
  usesShieldingGas: boolean;
  defaultGasFlowLMin: number;       // L/min
  usesFlux: boolean;
  defaultFluxRatio: number;         // kg flux / kg wire
  powerConsumptionKw: number;       // Average machine kW during arc-on
  consumableLabel: string;
}

export interface UnitPrices {
  consumablePerKg: Record<WeldingProcess, number>;
  shieldingGasPerM3: number;
  sawFluxPerKg: number;
  laborPerHour: number;
  electricityPerKwh: number;
}

export interface ProjectSettings {
  language?: LanguageCode;
  projectName: string;
  projectCode: string;
  clientName: string;
  engineerName: string;
  unitSystem: UnitSystem;
  standard: WeldingStandard;
  materialId: string;
  customDensityGcm3: number; // active density in g/cm³
  currencySymbol: string;
  unitPrices: UnitPrices;
}

export interface JointGeometryInput {
  jointType: JointType;
  process: WeldingProcess;
  // Common
  weldLengthM: number;         // Length per item in meters (stored canonically in metric)
  quantity: number;            // Number of identical weld seams / structural assemblies
  reinforcementPct: number;    // 5 - 15%
  // Fillet specific
  filletMode: FilletDimensionMode;
  filletSizeMm: number;        // Either 'a' (throat) or 'z' (leg) depending on filletMode
  isDoubleFillet: boolean;     // Both sides of T-joint
  // Groove specific
  plateThicknessMm: number;    // t (mm)
  grooveAngleDeg: number;      // alpha (total included angle for V/Double-V) or beta (bevel angle for Bevel/U/J)
  rootGapMm: number;           // R (mm)
  rootFaceMm: number;          // f (mm)
  rootRadiusMm: number;        // r_root (mm) for U and J grooves
  // Process parameters
  depositionEfficiencyPct: number; // eta (%)
  depositionRateKgH: number;       // kg/h
  operatingFactorPct: number;      // Duty cycle / operating factor (%)
  gasFlowLMin: number;             // L/min
  fluxToWireRatio: number;         // kg flux / kg wire (for SAW)
}

export interface WeldCalculationResult {
  theoreticalAreaMm2: number;      // A_th (mm²)
  reinforcementAreaMm2: number;    // A_reinf (mm²)
  totalAreaMm2: number;            // A_total (mm²)
  EffectiveLegZMm: number;         // Calculated z for fillet
  EffectiveThroatAMm: number;      // Calculated a for fillet
  totalLengthM: number;            // L * quantity (m)
  volumeCm3: number;               // V (cm³)
  netWeldWeightKg: number;         // W_net (kg)
  grossConsumableWeightKg: number; // W_gross (kg)
  shieldingGasM3: number;          // Shielding gas volume (m³)
  shieldingGasLiters: number;      // Shielding gas volume (L)
  fluxWeightKg: number;            // SAW flux weight (kg)
  arcOnTimeHours: number;          // Arc-on hours
  totalLaborHours: number;         // Total man-hours (Arc-on / operatingFactor)
  powerEnergyKwh: number;          // Electrical energy (kWh)
  // Cost breakdown
  consumableCost: number;
  gasCost: number;
  fluxCost: number;
  laborCost: number;
  powerCost: number;
  totalCost: number;
}

export interface WeldBOMItem {
  id: string;
  weldTag: string;           // e.g. "W-01"
  structuralMember: string;  // e.g. "Dầm chính H-Beam 600x300"
  wpsRef: string;            // e.g. "WPS-GMAW-01"
  input: JointGeometryInput;
  result: WeldCalculationResult;
}

export interface WPSReferenceTemplate {
  id: string;
  wpsCode: string;
  title: string;
  process: WeldingProcess;
  jointTypes: JointType[];
  materialGroup: string;
  fillerMetalClass: string;
  currentRangeAmp: string;
  voltageRangeV: string;
  travelSpeedMmMin: string;
  shieldingGasOrFlux: string;
  preheatTempC: string;
  standardCompliance: string;
}

export const MATERIAL_GRADES: MaterialGrade[] = [
  {
    id: 'carbon_steel',
    name: 'Carbon Steel (SS400 / A36 / S235 / S355)',
    code: 'CS-785',
    densityGcm3: 7.85,
    category: 'Carbon & Low-Alloy Steel',
  },
  {
    id: 'high_strength_steel',
    name: 'High-Strength Steel (Q345B / A572 Gr.50 / SM490)',
    code: 'HSLA-785',
    densityGcm3: 7.85,
    category: 'Carbon & Low-Alloy Steel',
  },
  {
    id: 'stainless_304',
    name: 'Austenitic Stainless Steel (SUS304 / 304L)',
    code: 'SS-304',
    densityGcm3: 7.93,
    category: 'Stainless Steel',
  },
  {
    id: 'stainless_316',
    name: 'Corrosion-Resistant Stainless (SUS316 / 316L)',
    code: 'SS-316',
    densityGcm3: 7.98,
    category: 'Stainless Steel',
  },
  {
    id: 'duplex_2205',
    name: 'Duplex Stainless Steel (UNS S32205 / EN 1.4462)',
    code: 'DSS-2205',
    densityGcm3: 7.80,
    category: 'Stainless Steel',
  },
  {
    id: 'aluminum_6061',
    name: 'Structural Aluminum Alloy (AA 5083 / 6061-T6)',
    code: 'AL-6061',
    densityGcm3: 2.70,
    category: 'Non-Ferrous Alloy',
  },
  {
    id: 'custom',
    name: 'Custom Material (Manual Density ρ)',
    code: 'CUSTOM',
    densityGcm3: 7.85,
    category: 'Custom',
  },
];

export const PROCESS_PRESETS: Record<WeldingProcess, ProcessPreset> = {
  [WeldingProcess.SMAW]: {
    process: WeldingProcess.SMAW,
    name: 'SMAW (MMA - 111)',
    shortDesc: 'Shielded Metal Arc Welding (Stick Electrode E7018 / E6013).',
    defaultEfficiency: 60,
    efficiencyRange: [55, 65],
    defaultDepositionRateKgH: 1.6,
    defaultOperatingFactor: 30,
    usesShieldingGas: false,
    defaultGasFlowLMin: 0,
    usesFlux: false,
    defaultFluxRatio: 0,
    powerConsumptionKw: 7.5,
    consumableLabel: 'SMAW Covered Electrode (E7018 / E6013)',
  },
  [WeldingProcess.GMAW]: {
    process: WeldingProcess.GMAW,
    name: 'GMAW / MIG-MAG (135)',
    shortDesc: 'Gas Metal Arc Welding with solid wire and CO₂ / Ar+CO₂ shielding gas.',
    defaultEfficiency: 90,
    efficiencyRange: [85, 95],
    defaultDepositionRateKgH: 3.8,
    defaultOperatingFactor: 45,
    usesShieldingGas: true,
    defaultGasFlowLMin: 18,
    usesFlux: false,
    defaultFluxRatio: 0,
    powerConsumptionKw: 11.0,
    consumableLabel: 'GMAW Solid Wire (ER70S-6 / ER308L)',
  },
  [WeldingProcess.FCAW]: {
    process: WeldingProcess.FCAW,
    name: 'FCAW (136)',
    shortDesc: 'Flux-Cored Arc Welding with high deposition rate for heavy structures.',
    defaultEfficiency: 86,
    efficiencyRange: [82, 90],
    defaultDepositionRateKgH: 4.5,
    defaultOperatingFactor: 45,
    usesShieldingGas: true,
    defaultGasFlowLMin: 20,
    usesFlux: false,
    defaultFluxRatio: 0,
    powerConsumptionKw: 13.5,
    consumableLabel: 'FCAW Flux-Cored Wire (E71T-1C)',
  },
  [WeldingProcess.GTAW]: {
    process: WeldingProcess.GTAW,
    name: 'GTAW / TIG (141)',
    shortDesc: 'Gas Tungsten Arc Welding for high-purity root passes & stainless piping.',
    defaultEfficiency: 96,
    efficiencyRange: [92, 99],
    defaultDepositionRateKgH: 0.9,
    defaultOperatingFactor: 30,
    usesShieldingGas: true,
    defaultGasFlowLMin: 12,
    usesFlux: false,
    defaultFluxRatio: 0,
    powerConsumptionKw: 6.0,
    consumableLabel: 'GTAW TIG Filler Rod (ER70S-2 / ER316L)',
  },
  [WeldingProcess.SAW]: {
    process: WeldingProcess.SAW,
    name: 'SAW (121)',
    shortDesc: 'Submerged Arc Welding for long H-beams, bridge girders & pressure vessels.',
    defaultEfficiency: 98,
    efficiencyRange: [95, 100],
    defaultDepositionRateKgH: 7.5,
    defaultOperatingFactor: 60,
    usesShieldingGas: false,
    defaultGasFlowLMin: 0,
    usesFlux: true,
    defaultFluxRatio: 1.1,
    powerConsumptionKw: 24.0,
    consumableLabel: 'SAW Wire (EM12K / EL12)',
  },
};

export interface JointMeta {
  type: JointType;
  nameVi: string;
  nameEn: string;
  awsSymbolCode: string;
  isoSymbolCode: string;
  summary: string;
}

export const JOINT_META_LIST: JointMeta[] = [
  {
    type: JointType.FILLET,
    nameVi: 'Mối hàn góc (Fillet Weld)',
    nameEn: 'Fillet Weld (T-Joint / Lap)',
    awsSymbolCode: 'AWS A2.4 Fillet (z)',
    isoSymbolCode: 'ISO 2553 Fillet (a / z)',
    summary: 'T-joint, lap joint, and stiffener connections.',
  },
  {
    type: JointType.SINGLE_V,
    nameVi: 'Giáp mối chữ V đơn (Single-V)',
    nameEn: 'Single-V Groove Weld',
    awsSymbolCode: 'AWS B-U2a / B-P2',
    isoSymbolCode: 'ISO 2553 Single-V (Y)',
    summary: 'Symmetric V-groove butt weld for plates 6–25 mm thick.',
  },
  {
    type: JointType.DOUBLE_V,
    nameVi: 'Giáp mối chữ V kép (Double-V / X)',
    nameEn: 'Double-V (X) Groove Weld',
    awsSymbolCode: 'AWS B-U3b',
    isoSymbolCode: 'ISO 2553 Double-V (X)',
    summary: 'Reduces weld metal volume by ~50% on thick plates (>16 mm).',
  },
  {
    type: JointType.SINGLE_BEVEL,
    nameVi: 'Mối hàn vát đơn (Single-Bevel)',
    nameEn: 'Single-Bevel Groove Weld',
    awsSymbolCode: 'AWS TC-U4a / B-U4',
    isoSymbolCode: 'ISO 2553 Single-Bevel (HV)',
    summary: 'Single-plate beveling for CJP T-joints and corner/butt joints.',
  },
  {
    type: JointType.DOUBLE_BEVEL,
    nameVi: 'Mối hàn vát kép (Double-Bevel / K)',
    nameEn: 'Double-Bevel (K) Groove Weld',
    awsSymbolCode: 'AWS TC-U5b',
    isoSymbolCode: 'ISO 2553 Double-Bevel (K)',
    summary: 'Double-sided bevel on one member for heavy structural column/beam connections.',
  },
  {
    type: JointType.SINGLE_U,
    nameVi: 'Giáp mối rãnh chữ U (Single-U)',
    nameEn: 'Single-U Groove Weld',
    awsSymbolCode: 'AWS B-U6',
    isoSymbolCode: 'ISO 2553 Single-U (U)',
    summary: 'Machined U-groove saving filler metal on thick-walled vessels (>20 mm).',
  },
  {
    type: JointType.SINGLE_J,
    nameVi: 'Mối hàn rãnh chữ J (Single-J)',
    nameEn: 'Single-J Groove Weld',
    awsSymbolCode: 'AWS TC-U8a / B-U8',
    isoSymbolCode: 'ISO 2553 Single-J (J)',
    summary: 'Single-sided J-groove for heavy T-joints and thick-section butt welds.',
  },
  {
    type: JointType.SQUARE,
    nameVi: 'Giáp mối không vát mép (Square)',
    nameEn: 'Square Groove Butt Weld',
    awsSymbolCode: 'AWS B-L1b',
    isoSymbolCode: 'ISO 2553 Square (I)',
    summary: 'Unbeveled butt joint for thin sheet/plate (t ≤ 6 mm) or deep-penetration SAW.',
  },
];

export const WPS_TEMPLATES: WPSReferenceTemplate[] = [
  {
    id: 'wps-1',
    wpsCode: 'WPS-GMAW-CS-01',
    title: 'GMAW Semi-Automatic Structural Steel (Fillet & Single-V)',
    process: WeldingProcess.GMAW,
    jointTypes: [JointType.FILLET, JointType.SINGLE_V, JointType.SINGLE_BEVEL],
    materialGroup: 'AWS D1.1 Group I & II (SS400, SM490, A36, Q345B, S355)',
    fillerMetalClass: 'AWS A5.18 ER70S-6 (Ø1.2 mm)',
    currentRangeAmp: '190 – 260 A (DCEP)',
    voltageRangeV: '24 – 30 V',
    travelSpeedMmMin: '250 – 380 mm/min',
    shieldingGasOrFlux: '100% CO₂ or 80% Ar + 20% CO₂ (18 L/min)',
    preheatTempC: 'Min 20°C (≥ 65°C if t > 25 mm)',
    standardCompliance: 'AWS D1.1 / ISO 15614-1',
  },
  {
    id: 'wps-2',
    wpsCode: 'WPS-SAW-HB-02',
    title: 'SAW Submerged Arc Built-Up H-Beam & Heavy Plate',
    process: WeldingProcess.SAW,
    jointTypes: [JointType.FILLET, JointType.DOUBLE_V, JointType.DOUBLE_BEVEL],
    materialGroup: 'AWS D1.1 Group I & II (S355JR, A572 Gr.50)',
    fillerMetalClass: 'AWS A5.17 F7A2-EM12K (Ø3.2 / Ø4.0 mm)',
    currentRangeAmp: '450 – 650 A (DCEP)',
    voltageRangeV: '29 – 35 V',
    travelSpeedMmMin: '400 – 600 mm/min',
    shieldingGasOrFlux: 'Agglomerated Flux OK 10.71 (Ratio 1.1 kg/kg wire)',
    preheatTempC: '50°C – 110°C depending on thickness',
    standardCompliance: 'AWS D1.1 / EN ISO 15614-1',
  },
  {
    id: 'wps-3',
    wpsCode: 'WPS-FCAW-CJP-03',
    title: 'FCAW-G Complete Joint Penetration (CJP Groove)',
    process: WeldingProcess.FCAW,
    jointTypes: [JointType.SINGLE_V, JointType.DOUBLE_V, JointType.SINGLE_BEVEL, JointType.DOUBLE_BEVEL],
    materialGroup: 'High-Strength Structural & Bridge Steel (Q345qD, SM520)',
    fillerMetalClass: 'AWS A5.20 E71T-1C / E71T-1M (Ø1.2 mm)',
    currentRangeAmp: '180 – 250 A (DCEP)',
    voltageRangeV: '25 – 29 V',
    travelSpeedMmMin: '220 – 340 mm/min',
    shieldingGasOrFlux: '100% CO₂ (20 L/min)',
    preheatTempC: '60°C – 120°C',
    standardCompliance: 'AWS D1.1 / AWS D1.5',
  },
  {
    id: 'wps-4',
    wpsCode: 'WPS-SMAW-SITE-04',
    title: 'SMAW Field Erection Low-Hydrogen Stick Welding',
    process: WeldingProcess.SMAW,
    jointTypes: [JointType.FILLET, JointType.SINGLE_V, JointType.SINGLE_BEVEL],
    materialGroup: 'Carbon & Low-Alloy Steel (A36, S275, S355)',
    fillerMetalClass: 'AWS A5.1 E7018 (Ø3.2 mm / Ø4.0 mm)',
    currentRangeAmp: '110 – 170 A (DCEP)',
    voltageRangeV: '21 – 26 V',
    travelSpeedMmMin: '120 – 200 mm/min',
    shieldingGasOrFlux: 'Low-Hydrogen Basic Coating (Redry 350°C × 2h)',
    preheatTempC: 'Min 50°C for t > 20 mm',
    standardCompliance: 'AWS D1.1 / ASME Section IX',
  },
  {
    id: 'wps-5',
    wpsCode: 'WPS-GTAW-SS-05',
    title: 'GTAW TIG Argon Purge Stainless Piping & Vessels',
    process: WeldingProcess.GTAW,
    jointTypes: [JointType.SINGLE_V, JointType.SINGLE_U, JointType.SINGLE_J, JointType.SQUARE],
    materialGroup: 'Austenitic Stainless Steel (SUS304L, SUS316L)',
    fillerMetalClass: 'AWS A5.9 ER308L / ER316L (Ø2.0 / Ø2.4 mm)',
    currentRangeAmp: '90 – 145 A (DCEN)',
    voltageRangeV: '11 – 15 V',
    travelSpeedMmMin: '75 – 130 mm/min',
    shieldingGasOrFlux: '99.995% Pure Argon (12 L/min + Back purge 8 L/min)',
    preheatTempC: 'No Preheat (Interpass ≤ 150°C)',
    standardCompliance: 'ASME Section IX / ISO 15614-1',
  },
];
