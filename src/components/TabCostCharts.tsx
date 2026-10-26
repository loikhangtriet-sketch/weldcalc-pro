import React, { useState } from 'react';
import {
  PROCESS_PRESETS,
  ProjectSettings,
  WeldBOMItem,
  WeldingProcess,
} from '../types/welding';
import { formatCurrency, formatNumber } from '../utils/calculations';
import { getTranslation } from '../i18n/translations';
import { getTechnicalTranslation } from '../i18n/wpsAndTechnicalTranslations';
import { BarChart3, Clock, Zap, TrendingUp, Users } from 'lucide-react';

interface TabCostChartsProps {
  settings: ProjectSettings;
  bomItems: WeldBOMItem[];
}

export const TabCostCharts: React.FC<TabCostChartsProps> = ({
  settings,
  bomItems,
}) => {
  const t = getTranslation(settings.language);
  const tech = getTechnicalTranslation(settings.language);
  const [welderCount, setWelderCount] = useState<number>(6);
  const [shiftHoursPerDay, setShiftHoursPerDay] = useState<number>(8);

  const summary = bomItems.reduce(
    (acc, item) => {
      acc.consumableCost += item.result.consumableCost;
      acc.gasCost += item.result.gasCost;
      acc.fluxCost += item.result.fluxCost;
      acc.laborCost += item.result.laborCost;
      acc.powerCost += item.result.powerCost;
      acc.totalCost += item.result.totalCost;
      acc.arcHours += item.result.arcOnTimeHours;
      acc.laborHours += item.result.totalLaborHours;
      acc.energyKwh += item.result.powerEnergyKwh;
      acc.netWeightKg += item.result.netWeldWeightKg;
      acc.grossWeightKg += item.result.grossConsumableWeightKg;
      return acc;
    },
    {
      consumableCost: 0,
      gasCost: 0,
      fluxCost: 0,
      laborCost: 0,
      powerCost: 0,
      totalCost: 0,
      arcHours: 0,
      laborHours: 0,
      energyKwh: 0,
      netWeightKg: 0,
      grossWeightKg: 0,
    }
  );

  const totalCostSafe = Math.max(1, summary.totalCost);
  const costCategories = [
    {
      key: 'consumable',
      label: t.t3CatConsumables,
      value: summary.consumableCost,
      pct: (summary.consumableCost / totalCostSafe) * 100,
      color: '#ea580c',
    },
    {
      key: 'labor',
      label: t.t3CatLabor,
      value: summary.laborCost,
      pct: (summary.laborCost / totalCostSafe) * 100,
      color: '#0284c7',
    },
    {
      key: 'aux',
      label: t.t3CatAux,
      value: summary.gasCost + summary.fluxCost,
      pct: ((summary.gasCost + summary.fluxCost) / totalCostSafe) * 100,
      color: '#0d9488',
    },
    {
      key: 'power',
      label: t.t3CatPower,
      value: summary.powerCost,
      pct: (summary.powerCost / totalCostSafe) * 100,
      color: '#64748b',
    },
  ];

  const totalCrewHoursPerDay = Math.max(1, welderCount * shiftHoursPerDay);
  const estimatedWorkingDays = summary.laborHours / totalCrewHoursPerDay;
  const costPerKgDeposited =
    summary.netWeightKg > 0 ? summary.totalCost / summary.netWeightKg : 0;

  const maxItemCost = Math.max(1, ...bomItems.map((i) => i.result.totalCost));

  return (
    <div className="space-y-6">
      {/* Top 4 Executive Financial & Schedule Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>{t.t3KpiTotalCost}</span>
            <TrendingUp className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {formatCurrency(summary.totalCost, settings.currencySymbol)}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-mono tabular-nums">
            {formatCurrency(costPerKgDeposited, settings.currencySymbol)} / kg
            W_net
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>{t.t3KpiArcTime}</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {formatNumber(summary.arcHours, 2)} h
          </div>
          <div className="text-xs text-slate-500 mt-1 font-mono tabular-nums">
            {t.t2ColLabor}: {formatNumber(summary.laborHours, 2)} h
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>{t.t3KpiScheduleDays}</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {formatNumber(estimatedWorkingDays, 1)} d
          </div>
          <div className="text-xs text-slate-500 mt-1 font-mono tabular-nums">
            {welderCount} × {shiftHoursPerDay} h/d
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>{t.t3KpiPowerEnergy}</span>
            <Zap className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {formatNumber(summary.energyKwh, 1)} kWh
          </div>
          <div className="text-xs text-slate-500 mt-1 font-mono tabular-nums">
            {formatCurrency(summary.powerCost, settings.currencySymbol)}
          </div>
        </div>
      </div>

      {/* Main 2-Column Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Cost Structure Breakdown (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between space-y-5">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-orange-600" />
              <span>
                {t.t3CostStructureTitle} ({settings.currencySymbol})
              </span>
            </h2>
          </div>

          <div className="space-y-2">
            <div className="h-5 w-full rounded-md overflow-hidden flex bg-slate-100 border border-slate-200">
              {costCategories.map((cat) => (
                <div
                  key={cat.key}
                  style={{
                    width: `${Math.max(cat.pct, 0)}%`,
                    backgroundColor: cat.color,
                  }}
                  title={`${cat.label}: ${formatNumber(cat.pct, 1)}%`}
                  className="h-full transition-all"
                />
              ))}
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>0%</span>
              <span>50%</span>
              <span>
                100% ({formatCurrency(summary.totalCost, settings.currencySymbol)}
                )
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {costCategories.map((cat) => (
              <div
                key={cat.key}
                className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800 flex items-center gap-2">
                    <span
                      className="inline-block w-3 h-3 rounded-xs"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.label}
                  </span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
                    {formatCurrency(cat.value, settings.currencySymbol)} (
                    {formatNumber(cat.pct, 1)}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, cat.pct)}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {t.t3WelderCount}
              </label>
              <input
                type="number"
                min="1"
                max="200"
                value={welderCount}
                onChange={(e) =>
                  setWelderCount(Math.max(1, parseInt(e.target.value, 10) || 1))
                }
                className="w-full px-3 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-orange-600 tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {t.t3ShiftHours}
              </label>
              <input
                type="number"
                min="1"
                max="24"
                value={shiftHoursPerDay}
                onChange={(e) =>
                  setShiftHoursPerDay(
                    Math.max(
                      1,
                      Math.min(24, parseInt(e.target.value, 10) || 8)
                    )
                  )
                }
                className="w-full px-3 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-orange-600 tabular-nums"
              />
            </div>
          </div>
        </div>

        {/* Right: Cost & Man-Hours Comparison by Weld Item (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              {t.t3ItemComparisonTitle}
            </h2>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-96 pr-1">
            {bomItems.map((item) => {
              const barPct = (item.result.totalCost / maxItemCost) * 100;
              const matShare =
                item.result.totalCost > 0
                  ? ((item.result.consumableCost +
                      item.result.gasCost +
                      item.result.fluxCost) /
                      item.result.totalCost) *
                    100
                  : 0;
              return (
                <div
                  key={item.id}
                  className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="truncate">
                      <span className="font-mono font-bold text-slate-900">
                        {item.weldTag}
                      </span>
                      <span className="text-slate-400 mx-1.5">·</span>
                      <span className="text-slate-700 font-medium">
                        {item.structuralMember}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 shrink-0 tabular-nums">
                      {formatCurrency(
                        item.result.totalCost,
                        settings.currencySymbol
                      )}
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-200 rounded-sm overflow-hidden">
                    <div
                      className="h-full bg-slate-900 rounded-sm flex"
                      style={{ width: `${Math.max(4, barPct)}%` }}
                    >
                      <div
                        className="h-full bg-orange-600"
                        style={{ width: `${matShare}%` }}
                      />
                      <div
                        className="h-full bg-sky-600"
                        style={{ width: `${100 - matShare}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 tabular-nums">
                    <span>
                      {item.input.process} · W_gross:{' '}
                      {formatNumber(item.result.grossConsumableWeightKg, 1)} kg
                    </span>
                    <span>
                      {t.t2ColLabor}:{' '}
                      {formatNumber(item.result.totalLaborHours, 1)} h (Arc:{' '}
                      {formatNumber(item.result.arcOnTimeHours, 1)} h)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 bg-orange-600 rounded-xs" />
                {t.t3CatConsumables}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 bg-sky-600 rounded-xs" />
                {t.t3CatLabor} & {t.t3CatPower}
              </span>
            </div>
            <span className="font-mono">
              {bomItems.length} {tech.itemsUnit}
            </span>
          </div>
        </div>
      </div>

      {/* Reference Table: Process Efficiency & Productivity Benchmark */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            {t.t3BenchmarkTitle}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                <th className="py-2 px-3">{t.t2ColProcess}</th>
                <th className="py-2 px-3">{tech.colSpecification}</th>
                <th className="py-2 px-3 text-right">{t.t1DepEfficiency}</th>
                <th className="py-2 px-3 text-right">{t.t1DepRate}</th>
                <th className="py-2 px-3 text-right">{t.t1OpFactor}</th>
                <th className="py-2 px-3 text-right">{tech.colPowerKw}</th>
                <th className="py-2 px-3 text-right">
                  {tech.colUnitPrice} ({settings.currencySymbol}/kg)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {Object.values(WeldingProcess).map((proc) => {
                const p = PROCESS_PRESETS[proc];
                return (
                  <tr key={proc} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-mono font-bold text-slate-900">
                      {proc}
                    </td>
                    <td className="py-2 px-3 text-slate-700">
                      {tech.processConsumables[proc] || p.consumableLabel}
                    </td>
                    <td className="py-2 px-3 text-right font-mono tabular-nums">
                      {p.efficiencyRange[0]}–{p.efficiencyRange[1]}% (
                      {p.defaultEfficiency}%)
                    </td>
                    <td className="py-2 px-3 text-right font-mono tabular-nums">
                      {formatNumber(p.defaultDepositionRateKgH, 1)} kg/h
                    </td>
                    <td className="py-2 px-3 text-right font-mono tabular-nums">
                      {p.defaultOperatingFactor}%
                    </td>
                    <td className="py-2 px-3 text-right font-mono tabular-nums">
                      {formatNumber(p.powerConsumptionKw, 1)} kW
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-semibold text-slate-900 tabular-nums">
                      {formatCurrency(
                        settings.unitPrices.consumablePerKg[proc],
                        settings.currencySymbol
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
