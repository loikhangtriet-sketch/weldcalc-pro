import React, { useEffect, useState } from 'react';
import {
  FilletDimensionMode,
  JOINT_META_LIST,
  JointGeometryInput,
  JointType,
  PROCESS_PRESETS,
  ProjectSettings,
  UnitSystem,
  WeldBOMItem,
  WeldingProcess,
  WeldingStandard,
} from '../types/welding';
import {
  calculateWeldJoint,
  displayAreaMm2,
  displayLengthMm,
  displayVolumeCm3,
  displayWeightKg,
  displayWeldLengthM,
  formatCurrency,
  formatNumber,
  MM_PER_INCH,
  M_PER_FT,
} from '../utils/calculations';
import { getTranslation } from '../i18n/translations';
import { getTechnicalTranslation } from '../i18n/wpsAndTechnicalTranslations';
import { WeldBlueprintSVG } from './WeldBlueprintSVG';
import { Plus, Check, Calculator, Wrench, Flame } from 'lucide-react';

interface TabJointCalculatorProps {
  settings: ProjectSettings;
  currentInput: JointGeometryInput;
  onUpdateInput: (next: JointGeometryInput) => void;
  onAddToBOM: (item: Omit<WeldBOMItem, 'id'>) => void;
  bomCount: number;
}

