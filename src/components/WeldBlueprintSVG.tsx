import React from 'react';
import {
  FilletDimensionMode,
  JOINT_META_LIST,
  JointGeometryInput,
  JointType,
  LanguageCode,
  UnitSystem,
  WeldCalculationResult,
  WeldingStandard,
} from '../types/welding';
import { displayLengthMm, formatNumber } from '../utils/calculations';
import { getTranslation } from '../i18n/translations';

interface WeldBlueprintSVGProps {
  input: JointGeometryInput;
  result: WeldCalculationResult;
  unitSystem: UnitSystem;
  standard: WeldingStandard;
  language?: LanguageCode;
}

export const WeldBlueprintSVG: React.FC<WeldBlueprintSVGProps> = ({
  input,
  result,
  unitSystem,
  standard,
  language,
}) => {
  const t = getTranslation(language);
  const meta =
    JOINT_META_LIST.find((m) => m.type === input.jointType) ||
    JOINT_META_LIST[0];

  const cx = 260;
  const cy = 165;

  const tRaw = Math.max(4, Math.min(60, input.plateThicknessMm));
  const plateH = 74 + ((tRaw - 4) / 56) * 62;
  const topY = cy - plateH / 2;
  const botY = cy + plateH / 2;

  const gapRaw = Math.max(0, Math.min(12, input.rootGapMm));
  const gapPx =
    input.jointType === JointType.FILLET ? 0 : Math.max(4, gapRaw * 3.5);

  const faceRatio = Math.min(
    0.65,
    Math.max(0, input.rootFaceMm / Math.max(1, input.plateThicknessMm))
  );
  const facePx = plateH * faceRatio;
  const bevelDepthPx = Math.max(8, plateH - facePx);

  const angleClamped = Math.max(15, Math.min(90, input.grooveAngleDeg));
  const halfAngleRad = ((angleClamped / 2) * Math.PI) / 180;
  const bevelAngleRad = (Math.min(60, angleClamped) * Math.PI) / 180;

  const reinfScale = 1 + (input.reinforcementPct / 100) * 1.4;
  const capHeight = Math.max(6, Math.min(20, 10 * reinfScale));

  const fmtDim = (mm: number) => {
    const conv = displayLengthMm(mm, unitSystem);
    return `${formatNumber(conv.value, unitSystem === UnitSystem.IMPERIAL ? 3 : 1)} ${conv.unit}`;
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-lg border border-slate-800 overflow-hidden">
      {/* CAD Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2 font-mono text-slate-300">
          <span className="text-sky-400 font-semibold">
            {t.bpCrossSection}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {standard === WeldingStandard.ISO_2553
              ? meta.isoSymbolCode
              : meta.awsSymbolCode}
          </span>
        </div>
        <div className="font-mono text-slate-400 tabular-nums">
          A = {formatNumber(result.totalAreaMm2, 1)} mm² · η ={' '}
          {input.depositionEfficiencyPct}%
        </div>
      </div>

      {/* Main SVG Blueprint Viewport */}
      <div className="relative p-3">
        <svg
          viewBox="0 0 520 300"
          className="w-full h-auto select-none"
          role="img"
          aria-label={t.jointNames[input.jointType]}
        >
          <defs>
            <pattern
              id="cad-grid-minor"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#1e293b"
                strokeWidth="0.75"
              />
            </pattern>
            <pattern
              id="cad-grid-major"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <rect width="100" height="100" fill="url(#cad-grid-minor)" />
              <path
                d="M 100 0 L 0 0 0 100"
                fill="none"
                stroke="#334155"
                strokeWidth="1"
              />
            </pattern>
            <pattern
              id="steel-hatch"
              width="10"
              height="10"
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="10"
                stroke="#475569"
                strokeWidth="1.5"
              />
            </pattern>
            <linearGradient
              id="weld-metal-grad"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#fb923c" stopOpacity="0.92" />
              <stop offset="50%" stopColor="#ea580c" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#c2410c" stopOpacity="0.92" />
            </linearGradient>
            <marker
              id="dim-arrow"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#38bdf8" />
            </marker>
          </defs>

          <rect width="520" height="300" fill="url(#cad-grid-major)" />

          <line
            x1={cx}
            y1="18"
            x2={cx}
            y2="282"
            stroke="#475569"
            strokeWidth="1"
            strokeDasharray="6 4"
          />

          {/* 1. FILLET WELD */}
          {input.jointType === JointType.FILLET &&
            (() => {
              const zScaled = Math.max(
                28,
                Math.min(82, result.EffectiveLegZMm * 4.6)
              );
              const webW = 36;
              const flangeY = 215;
              const flangeH = 34;
              const webTopY = 52;
              const rightCornerX = cx + webW / 2;
              const leftCornerX = cx - webW / 2;
              const bulge = (input.reinforcementPct / 100) * 16;

              return (
                <g>
                  <rect
                    x="70"
                    y={flangeY}
                    width="380"
                    height={flangeH}
                    fill="#1e293b"
                    stroke="#94a3b8"
                    strokeWidth="1.75"
                  />
                  <rect
                    x="70"
                    y={flangeY}
                    width="380"
                    height={flangeH}
                    fill="url(#steel-hatch)"
                    opacity="0.45"
                  />
                  <rect
                    x={leftCornerX}
                    y={webTopY}
                    width={webW}
                    height={flangeY - webTopY}
                    fill="#1e293b"
                    stroke="#94a3b8"
                    strokeWidth="1.75"
                  />
                  <rect
                    x={leftCornerX}
                    y={webTopY}
                    width={webW}
                    height={flangeY - webTopY}
                    fill="url(#steel-hatch)"
                    opacity="0.45"
                  />

                  <path
                    d={`M ${rightCornerX} ${flangeY} L ${rightCornerX} ${
                      flangeY - zScaled
                    } Q ${rightCornerX + zScaled * 0.55 + bulge} ${
                      flangeY - zScaled * 0.55 - bulge
                    } ${rightCornerX + zScaled} ${flangeY} Z`}
                    fill="url(#weld-metal-grad)"
                    stroke="#fdba74"
                    strokeWidth="1.75"
                  />
                  <line
                    x1={rightCornerX}
                    y1={flangeY - zScaled}
                    x2={rightCornerX + zScaled}
                    y2={flangeY}
                    stroke="#fef08a"
                    strokeWidth="1.2"
                    strokeDasharray="4 3"
                  />
                  <line
                    x1={rightCornerX}
                    y1={flangeY}
                    x2={rightCornerX + zScaled * 0.5}
                    y2={flangeY - zScaled * 0.5}
                    stroke="#38bdf8"
                    strokeWidth="1.75"
                    markerEnd="url(#dim-arrow)"
                  />
                  <text
                    x={rightCornerX + zScaled * 0.55 + 14}
                    y={flangeY - zScaled * 0.55 - 6}
                    fill="#38bdf8"
                    fontSize="11"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="600"
                  >
                    a = {fmtDim(result.EffectiveThroatAMm)}
                  </text>

                  {input.isDoubleFillet && (
                    <g>
                      <path
                        d={`M ${leftCornerX} ${flangeY} L ${leftCornerX} ${
                          flangeY - zScaled
                        } Q ${leftCornerX - zScaled * 0.55 - bulge} ${
                          flangeY - zScaled * 0.55 - bulge
                        } ${leftCornerX - zScaled} ${flangeY} Z`}
                        fill="url(#weld-metal-grad)"
                        stroke="#fdba74"
                        strokeWidth="1.75"
                      />
                      <line
                        x1={leftCornerX}
                        y1={flangeY - zScaled}
                        x2={leftCornerX - zScaled}
                        y2={flangeY}
                        stroke="#fef08a"
                        strokeWidth="1.2"
                        strokeDasharray="4 3"
                      />
                    </g>
                  )}

                  <line
                    x1={rightCornerX}
                    y1={flangeY + 52}
                    x2={rightCornerX + zScaled}
                    y2={flangeY + 52}
                    stroke="#38bdf8"
                    strokeWidth="1.4"
                    markerStart="url(#dim-arrow)"
                    markerEnd="url(#dim-arrow)"
                  />
                  <text
                    x={rightCornerX + zScaled / 2}
                    y={flangeY + 68}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="11"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="600"
                  >
                    z = {fmtDim(result.EffectiveLegZMm)}
                  </text>

                  <text
                    x="80"
                    y="36"
                    fill="#cbd5e1"
                    fontSize="11"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {t.jointNames[JointType.FILLET]} ·{' '}
                    {input.isDoubleFillet ? t.t1DoubleFillet : t.t1SingleFillet} ·{' '}
                    {input.filletMode === FilletDimensionMode.THROAT_A
                      ? t.t1ThroatA
                      : t.t1LegZ}
                  </text>
                </g>
              );
            })()}

          {/* 2. SINGLE-V GROOVE */}
          {input.jointType === JointType.SINGLE_V &&
            (() => {
              const bevelSpread = Math.min(
                95,
                bevelDepthPx * Math.tan(halfAngleRad)
              );
              const rootTopY = botY - facePx;
              const leftRootX = cx - gapPx / 2;
              const rightRootX = cx + gapPx / 2;
              const leftTopX = leftRootX - bevelSpread;
              const rightTopX = rightRootX + bevelSpread;

              return (
                <g>
                  <polygon
                    points={`55,${topY} ${leftTopX},${topY} ${leftRootX},${rootTopY} ${leftRootX},${botY} 55,${botY}`}
                    fill="#1e293b"
                    stroke="#94a3b8"
                    strokeWidth="1.75"
                  />
                  <polygon
                    points={`465,${topY} ${rightTopX},${topY} ${rightRootX},${rootTopY} ${rightRootX},${botY} 465,${botY}`}
                    fill="#1e293b"
                    stroke="#94a3b8"
                    strokeWidth="1.75"
                  />
                  <path
                    d={`M ${leftTopX - 4} ${topY} Q ${cx} ${
                      topY - capHeight * 1.6
                    } ${rightTopX + 4} ${topY} L ${rightRootX} ${rootTopY} L ${rightRootX} ${botY} Q ${cx} ${
                      botY + 5
                    } ${leftRootX} ${botY} L ${leftRootX} ${rootTopY} Z`}
                    fill="url(#weld-metal-grad)"
                    stroke="#fdba74"
                    strokeWidth="1.75"
                  />
                  <text
                    x={cx}
                    y={topY - capHeight - 12}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="11.5"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="600"
                  >
                    {t.jointNames[JointType.SINGLE_V]} · α ={' '}
                    {input.grooveAngleDeg}°
                  </text>
                  <text
                    x={cx}
                    y={botY + 28}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="11"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="600"
                  >
                    t = {fmtDim(input.plateThicknessMm)} · R ={' '}
                    {fmtDim(input.rootGapMm)} · f = {fmtDim(input.rootFaceMm)}
                  </text>
                </g>
              );
            })()}

          {/* 3. DOUBLE-V GROOVE */}
          {input.jointType === JointType.DOUBLE_V &&
            (() => {
              const halfDepth = bevelDepthPx / 2;
              const bevelSpread = Math.min(
                85,
                halfDepth * Math.tan(halfAngleRad)
              );
              const leftRootX = cx - gapPx / 2;
              const rightRootX = cx + gapPx / 2;
              const rootTopY = cy - facePx / 2;
              const rootBotY = cy + facePx / 2;
              const leftEdgeX = leftRootX - bevelSpread;
              const rightEdgeX = rightRootX + bevelSpread;

              return (
                <g>
                  <polygon
                    points={`55,${topY} ${leftEdgeX},${topY} ${leftRootX},${rootTopY} ${leftRootX},${rootBotY} ${leftEdgeX},${botY} 55,${botY}`}
                    fill="#1e293b"
                    stroke="#94a3b8"
                    strokeWidth="1.75"
                  />
                  <polygon
                    points={`465,${topY} ${rightEdgeX},${topY} ${rightRootX},${rootTopY} ${rightRootX},${rootBotY} ${rightEdgeX},${botY} 465,${botY}`}
                    fill="#1e293b"
                    stroke="#94a3b8"
                    strokeWidth="1.75"
                  />
                  <path
                    d={`M ${leftEdgeX - 3} ${topY} Q ${cx} ${
                      topY - capHeight * 1.4
                    } ${rightEdgeX + 3} ${topY} L ${rightRootX} ${rootTopY} L ${rightRootX} ${rootBotY} L ${
                      rightEdgeX + 3
                    } ${botY} Q ${cx} ${botY + capHeight * 1.4} ${
                      leftEdgeX - 3
                    } ${botY} L ${leftRootX} ${rootBotY} L ${leftRootX} ${rootTopY} Z`}
                    fill="url(#weld-metal-grad)"
                    stroke="#fdba74"
                    strokeWidth="1.75"
                  />
                  <text
                    x={cx}
                    y={topY - capHeight - 10}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="11.5"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="600"
                  >
                    {t.jointNames[JointType.DOUBLE_V]} · α ={' '}
                    {input.grooveAngleDeg}°
                  </text>
                  <text
                    x={cx}
                    y={botY + capHeight + 22}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="11"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="600"
                  >
                    t = {fmtDim(input.plateThicknessMm)} · R ={' '}
                    {fmtDim(input.rootGapMm)} · f = {fmtDim(input.rootFaceMm)}
                  </text>
                </g>
              );
            })()}

          {/* 4. SINGLE-BEVEL GROOVE */}
          {input.jointType === JointType.SINGLE_BEVEL &&
            (() => {
              const bevelSpread = Math.min(
                95,
                bevelDepthPx * Math.tan(bevelAngleRad)
              );
              const leftRootX = cx - gapPx / 2;
              const rightRootX = cx + gapPx / 2;
              const rootTopY = botY - facePx;
              const rightTopX = rightRootX + bevelSpread;

              return (
                <g>
                  <rect
                    x="55"
                    y={topY}
                    width={leftRootX - 55}
                    height={plateH}
                    fill="#1e293b"
                    stroke="#94a3b8"
                    strokeWidth="1.75"
                  />
                  <polygon
                    points={`465,${topY} ${rightTopX},${topY} ${rightRootX},${rootTopY} ${rightRootX},${botY} 465,${botY}`}
                    fill="#1e293b"
                    stroke="#94a3b8"
                    strokeWidth="1.75"
                  />
                  <path
                    d={`M ${leftRootX - 3} ${topY} Q ${
                      (leftRootX + rightTopX) / 2
                    } ${topY - capHeight * 1.5} ${
                      rightTopX + 4
                    } ${topY} L ${rightRootX} ${rootTopY} L ${rightRootX} ${botY} L ${leftRootX} ${botY} Z`}
                    fill="url(#weld-metal-grad)"
                    stroke="#fdba74"
                    strokeWidth="1.75"
                  />
                  <text
                    x={cx}
                    y={topY - capHeight - 10}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="11.5"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="600"
                  >
                    {t.jointNames[JointType.SINGLE_BEVEL]} · β ={' '}
                    {input.grooveAngleDeg}°
                  </text>
                  <text
                    x={cx}
                    y={botY + 26}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="11"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="600"
                  >
                    t = {fmtDim(input.plateThicknessMm)} · R ={' '}
                    {fmtDim(input.rootGapMm)} · f = {fmtDim(input.rootFaceMm)}
                  </text>
                </g>
              );
            })()}

          {/* 5. DOUBLE-BEVEL GROOVE */}
          {input.jointType === JointType.DOUBLE_BEVEL &&
            (() => {
              const halfDepth = bevelDepthPx / 2;
              const bevelSpread = Math.min(
                90,
                halfDepth * Math.tan(bevelAngleRad)
              );
              const leftRootX = cx - gapPx / 2;
              const rightRootX = cx + gapPx / 2;
              const rootTopY = cy - facePx / 2;
              const rootBotY = cy + facePx / 2;
              const rightEdgeX = rightRootX + bevelSpread;

              return (
                <g>
                  <rect
                    x="55"
                    y={topY}
                    width={leftRootX - 55}
                    height={plateH}
                    fill="#1e293b"
                    stroke="#94a3b8"
                    strokeWidth="1.75"
                  />
                  <polygon
                    points={`465,${topY} ${rightEdgeX},${topY} ${rightRootX},${rootTopY} ${rightRootX},${rootBotY} ${rightEdgeX},${botY} 465,${botY}`}
                    fill="#1e293b"
                    stroke="#94a3b8"
                    strokeWidth="1.75"
                  />
                  <path
                    d={`M ${leftRootX - 2} ${topY} Q ${
                      (leftRootX + rightEdgeX) / 2
                    } ${topY - capHeight * 1.4} ${
                      rightEdgeX + 3
                    } ${topY} L ${rightRootX} ${rootTopY} L ${rightRootX} ${rootBotY} L ${
                      rightEdgeX + 3
                    } ${botY} Q ${(leftRootX + rightEdgeX) / 2} ${
                      botY + capHeight * 1.4
                    } ${leftRootX - 2} ${botY} Z`}
                    fill="url(#weld-metal-grad)"
                    stroke="#fdba74"
                    strokeWidth="1.75"
                  />
                  <text
                    x={cx}
                    y={topY - capHeight - 10}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="11.5"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="600"
                  >
                    {t.jointNames[JointType.DOUBLE_BEVEL]} · β ={' '}
                    {input.grooveAngleDeg}°
                  </text>
                  <text
                    x={cx}
                    y={botY + capHeight + 22}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="11"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="600"
                  >
                    t = {fmtDim(input.plateThicknessMm)} · R ={' '}
                    {fmtDim(input.rootGapMm)} · f = {fmtDim(input.rootFaceMm)}
                  </text>
                </g>
              );
            })()}

          {/* 6. SINGLE-U GROOVE */}
          {input.jointType === JointType.SINGLE_U &&
            (() => {
              const rPx = Math.max(
                16,
                Math.min(44, input.rootRadiusMm * 3.2)
              );
              const rootTopY = botY - facePx;
              const uCenterY = rootTopY - rPx;
              const leftRootX = cx - gapPx / 2;
              const rightRootX = cx + gapPx / 2;
              const slopeSpread = Math.max(
                8,
                (uCenterY - topY) *
                  Math.tan((Math.min(35, input.grooveAngleDeg) * Math.PI) / 180)
              );
              const leftTopX = leftRootX - rPx - slopeSpread;
              const rightTopX = rightRootX + rPx + slopeSpread;

              return (
                <g>
                  <path
                    d={`M 55 ${topY} L ${leftTopX} ${topY} L ${
                      leftRootX - rPx
                    } ${uCenterY} Q ${
                      leftRootX - rPx
                    } ${rootTopY} ${leftRootX} ${rootTopY} L ${leftRootX} ${botY} L 55 ${botY} Z`}
                    fill="#1e293b"
                    stroke="#94a3b8"
                    strokeWidth="1.75"
                  />
                  <path
                    d={`M 465 ${topY} L ${rightTopX} ${topY} L ${
                      rightRootX + rPx
                    } ${uCenterY} Q ${
                      rightRootX + rPx
                    } ${rootTopY} ${rightRootX} ${rootTopY} L ${rightRootX} ${botY} L 465 ${botY} Z`}
                    fill="#1e293b"
                    stroke="#94a3b8"
                    strokeWidth="1.75"
                  />
                  <path
                    d={`M ${leftTopX - 3} ${topY} Q ${cx} ${
                      topY - capHeight * 1.5
                    } ${rightTopX + 3} ${topY} L ${
                      rightRootX + rPx
                    } ${uCenterY} Q ${
                      rightRootX + rPx
                    } ${rootTopY} ${rightRootX} ${rootTopY} L ${rightRootX} ${botY} L ${leftRootX} ${botY} L ${leftRootX} ${rootTopY} Q ${
                      leftRootX - rPx
                    } ${rootTopY} ${leftRootX - rPx} ${uCenterY} Z`}
                    fill="url(#weld-metal-grad)"
                    stroke="#fdba74"
                    strokeWidth="1.75"
                  />
                  <text
                    x={cx}
                    y={topY - capHeight - 10}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="11.5"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="600"
                  >
                    {t.jointNames[JointType.SINGLE_U]} · r ={' '}
                    {fmtDim(input.rootRadiusMm)} · β = {input.grooveAngleDeg}°
                  </text>
                  <text
                    x={cx}
                    y={botY + 26}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="11"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="600"
                  >
                    t = {fmtDim(input.plateThicknessMm)} · R ={' '}
                    {fmtDim(input.rootGapMm)} · f = {fmtDim(input.rootFaceMm)}
                  </text>
                </g>
              );
            })()}

          {/* 7. SINGLE-J GROOVE */}
          {input.jointType === JointType.SINGLE_J &&
            (() => {
              const rPx = Math.max(
                16,
                Math.min(44, input.rootRadiusMm * 3.2)
              );
              const rootTopY = botY - facePx;
              const uCenterY = rootTopY - rPx;
              const leftRootX = cx - gapPx / 2;
              const rightRootX = cx + gapPx / 2;
              const slopeSpread = Math.max(
                8,
                (uCenterY - topY) *
                  Math.tan((Math.min(35, input.grooveAngleDeg) * Math.PI) / 180)
              );
              const rightTopX = rightRootX + rPx + slopeSpread;

              return (
                <g>
                  <rect
                    x="55"
                    y={topY}
                    width={leftRootX - 55}
                    height={plateH}
                    fill="#1e293b"
                    stroke="#94a3b8"
                    strokeWidth="1.75"
                  />
                  <path
                    d={`M 465 ${topY} L ${rightTopX} ${topY} L ${
                      rightRootX + rPx
                    } ${uCenterY} Q ${
                      rightRootX + rPx
                    } ${rootTopY} ${rightRootX} ${rootTopY} L ${rightRootX} ${botY} L 465 ${botY} Z`}
                    fill="#1e293b"
                    stroke="#94a3b8"
                    strokeWidth="1.75"
                  />
                  <path
                    d={`M ${leftRootX - 2} ${topY} Q ${
                      (leftRootX + rightTopX) / 2
                    } ${topY - capHeight * 1.5} ${rightTopX + 3} ${topY} L ${
                      rightRootX + rPx
                    } ${uCenterY} Q ${
                      rightRootX + rPx
                    } ${rootTopY} ${rightRootX} ${rootTopY} L ${rightRootX} ${botY} L ${leftRootX} ${botY} Z`}
                    fill="url(#weld-metal-grad)"
                    stroke="#fdba74"
                    strokeWidth="1.75"
                  />
                  <text
                    x={cx}
                    y={topY - capHeight - 10}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="11.5"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="600"
                  >
                    {t.jointNames[JointType.SINGLE_J]} · r ={' '}
                    {fmtDim(input.rootRadiusMm)} · β = {input.grooveAngleDeg}°
                  </text>
                  <text
                    x={cx}
                    y={botY + 26}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="11"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="600"
                  >
                    t = {fmtDim(input.plateThicknessMm)} · R ={' '}
                    {fmtDim(input.rootGapMm)} · f = {fmtDim(input.rootFaceMm)}
                  </text>
                </g>
              );
            })()}

          {/* 8. SQUARE GROOVE */}
          {input.jointType === JointType.SQUARE &&
            (() => {
              const sqGapPx = Math.max(8, gapRaw * 4.5);
              const leftX = cx - sqGapPx / 2;
              const rightX = cx + sqGapPx / 2;

              return (
                <g>
                  <rect
                    x="55"
                    y={topY}
                    width={leftX - 55}
                    height={plateH}
                    fill="#1e293b"
                    stroke="#94a3b8"
                    strokeWidth="1.75"
                  />
                  <rect
                    x={rightX}
                    y={topY}
                    width={465 - rightX}
                    height={plateH}
                    fill="#1e293b"
                    stroke="#94a3b8"
                    strokeWidth="1.75"
                  />
                  <path
                    d={`M ${leftX - 10} ${topY} Q ${cx} ${
                      topY - capHeight * 1.4
                    } ${rightX + 10} ${topY} L ${rightX} ${botY} Q ${cx} ${
                      botY + capHeight * 0.9
                    } ${leftX} ${botY} Z`}
                    fill="url(#weld-metal-grad)"
                    stroke="#fdba74"
                    strokeWidth="1.75"
                  />
                  <text
                    x={cx}
                    y={topY - capHeight - 10}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="11.5"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="600"
                  >
                    {t.jointNames[JointType.SQUARE]}
                  </text>
                  <text
                    x={cx}
                    y={botY + 28}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="11"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="600"
                  >
                    t = {fmtDim(input.plateThicknessMm)} · R ={' '}
                    {fmtDim(input.rootGapMm)}
                  </text>
                </g>
              );
            })()}
        </svg>

        {/* Legend Footer inside Blueprint */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-xs bg-orange-500 border border-orange-300" />
              {t.bpWeldMetal} (A = {formatNumber(result.totalAreaMm2, 1)} mm²)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-xs bg-slate-700 border border-slate-400" />
              {t.bpBaseMetal}
            </span>
          </div>
          <span>
            {t.bpReinforcement}: +{input.reinforcementPct}%
          </span>
        </div>
      </div>
    </div>
  );
};
