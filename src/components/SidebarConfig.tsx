import React from 'react';
import {
  LanguageCode,
  MATERIAL_GRADES,
  ProjectSettings,
  UnitSystem,
  WeldingProcess,
  WeldingStandard,
} from '../types/welding';
import {
  getLanguageOption,
  getTranslation,
  LANGUAGE_OPTIONS,
} from '../i18n/translations';
import { getTechnicalTranslation } from '../i18n/wpsAndTechnicalTranslations';
import {
  RotateCcw,
  Sliders,
  Coins,
  Layers,
  Compass,
  Globe,
} from 'lucide-react';

interface SidebarConfigProps {
  settings: ProjectSettings;
  onUpdateSettings: (next: ProjectSettings) => void;
  onResetDefaults: () => void;
}

const CURRENCY_PRESETS = [
  'VNĐ',
  'USD',
  'GBP £',
  'EUR €',
  'CNY ¥',
  'JPY ¥',
  'KRW ₩',
  'RUB ₽',
  'THB ฿',
  'INR ₹',
];

export const SidebarConfig: React.FC<SidebarConfigProps> = ({
  settings,
  onUpdateSettings,
  onResetDefaults,
}) => {
  const t = getTranslation(settings.language);
  const tech = getTechnicalTranslation(settings.language);
  const activeLangOpt = getLanguageOption(settings.language);

  const handleMaterialChange = (materialId: string) => {
    const found = MATERIAL_GRADES.find((m) => m.id === materialId);
    onUpdateSettings({
      ...settings,
      materialId,
      customDensityGcm3: found ? found.densityGcm3 : settings.customDensityGcm3,
    });
  };

  const handleConsumablePriceChange = (proc: WeldingProcess, value: number) => {
    onUpdateSettings({
      ...settings,
      unitPrices: {
        ...settings.unitPrices,
        consumablePerKg: {
          ...settings.unitPrices.consumablePerKg,
          [proc]: Math.max(0, value),
        },
      },
    });
  };

  const applyLanguageCurrencySuggestion = () => {
    onUpdateSettings({
      ...settings,
      currencySymbol: activeLangOpt.suggestedCurrency,
      unitPrices: {
        consumablePerKg: { ...activeLangOpt.suggestedPrices.consumablePerKg },
        shieldingGasPerM3: activeLangOpt.suggestedPrices.shieldingGasPerM3,
        sawFluxPerKg: activeLangOpt.suggestedPrices.sawFluxPerKg,
        laborPerHour: activeLangOpt.suggestedPrices.laborPerHour,
        electricityPerKwh: activeLangOpt.suggestedPrices.electricityPerKwh,
      },
    });
  };

  const applyCurrencyPreset = (symbol: string) => {
    const matchedLang = LANGUAGE_OPTIONS.find(
      (o) => o.suggestedCurrency === symbol
    );
    if (matchedLang) {
      onUpdateSettings({
        ...settings,
        currencySymbol: symbol,
        unitPrices: {
          consumablePerKg: { ...matchedLang.suggestedPrices.consumablePerKg },
          shieldingGasPerM3: matchedLang.suggestedPrices.shieldingGasPerM3,
          sawFluxPerKg: matchedLang.suggestedPrices.sawFluxPerKg,
          laborPerHour: matchedLang.suggestedPrices.laborPerHour,
          electricityPerKwh: matchedLang.suggestedPrices.electricityPerKwh,
        },
      });
    } else {
      onUpdateSettings({
        ...settings,
        currencySymbol: symbol,
      });
    }
  };

  const showCurrencySuggestion =
    settings.currencySymbol.trim() !== activeLangOpt.suggestedCurrency.trim();

  return (
    <aside className="w-full lg:w-80 xl:w-84 shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 p-5 space-y-5 no-print">
      {/* Section 0: Global 12-Language Switcher */}
      <div className="space-y-2.5 bg-slate-50 border border-slate-200 rounded-lg p-3.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-orange-600" />
            <span>{t.sbLanguageTitle}</span>
          </label>
          <span className="text-[11px] font-mono text-slate-500">
            {activeLangOpt.regionTag}
          </span>
        </div>

        <select
          value={settings.language || 'vi'}
          onChange={(e) =>
            onUpdateSettings({
              ...settings,
              language: e.target.value as LanguageCode,
            })
          }
          className="w-full px-2.5 py-1.5 text-xs font-medium bg-white border border-slate-300 rounded-md focus:outline-none focus:border-orange-600"
        >
          {LANGUAGE_OPTIONS.map((opt) => (
            <option key={opt.code} value={opt.code}>
              [{opt.regionTag}] {opt.nativeName} — {opt.englishName} ({opt.suggestedCurrency})
            </option>
          ))}
        </select>

        {/* Quick 12-language pill grid */}
        <div className="grid grid-cols-4 gap-1 pt-0.5">
          {LANGUAGE_OPTIONS.map((opt) => {
            const active = (settings.language || 'vi') === opt.code;
            return (
              <button
                key={opt.code}
                type="button"
                onClick={() =>
                  onUpdateSettings({ ...settings, language: opt.code })
                }
                title={`${opt.nativeName} (${opt.englishName})`}
                className={`py-1 px-1.5 text-[11px] font-mono rounded border transition-colors truncate cursor-pointer ${
                  active
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {opt.regionTag} · {opt.nativeName.split(' ')[0]}
              </button>
            );
          })}
        </div>

        {/* Non-intrusive 1-Click Currency Suggestion */}
        {showCurrencySuggestion && (
          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2 text-[11px]">
            <span className="text-slate-600 leading-tight">
              {t.sbCurrencySuggestPrompt}{' '}
              <strong className="font-mono text-slate-900">
                {activeLangOpt.suggestedCurrency}
              </strong>
            </span>
            <button
              type="button"
              onClick={applyLanguageCurrencySuggestion}
              className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.sbApplyCurrencyBtn} ({activeLangOpt.suggestedCurrency})
            </button>
          </div>
        )}
      </div>

      {/* Section 1: Project Identity & Material */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-600" />
            <span>{t.sbSec1Title}</span>
          </h2>
          <button
            type="button"
            onClick={onResetDefaults}
            className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.sbResetBtn}</span>
          </button>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            {t.sbProjectName}
          </label>
          <input
            type="text"
            value={settings.projectName}
            onChange={(e) =>
              onUpdateSettings({ ...settings, projectName: e.target.value })
            }
            className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {t.sbProjectCode}
            </label>
            <input
              type="text"
              value={settings.projectCode}
              onChange={(e) =>
                onUpdateSettings({ ...settings, projectCode: e.target.value })
              }
              className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-orange-600"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {t.sbEngineer}
            </label>
            <input
              type="text"
              value={settings.engineerName}
              onChange={(e) =>
                onUpdateSettings({ ...settings, engineerName: e.target.value })
              }
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-orange-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            {t.sbBaseMaterial}
          </label>
          <select
            value={settings.materialId}
            onChange={(e) => handleMaterialChange(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-orange-600"
          >
            {MATERIAL_GRADES.map((mat) => (
              <option key={mat.id} value={mat.id}>
                {tech.materialNames[mat.id] || mat.name} ({mat.densityGcm3} g/cm³)
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <label className="text-xs font-medium text-slate-700">
            {t.sbDensity}
          </label>
          <input
            type="number"
            step="0.01"
            min="1.0"
            max="22.0"
            value={settings.customDensityGcm3}
            onChange={(e) =>
              onUpdateSettings({
                ...settings,
                materialId: 'custom',
                customDensityGcm3: parseFloat(e.target.value) || 7.85,
              })
            }
            className="w-24 px-2.5 py-1 text-right text-xs font-mono font-semibold bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-orange-600 tabular-nums"
          />
        </div>
      </div>

      <hr className="border-slate-200" />

      {/* Section 2: Units & Standards */}
      <div className="space-y-3.5">
        <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <Compass className="w-4 h-4 text-orange-600" />
          <span>{t.sbSec2Title}</span>
        </h2>

        <div>
          <span className="block text-xs font-medium text-slate-700 mb-1.5">
            {t.sbUnitSystem}
          </span>
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() =>
                onUpdateSettings({ ...settings, unitSystem: UnitSystem.METRIC })
              }
              className={`py-1.5 px-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer truncate ${
                settings.unitSystem === UnitSystem.METRIC
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tech.unitMetricLabel}
            </button>
            <button
              type="button"
              onClick={() =>
                onUpdateSettings({
                  ...settings,
                  unitSystem: UnitSystem.IMPERIAL,
                })
              }
              className={`py-1.5 px-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer truncate ${
                settings.unitSystem === UnitSystem.IMPERIAL
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tech.unitImperialLabel}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            {t.sbStandardRef}
          </label>
          <select
            value={settings.standard}
            onChange={(e) =>
              onUpdateSettings({
                ...settings,
                standard: e.target.value as WeldingStandard,
              })
            }
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-orange-600"
          >
            <option value={WeldingStandard.ISO_2553}>
              ISO 2553 (International — a / z)
            </option>
            <option value={WeldingStandard.AWS_A2_4}>
              AWS A2.4 (US Standard — Leg z)
            </option>
            <option value={WeldingStandard.AWS_A3_0}>
              AWS A3.0 (Welding Terms & Definitions)
            </option>
          </select>
        </div>
      </div>

      <hr className="border-slate-200" />

      {/* Section 3: Custom Currency & Unit Prices */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Coins className="w-4 h-4 text-orange-600" />
            <span>{t.sbSec3Title}</span>
          </h2>
        </div>

        {/* Custom Currency Input + Quick Presets */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-medium text-slate-700">
              {t.sbCurrencySymbol}
            </label>
            <input
              type="text"
              value={settings.currencySymbol}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  currencySymbol: e.target.value || 'VNĐ',
                })
              }
              className="w-24 px-2.5 py-1 text-right text-xs font-mono font-semibold bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-orange-600"
            />
          </div>

          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[11px] text-slate-500">{t.sbQuickPresets}</span>
            {CURRENCY_PRESETS.map((sym) => (
              <button
                key={sym}
                type="button"
                onClick={() => applyCurrencyPreset(sym)}
                className={`px-1.5 py-0.5 text-[10px] font-mono rounded border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  settings.currencySymbol === sym
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {sym}
              </button>
            ))}
          </div>
        </div>

        {/* Consumables Per Kg */}
        <div className="space-y-2 pt-1">
          <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>
              {t.sbConsumablePrices} ({settings.currencySymbol}/kg)
            </span>
          </div>

          {(
            [
              { proc: WeldingProcess.SMAW, label: 'SMAW (E7018 / E6013)' },
              { proc: WeldingProcess.GMAW, label: 'GMAW (ER70S-6)' },
              { proc: WeldingProcess.FCAW, label: 'FCAW (E71T-1C)' },
              { proc: WeldingProcess.GTAW, label: 'GTAW (ER308L / TIG)' },
              { proc: WeldingProcess.SAW, label: 'SAW (EM12K)' },
            ] as const
          ).map((item) => (
            <div
              key={item.proc}
              className="flex items-center justify-between gap-2"
            >
              <label className="text-xs text-slate-600">{item.label}</label>
              <input
                type="number"
                min="0"
                step="any"
                value={settings.unitPrices.consumablePerKg[item.proc]}
                onChange={(e) =>
                  handleConsumablePriceChange(
                    item.proc,
                    parseFloat(e.target.value) || 0
                  )
                }
                className="w-28 px-2 py-1 text-right text-xs font-mono bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-orange-600 tabular-nums"
              />
            </div>
          ))}
        </div>

        {/* Auxiliary & Labor & Power Prices */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <div className="text-xs font-semibold text-slate-800">
            {t.sbAuxLaborPowerPrices} ({settings.currencySymbol})
          </div>

          <div className="flex items-center justify-between gap-2">
            <label className="text-xs text-slate-600">
              {t.sbShieldingGasPrice}
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={settings.unitPrices.shieldingGasPerM3}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  unitPrices: {
                    ...settings.unitPrices,
                    shieldingGasPerM3: parseFloat(e.target.value) || 0,
                  },
                })
              }
              className="w-28 px-2 py-1 text-right text-xs font-mono bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-orange-600 tabular-nums"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <label className="text-xs text-slate-600">{t.sbSawFluxPrice}</label>
            <input
              type="number"
              min="0"
              step="any"
              value={settings.unitPrices.sawFluxPerKg}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  unitPrices: {
                    ...settings.unitPrices,
                    sawFluxPerKg: parseFloat(e.target.value) || 0,
                  },
                })
              }
              className="w-28 px-2 py-1 text-right text-xs font-mono bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-orange-600 tabular-nums"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <label className="text-xs text-slate-600">{t.sbLaborPrice}</label>
            <input
              type="number"
              min="0"
              step="any"
              value={settings.unitPrices.laborPerHour}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  unitPrices: {
                    ...settings.unitPrices,
                    laborPerHour: parseFloat(e.target.value) || 0,
                  },
                })
              }
              className="w-28 px-2 py-1 text-right text-xs font-mono bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-orange-600 tabular-nums"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <label className="text-xs text-slate-600">{t.sbPowerPrice}</label>
            <input
              type="number"
              min="0"
              step="any"
              value={settings.unitPrices.electricityPerKwh}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  unitPrices: {
                    ...settings.unitPrices,
                    electricityPerKwh: parseFloat(e.target.value) || 0,
                  },
                })
              }
              className="w-28 px-2 py-1 text-right text-xs font-mono bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-orange-600 tabular-nums"
            />
          </div>
        </div>
      </div>
    </aside>
  );
};
