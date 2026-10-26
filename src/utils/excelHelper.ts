import * as XLSX from 'xlsx';
import {
  FilletDimensionMode,
  JointGeometryInput,
  JointType,
  PROCESS_PRESETS,
  ProjectSettings,
  WeldBOMItem,
  WeldingProcess,
} from '../types/welding';
import { calculateWeldJoint } from './calculations';
import { getTranslation } from '../i18n/translations';
import {
  getLocalizedSampleData,
  getTechnicalTranslation,
} from '../i18n/wpsAndTechnicalTranslations';

export interface ParsedExcelRow {
  rowNumber: number;
  status: 'VALID' | 'AUTO_ADJUSTED';
  notes: string[];
  item: WeldBOMItem;
}

/**
 * Normalizes column header keys so users can upload files with headers in any of the 12 languages
 * or standard English/Vietnamese technical column names.
 */
function findColumnValue(
  rowObj: Record<string, any>,
  aliases: string[]
): any {
  const keys = Object.keys(rowObj);
  for (const alias of aliases) {
    const lowerAlias = alias.toLowerCase().trim();
    const matchedKey = keys.find((k) => {
      const cleanK = k.toLowerCase().trim();
      return cleanK === lowerAlias || cleanK.includes(lowerAlias);
    });
    if (
      matchedKey &&
      rowObj[matchedKey] !== undefined &&
      rowObj[matchedKey] !== null &&
      String(rowObj[matchedKey]).trim() !== ''
    ) {
      return rowObj[matchedKey];
    }
  }
  return undefined;
}

function normalizeJointType(raw: any): { jointType: JointType; adjusted: boolean } {
  const s = String(raw || '')
    .toLowerCase()
    .trim();
  if (!s) return { jointType: JointType.FILLET, adjusted: true };

  if (s.includes('fillet') || s.includes('góc') || s.includes('goc') || s.includes('角') || s.includes('すみ肉') || s.includes('필릿')) {
    return { jointType: JointType.FILLET, adjusted: false };
  }
  if (s === 'double_v' || s.includes('double-v') || s.includes('v kép') || s.includes('chữ x') || s.includes('双v') || s.includes('x形') || s === 'x') {
    return { jointType: JointType.DOUBLE_V, adjusted: false };
  }
  if (s === 'single_v' || s.includes('single-v') || s.includes('v đơn') || s.includes('chữ v') || s.includes('单v') || s.includes('v形') || s === 'v') {
    return { jointType: JointType.SINGLE_V, adjusted: false };
  }
  if (s === 'double_bevel' || s.includes('double-bevel') || s.includes('vát kép') || s.includes('chữ k') || s.includes('k形') || s === 'k') {
    return { jointType: JointType.DOUBLE_BEVEL, adjusted: false };
  }
  if (s === 'single_bevel' || s.includes('bevel') || s.includes('vát đơn') || s.includes('hv') || s.includes('レ形')) {
    return { jointType: JointType.SINGLE_BEVEL, adjusted: false };
  }
  if (s === 'single_u' || s.includes('rãnh u') || s.includes('u-groove') || s === 'u') {
    return { jointType: JointType.SINGLE_U, adjusted: false };
  }
  if (s === 'single_j' || s.includes('rãnh j') || s.includes('j-groove') || s === 'j') {
    return { jointType: JointType.SINGLE_J, adjusted: false };
  }
  if (s === 'square' || s.includes('thẳng') || s.includes('i形') || s === 'i') {
    return { jointType: JointType.SQUARE, adjusted: false };
  }
  return { jointType: JointType.FILLET, adjusted: true };
}

