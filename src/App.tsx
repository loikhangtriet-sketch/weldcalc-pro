import React, { useEffect, useState } from 'react';
import {
  FilletDimensionMode,
  JointGeometryInput,
  JointType,
  ProjectSettings,
  UnitSystem,
  WeldBOMItem,
  WeldingProcess,
  WeldingStandard,
} from './types/welding';
import {
  calculateWeldJoint,
  createInitialSampleBOM,
  formatCurrency,
  formatNumber,
} from './utils/calculations';
import { getTranslation } from './i18n/translations';
import {
  getLocalizedSampleData,
  getTechnicalTranslation,
} from './i18n/wpsAndTechnicalTranslations';
import { getTab5Translation } from './i18n/tab5Translations';
import { exportDetailedWeldBOMXlsx } from './utils/excelHelper';
import { SidebarConfig } from './components/SidebarConfig';
import { TabJointCalculator } from './components/TabJointCalculator';
import { TabWeldBOM } from './components/TabWeldBOM';
import { TabCostCharts } from './components/TabCostCharts';
import { TabExportStreamlit } from './components/TabExportStreamlit';
import { TabCommentsQA } from './components/TabCommentsQA';
import { FileSpreadsheet } from 'lucide-react';

type ActiveTab = 'calculator' | 'bom' | 'cost' | 'export' | 'qa';

const STORAGE_KEY_SETTINGS = 'weldcalc_pro_settings_v2';
const STORAGE_KEY_BOM = 'weldcalc_pro_bom_v2';

const DEFAULT_PROJECT_SETTINGS: ProjectSettings = {
  language: 'vi',
  projectName: 'Nhà Máy Kết Cấu Thép & Tổ Hợp Dầm Cầu',
  projectCode: 'PRJ-STEEL-2026',
  clientName: 'Ban Quản Lý Dự Án Công Nghiệp',
  engineerName: 'KS. Hàn & Dự Toán',
  unitSystem: UnitSystem.METRIC,
  standard: WeldingStandard.ISO_2553,
  materialId: 'carbon_steel',
  customDensityGcm3: 7.85,
  currencySymbol: 'VNĐ',
  unitPrices: {
    consumablePerKg: {
      [WeldingProcess.SMAW]: 42000,
      [WeldingProcess.GMAW]: 36000,
      [WeldingProcess.FCAW]: 54000,
      [WeldingProcess.GTAW]: 145000,
      [WeldingProcess.SAW]: 45000,
    },
    shieldingGasPerM3: 65000,
    sawFluxPerKg: 38000,
    laborPerHour: 85000,
    electricityPerKwh: 2800,
  },
};

