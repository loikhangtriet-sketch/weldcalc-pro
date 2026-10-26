import React, { useEffect, useState } from 'react';
import {
  JointType,
  ProjectSettings,
  WeldBOMItem,
  WeldingProcess,
  WPSReferenceTemplate,
} from '../types/welding';
import { formatCurrency, formatNumber } from '../utils/calculations';
import { getTranslation } from '../i18n/translations';
import { getTechnicalTranslation } from '../i18n/wpsAndTechnicalTranslations';
import {
  downloadSampleExcelTemplateXlsx,
  exportConsumablesSummaryXlsx,
  exportDetailedWeldBOMXlsx,
} from '../utils/excelHelper';
import {
  Download,
  FileSpreadsheet,
  Printer,
  Copy,
  Check,
  BookOpen,
  FileText,
  Plus,
  CheckCircle2,
  Search,
  Layers,
  X,
} from 'lucide-react';

interface TabExportProps {
  settings: ProjectSettings;
  bomItems: WeldBOMItem[];
  onUpdateBOMItems: (items: WeldBOMItem[]) => void;
}

const STORAGE_KEY_CUSTOM_WPS_ITEMS = 'weldcalc_pro_custom_wps_items_v2';

export function exportDetailedWeldBOMCsv(
  settings: ProjectSettings,
  bomItems: WeldBOMItem[]
) {
  const t = getTranslation(settings.language);
  const headers = [
    t.t2ColTag,
    t.t2ColMember,
    'WPS',
    t.excelCols.jointType,
    t.t2ColProcess,
    t.t2ColLength,
    t.t2ColQty,
    t.excelCols.lengthM,
    t.t2ColArea,
    'V (cm³)',
    t.t2ColNet,
    'η (%)',
    t.t2ColGross,
    'Gas (m³)',
    'SAW Flux (kg)',
    'Arc (h)',
    t.t2ColLabor,
    'kWh',
    `${t.t2ColCost} (${settings.currencySymbol})`,
  ];

  const rows = bomItems.map((item) => [
    `"${item.weldTag}"`,
    `"${item.structuralMember.replace(/"/g, '""')}"`,
    `"${item.wpsRef}"`,
    `"${t.jointNames[item.input.jointType] || item.input.jointType}"`,
    `"${item.input.process}"`,
    item.input.weldLengthM.toFixed(2),
    item.input.quantity,
    item.result.totalLengthM.toFixed(2),
    item.result.totalAreaMm2.toFixed(2),
    item.result.volumeCm3.toFixed(2),
    item.result.netWeldWeightKg.toFixed(3),
    item.input.depositionEfficiencyPct,
    item.result.grossConsumableWeightKg.toFixed(3),
    item.result.shieldingGasM3.toFixed(3),
    item.result.fluxWeightKg.toFixed(3),
    item.result.arcOnTimeHours.toFixed(2),
    item.result.totalLaborHours.toFixed(2),
    item.result.powerEnergyKwh.toFixed(2),
    item.result.totalCost.toFixed(2),
  ]);

  const csvContent =
    '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const cleanProject = settings.projectCode.replace(/[^a-zA-Z0-9_-]/g, '_');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${cleanProject}_Welding_BOM_${settings.language || 'vi'}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const TabExportStreamlit: React.FC<TabExportProps> = ({
  settings,
  bomItems,
  onUpdateBOMItems,
}) => {
  const t = getTranslation(settings.language);
  const tech = getTechnicalTranslation(settings.language);

  const [copiedReport, setCopiedReport] = useState<boolean>(false);
  const [wpsProcessFilter, setWpsProcessFilter] = useState<string>('ALL');
  const [wpsSearchQuery, setWpsSearchQuery] = useState<string>('');
  const [assignedFeedback, setAssignedFeedback] = useState<string | null>(null);
  const [showNewWpsModal, setShowNewWpsModal] = useState<boolean>(false);

  // Store only user-created custom WPS items in localStorage so built-in 5 WPS templates dynamically translate across all 12 languages
  const [customWpsList, setCustomWpsList] = useState<WPSReferenceTemplate[]>(
    () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_WPS_ITEMS);
        if (saved) {
          const parsed = JSON.parse(saved) as WPSReferenceTemplate[];
          if (Array.isArray(parsed)) {
            return parsed;
          }
        }
      } catch {
        // ignore
      }
      return [];
    }
  );

  // Combined WPS list: user-created custom WPS + 5 dynamically localized standard WPS templates
  const allWpsList: WPSReferenceTemplate[] = [
    ...customWpsList,
    ...tech.wpsTemplates,
  ];

  const [selectedWpsId, setSelectedWpsId] = useState<string>('wps-1');

  // New WPS form state initialized from active language defaults
  const [newWpsCode, setNewWpsCode] = useState<string>('WPS-GMAW-CUSTOM-06');
  const [newWpsTitle, setNewWpsTitle] = useState<string>(
    tech.wpsNewDefaults.title
  );
  const [newWpsProcess, setNewWpsProcess] = useState<WeldingProcess>(
    WeldingProcess.GMAW
  );
  const [newWpsMaterial, setNewWpsMaterial] = useState<string>(
    tech.wpsNewDefaults.materialGroup
  );
  const [newWpsFiller, setNewWpsFiller] = useState<string>(
    tech.wpsNewDefaults.fillerMetalClass
  );
  const [newWpsCurrent, setNewWpsCurrent] = useState<string>(
    tech.wpsNewDefaults.currentRangeAmp
  );
  const [newWpsVoltage, setNewWpsVoltage] = useState<string>(
    tech.wpsNewDefaults.voltageRangeV
  );
  const [newWpsSpeed, setNewWpsSpeed] = useState<string>(
    tech.wpsNewDefaults.travelSpeedMmMin
  );
  const [newWpsGasFlux, setNewWpsGasFlux] = useState<string>(
    tech.wpsNewDefaults.shieldingGasOrFlux
  );
  const [newWpsPreheat, setNewWpsPreheat] = useState<string>(
    tech.wpsNewDefaults.preheatTempC
  );
  const [newWpsStandard, setNewWpsStandard] = useState<string>(
    tech.wpsNewDefaults.standardCompliance
  );

  // Sync new WPS form defaults when language changes
  useEffect(() => {
    setNewWpsTitle(tech.wpsNewDefaults.title);
    setNewWpsMaterial(tech.wpsNewDefaults.materialGroup);
    setNewWpsFiller(tech.wpsNewDefaults.fillerMetalClass);
    setNewWpsCurrent(tech.wpsNewDefaults.currentRangeAmp);
    setNewWpsVoltage(tech.wpsNewDefaults.voltageRangeV);
    setNewWpsSpeed(tech.wpsNewDefaults.travelSpeedMmMin);
    setNewWpsGasFlux(tech.wpsNewDefaults.shieldingGasOrFlux);
    setNewWpsPreheat(tech.wpsNewDefaults.preheatTempC);
    setNewWpsStandard(tech.wpsNewDefaults.standardCompliance);
  }, [settings.language, tech]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_CUSTOM_WPS_ITEMS,
        JSON.stringify(customWpsList)
      );
    } catch {
      // ignore
    }
  }, [customWpsList]);

  const triggerDownload = (
    content: string,
    filename: string,
    mimeType: string
  ) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Group consumables by process with localized consumable descriptions
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
      const arcH = items.reduce((s, i) => s + i.result.arcOnTimeHours, 0);
      const laborH = items.reduce((s, i) => s + i.result.totalLaborHours, 0);
      const kwh = items.reduce((s, i) => s + i.result.powerEnergyKwh, 0);
      const cost = items.reduce((s, i) => s + i.result.totalCost, 0);
      return {
        proc,
        count: items.length,
        consumableLabel: tech.processConsumables[proc],
        netKg,
        grossKg,
        gasM3,
        fluxKg,
        arcH,
        laborH,
        kwh,
        cost,
      };
    })
    .filter((g) => g.count > 0);

  // Grand totals
  const grandTotals = bomItems.reduce(
    (acc, item) => {
      acc.lengthM += item.result.totalLengthM;
      acc.volumeCm3 += item.result.volumeCm3;
      acc.netKg += item.result.netWeldWeightKg;
      acc.grossKg += item.result.grossConsumableWeightKg;
      acc.gasM3 += item.result.shieldingGasM3;
      acc.fluxKg += item.result.fluxWeightKg;
      acc.arcH += item.result.arcOnTimeHours;
      acc.laborH += item.result.totalLaborHours;
      acc.kwh += item.result.powerEnergyKwh;
      acc.consumableCost += item.result.consumableCost;
      acc.auxCost += item.result.gasCost + item.result.fluxCost;
      acc.laborCost += item.result.laborCost;
      acc.powerCost += item.result.powerCost;
      acc.totalCost += item.result.totalCost;
      return acc;
    },
    {
      lengthM: 0,
      volumeCm3: 0,
      netKg: 0,
      grossKg: 0,
      gasM3: 0,
      fluxKg: 0,
      arcH: 0,
      laborH: 0,
      kwh: 0,
      consumableCost: 0,
      auxCost: 0,
      laborCost: 0,
      powerCost: 0,
      totalCost: 0,
    }
  );

  const handleExportConsumablesSummaryCsv = () => {
    const headers = [
      t.t2ColProcess,
      tech.colSpecification,
      t.t2ColQty,
      t.t2ColNet,
      t.t2ColGross,
      'Gas (m³)',
      'SAW Flux (kg)',
      t.t2ColLabor,
      `${t.t2ColCost} (${settings.currencySymbol})`,
    ];

    const rows = processSummary.map((r) => [
      `"${r.proc}"`,
      `"${r.consumableLabel}"`,
      r.count,
      r.netKg.toFixed(3),
      r.grossKg.toFixed(3),
      r.gasM3.toFixed(3),
      r.fluxKg.toFixed(3),
      r.laborH.toFixed(2),
      r.cost.toFixed(2),
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const cleanProject = settings.projectCode.replace(/[^a-zA-Z0-9_-]/g, '_');
    triggerDownload(
      csvContent,
      `${cleanProject}_Consumables_Summary_${settings.language || 'vi'}.csv`,
      'text/csv;charset=utf-8;'
    );
  };

  const generateBidSummaryText = (): string => {
    const processLines = processSummary
      .map(
        (p) =>
          `  * ${p.proc.padEnd(5, ' ')} (${
            p.consumableLabel
          }): W_gross = ${p.grossKg.toFixed(
            2
          )} kg | Gas = ${p.gasM3.toFixed(2)} m³ | SAW Flux = ${p.fluxKg.toFixed(
            2
          )} kg | ${t.t2ColLabor} = ${p.laborH.toFixed(2)} h`
      )
      .join('\r\n');

    return `================================================================================
${t.t4LivePreviewTitle.toUpperCase()}
================================================================================
${t.sbProjectName} : ${settings.projectName} (${settings.projectCode})
${t.sbEngineer}    : ${settings.engineerName}
${t.ctxStandard}   : ${settings.standard}
${t.sbDensity}     : ${settings.customDensityGcm3} g/cm³
${tech.currencyLabel} : ${settings.currencySymbol}
--------------------------------------------------------------------------------
I. ${t.t2ConsumablesSummaryTitle}:
- ${t.t1Quantity}          : ${bomItems.length} ${tech.itemsUnit}
- ${t.t1LengthPerWeld}     : ${grandTotals.lengthM.toFixed(2)} m
- ${t.t1WeldVolume}        : ${grandTotals.volumeCm3.toFixed(2)} cm³
- ${t.t2KpiNetWeight}      : ${grandTotals.netKg.toFixed(2)} kg
- ${t.t2KpiGrossWeight}    : ${grandTotals.grossKg.toFixed(2)} kg
- ${t.t2KpiAux}            : ${grandTotals.gasM3.toFixed(2)} m³ / ${grandTotals.fluxKg.toFixed(2)} kg
- ${t.t3KpiArcTime}        : ${grandTotals.arcH.toFixed(2)} h
- ${t.t2ColLabor}          : ${grandTotals.laborH.toFixed(2)} h
- ${t.t3KpiPowerEnergy}    : ${grandTotals.kwh.toFixed(2)} kWh

${tech.byProcessLabel}
${processLines || '  (—)'}
--------------------------------------------------------------------------------
II. ${t.t3CostStructureTitle} (${settings.currencySymbol}):
1. ${t.t3CatConsumables} : ${formatCurrency(
      grandTotals.consumableCost,
      settings.currencySymbol
    )}
2. ${t.t3CatAux}         : ${formatCurrency(
      grandTotals.auxCost,
      settings.currencySymbol
    )}
3. ${t.t3CatLabor}       : ${formatCurrency(
      grandTotals.laborCost,
      settings.currencySymbol
    )}
4. ${t.t3CatPower}       : ${formatCurrency(
      grandTotals.powerCost,
      settings.currencySymbol
    )}
--------------------------------------------------------------------------------
=> ${t.ctxTotalCost.toUpperCase()} : ${formatCurrency(
      grandTotals.totalCost,
      settings.currencySymbol
    )}
================================================================================`;
  };

  const handleDownloadBidSummaryTxt = () => {
    const cleanProject = settings.projectCode.replace(/[^a-zA-Z0-9_-]/g, '_');
    triggerDownload(
      generateBidSummaryText(),
      `${cleanProject}_Bid_Summary_${settings.language || 'vi'}.txt`,
      'text/plain;charset=utf-8;'
    );
  };

  const handleCopyBidReport = () => {
    navigator.clipboard.writeText(generateBidSummaryText());
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  // Filtered WPS list
  const filteredWpsList = allWpsList.filter((w) => {
    const matchProc =
      wpsProcessFilter === 'ALL' || w.process === wpsProcessFilter;
    const q = wpsSearchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      w.wpsCode.toLowerCase().includes(q) ||
      w.title.toLowerCase().includes(q) ||
      w.materialGroup.toLowerCase().includes(q) ||
      w.fillerMetalClass.toLowerCase().includes(q);
    return matchProc && matchQuery;
  });

  const activeWps =
    allWpsList.find((w) => w.id === selectedWpsId) ||
    filteredWpsList[0] ||
    allWpsList[0];

  const handleAssignWpsToMatchingBOM = (
    wps: WPSReferenceTemplate,
    applyAll = false
  ) => {
    let updatedCount = 0;
    const nextBom = bomItems.map((item) => {
      if (applyAll || item.input.process === wps.process) {
        updatedCount++;
        return {
          ...item,
          wpsRef: wps.wpsCode,
        };
      }
      return item;
    });

    if (updatedCount > 0) {
      onUpdateBOMItems(nextBom);
      setAssignedFeedback(
        tech.wpsAssignedSuccessFmt(wps.wpsCode, updatedCount)
      );
    } else {
      setAssignedFeedback(tech.wpsAssignedEmptyFmt(wps.process));
    }
    setTimeout(() => setAssignedFeedback(null), 3500);
  };

  const handleDownloadWpsSheet = (wps: WPSReferenceTemplate) => {
    const content = `======================================================================
${tech.wpsSheetHeader}
======================================================================
${tech.wpsCodeLabel} : ${wps.wpsCode}
${tech.wpsTitleLabel} : ${wps.title}
${t.t2ColProcess} : ${wps.process}
${t.ctxStandard} : ${wps.standardCompliance}
----------------------------------------------------------------------
1. ${tech.wpsBaseMetalLabel} : ${wps.materialGroup}
2. ${tech.wpsFillerMetalLabel} : ${wps.fillerMetalClass}
3. ${tech.wpsCurrentLabel} : ${wps.currentRangeAmp}
4. ${tech.wpsVoltageLabel} : ${wps.voltageRangeV}
5. ${tech.wpsTravelSpeedLabel} : ${wps.travelSpeedMmMin}
6. ${tech.wpsGasFluxLabel} : ${wps.shieldingGasOrFlux}
7. ${tech.wpsPreheatLabel} : ${wps.preheatTempC}
======================================================================`;
    triggerDownload(
      content,
      `${wps.wpsCode}_${settings.language || 'vi'}_Specification_Sheet.txt`,
      'text/plain;charset=utf-8;'
    );
  };

  const handleCreateCustomWps = (e: React.FormEvent) => {
    e.preventDefault();
    const created: WPSReferenceTemplate = {
      id: `wps-custom-${Date.now()}`,
      wpsCode:
        newWpsCode.trim() || `WPS-${newWpsProcess}-${allWpsList.length + 1}`,
      title: newWpsTitle.trim() || `WPS ${newWpsProcess}`,
      process: newWpsProcess,
      jointTypes: [JointType.FILLET, JointType.SINGLE_V],
      materialGroup: newWpsMaterial.trim(),
      fillerMetalClass: newWpsFiller.trim(),
      currentRangeAmp: newWpsCurrent.trim(),
      voltageRangeV: newWpsVoltage.trim(),
      travelSpeedMmMin: newWpsSpeed.trim(),
      shieldingGasOrFlux: newWpsGasFlux.trim(),
      preheatTempC: newWpsPreheat.trim(),
      standardCompliance: newWpsStandard.trim(),
    };
    setCustomWpsList((prev) => [created, ...prev]);
    setSelectedWpsId(created.id);
    setShowNewWpsModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Section 1: 3 Primary Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 no-print">
        {/* Card 1: Detailed Weld BOM (.xlsx & .csv) */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-orange-600 font-semibold">
              {tech.card1Kicker}
            </div>
            <h3 className="text-base font-semibold text-slate-900">
              {t.t4Card1Title}
            </h3>
            <p className="text-xs text-slate-600">{t.t4Card1Desc}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => exportDetailedWeldBOMXlsx(settings, bomItems)}
              className="py-2.5 px-3 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{t.t4Card1BtnXlsx}</span>
            </button>
            <button
              type="button"
              onClick={() => exportDetailedWeldBOMCsv(settings, bomItems)}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{t.t4Card1BtnCsv}</span>
            </button>
          </div>
        </div>

        {/* Card 2: Process-Grouped Consumables Summary (.xlsx & .csv) */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-sky-600 font-semibold">
              {tech.card2Kicker}
            </div>
            <h3 className="text-base font-semibold text-slate-900">
              {t.t4Card2Title}
            </h3>
            <p className="text-xs text-slate-600">{t.t4Card2Desc}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => exportConsumablesSummaryXlsx(settings, bomItems)}
              className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>{t.t4Card2BtnXlsx}</span>
            </button>
            <button
              type="button"
              onClick={handleExportConsumablesSummaryCsv}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{t.t4Card2BtnCsv}</span>
            </button>
          </div>
        </div>

        {/* Card 3: Bid Summary Document & Print */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-teal-600 font-semibold">
              {tech.card3Kicker}
            </div>
            <h3 className="text-base font-semibold text-slate-900">
              {t.t4Card3Title}
            </h3>
            <p className="text-xs text-slate-600">{t.t4Card3Desc}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDownloadBidSummaryTxt}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>{t.t4Card3BtnTxt}</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{t.t4Card3BtnPrint}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: Live Bid Summary Report Preview */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 no-print">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              {t.t4LivePreviewTitle}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => downloadSampleExcelTemplateXlsx(settings)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.t2DownloadTemplateBtn}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyBidReport}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copiedReport ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.t4CopiedMsg}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t.t4CopyBtn}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.t4Card3BtnPrint}</span>
            </button>
          </div>
        </div>

        {/* Printable Engineering Bid Report Document */}
        <div className="p-6 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="space-y-1">
              <div className="text-xs font-mono font-semibold text-orange-600">
                {t.t4LivePreviewTitle}
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {settings.projectName}
              </h3>
              <div className="text-xs text-slate-600 font-mono">
                {t.ctxCode}: {settings.projectCode} · {t.sbEngineer}:{' '}
                {settings.engineerName}
              </div>
            </div>

            <div className="text-right text-xs font-mono text-slate-600 space-y-0.5 tabular-nums">
              <div>
                {t.ctxStandard}: {settings.standard}
              </div>
              <div>
                {t.sbDensity}: {settings.customDensityGcm3} g/cm³
              </div>
              <div>
                {tech.currencyLabel}: {settings.currencySymbol}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Consumables Summary Table by Process (7 cols) */}
            <div className="lg:col-span-7 space-y-2.5">
              <h4 className="text-xs font-semibold text-slate-800">
                I. {t.t2ConsumablesSummaryTitle}
              </h4>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                      <th className="py-2 px-3">{t.t2ColProcess}</th>
                      <th className="py-2 px-3">{tech.colSpecification}</th>
                      <th className="py-2 px-3 text-right">{t.t2ColNet}</th>
                      <th className="py-2 px-3 text-right">{t.t2ColGross}</th>
                      <th className="py-2 px-3 text-right">{t.t2ColAux}</th>
                      <th className="py-2 px-3 text-right">{t.t2ColLabor}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {processSummary.map((row) => (
                      <tr key={row.proc}>
                        <td className="py-2 px-3 font-mono font-bold text-slate-900">
                          {row.proc}
                        </td>
                        <td className="py-2 px-3 text-slate-700">
                          {row.consumableLabel}
                        </td>
                        <td className="py-2 px-3 text-right font-mono tabular-nums">
                          {formatNumber(row.netKg, 2)}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-orange-600 tabular-nums">
                          {formatNumber(row.grossKg, 2)}
                        </td>
                        <td className="py-2 px-3 text-right font-mono tabular-nums">
                          {row.gasM3 > 0
                            ? `${formatNumber(row.gasM3, 2)} m³`
                            : row.fluxKg > 0
                            ? `${formatNumber(row.fluxKg, 2)} kg`
                            : '—'}
                        </td>
                        <td className="py-2 px-3 text-right font-mono tabular-nums">
                          {formatNumber(row.laborH, 2)} h
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50 font-semibold text-slate-900 border-t border-slate-300">
                      <td className="py-2 px-3" colSpan={2}>
                        {tech.totalLabel} ({bomItems.length} {tech.itemsUnit} ·{' '}
                        {formatNumber(grandTotals.lengthM, 1)} m)
                      </td>
                      <td className="py-2 px-3 text-right font-mono tabular-nums">
                        {formatNumber(grandTotals.netKg, 2)}
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-orange-600 tabular-nums">
                        {formatNumber(grandTotals.grossKg, 2)}
                      </td>
                      <td className="py-2 px-3 text-right font-mono tabular-nums">
                        {formatNumber(grandTotals.gasM3, 1)}m³ /{' '}
                        {formatNumber(grandTotals.fluxKg, 1)}kg
                      </td>
                      <td className="py-2 px-3 text-right font-mono tabular-nums">
                        {formatNumber(grandTotals.laborH, 2)} h
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Financial Cost Breakdown Table (5 cols) */}
            <div className="lg:col-span-5 space-y-2.5">
              <h4 className="text-xs font-semibold text-slate-800">
                II. {t.t3CostStructureTitle} ({settings.currencySymbol})
              </h4>
              <div className="border border-slate-200 rounded-lg divide-y divide-slate-200 text-xs">
                <div className="py-2.5 px-3.5 flex items-center justify-between">
                  <span className="text-slate-600">
                    1. {t.t3CatConsumables}
                  </span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
                    {formatCurrency(
                      grandTotals.consumableCost,
                      settings.currencySymbol
                    )}
                  </span>
                </div>
                <div className="py-2.5 px-3.5 flex items-center justify-between">
                  <span className="text-slate-600">2. {t.t3CatAux}</span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
                    {formatCurrency(
                      grandTotals.auxCost,
                      settings.currencySymbol
                    )}
                  </span>
                </div>
                <div className="py-2.5 px-3.5 flex items-center justify-between">
                  <span className="text-slate-600">
                    3. {t.t3CatLabor} ({formatNumber(grandTotals.laborH, 1)} h)
                  </span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
                    {formatCurrency(
                      grandTotals.laborCost,
                      settings.currencySymbol
                    )}
                  </span>
                </div>
                <div className="py-2.5 px-3.5 flex items-center justify-between">
                  <span className="text-slate-600">
                    4. {t.t3CatPower} ({formatNumber(grandTotals.kwh, 1)} kWh)
                  </span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
                    {formatCurrency(
                      grandTotals.powerCost,
                      settings.currencySymbol
                    )}
                  </span>
                </div>
                <div className="py-3 px-3.5 bg-slate-900 text-white flex items-center justify-between rounded-b-lg">
                  <span className="font-semibold">
                    {t.ctxTotalCost.toUpperCase()}
                  </span>
                  <span className="text-sm font-mono font-bold text-orange-400 tabular-nums">
                    {formatCurrency(
                      grandTotals.totalCost,
                      settings.currencySymbol
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Interactive WPS / PQR Library (12-Language Synchronized) */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-5 no-print">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3.5">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-orange-600" />
              <span>{t.t4WpsLibraryTitle}</span>
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setShowNewWpsModal((prev) => !prev)}
            className="px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
          >
            {showNewWpsModal ? (
              <>
                <X className="w-3.5 h-3.5" />
                <span>{t.t2CancelBtn}</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>{t.t4CreateWpsBtn}</span>
              </>
            )}
          </button>
        </div>

        {showNewWpsModal && (
          <form
            onSubmit={handleCreateCustomWps}
            className="p-4 bg-slate-50 border border-slate-300 rounded-lg space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {tech.wpsCodeLabel}
                </label>
                <input
                  type="text"
                  required
                  value={newWpsCode}
                  onChange={(e) => setNewWpsCode(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-md focus:outline-none focus:border-orange-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {t.t2ColProcess}
                </label>
                <select
                  value={newWpsProcess}
                  onChange={(e) =>
                    setNewWpsProcess(e.target.value as WeldingProcess)
                  }
                  className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-md focus:outline-none focus:border-orange-600"
                >
                  {Object.values(WeldingProcess).map((p) => (
                    <option key={p} value={p}>
                      {p} — {tech.processConsumables[p]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {t.ctxStandard}
                </label>
                <input
                  type="text"
                  value={newWpsStandard}
                  onChange={(e) => setNewWpsStandard(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-md focus:outline-none focus:border-orange-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {tech.wpsTitleLabel}
                </label>
                <input
                  type="text"
                  required
                  value={newWpsTitle}
                  onChange={(e) => setNewWpsTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-orange-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {tech.wpsBaseMetalLabel}
                </label>
                <input
                  type="text"
                  value={newWpsMaterial}
                  onChange={(e) => setNewWpsMaterial(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-orange-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {tech.wpsFillerMetalLabel}
                </label>
                <input
                  type="text"
                  value={newWpsFiller}
                  onChange={(e) => setNewWpsFiller(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-md focus:outline-none focus:border-orange-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {tech.wpsCurrentLabel}
                </label>
                <input
                  type="text"
                  value={newWpsCurrent}
                  onChange={(e) => setNewWpsCurrent(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-md focus:outline-none focus:border-orange-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {tech.wpsVoltageLabel}
                </label>
                <input
                  type="text"
                  value={newWpsVoltage}
                  onChange={(e) => setNewWpsVoltage(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-md focus:outline-none focus:border-orange-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {tech.wpsTravelSpeedLabel}
                </label>
                <input
                  type="text"
                  value={newWpsSpeed}
                  onChange={(e) => setNewWpsSpeed(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-md focus:outline-none focus:border-orange-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {tech.wpsGasFluxLabel}
                </label>
                <input
                  type="text"
                  value={newWpsGasFlux}
                  onChange={(e) => setNewWpsGasFlux(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-orange-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {tech.wpsPreheatLabel}
                </label>
                <input
                  type="text"
                  value={newWpsPreheat}
                  onChange={(e) => setNewWpsPreheat(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-orange-600"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewWpsModal(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer"
                >
                  {t.t2CancelBtn}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 cursor-pointer"
                >
                  {tech.wpsSaveBtn}
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
            {(['ALL', ...Object.values(WeldingProcess)] as const).map(
              (proc) => (
                <button
                  key={proc}
                  type="button"
                  onClick={() => setWpsProcessFilter(proc)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    wpsProcessFilter === proc
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {proc === 'ALL'
                    ? `${t.t2AllProcesses} (${allWpsList.length})`
                    : proc}
                </button>
              )
            )}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={wpsSearchQuery}
              onChange={(e) => setWpsSearchQuery(e.target.value)}
              placeholder={tech.wpsSearchPlaceholder}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-orange-600 w-64"
            />
          </div>
        </div>

        {assignedFeedback && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-900 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{assignedFeedback}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-5 space-y-2 max-h-96 overflow-y-auto pr-1">
            {filteredWpsList.map((w) => {
              const isSelected = activeWps?.id === w.id;
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setSelectedWpsId(w.id)}
                  className={`w-full text-left p-3.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50/80 text-slate-800 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold">
                      {w.wpsCode}
                    </span>
                    <span
                      className={`font-mono text-[11px] truncate max-w-[60%] ${
                        isSelected ? 'text-orange-300' : 'text-slate-500'
                      }`}
                    >
                      {w.process} · {w.standardCompliance}
                    </span>
                  </div>
                  <div
                    className={`text-xs font-medium mt-1 line-clamp-1 ${
                      isSelected ? 'text-slate-100' : 'text-slate-700'
                    }`}
                  >
                    {w.title}
                  </div>
                  <div
                    className={`text-[11px] font-mono mt-1 truncate ${
                      isSelected ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {w.fillerMetalClass}
                  </div>
                </button>
              );
            })}
          </div>

          {activeWps && (
            <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-lg p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <div className="text-xs font-mono font-bold text-orange-600">
                      {activeWps.wpsCode} · {activeWps.process}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                      {activeWps.title}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-600">
                    {activeWps.standardCompliance}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white border border-slate-200/80 rounded-md">
                    <span className="text-slate-500 block">
                      {tech.wpsBaseMetalLabel}:
                    </span>
                    <span className="font-semibold text-slate-900 mt-0.5 block">
                      {activeWps.materialGroup}
                    </span>
                  </div>

                  <div className="p-3 bg-white border border-slate-200/80 rounded-md">
                    <span className="text-slate-500 block">
                      {tech.wpsFillerMetalLabel}:
                    </span>
                    <span className="font-mono font-semibold text-slate-900 mt-0.5 block">
                      {activeWps.fillerMetalClass}
                    </span>
                  </div>

                  <div className="p-3 bg-white border border-slate-200/80 rounded-md">
                    <span className="text-slate-500 block">
                      {tech.wpsCurrentVoltageLabel}:
                    </span>
                    <span className="font-mono font-semibold text-slate-900 mt-0.5 block tabular-nums">
                      I = {activeWps.currentRangeAmp} · U ={' '}
                      {activeWps.voltageRangeV}
                    </span>
                  </div>

                  <div className="p-3 bg-white border border-slate-200/80 rounded-md">
                    <span className="text-slate-500 block">
                      {tech.wpsTravelSpeedLabel}:
                    </span>
                    <span className="font-mono font-semibold text-slate-900 mt-0.5 block tabular-nums">
                      v = {activeWps.travelSpeedMmMin}
                    </span>
                  </div>

                  <div className="p-3 bg-white border border-slate-200/80 rounded-md">
                    <span className="text-slate-500 block">
                      {tech.wpsGasFluxLabel}:
                    </span>
                    <span className="font-medium text-slate-900 mt-0.5 block">
                      {activeWps.shieldingGasOrFlux}
                    </span>
                  </div>

                  <div className="p-3 bg-white border border-slate-200/80 rounded-md">
                    <span className="text-slate-500 block">
                      {tech.wpsPreheatLabel}:
                    </span>
                    <span className="font-medium text-slate-900 mt-0.5 block">
                      {activeWps.preheatTempC}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleAssignWpsToMatchingBOM(activeWps, false)
                    }
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {t.t4AssignWpsMatchingBtn} ({activeWps.process})
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleAssignWpsToMatchingBOM(activeWps, true)
                    }
                    className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {t.t4AssignWpsAllBtn}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownloadWpsSheet(activeWps)}
                  className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t.t4DownloadWpsBtn}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
