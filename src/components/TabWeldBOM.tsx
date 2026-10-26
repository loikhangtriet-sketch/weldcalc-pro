import React, { useState } from 'react';
import {
  JointType,
  PROCESS_PRESETS,
  ProjectSettings,
  WeldBOMItem,
  WeldingProcess,
} from '../types/welding';
import {
  calculateWeldJoint,
  displayWeightKg,
  displayWeldLengthM,
  formatCurrency,
  formatNumber,
} from '../utils/calculations';
import { getTranslation } from '../i18n/translations';
import { getTechnicalTranslation } from '../i18n/wpsAndTechnicalTranslations';
import {
  downloadSampleExcelTemplateXlsx,
  ParsedExcelRow,
  parseUploadedExcelBuffer,
} from '../utils/excelHelper';
import {
  Trash2,
  Copy,
  RotateCcw,
  Search,
  Layers,
  PlusCircle,
  Upload,
  FileSpreadsheet,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  X,
  Download,
} from 'lucide-react';

interface TabWeldBOMProps {
  settings: ProjectSettings;
  bomItems: WeldBOMItem[];
  onUpdateBOMItems: (items: WeldBOMItem[]) => void;
  onResetSampleBOM: () => void;
  onSwitchToCalculator: () => void;
}

export const TabWeldBOM: React.FC<TabWeldBOMProps> = ({
  settings,
  bomItems,
  onUpdateBOMItems,
  onResetSampleBOM,
  onSwitchToCalculator,
}) => {
  const t = getTranslation(settings.language);
  const tech = getTechnicalTranslation(settings.language);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [processFilter, setProcessFilter] = useState<string>('ALL');
  const [showFormGuide, setShowFormGuide] = useState<boolean>(false);
  const [previewRows, setPreviewRows] = useState<ParsedExcelRow[] | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  const filteredItems = bomItems.filter((item) => {
    const matchesProcess =
      processFilter === 'ALL' || item.input.process === processFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.weldTag.toLowerCase().includes(q) ||
      item.structuralMember.toLowerCase().includes(q) ||
      item.wpsRef.toLowerCase().includes(q);
    return matchesProcess && matchesSearch;
  });

  const handleQuantityChange = (id: string, nextQty: number) => {
    const updated = bomItems.map((item) => {
      if (item.id !== id) return item;
      const nextInput = { ...item.input, quantity: Math.max(1, nextQty) };
      return {
        ...item,
        input: nextInput,
        result: calculateWeldJoint(nextInput, settings),
      };
    });
    onUpdateBOMItems(updated);
  };

  const handleLengthChange = (id: string, nextLengthM: number) => {
    const updated = bomItems.map((item) => {
      if (item.id !== id) return item;
      const nextInput = {
        ...item.input,
        weldLengthM: Math.max(0.05, nextLengthM),
      };
      return {
        ...item,
        input: nextInput,
        result: calculateWeldJoint(nextInput, settings),
      };
    });
    onUpdateBOMItems(updated);
  };

  const handleDuplicate = (item: WeldBOMItem) => {
    const clone: WeldBOMItem = {
      ...item,
      id: `weld-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      weldTag: `${item.weldTag}-COPY`,
    };
    onUpdateBOMItems([...bomItems, clone]);
  };

  const handleDelete = (id: string) => {
    onUpdateBOMItems(bomItems.filter((i) => i.id !== id));
  };

  const handleExcelFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const buf = evt.target?.result;
      if (buf instanceof ArrayBuffer) {
        const parsed = parseUploadedExcelBuffer(buf, settings);
        if (parsed.length > 0) {
          setPreviewRows(parsed);
        }
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  const handleConfirmAppend = () => {
    if (!previewRows) return;
    onUpdateBOMItems([...bomItems, ...previewRows.map((r) => r.item)]);
    setPreviewRows(null);
    setUploadedFileName('');
  };

  const handleConfirmReplace = () => {
    if (!previewRows) return;
    onUpdateBOMItems(previewRows.map((r) => r.item));
    setPreviewRows(null);
    setUploadedFileName('');
  };

  const totals = bomItems.reduce(
    (acc, item) => {
      acc.totalLengthM += item.result.totalLengthM;
      acc.netWeightKg += item.result.netWeldWeightKg;
      acc.grossWeightKg += item.result.grossConsumableWeightKg;
      acc.gasM3 += item.result.shieldingGasM3;
      acc.fluxKg += item.result.fluxWeightKg;
      acc.arcHours += item.result.arcOnTimeHours;
      acc.laborHours += item.result.totalLaborHours;
      acc.totalCost += item.result.totalCost;
      return acc;
    },
    {
      totalLengthM: 0,
      netWeightKg: 0,
      grossWeightKg: 0,
      gasM3: 0,
      fluxKg: 0,
      arcHours: 0,
      laborHours: 0,
      totalCost: 0,
    }
  );

  const processSummary = Object.values(WeldingProcess)
    .map((proc) => {
      const items = bomItems.filter((i) => i.input.process === proc);
      const netKg = items.reduce((s, i) => s + i.result.netWeldWeightKg, 0);
      const grossKg = items.reduce(
        (s, i) => s + i.result.grossConsumableWeightKg,
        0
      );
      const gasM3 = items.reduce((s, i) => s + i.result.shieldingGasM3, 0);
      const fluxKg = items.reduce((s, i) => s + i.result.fluxWeightKg, 0);
      const laborH = items.reduce((s, i) => s + i.result.totalLaborHours, 0);
      const cost = items.reduce((s, i) => s + i.result.totalCost, 0);
      return {
        proc,
        count: items.length,
        consumableLabel:
          tech.processConsumables[proc] ||
          PROCESS_PRESETS[proc].consumableLabel,
        netKg,
        grossKg,
        gasM3,
        fluxKg,
        laborH,
        cost,
      };
    })
    .filter((g) => g.count > 0);

  const netWtTotalDisp = displayWeightKg(
    totals.netWeightKg,
    settings.unitSystem
  );
  const grossWtTotalDisp = displayWeightKg(
    totals.grossWeightKg,
    settings.unitSystem
  );
  const lenTotalDisp = displayWeldLengthM(
    totals.totalLengthM,
    settings.unitSystem
  );

  const templateGuideColumns = [
    {
      col: t.excelCols.weldTag,
      req: true,
      desc: t.t1WeldTag,
      example: 'W-101, W-102',
    },
    {
      col: t.excelCols.member,
      req: true,
      desc: t.t1MemberName,
      example: 'H-Beam H600x300 / Flange Splice',
    },
    {
      col: t.excelCols.wpsCode,
      req: false,
      desc: t.t1WpsCode,
      example: 'WPS-GMAW-CS-01',
    },
    {
      col: t.excelCols.jointType,
      req: true,
      desc: 'fillet, single_v, double_v, single_bevel, double_bevel, single_u, single_j, square',
      example: 'fillet / single_v',
    },
    {
      col: t.excelCols.process,
      req: true,
      desc: 'SMAW, GMAW, FCAW, GTAW, SAW',
      example: 'GMAW / SAW',
    },
    {
      col: t.excelCols.lengthM,
      req: true,
      desc: `${t.t1LengthPerWeld} (m)`,
      example: '6.0',
    },
    {
      col: t.excelCols.quantity,
      req: true,
      desc: t.t1Quantity,
      example: '8',
    },
    {
      col: t.excelCols.filletSizeMm,
      req: false,
      desc: `${t.t1LegZ} / ${t.t1ThroatA} (mm)`,
      example: '8.0',
    },
    {
      col: t.excelCols.filletMode,
      req: false,
      desc: 'LEG_Z (AWS z) / THROAT_A (ISO a)',
      example: 'LEG_Z',
    },
    {
      col: t.excelCols.doubleSide,
      req: false,
      desc: `${t.t1DoubleFillet} (TRUE / FALSE)`,
      example: 'TRUE',
    },
    {
      col: t.excelCols.thicknessMm,
      req: false,
      desc: `${t.t1PlateThickness} (mm)`,
      example: '16.0',
    },
    {
      col: t.excelCols.grooveAngleDeg,
      req: false,
      desc: `${t.t1GrooveAngle} / ${t.t1BevelAngle}`,
      example: '60',
    },
    {
      col: t.excelCols.rootGapMm,
      req: false,
      desc: `${t.t1RootGap} (mm)`,
      example: '2.5',
    },
    {
      col: t.excelCols.rootFaceMm,
      req: false,
      desc: `${t.t1RootFace} (mm)`,
      example: '2.0',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top 4 KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-xs text-slate-500">{t.t2KpiNetWeight}</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {formatNumber(netWtTotalDisp.value, 2)} {netWtTotalDisp.unit}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-mono tabular-nums">
            L = {formatNumber(lenTotalDisp.value, 1)} {lenTotalDisp.unit}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-xs text-slate-500">{t.t2KpiGrossWeight}</div>
          <div className="text-2xl font-bold font-mono text-orange-600 mt-1 tabular-nums">
            {formatNumber(grossWtTotalDisp.value, 2)} {grossWtTotalDisp.unit}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-mono tabular-nums">
            η_avg ={' '}
            {totals.grossWeightKg > 0
              ? formatNumber(
                  (totals.netWeightKg / totals.grossWeightKg) * 100,
                  1
                )
              : 0}
            %
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-xs text-slate-500">{t.t2KpiAux}</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {formatNumber(totals.gasM3, 2)} m³ · {formatNumber(totals.fluxKg, 1)}{' '}
            kg
          </div>
          <div className="text-xs text-slate-500 mt-1">
            CO₂/Ar (m³) · SAW Flux (kg)
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-xs text-slate-500">{t.t2KpiTotalCost}</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {formatCurrency(totals.totalCost, settings.currencySymbol)}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-mono tabular-nums">
            {formatNumber(totals.laborHours, 1)} h (Arc:{' '}
            {formatNumber(totals.arcHours, 1)} h)
          </div>
        </div>
      </div>

      {/* Interactive Excel Template & Form Guide Panel (Toggleable) */}
      {showFormGuide && (
        <div className="bg-white border border-slate-300 rounded-lg overflow-hidden">
          <div className="px-5 py-3.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-orange-400" />
                <span>{t.t2GuidePanelTitle}</span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {t.t2GuidePanelSubtitle}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => downloadSampleExcelTemplateXlsx(settings)}
                className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.t2DownloadTemplateBtn}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowFormGuide(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className="text-xs font-mono text-slate-700 bg-slate-100 border border-slate-200 rounded-md px-3.5 py-2">
              {t.t2GuideNoteCodes}
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                    <th className="py-2 px-3">#</th>
                    <th className="py-2 px-3">{t.t2GuideColHeader}</th>
                    <th className="py-2 px-3">{t.t2GuideDescHeader}</th>
                    <th className="py-2 px-3">{t.t2GuideExampleHeader}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {templateGuideColumns.map((c, idx) => (
                    <tr key={c.col} className="hover:bg-slate-50">
                      <td className="py-1.5 px-3 font-mono text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-1.5 px-3 font-mono font-semibold text-slate-900">
                        {c.col}
                        {c.req && (
                          <span className="text-orange-600 ml-1">*</span>
                        )}
                      </td>
                      <td className="py-1.5 px-3 text-slate-700">{c.desc}</td>
                      <td className="py-1.5 px-3 font-mono text-slate-600">
                        {c.example}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Excel Import Validation & Preview Panel (Shows when user uploads a file) */}
      {previewRows && (
        <div className="bg-white border-2 border-orange-500 rounded-lg overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 bg-orange-50 border-b border-orange-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-orange-600" />
                <span>
                  {t.t2PreviewPanelTitle}:{' '}
                  <span className="font-mono text-orange-700">
                    {uploadedFileName}
                  </span>
                </span>
              </h3>
              <div className="text-xs text-slate-600 mt-0.5 font-mono">
                {previewRows.length} {t.t2PreviewValidRows} ·{' '}
                {
                  previewRows.filter((r) => r.status === 'AUTO_ADJUSTED').length
                }{' '}
                {t.t2PreviewAutoRows}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleConfirmAppend}
                className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
              >
                + {t.t2AppendBtn} (+{previewRows.length})
              </button>
              <button
                type="button"
                onClick={handleConfirmReplace}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
              >
                {t.t2ReplaceBtn} ({previewRows.length})
              </button>
              <button
                type="button"
                onClick={() => setPreviewRows(null)}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-medium rounded-md transition-colors cursor-pointer"
              >
                {t.t2CancelBtn}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-72">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                  <th className="py-2 px-3">{tech.colRow}</th>
                  <th className="py-2 px-3">{tech.colStatus}</th>
                  <th className="py-2 px-3">{t.t2ColTag}</th>
                  <th className="py-2 px-3">{t.t2ColMember}</th>
                  <th className="py-2 px-3">{t.t2ColJointAndDim}</th>
                  <th className="py-2 px-3">{t.t2ColProcess}</th>
                  <th className="py-2 px-3 text-right">{t.t2ColLength}</th>
                  <th className="py-2 px-3 text-right">{t.t2ColQty}</th>
                  <th className="py-2 px-3 text-right">{t.t2ColNet}</th>
                  <th className="py-2 px-3 text-right">{t.t2ColGross}</th>
                  <th className="py-2 px-3 text-right">
                    {t.t2ColCost} ({settings.currencySymbol})
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {previewRows.map((r) => (
                  <tr key={r.item.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-mono text-slate-500">
                      #{r.rowNumber}
                    </td>
                    <td className="py-2 px-3">
                      {r.status === 'VALID' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{tech.statusValid}</span>
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 text-amber-700 font-medium"
                          title={r.notes.join(', ')}
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>
                            {tech.statusAuto} ({r.notes.join(', ')})
                          </span>
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 font-mono font-bold text-slate-900">
                      {r.item.weldTag}
                    </td>
                    <td className="py-2 px-3 text-slate-800 truncate max-w-xs">
                      {r.item.structuralMember}
                    </td>
                    <td className="py-2 px-3 font-mono text-slate-700">
                      {t.jointNames[r.item.input.jointType]}
                    </td>
                    <td className="py-2 px-3 font-mono font-semibold">
                      {r.item.input.process}
                    </td>
                    <td className="py-2 px-3 text-right font-mono tabular-nums">
                      {formatNumber(r.item.input.weldLengthM, 2)}
                    </td>
                    <td className="py-2 px-3 text-right font-mono tabular-nums">
                      {r.item.input.quantity}
                    </td>
                    <td className="py-2 px-3 text-right font-mono tabular-nums">
                      {formatNumber(r.item.result.netWeldWeightKg, 2)}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-orange-600 tabular-nums">
                      {formatNumber(r.item.result.grossConsumableWeightKg, 2)}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-semibold tabular-nums">
                      {formatCurrency(
                        r.item.result.totalCost,
                        settings.currencySymbol
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Section A: Weld List Schedule Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              {t.t2ScheduleTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{t.t2ScheduleDesc}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.t2SearchPlaceholder}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-orange-600"
              />
            </div>

            {/* Process filter */}
            <select
              value={processFilter}
              onChange={(e) => setProcessFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-orange-600"
            >
              <option value="ALL">
                {t.t2AllProcesses} ({bomItems.length})
              </option>
              {Object.values(WeldingProcess).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            {/* Toggle Form Guide */}
            <button
              type="button"
              onClick={() => setShowFormGuide((prev) => !prev)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                showFormGuide
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t.t2ExcelGuideBtn}</span>
            </button>

            {/* Download 1-Sheet Sample Excel (.xlsx) */}
            <button
              type="button"
              onClick={() => downloadSampleExcelTemplateXlsx(settings)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.t2DownloadTemplateBtn}</span>
            </button>

            {/* Upload Excel (.xlsx, .xls, .csv) */}
            <label className="px-3.5 py-1.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0">
              <Upload className="w-3.5 h-3.5" />
              <span>{t.t2UploadExcelBtn}</span>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleExcelFileUpload}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={onResetSampleBOM}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded-md transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.t2ResetSampleBtn}</span>
            </button>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onSwitchToCalculator}
                className="px-4 py-2 bg-orange-600 text-white text-xs font-semibold rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t.navTab1}</span>
              </button>
              <button
                type="button"
                onClick={onResetSampleBOM}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              >
                {t.t2ResetSampleBtn}
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                  <th className="py-2.5 px-3">{t.t2ColTag}</th>
                  <th className="py-2.5 px-3">{t.t2ColMember}</th>
                  <th className="py-2.5 px-3">{t.t2ColJointAndDim}</th>
                  <th className="py-2.5 px-3">{t.t2ColProcess}</th>
                  <th className="py-2.5 px-3 text-right">{t.t2ColLength}</th>
                  <th className="py-2.5 px-3 text-right">{t.t2ColQty}</th>
                  <th className="py-2.5 px-3 text-right">{t.t2ColArea}</th>
                  <th className="py-2.5 px-3 text-right">{t.t2ColNet}</th>
                  <th className="py-2.5 px-3 text-right">{t.t2ColGross}</th>
                  <th className="py-2.5 px-3 text-right">{t.t2ColAux}</th>
                  <th className="py-2.5 px-3 text-right">{t.t2ColLabor}</th>
                  <th className="py-2.5 px-3 text-right">
                    {t.t2ColCost} ({settings.currencySymbol})
                  </th>
                  <th className="py-2.5 px-3 text-center">{t.t2ColAction}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {filteredItems.map((item) => {
                  const isFillet = item.input.jointType === JointType.FILLET;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/90 transition-colors"
                    >
                      <td className="py-2.5 px-3 font-mono font-semibold text-slate-900 whitespace-nowrap">
                        {item.weldTag}
                      </td>
                      <td className="py-2.5 px-3 max-w-xs">
                        <div className="font-medium text-slate-900 truncate">
                          {item.structuralMember}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {item.wpsRef}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="text-slate-800 font-medium">
                          {t.jointNames[item.input.jointType]}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                          {isFillet
                            ? `z=${formatNumber(
                                item.result.EffectiveLegZMm,
                                1
                              )}mm (a=${formatNumber(
                                item.result.EffectiveThroatAMm,
                                1
                              )}mm)${item.input.isDoubleFillet ? ' ×2' : ''}`
                            : `t=${item.input.plateThicknessMm}mm · α=${item.input.grooveAngleDeg}° · R=${item.input.rootGapMm}mm`}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-slate-800 whitespace-nowrap">
                        {item.input.process}
                        <span className="block text-[10px] font-normal text-slate-500">
                          η={item.input.depositionEfficiencyPct}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                        <input
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={item.input.weldLengthM}
                          onChange={(e) =>
                            handleLengthChange(
                              item.id,
                              parseFloat(e.target.value) || 0.1
                            )
                          }
                          className="w-16 px-1.5 py-0.5 text-right text-xs font-mono bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-orange-600 tabular-nums"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={item.input.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.id,
                              parseInt(e.target.value, 10) || 1
                            )
                          }
                          className="w-14 px-1.5 py-0.5 text-right text-xs font-mono bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-orange-600 tabular-nums"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-700 tabular-nums whitespace-nowrap">
                        {formatNumber(item.result.totalAreaMm2, 1)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-900 tabular-nums whitespace-nowrap">
                        {formatNumber(item.result.netWeldWeightKg, 2)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-orange-600 tabular-nums whitespace-nowrap">
                        {formatNumber(item.result.grossConsumableWeightKg, 2)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-700 tabular-nums whitespace-nowrap">
                        {item.result.shieldingGasM3 > 0
                          ? `${formatNumber(item.result.shieldingGasM3, 2)} m³`
                          : item.result.fluxWeightKg > 0
                          ? `${formatNumber(item.result.fluxWeightKg, 2)} kg`
                          : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-700 tabular-nums whitespace-nowrap">
                        {formatNumber(item.result.totalLaborHours, 2)} h
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                        {formatCurrency(
                          item.result.totalCost,
                          settings.currencySymbol
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDuplicate(item)}
                            className="p-1 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="p-1 text-slate-500 hover:text-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section B: Consumables BOM Grouped by Welding Process */}
      {processSummary.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-600" />
              <span>{t.t2ConsumablesSummaryTitle}</span>
            </h3>
            <span className="text-xs text-slate-500">
              {t.t2ConsumablesSummarySub}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                  <th className="py-2.5 px-3">{t.t2ColProcess}</th>
                  <th className="py-2.5 px-3">{tech.colSpecification}</th>
                  <th className="py-2.5 px-3 text-right">{t.t2ColQty}</th>
                  <th className="py-2.5 px-3 text-right">{t.t2ColNet}</th>
                  <th className="py-2.5 px-3 text-right">{t.t2ColGross}</th>
                  <th className="py-2.5 px-3 text-right">Gas (m³)</th>
                  <th className="py-2.5 px-3 text-right">SAW Flux (kg)</th>
                  <th className="py-2.5 px-3 text-right">{t.t2ColLabor}</th>
                  <th className="py-2.5 px-3 text-right">
                    {t.t2ColCost} ({settings.currencySymbol})
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {processSummary.map((row) => (
                  <tr key={row.proc} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                      {row.proc}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">
                      {row.consumableLabel}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                      {row.count}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                      {formatNumber(row.netKg, 2)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-orange-600 tabular-nums">
                      {formatNumber(row.grossKg, 2)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                      {row.gasM3 > 0 ? formatNumber(row.gasM3, 2) : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                      {row.fluxKg > 0 ? formatNumber(row.fluxKg, 2) : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                      {formatNumber(row.laborH, 2)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900 tabular-nums">
                      {formatCurrency(row.cost, settings.currencySymbol)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