function normalizeProcess(raw: any): { process: WeldingProcess; adjusted: boolean } {
  const s = String(raw || '')
    .toUpperCase()
    .trim();
  if (s.includes('SAW') || s.includes('121')) {
    return { process: WeldingProcess.SAW, adjusted: false };
  }
  if (s.includes('FCAW') || s.includes('136')) {
    return { process: WeldingProcess.FCAW, adjusted: false };
  }
  if (s.includes('GTAW') || s.includes('TIG') || s.includes('141')) {
    return { process: WeldingProcess.GTAW, adjusted: false };
  }
  if (s.includes('SMAW') || s.includes('MMA') || s.includes('111') || s.includes('QUE')) {
    return { process: WeldingProcess.SMAW, adjusted: false };
  }
  if (s.includes('GMAW') || s.includes('MIG') || s.includes('MAG') || s.includes('135') || s.includes('CO2')) {
    return { process: WeldingProcess.GMAW, adjusted: false };
  }
  return { process: WeldingProcess.GMAW, adjusted: true };
}

/**
 * Generates and downloads a 1-Sheet Sample Excel Template (.xlsx) localized in the active language
 */
export function downloadSampleExcelTemplateXlsx(settings: ProjectSettings) {
  const t = getTranslation(settings.language);
  const sampleMeta = getLocalizedSampleData(settings.language);
  const c = t.excelCols;

  const sampleRows = [
    {
      [c.weldTag]: 'W-101',
      [c.member]: sampleMeta.samples['sample-1'],
      [c.wpsCode]: 'WPS-SAW-HB-02',
      [c.jointType]: 'fillet',
      [c.process]: 'SAW',
      [c.lengthM]: 12.0,
      [c.quantity]: 8,
      [c.filletSizeMm]: 10,
      [c.filletMode]: 'LEG_Z',
      [c.doubleSide]: 'TRUE',
      [c.thicknessMm]: 14,
      [c.grooveAngleDeg]: 60,
      [c.rootGapMm]: 2.0,
      [c.rootFaceMm]: 2.0,
    },
    {
      [c.weldTag]: 'W-102',
      [c.member]: sampleMeta.samples['sample-2'],
      [c.wpsCode]: 'WPS-FCAW-CJP-03',
      [c.jointType]: 'single_v',
      [c.process]: 'FCAW',
      [c.lengthM]: 0.45,
      [c.quantity]: 24,
      [c.filletSizeMm]: 8,
      [c.filletMode]: 'LEG_Z',
      [c.doubleSide]: 'FALSE',
      [c.thicknessMm]: 20,
      [c.grooveAngleDeg]: 60,
      [c.rootGapMm]: 3.0,
      [c.rootFaceMm]: 2.0,
    },
    {
      [c.weldTag]: 'W-103',
      [c.member]: sampleMeta.samples['sample-3'],
      [c.wpsCode]: 'WPS-GMAW-CS-01',
      [c.jointType]: 'single_bevel',
      [c.process]: 'GMAW',
      [c.lengthM]: 1.8,
      [c.quantity]: 16,
      [c.filletSizeMm]: 8,
      [c.filletMode]: 'LEG_Z',
      [c.doubleSide]: 'FALSE',
      [c.thicknessMm]: 18,
      [c.grooveAngleDeg]: 45,
      [c.rootGapMm]: 2.5,
      [c.rootFaceMm]: 2.0,
    },
    {
      [c.weldTag]: 'W-104',
      [c.member]: sampleMeta.samples['sample-4'],
      [c.wpsCode]: 'WPS-SAW-HB-02',
      [c.jointType]: 'double_v',
      [c.process]: 'SAW',
      [c.lengthM]: 6.0,
      [c.quantity]: 6,
      [c.filletSizeMm]: 8,
      [c.filletMode]: 'LEG_Z',
      [c.doubleSide]: 'FALSE',
      [c.thicknessMm]: 28,
      [c.grooveAngleDeg]: 60,
      [c.rootGapMm]: 2.0,
      [c.rootFaceMm]: 3.0,
    },
    {
      [c.weldTag]: 'W-105',
      [c.member]: sampleMeta.samples['sample-5'],
      [c.wpsCode]: 'WPS-SMAW-SITE-04',
      [c.jointType]: 'fillet',
      [c.process]: 'SMAW',
      [c.lengthM]: 0.55,
      [c.quantity]: 64,
      [c.filletSizeMm]: 6,
      [c.filletMode]: 'THROAT_A',
      [c.doubleSide]: 'TRUE',
      [c.thicknessMm]: 12,
      [c.grooveAngleDeg]: 60,
      [c.rootGapMm]: 2.0,
      [c.rootFaceMm]: 2.0,
    },
  ];

  const ws = XLSX.utils.json_to_sheet(sampleRows);
  ws['!cols'] = [
    { wch: 15 },
    { wch: 36 },
    { wch: 18 },
    { wch: 16 },
    { wch: 14 },
    { wch: 15 },
    { wch: 12 },
    { wch: 18 },
    { wch: 20 },
    { wch: 18 },
    { wch: 16 },
    { wch: 16 },
    { wch: 16 },
    { wch: 16 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Weld_BOM_Input');
  XLSX.writeFile(wb, `WeldCalc_Pro_Template_${settings.language || 'vi'}.xlsx`);
}

/**
 * Parses an uploaded Excel (.xlsx, .xls) or CSV file buffer into validated WeldBOMItem preview rows.
 */
export function parseUploadedExcelBuffer(
  buffer: ArrayBuffer,
  settings: ProjectSettings
): ParsedExcelRow[] {
  const wb = XLSX.read(buffer, { type: 'array' });
  const firstSheetName = wb.SheetNames[0];
  if (!firstSheetName) return [];

  const ws = wb.Sheets[firstSheetName];
  const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(ws, {
    defval: '',
  });

  const parsedResults: ParsedExcelRow[] = [];

  rawRows.forEach((rowObj, idx) => {
    const notes: string[] = [];
    let isAutoAdjusted = false;

    const rawTag = findColumnValue(rowObj, [
      'weld_tag',
      'ma_duong_han',
      'tag',
      'id',
      'mã',
      '焊缝编号',
      '溶接番号',
      '용접번호',
    ]);
    const weldTag = rawTag ? String(rawTag).trim() : `W-IMP-${idx + 1}`;
    if (!rawTag) {
      isAutoAdjusted = true;
      notes.push('Auto ID');
    }

    const rawMember = findColumnValue(rowObj, [
      'structural_member',
      'ten_cau_kien',
      'cau_kien',
      'member',
      'cấu kiện',
      '构件',
      '部材',
      '구조부재',
    ]);
    const structuralMember = rawMember
      ? String(rawMember).trim()
      : `Structural Weld Assembly #${idx + 1}`;

    const rawProcess = findColumnValue(rowObj, [
      'process',
      'phuong_phap',
      'phương pháp',
      '焊接方法',
      '溶接法',
      '용접법',
    ]);
    const procNorm = normalizeProcess(rawProcess);
    if (procNorm.adjusted) {
      isAutoAdjusted = true;
      notes.push('Default Process GMAW');
    }
    const process = procNorm.process;
    const preset = PROCESS_PRESETS[process];

    const rawJoint = findColumnValue(rowObj, [
      'joint_type',
      'kieu_lien_ket',
      'joint',
      'kiểu',
      '接头',
      '継手',
      '이음',
    ]);
    const jointNorm = normalizeJointType(rawJoint);
    if (jointNorm.adjusted && rawJoint) {
      isAutoAdjusted = true;
      notes.push('Default Fillet');
    }
    const jointType = jointNorm.jointType;

    const rawWps = findColumnValue(rowObj, [
      'wps_code',
      'ma_wps',
      'wps',
      '工艺编号',
      'wps番号',
    ]);
    const wpsRef = rawWps ? String(rawWps).trim() : `WPS-${process}-01`;

    const rawLength = findColumnValue(rowObj, [
      'length_m',
      'chieu_dai',
      'length',
      'dài',
      '长度',
      '溶接長',
      '길이',
    ]);
    const weldLengthM = Math.max(0.05, parseFloat(String(rawLength)) || 2.0);
    if (!rawLength) {
      isAutoAdjusted = true;
      notes.push('L=2.0m');
    }

    const rawQty = findColumnValue(rowObj, [
      'quantity',
      'so_luong',
      'qty',
      'sl',
      '数量',
      '수량',
    ]);
    const quantity = Math.max(1, parseInt(String(rawQty), 10) || 1);

    const rawFilletSize = findColumnValue(rowObj, [
      'fillet_size',
      'kich_thuoc_goc',
      'canh_han',
      'fillet_mm',
      '角焊尺寸',
      'すみ肉寸法',
      '필릿치수',
    ]);
    const filletSizeMm = Math.max(1, parseFloat(String(rawFilletSize)) || 8);

    const rawFilletMode = String(
      findColumnValue(rowObj, [
        'fillet_mode',
        'quy_uoc_goc',
        '角焊模式',
        '寸法モード',
        '치수모드',
      ]) || 'LEG_Z'
    )
      .toUpperCase()
      .trim();
    const filletMode = rawFilletMode.includes('THROAT') || rawFilletMode === 'A'
      ? FilletDimensionMode.THROAT_A
      : FilletDimensionMode.LEG_Z;

    const rawDouble = String(
      findColumnValue(rowObj, [
        'double_side',
        'han_2_phia',
        'double',
        '双侧',
        '両側',
        '양면',
      ]) ?? 'TRUE'
    )
      .toUpperCase()
      .trim();
    const isDoubleFillet =
      rawDouble === 'TRUE' ||
      rawDouble === '1' ||
      rawDouble === 'YES' ||
      rawDouble === 'CÓ' ||
      rawDouble === '2';

    const rawThickness = findColumnValue(rowObj, [
      'thickness',
      'chieu_day',
      't_mm',
      '板厚',
      '판두께',
    ]);
    const plateThicknessMm = Math.max(1, parseFloat(String(rawThickness)) || 16);

    const rawAngle = findColumnValue(rowObj, [
      'groove_angle',
      'goc_vat',
      'angle',
      '坡口角度',
      '開先角度',
      '개선각도',
    ]);
    const grooveAngleDeg = Math.max(
      5,
      Math.min(120, parseFloat(String(rawAngle)) || 60)
    );

    const rawGap = findColumnValue(rowObj, [
      'root_gap',
      'khe_ho',
      'gap',
      '根部间隙',
      'ルート間隔',
      '루트간격',
    ]);
    const rootGapMm = Math.max(0, parseFloat(String(rawGap)) ?? 2.5);

    const rawFace = findColumnValue(rowObj, [
      'root_face',
      'mat_re',
      'face',
      '钝边',
      'ルート面',
      '루트면',
    ]);
    const rootFaceMm = Math.max(0, parseFloat(String(rawFace)) ?? 2.0);

    const input: JointGeometryInput = {
      jointType,
      process,
      weldLengthM,
      quantity,
      reinforcementPct: 10,
      filletMode,
      filletSizeMm,
      isDoubleFillet,
      plateThicknessMm,
      grooveAngleDeg,
      rootGapMm,
      rootFaceMm,
      rootRadiusMm: 6.0,
      depositionEfficiencyPct: preset.defaultEfficiency,
      depositionRateKgH: preset.defaultDepositionRateKgH,
      operatingFactorPct: preset.defaultOperatingFactor,
      gasFlowLMin: preset.defaultGasFlowLMin,
      fluxToWireRatio: preset.defaultFluxRatio,
    };

    const result = calculateWeldJoint(input, settings);

    parsedResults.push({
      rowNumber: idx + 2,
      status: isAutoAdjusted ? 'AUTO_ADJUSTED' : 'VALID',
      notes,
      item: {
        id: `xlsx-${Date.now()}-${idx}`,
        weldTag,
        structuralMember,
        wpsRef,
        input,
        result,
      },
    });
  });

  return parsedResults;
}

/**
 * Exports the full Detailed Weld BOM Schedule as a native .xlsx Excel Workbook
 */
export function exportDetailedWeldBOMXlsx(
  settings: ProjectSettings,
  bomItems: WeldBOMItem[]
) {
  const t = getTranslation(settings.language);
  const rows = bomItems.map((item) => ({
    [t.t2ColTag]: item.weldTag,
    [t.t2ColMember]: item.structuralMember,
    WPS: item.wpsRef,
    Joint_Type: t.jointNames[item.input.jointType] || item.input.jointType,
    [t.t2ColProcess]: item.input.process,
    [t.t2ColLength]: Number(item.input.weldLengthM.toFixed(2)),
    [t.t2ColQty]: item.input.quantity,
    Total_Length_m: Number(item.result.totalLengthM.toFixed(2)),
    [t.t2ColArea]: Number(item.result.totalAreaMm2.toFixed(2)),
    Volume_cm3: Number(item.result.volumeCm3.toFixed(2)),
    [t.t2ColNet]: Number(item.result.netWeldWeightKg.toFixed(3)),
    'η (%)': item.input.depositionEfficiencyPct,
    [t.t2ColGross]: Number(item.result.grossConsumableWeightKg.toFixed(3)),
    Gas_m3: Number(item.result.shieldingGasM3.toFixed(3)),
    SAW_Flux_kg: Number(item.result.fluxWeightKg.toFixed(3)),
    Arc_Hours: Number(item.result.arcOnTimeHours.toFixed(2)),
    [t.t2ColLabor]: Number(item.result.totalLaborHours.toFixed(2)),
    Energy_kWh: Number(item.result.powerEnergyKwh.toFixed(2)),
    [`${t.t2ColCost} (${settings.currencySymbol})`]: Number(
      item.result.totalCost.toFixed(2)
    ),
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Welding_BOM');
  const cleanProject = settings.projectCode.replace(/[^a-zA-Z0-9_-]/g, '_');
  XLSX.writeFile(
    wb,
    `${cleanProject}_Welding_BOM_${settings.language || 'vi'}.xlsx`
  );
}

/**
 * Exports Process-Grouped Consumables Summary as a native .xlsx Excel Workbook
 */
export function exportConsumablesSummaryXlsx(
  settings: ProjectSettings,
  bomItems: WeldBOMItem[]
) {
  const t = getTranslation(settings.language);
  const tech = getTechnicalTranslation(settings.language);
  const summaryRows = Object.values(WeldingProcess)
    .map((proc) => {
      const items = bomItems.filter((i) => i.input.process === proc);
      if (items.length === 0) return null;
      return {
        [t.t2ColProcess]: proc,
        [tech.colSpecification]:
          tech.processConsumables[proc] ||
          PROCESS_PRESETS[proc].consumableLabel,
        [t.t2ColQty]: items.length,
        [t.t2ColNet]: Number(
          items.reduce((s, i) => s + i.result.netWeldWeightKg, 0).toFixed(3)
        ),
        [t.t2ColGross]: Number(
          items
            .reduce((s, i) => s + i.result.grossConsumableWeightKg, 0)
            .toFixed(3)
        ),
        'Gas (m³)': Number(
          items.reduce((s, i) => s + i.result.shieldingGasM3, 0).toFixed(3)
        ),
        'SAW Flux (kg)': Number(
          items.reduce((s, i) => s + i.result.fluxWeightKg, 0).toFixed(3)
        ),
        [t.t2ColLabor]: Number(
          items.reduce((s, i) => s + i.result.totalLaborHours, 0).toFixed(2)
        ),
        [`${t.t2ColCost} (${settings.currencySymbol})`]: Number(
          items.reduce((s, i) => s + i.result.totalCost, 0).toFixed(2)
        ),
      };
    })
    .filter(Boolean);

  const ws = XLSX.utils.json_to_sheet(summaryRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Consumables_Summary');
  const cleanProject = settings.projectCode.replace(/[^a-zA-Z0-9_-]/g, '_');
  XLSX.writeFile(
    wb,
    `${cleanProject}_Consumables_Summary_${settings.language || 'vi'}.xlsx`
  );
}