export const TabJointCalculator: React.FC<TabJointCalculatorProps> = ({
  settings,
  currentInput,
  onUpdateInput,
  onAddToBOM,
  bomCount,
}) => {
  const t = getTranslation(settings.language);
  const tech = getTechnicalTranslation(settings.language);

  const [weldTag, setWeldTag] = useState<string>(`W-0${bomCount + 1}`);
  const [structuralMember, setStructuralMember] = useState<string>(
    tech.defaultMemberSample
  );
  const [wpsRef, setWpsRef] = useState<string>(
    `WPS-${currentInput.process}-01`
  );
  const [addedBanner, setAddedBanner] = useState<boolean>(false);

  useEffect(() => {
    setStructuralMember(tech.defaultMemberSample);
  }, [settings.language, tech.defaultMemberSample]);

  const result = calculateWeldJoint(currentInput, settings);
  const activeJointMeta =
    JOINT_META_LIST.find((j) => j.type === currentInput.jointType) ||
    JOINT_META_LIST[0];
  const activeProcessPreset = PROCESS_PRESETS[currentInput.process];

  const isImperial = settings.unitSystem === UnitSystem.IMPERIAL;
  const lenUnit = isImperial ? 'in' : 'mm';
  const weldLenUnit = isImperial ? 'ft' : 'm';

  const handleSelectProcess = (proc: WeldingProcess) => {
    const preset = PROCESS_PRESETS[proc];
    onUpdateInput({
      ...currentInput,
      process: proc,
      depositionEfficiencyPct: preset.defaultEfficiency,
      depositionRateKgH: preset.defaultDepositionRateKgH,
      operatingFactorPct: preset.defaultOperatingFactor,
      gasFlowLMin: preset.defaultGasFlowLMin,
      fluxToWireRatio: preset.defaultFluxRatio,
    });
    setWpsRef(`WPS-${proc}-01`);
  };

  const handleAddClick = () => {
    const cleanTag = weldTag.trim() || `W-0${bomCount + 1}`;
    const cleanMember =
      structuralMember.trim() || t.jointNames[currentInput.jointType];
    onAddToBOM({
      weldTag: cleanTag,
      structuralMember: cleanMember,
      wpsRef: wpsRef.trim() || `WPS-${currentInput.process}-01`,
      input: { ...currentInput },
      result,
    });
    const nextIdx = bomCount + 2;
    setWeldTag(`W-${nextIdx < 10 ? `0${nextIdx}` : nextIdx}`);
    setAddedBanner(true);
    setTimeout(() => setAddedBanner(false), 2500);
  };

  const areaDisp = displayAreaMm2(result.totalAreaMm2, settings.unitSystem);
  const areaThDisp = displayAreaMm2(
    result.theoreticalAreaMm2,
    settings.unitSystem
  );
  const volDisp = displayVolumeCm3(result.volumeCm3, settings.unitSystem);
  const netWtDisp = displayWeightKg(result.netWeldWeightKg, settings.unitSystem);
  const grossWtDisp = displayWeightKg(
    result.grossConsumableWeightKg,
    settings.unitSystem
  );
  const totalLenDisp = displayWeldLengthM(
    result.totalLengthM,
    settings.unitSystem
  );

  return (
    <div className="space-y-6">
      {/* Top Joint Type Selector Strip */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              {t.t1LibraryTitle} ({settings.standard})
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              {t.jointNames[currentInput.jointType]} —{' '}
              {tech.jointSummaries[currentInput.jointType] ||
                activeJointMeta.summary}
            </p>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            {settings.standard === WeldingStandard.ISO_2553
              ? activeJointMeta.isoSymbolCode
              : activeJointMeta.awsSymbolCode}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-2">
          {JOINT_META_LIST.map((j) => {
            const active = currentInput.jointType === j.type;
            return (
              <button
                key={j.type}
                type="button"
                onClick={() =>
                  onUpdateInput({ ...currentInput, jointType: j.type })
                }
                className={`px-3 py-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  active
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50/80 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-semibold truncate">
                  {t.jointNames[j.type]}
                </div>
                <div
                  className={`text-[10px] font-mono mt-0.5 truncate ${
                    active ? 'text-orange-300' : 'text-slate-500'
                  }`}
                >
                  {j.isoSymbolCode.replace('ISO 2553 ', '')}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-orange-600" />
                <span>{t.t1Sec1Title}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {t.t1WeldTag}
                  </label>
                  <input
                    type="text"
                    value={weldTag}
                    onChange={(e) => setWeldTag(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-mono font-semibold bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-orange-600"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {t.t1MemberName}
                  </label>
                  <input
                    type="text"
                    value={structuralMember}
                    onChange={(e) => setStructuralMember(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-orange-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {t.t1WpsCode}
                  </label>
                  <input
                    type="text"
                    value={wpsRef}
                    onChange={(e) => setWpsRef(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-orange-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {t.t1LengthPerWeld} ({weldLenUnit})
                  </label>
                  <input
                    type="number"
                    min="0.05"
                    step="0.1"
                    value={
                      isImperial
                        ? Number(
                            (currentInput.weldLengthM / M_PER_FT).toFixed(2)
                          )
                        : currentInput.weldLengthM
                    }
                    onChange={(e) => {
                      const val = Math.max(
                        0.01,
                        parseFloat(e.target.value) || 0.1
                      );
                      onUpdateInput({
                        ...currentInput,
                        weldLengthM: isImperial ? val * M_PER_FT : val,
                      });
                    }}
                    className="w-full px-3 py-1.5 text-sm font-mono bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-orange-600 tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {t.t1Quantity}
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={currentInput.quantity}
                    onChange={(e) =>
                      onUpdateInput({
                        ...currentInput,
                        quantity: Math.max(
                          1,
                          parseInt(e.target.value, 10) || 1
                        ),
                      })
                    }
                    className="w-full px-3 py-1.5 text-sm font-mono bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-orange-600 tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {t.t1Reinforcement} ({currentInput.reinforcementPct}%)
                  </label>
                  <div className="flex items-center gap-2 pt-1.5">
                    <input
                      type="range"
                      min="0"
                      max="25"
                      step="1"
                      value={currentInput.reinforcementPct}
                      onChange={(e) =>
                        onUpdateInput({
                          ...currentInput,
                          reinforcementPct: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      className="w-full accent-orange-600"
                    />
                    <span className="text-xs font-mono font-semibold text-slate-800 w-10 text-right tabular-nums">
                      {currentInput.reinforcementPct}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-slate-200" />

            {/* Step 2 */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-orange-600" />
                <span>
                  {t.t1Sec2Title} ({lenUnit})
                </span>
              </h3>

              {currentInput.jointType === JointType.FILLET ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="block text-xs font-medium text-slate-700 mb-1.5">
                        {t.t1FilletRule} ({settings.standard})
                      </span>
                      <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateInput({
                              ...currentInput,
                              filletMode: FilletDimensionMode.LEG_Z,
                            })
                          }
                          className={`py-1.5 px-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            currentInput.filletMode ===
                            FilletDimensionMode.LEG_Z
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {t.t1LegZ}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateInput({
                              ...currentInput,
                              filletMode: FilletDimensionMode.THROAT_A,
                            })
                          }
                          className={`py-1.5 px-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            currentInput.filletMode ===
                            FilletDimensionMode.THROAT_A
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {t.t1ThroatA}
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="block text-xs font-medium text-slate-700 mb-1.5">
                        {t.t1FilletArrangement}
                      </span>
                      <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateInput({
                              ...currentInput,
                              isDoubleFillet: false,
                            })
                          }
                          className={`py-1.5 px-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            !currentInput.isDoubleFillet
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {t.t1SingleFillet}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateInput({
                              ...currentInput,
                              isDoubleFillet: true,
                            })
                          }
                          className={`py-1.5 px-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            currentInput.isDoubleFillet
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {t.t1DoubleFillet}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        {currentInput.filletMode ===
                        FilletDimensionMode.THROAT_A
                          ? `${t.t1ThroatA} (${lenUnit})`
                          : `${t.t1LegZ} (${lenUnit})`}
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        step="0.5"
                        value={
                          isImperial
                            ? Number(
                                (
                                  currentInput.filletSizeMm / MM_PER_INCH
                                ).toFixed(3)
                              )
                            : currentInput.filletSizeMm
                        }
                        onChange={(e) => {
                          const v = Math.max(
                            0.5,
                            parseFloat(e.target.value) || 1
                          );
                          onUpdateInput({
                            ...currentInput,
                            filletSizeMm: isImperial ? v * MM_PER_INCH : v,
                          });
                        }}
                        className="w-full px-3 py-1.5 text-sm font-mono bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-orange-600 tabular-nums"
                      />
                    </div>

                    <div className="sm:col-span-2 bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs text-slate-700 font-mono flex items-center justify-between">
                      <span>{t.t1EquivalentConv}</span>
                      <span className="font-semibold text-slate-900 tabular-nums">
                        z ={' '}
                        {formatNumber(
                          displayLengthMm(
                            result.EffectiveLegZMm,
                            settings.unitSystem
                          ).value,
                          2
                        )}{' '}
                        {lenUnit} · a ={' '}
                        {formatNumber(
                          displayLengthMm(
                            result.EffectiveThroatAMm,
                            settings.unitSystem
                          ).value,
                          2
                        )}{' '}
                        {lenUnit}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {t.t1PlateThickness} ({lenUnit})
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="150"
                      step="0.5"
                      value={
                        isImperial
                          ? Number(
                              (
                                currentInput.plateThicknessMm / MM_PER_INCH
                              ).toFixed(3)
                            )
                          : currentInput.plateThicknessMm
                      }
                      onChange={(e) => {
                        const v = Math.max(1, parseFloat(e.target.value) || 1);
                        onUpdateInput({
                          ...currentInput,
                          plateThicknessMm: isImperial ? v * MM_PER_INCH : v,
                        });
                      }}
                      className="w-full px-3 py-1.5 text-sm font-mono bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-orange-600 tabular-nums"
                    />
                  </div>

                  {currentInput.jointType !== JointType.SQUARE && (
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        {currentInput.jointType === JointType.SINGLE_V ||
                        currentInput.jointType === JointType.DOUBLE_V
                          ? t.t1GrooveAngle
                          : t.t1BevelAngle}
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="110"
                        step="2.5"
                        value={currentInput.grooveAngleDeg}
                        onChange={(e) =>
                          onUpdateInput({
                            ...currentInput,
                            grooveAngleDeg: Math.max(
                              5,
                              Math.min(120, parseFloat(e.target.value) || 45)
                            ),
                          })
                        }
                        className="w-full px-3 py-1.5 text-sm font-mono bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-orange-600 tabular-nums"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {t.t1RootGap} ({lenUnit})
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="25"
                      step="0.5"
                      value={
                        isImperial
                          ? Number(
                              (currentInput.rootGapMm / MM_PER_INCH).toFixed(3)
                            )
                          : currentInput.rootGapMm
                      }
                      onChange={(e) => {
                        const v = Math.max(0, parseFloat(e.target.value) || 0);
                        onUpdateInput({
                          ...currentInput,
                          rootGapMm: isImperial ? v * MM_PER_INCH : v,
                        });
                      }}
                      className="w-full px-3 py-1.5 text-sm font-mono bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-orange-600 tabular-nums"
                    />
                  </div>

                  {currentInput.jointType !== JointType.SQUARE && (
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        {t.t1RootFace} ({lenUnit})
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="30"
                        step="0.5"
                        value={
                          isImperial
                            ? Number(
                                (currentInput.rootFaceMm / MM_PER_INCH).toFixed(
                                  3
                                )
                              )
                            : currentInput.rootFaceMm
                        }
                        onChange={(e) => {
                          const v = Math.max(
                            0,
                            parseFloat(e.target.value) || 0
                          );
                          onUpdateInput({
                            ...currentInput,
                            rootFaceMm: isImperial ? v * MM_PER_INCH : v,
                          });
                        }}
                        className="w-full px-3 py-1.5 text-sm font-mono bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-orange-600 tabular-nums"
                      />
                    </div>
                  )}

                  {(currentInput.jointType === JointType.SINGLE_U ||
                    currentInput.jointType === JointType.SINGLE_J) && (
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        {t.t1RootRadius} ({lenUnit})
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        step="0.5"
                        value={
                          isImperial
                            ? Number(
                                (
                                  currentInput.rootRadiusMm / MM_PER_INCH
                                ).toFixed(3)
                              )
                            : currentInput.rootRadiusMm
                        }
                        onChange={(e) => {
                          const v = Math.max(
                            1,
                            parseFloat(e.target.value) || 5
                          );
                          onUpdateInput({
                            ...currentInput,
                            rootRadiusMm: isImperial ? v * MM_PER_INCH : v,
                          });
                        }}
                        className="w-full px-3 py-1.5 text-sm font-mono bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-orange-600 tabular-nums"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <hr className="border-slate-200" />

            {/* Step 3 */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-600" />
                  <span>{t.t1Sec3Title}</span>
                </h3>
                <span className="text-xs text-slate-500">
                  {tech.processConsumables[currentInput.process] ||
                    activeProcessPreset.consumableLabel}
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {Object.values(WeldingProcess).map((proc) => {
                  const isSelected = currentInput.process === proc;
                  const p = PROCESS_PRESETS[proc];
                  return (
                    <button
                      key={proc}
                      type="button"
                      onClick={() => handleSelectProcess(proc)}
                      className={`py-2 px-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-xs font-bold font-mono">{proc}</div>
                      <div
                        className={`text-[10px] font-mono mt-0.5 ${
                          isSelected ? 'text-orange-100' : 'text-slate-500'
                        }`}
                      >
                        η ≈ {p.defaultEfficiency}%
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {t.t1DepEfficiency}
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="100"
                    step="1"
                    value={currentInput.depositionEfficiencyPct}
                    onChange={(e) =>
                      onUpdateInput({
                        ...currentInput,
                        depositionEfficiencyPct: Math.max(
                          30,
                          Math.min(100, parseFloat(e.target.value) || 85)
                        ),
                      })
                    }
                    className="w-full px-3 py-1.5 text-sm font-mono bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-orange-600 tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {t.t1DepRate}
                  </label>
                  <input
                    type="number"
                    min="0.2"
                    max="25"
                    step="0.1"
                    value={currentInput.depositionRateKgH}
                    onChange={(e) =>
                      onUpdateInput({
                        ...currentInput,
                        depositionRateKgH: Math.max(
                          0.1,
                          parseFloat(e.target.value) || 2.0
                        ),
                      })
                    }
                    className="w-full px-3 py-1.5 text-sm font-mono bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-orange-600 tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {t.t1OpFactor}
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="95"
                    step="5"
                    value={currentInput.operatingFactorPct}
                    onChange={(e) =>
                      onUpdateInput({
                        ...currentInput,
                        operatingFactorPct: Math.max(
                          10,
                          Math.min(100, parseFloat(e.target.value) || 40)
                        ),
                      })
                    }
                    className="w-full px-3 py-1.5 text-sm font-mono bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-orange-600 tabular-nums"
                  />
                </div>

                {activeProcessPreset.usesShieldingGas ? (
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {t.t1GasFlow}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      step="1"
                      value={currentInput.gasFlowLMin}
                      onChange={(e) =>
                        onUpdateInput({
                          ...currentInput,
                          gasFlowLMin: Math.max(
                            0,
                            parseFloat(e.target.value) || 0
                          ),
                        })
                      }
                      className="w-full px-3 py-1.5 text-sm font-mono bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-orange-600 tabular-nums"
                    />
                  </div>
                ) : activeProcessPreset.usesFlux ? (
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {t.t1FluxRatio}
                    </label>
                    <input
                      type="number"
                      min="0.5"
                      max="2.5"
                      step="0.05"
                      value={currentInput.fluxToWireRatio}
                      onChange={(e) =>
                        onUpdateInput({
                          ...currentInput,
                          fluxToWireRatio: Math.max(
                            0,
                            parseFloat(e.target.value) || 1.1
                          ),
                        })
                      }
                      className="w-full px-3 py-1.5 text-sm font-mono bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-orange-600 tabular-nums"
                    />
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-md p-2.5 flex flex-col justify-center">
                    <span className="text-xs font-medium text-slate-700">
                      {t.t1NoAuxRequired}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-600">
              {t.t1TotalItemLength}{' '}
              <strong className="font-mono text-slate-900 tabular-nums">
                {formatNumber(totalLenDisp.value, 2)} {totalLenDisp.unit}
              </strong>{' '}
              ({currentInput.quantity})
            </div>

            <button
              type="button"
              onClick={handleAddClick}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
            >
              {addedBanner ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t.t1AddedBomMsg}</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>{t.t1AddBomBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Interactive 2D CAD Blueprint & Results (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <WeldBlueprintSVG
            input={currentInput}
            result={result}
            unitSystem={settings.unitSystem}
            standard={settings.standard}
            language={settings.language}
          />

          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
                <h3 className="text-sm font-semibold text-slate-900">
                  {t.t1ResultsTitle}
                </h3>
                <span className="text-xs font-mono text-slate-500 tabular-nums">
                  ρ = {settings.customDensityGcm3} g/cm³
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
                  <div className="text-xs text-slate-500">{t.t1CrossArea}</div>
                  <div className="text-lg font-bold font-mono text-slate-900 mt-0.5 tabular-nums">
                    {formatNumber(areaDisp.value, isImperial ? 3 : 2)}{' '}
                    {areaDisp.unit}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5 tabular-nums">
                    {t.t1Theoretical}:{' '}
                    {formatNumber(areaThDisp.value, isImperial ? 3 : 2)}{' '}
                    {areaThDisp.unit}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
                  <div className="text-xs text-slate-500">{t.t1WeldVolume}</div>
                  <div className="text-lg font-bold font-mono text-slate-900 mt-0.5 tabular-nums">
                    {formatNumber(volDisp.value, 2)} {volDisp.unit}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5 tabular-nums">
                    L = {formatNumber(totalLenDisp.value, 2)}{' '}
                    {totalLenDisp.unit}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
                  <div className="text-xs text-slate-500">{t.t1NetWeight}</div>
                  <div className="text-lg font-bold font-mono text-slate-900 mt-0.5 tabular-nums">
                    {formatNumber(netWtDisp.value, 2)} {netWtDisp.unit}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    W_net = V × ρ
                  </div>
                </div>

                <div className="p-3 bg-orange-50/70 border border-orange-200 rounded-lg">
                  <div className="text-xs text-orange-900 font-medium">
                    {t.t1GrossWeight}
                  </div>
                  <div className="text-lg font-bold font-mono text-orange-700 mt-0.5 tabular-nums">
                    {formatNumber(grossWtDisp.value, 2)} {grossWtDisp.unit}
                  </div>
                  <div className="text-[11px] text-orange-800/80 font-mono mt-0.5 tabular-nums">
                    W_gross = W_net / {currentInput.depositionEfficiencyPct}%
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>
                  {t.t1AuxMaterial} ({currentInput.process}):
                </span>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {activeProcessPreset.usesShieldingGas
                    ? `${formatNumber(result.shieldingGasM3, 2)} m³ (${formatNumber(
                        result.shieldingGasLiters,
                        0
                      )} L)`
                    : activeProcessPreset.usesFlux
                    ? `${formatNumber(result.fluxWeightKg, 2)} kg SAW Flux`
                    : '—'}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>{t.t1ArcAndLaborTime}:</span>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {formatNumber(result.arcOnTimeHours, 2)} h /{' '}
                  {formatNumber(result.totalLaborHours, 2)} h
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="font-semibold text-slate-800">
                  {t.t1EstimatedItemCost}
                </span>
                <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
                  {formatCurrency(result.totalCost, settings.currencySymbol)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