const DEFAULT_JOINT_INPUT: JointGeometryInput = {
  jointType: JointType.SINGLE_V,
  process: WeldingProcess.GMAW,
  weldLengthM: 6.0,
  quantity: 4,
  reinforcementPct: 10,
  filletMode: FilletDimensionMode.LEG_Z,
  filletSizeMm: 8,
  isDoubleFillet: true,
  plateThicknessMm: 16,
  grooveAngleDeg: 60,
  rootGapMm: 2.5,
  rootFaceMm: 2.0,
  rootRadiusMm: 6.0,
  depositionEfficiencyPct: 90,
  depositionRateKgH: 3.8,
  operatingFactorPct: 45,
  gasFlowLMin: 18,
  fluxToWireRatio: 0,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('calculator');

  const [settings, setSettings] = useState<ProjectSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        return { ...DEFAULT_PROJECT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_PROJECT_SETTINGS;
  });

  const [currentInput, setCurrentInput] =
    useState<JointGeometryInput>(DEFAULT_JOINT_INPUT);

  const [bomItems, setBomItems] = useState<WeldBOMItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOM);
      if (saved) {
        const parsed = JSON.parse(saved) as WeldBOMItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore storage errors
    }
    return createInitialSampleBOM(DEFAULT_PROJECT_SETTINGS);
  });

  const t = getTranslation(settings.language);
  const tech = getTechnicalTranslation(settings.language);
  const t5 = getTab5Translation(settings.language);

  const handleUpdateSettings = (nextSettings: ProjectSettings) => {
    const langChanged = nextSettings.language !== settings.language;
    const prevSampleMeta = getLocalizedSampleData(settings.language);
    const nextSampleMeta = getLocalizedSampleData(nextSettings.language);

    const adjustedSettings: ProjectSettings = {
      ...nextSettings,
      projectName:
        langChanged && nextSettings.projectName === prevSampleMeta.projectName
          ? nextSampleMeta.projectName
          : nextSettings.projectName,
      engineerName:
        langChanged && nextSettings.engineerName === prevSampleMeta.engineerName
          ? nextSampleMeta.engineerName
          : nextSettings.engineerName,
    };

    setSettings(adjustedSettings);
    setBomItems((prev) =>
      prev.map((item) => {
        const sampleKey = item.id as keyof typeof nextSampleMeta.samples;
        const localizedSampleMember = nextSampleMeta.samples[sampleKey];
        return {
          ...item,
          structuralMember:
            langChanged && localizedSampleMember
              ? localizedSampleMember
              : item.structuralMember,
          result: calculateWeldJoint(item.input, adjustedSettings),
        };
      })
    );
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BOM, JSON.stringify(bomItems));
    } catch {
      // ignore
    }
  }, [bomItems]);

  const handleAddToBOM = (newItem: Omit<WeldBOMItem, 'id'>) => {
    const created: WeldBOMItem = {
      ...newItem,
      id: `weld-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    };
    setBomItems((prev) => [...prev, created]);
  };

  const handleResetAllDefaults = () => {
    const sampleMeta = getLocalizedSampleData(settings.language);
    const resetWithLang = {
      ...DEFAULT_PROJECT_SETTINGS,
      language: settings.language || 'vi',
      projectName: sampleMeta.projectName,
      engineerName: sampleMeta.engineerName,
    };
    setSettings(resetWithLang);
    setCurrentInput(DEFAULT_JOINT_INPUT);
    setBomItems(createInitialSampleBOM(resetWithLang));
  };

  const totalNetWeightKg = bomItems.reduce(
    (s, i) => s + i.result.netWeldWeightKg,
    0
  );
  const totalGrossWeightKg = bomItems.reduce(
    (s, i) => s + i.result.grossConsumableWeightKg,
    0
  );
  const totalProjectCost = bomItems.reduce(
    (s, i) => s + i.result.totalCost,
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navigation Bar — Strict 3-Zone Contract */}
      <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-white border-b border-slate-200 sticky top-0 z-20 no-print">
        {/* Zone 1: Brand Title, single text element */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('calculator');
          }}
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 font-display"
        >
          WeldCalc Pro
        </a>

        {/* Zone 2: 5 Single-line Navigation Links */}
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('calculator')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
              activeTab === 'calculator'
                ? 'text-slate-900 border-orange-600 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            {t.navTab1}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bom')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
              activeTab === 'bom'
                ? 'text-slate-900 border-orange-600 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            {t.navTab2} ({bomItems.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cost')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
              activeTab === 'cost'
                ? 'text-slate-900 border-orange-600 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            {t.navTab3}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
              activeTab === 'export'
                ? 'text-slate-900 border-orange-600 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            {t.navTab4}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('qa')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
              activeTab === 'qa'
                ? 'text-slate-900 border-orange-600 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            {t5.navTab5}
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => exportDetailedWeldBOMXlsx(settings, bomItems)}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{t.headerExportCta}</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Container: Left Sidebar + Right Tab Viewport */}
      <div className="flex-1 flex flex-col lg:flex-row">
        <SidebarConfig
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onResetDefaults={handleResetAllDefaults}
        />

        <main className="flex-1 p-5 lg:p-6 max-w-[1440px] w-full mx-auto space-y-5">
          {/* Project Context Bar */}
          <div className="bg-white border border-slate-200 rounded-lg px-5 py-3.5 flex flex-wrap items-center justify-between gap-4 no-print">
            <div>
              <h1 className="text-lg font-bold text-slate-900 text-balance">
                {settings.projectName}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5 font-mono">
                <span>
                  {t.ctxCode}: {settings.projectCode}
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  {t.ctxStandard}: {settings.standard}
                </span>
                <span aria-hidden="true">·</span>
                <span>ρ = {settings.customDensityGcm3} g/cm³</span>
                <span aria-hidden="true">·</span>
                <span>
                  {t.ctxSystem}:{' '}
                  {settings.unitSystem === UnitSystem.METRIC
                    ? tech.unitMetricLabel
                    : tech.unitImperialLabel}
                </span>
              </div>
            </div>

            {/* Unboxed Live Project Summary Metadata */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono tabular-nums text-slate-700">
              <span>
                W_net:{' '}
                <strong className="text-slate-900">
                  {formatNumber(totalNetWeightKg, 1)} kg
                </strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                W_gross:{' '}
                <strong className="text-orange-600">
                  {formatNumber(totalGrossWeightKg, 1)} kg
                </strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {t.ctxTotalCost}:{' '}
                <strong className="text-slate-900">
                  {formatCurrency(totalProjectCost, settings.currencySymbol)}
                </strong>
              </span>
            </div>
          </div>

          {/* Active Tab View */}
          {activeTab === 'calculator' && (
            <TabJointCalculator
              settings={settings}
              currentInput={currentInput}
              onUpdateInput={setCurrentInput}
              onAddToBOM={handleAddToBOM}
              bomCount={bomItems.length}
            />
          )}

          {activeTab === 'bom' && (
            <TabWeldBOM
              settings={settings}
              bomItems={bomItems}
              onUpdateBOMItems={setBomItems}
              onResetSampleBOM={() =>
                setBomItems(createInitialSampleBOM(settings))
              }
              onSwitchToCalculator={() => setActiveTab('calculator')}
            />
          )}

          {activeTab === 'cost' && (
            <TabCostCharts settings={settings} bomItems={bomItems} />
          )}

          {activeTab === 'export' && (
            <TabExportStreamlit
              settings={settings}
              bomItems={bomItems}
              onUpdateBOMItems={setBomItems}
            />
          )}

          {activeTab === 'qa' && (
            <TabCommentsQA settings={settings} bomItems={bomItems} />
          )}
        </main>
      </div>
    </div>
  );
}
