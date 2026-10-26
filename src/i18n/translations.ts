import {
  JointType,
  LanguageCode,
  UnitPrices,
  WeldingProcess,
} from '../types/welding';

export interface LanguageOption {
  code: LanguageCode;
  nativeName: string;
  englishName: string;
  regionTag: string;
  suggestedCurrency: string;
  suggestedPrices: UnitPrices;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    code: 'vi',
    nativeName: 'Tiếng Việt',
    englishName: 'Vietnamese',
    regionTag: 'VN',
    suggestedCurrency: 'VNĐ',
    suggestedPrices: {
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
  },
  {
    code: 'en-US',
    nativeName: 'English (US)',
    englishName: 'American English',
    regionTag: 'US',
    suggestedCurrency: 'USD',
    suggestedPrices: {
      consumablePerKg: {
        [WeldingProcess.SMAW]: 3.2,
        [WeldingProcess.GMAW]: 2.6,
        [WeldingProcess.FCAW]: 3.8,
        [WeldingProcess.GTAW]: 9.5,
        [WeldingProcess.SAW]: 3.0,
      },
      shieldingGasPerM3: 4.5,
      sawFluxPerKg: 2.2,
      laborPerHour: 32.0,
      electricityPerKwh: 0.14,
    },
  },
  {
    code: 'en-GB',
    nativeName: 'English (UK)',
    englishName: 'British English',
    regionTag: 'GB',
    suggestedCurrency: 'GBP £',
    suggestedPrices: {
      consumablePerKg: {
        [WeldingProcess.SMAW]: 2.6,
        [WeldingProcess.GMAW]: 2.1,
        [WeldingProcess.FCAW]: 3.1,
        [WeldingProcess.GTAW]: 7.8,
        [WeldingProcess.SAW]: 2.5,
      },
      shieldingGasPerM3: 3.8,
      sawFluxPerKg: 1.8,
      laborPerHour: 26.0,
      electricityPerKwh: 0.22,
    },
  },
  {
    code: 'zh',
    nativeName: '中文 (简体)',
    englishName: 'Chinese (Simplified)',
    regionTag: 'CN',
    suggestedCurrency: 'CNY ¥',
    suggestedPrices: {
      consumablePerKg: {
        [WeldingProcess.SMAW]: 12.5,
        [WeldingProcess.GMAW]: 10.8,
        [WeldingProcess.FCAW]: 16.0,
        [WeldingProcess.GTAW]: 45.0,
        [WeldingProcess.SAW]: 13.5,
      },
      shieldingGasPerM3: 18.0,
      sawFluxPerKg: 9.5,
      laborPerHour: 45.0,
      electricityPerKwh: 0.85,
    },
  },
  {
    code: 'ja',
    nativeName: '日本語',
    englishName: 'Japanese',
    regionTag: 'JP',
    suggestedCurrency: 'JPY ¥',
    suggestedPrices: {
      consumablePerKg: {
        [WeldingProcess.SMAW]: 450,
        [WeldingProcess.GMAW]: 380,
        [WeldingProcess.FCAW]: 560,
        [WeldingProcess.GTAW]: 1400,
        [WeldingProcess.SAW]: 420,
      },
      shieldingGasPerM3: 680,
      sawFluxPerKg: 340,
      laborPerHour: 3200,
      electricityPerKwh: 28,
    },
  },
  {
    code: 'ko',
    nativeName: '한국어',
    englishName: 'Korean',
    regionTag: 'KR',
    suggestedCurrency: 'KRW ₩',
    suggestedPrices: {
      consumablePerKg: {
        [WeldingProcess.SMAW]: 3400,
        [WeldingProcess.GMAW]: 2800,
        [WeldingProcess.FCAW]: 4100,
        [WeldingProcess.GTAW]: 11000,
        [WeldingProcess.SAW]: 3200,
      },
      shieldingGasPerM3: 4800,
      sawFluxPerKg: 2600,
      laborPerHour: 28000,
      electricityPerKwh: 160,
    },
  },
  {
    code: 'ru',
    nativeName: 'Русский',
    englishName: 'Russian',
    regionTag: 'RU',
    suggestedCurrency: 'RUB ₽',
    suggestedPrices: {
      consumablePerKg: {
        [WeldingProcess.SMAW]: 210,
        [WeldingProcess.GMAW]: 175,
        [WeldingProcess.FCAW]: 260,
        [WeldingProcess.GTAW]: 680,
        [WeldingProcess.SAW]: 195,
      },
      shieldingGasPerM3: 290,
      sawFluxPerKg: 150,
      laborPerHour: 850,
      electricityPerKwh: 6.5,
    },
  },
  {
    code: 'th',
    nativeName: 'ไทย',
    englishName: 'Thai',
    regionTag: 'TH',
    suggestedCurrency: 'THB ฿',
    suggestedPrices: {
      consumablePerKg: {
        [WeldingProcess.SMAW]: 68,
        [WeldingProcess.GMAW]: 56,
        [WeldingProcess.FCAW]: 85,
        [WeldingProcess.GTAW]: 230,
        [WeldingProcess.SAW]: 72,
      },
      shieldingGasPerM3: 110,
      sawFluxPerKg: 60,
      laborPerHour: 180,
      electricityPerKwh: 4.5,
    },
  },
  {
    code: 'hi',
    nativeName: 'हिन्दी',
    englishName: 'Hindi (India)',
    regionTag: 'IN',
    suggestedCurrency: 'INR ₹',
    suggestedPrices: {
      consumablePerKg: {
        [WeldingProcess.SMAW]: 155,
        [WeldingProcess.GMAW]: 130,
        [WeldingProcess.FCAW]: 195,
        [WeldingProcess.GTAW]: 520,
        [WeldingProcess.SAW]: 165,
      },
      shieldingGasPerM3: 240,
      sawFluxPerKg: 125,
      laborPerHour: 350,
      electricityPerKwh: 9.5,
    },
  },
  {
    code: 'de',
    nativeName: 'Deutsch',
    englishName: 'German',
    regionTag: 'DE',
    suggestedCurrency: 'EUR €',
    suggestedPrices: {
      consumablePerKg: {
        [WeldingProcess.SMAW]: 3.0,
        [WeldingProcess.GMAW]: 2.4,
        [WeldingProcess.FCAW]: 3.6,
        [WeldingProcess.GTAW]: 8.9,
        [WeldingProcess.SAW]: 2.8,
      },
      shieldingGasPerM3: 4.2,
      sawFluxPerKg: 2.1,
      laborPerHour: 34.0,
      electricityPerKwh: 0.26,
    },
  },
  {
    code: 'fr',
    nativeName: 'Français',
    englishName: 'French',
    regionTag: 'FR',
    suggestedCurrency: 'EUR €',
    suggestedPrices: {
      consumablePerKg: {
        [WeldingProcess.SMAW]: 2.9,
        [WeldingProcess.GMAW]: 2.35,
        [WeldingProcess.FCAW]: 3.5,
        [WeldingProcess.GTAW]: 8.8,
        [WeldingProcess.SAW]: 2.75,
      },
      shieldingGasPerM3: 4.1,
      sawFluxPerKg: 2.0,
      laborPerHour: 31.0,
      electricityPerKwh: 0.21,
    },
  },
  {
    code: 'es',
    nativeName: 'Español',
    englishName: 'Spanish',
    regionTag: 'ES',
    suggestedCurrency: 'EUR €',
    suggestedPrices: {
      consumablePerKg: {
        [WeldingProcess.SMAW]: 2.7,
        [WeldingProcess.GMAW]: 2.2,
        [WeldingProcess.FCAW]: 3.3,
        [WeldingProcess.GTAW]: 8.4,
        [WeldingProcess.SAW]: 2.6,
      },
      shieldingGasPerM3: 3.9,
      sawFluxPerKg: 1.9,
      laborPerHour: 24.0,
      electricityPerKwh: 0.19,
    },
  },
];

export interface TranslationDictionary {
  // Navigation & Header
  navTab1: string;
  navTab2: string;
  navTab3: string;
  navTab4: string;
  headerExportCta: string;
  tab1Full: string;
  tab2Full: string;
  tab3Full: string;
  tab4Full: string;
  ctxCode: string;
  ctxStandard: string;
  ctxSystem: string;
  ctxTotalCost: string;

  // Sidebar
  sbLanguageTitle: string;
  sbCurrencySuggestPrompt: string;
  sbApplyCurrencyBtn: string;
  sbSec1Title: string;
  sbResetBtn: string;
  sbProjectName: string;
  sbProjectCode: string;
  sbEngineer: string;
  sbBaseMaterial: string;
  sbDensity: string;
  sbSec2Title: string;
  sbUnitSystem: string;
  sbStandardRef: string;
  sbSec3Title: string;
  sbCurrencySymbol: string;
  sbQuickPresets: string;
  sbConsumablePrices: string;
  sbAuxLaborPowerPrices: string;
  sbShieldingGasPrice: string;
  sbSawFluxPrice: string;
  sbLaborPrice: string;
  sbPowerPrice: string;

  // Tab 1: Joint Calculator & Blueprint
  t1LibraryTitle: string;
  t1Sec1Title: string;
  t1WeldTag: string;
  t1MemberName: string;
  t1WpsCode: string;
  t1LengthPerWeld: string;
  t1Quantity: string;
  t1Reinforcement: string;
  t1Sec2Title: string;
  t1FilletRule: string;
  t1LegZ: string;
  t1ThroatA: string;
  t1FilletArrangement: string;
  t1SingleFillet: string;
  t1DoubleFillet: string;
  t1EquivalentConv: string;
  t1PlateThickness: string;
  t1GrooveAngle: string;
  t1BevelAngle: string;
  t1RootGap: string;
  t1RootFace: string;
  t1RootRadius: string;
  t1Sec3Title: string;
  t1DepEfficiency: string;
  t1DepRate: string;
  t1OpFactor: string;
  t1GasFlow: string;
  t1FluxRatio: string;
  t1NoAuxRequired: string;
  t1TotalItemLength: string;
  t1AddBomBtn: string;
  t1AddedBomMsg: string;
  t1ResultsTitle: string;
  t1CrossArea: string;
  t1Theoretical: string;
  t1WeldVolume: string;
  t1NetWeight: string;
  t1GrossWeight: string;
  t1AuxMaterial: string;
  t1ArcAndLaborTime: string;
  t1EstimatedItemCost: string;
  bpCrossSection: string;
  bpWeldMetal: string;
  bpBaseMetal: string;
  bpReinforcement: string;

  //Joint names
  jointNames: Record<JointType, string>;

  // Tab 2: Weld BOM & Excel Import Suite
  t2KpiNetWeight: string;
  t2KpiGrossWeight: string;
  t2KpiAux: string;
  t2KpiTotalCost: string;
  t2ScheduleTitle: string;
  t2ScheduleDesc: string;
  t2SearchPlaceholder: string;
  t2AllProcesses: string;
  t2ExcelGuideBtn: string;
  t2DownloadTemplateBtn: string;
  t2UploadExcelBtn: string;
  t2ResetSampleBtn: string;
  t2GuidePanelTitle: string;
  t2GuidePanelSubtitle: string;
  t2GuideColHeader: string;
  t2GuideDescHeader: string;
  t2GuideExampleHeader: string;
  t2GuideNoteCodes: string;
  t2PreviewPanelTitle: string;
  t2PreviewValidRows: string;
  t2PreviewAutoRows: string;
  t2AppendBtn: string;
  t2ReplaceBtn: string;
  t2CancelBtn: string;
  t2ColTag: string;
  t2ColMember: string;
  t2ColJointAndDim: string;
  t2ColProcess: string;
  t2ColLength: string;
  t2ColQty: string;
  t2ColArea: string;
  t2ColNet: string;
  t2ColGross: string;
  t2ColAux: string;
  t2ColLabor: string;
  t2ColCost: string;
  t2ColAction: string;
  t2ConsumablesSummaryTitle: string;
  t2ConsumablesSummarySub: string;

  // Tab 3: Cost & Labor Charts
  t3KpiTotalCost: string;
  t3KpiArcTime: string;
  t3KpiScheduleDays: string;
  t3KpiPowerEnergy: string;
  t3CostStructureTitle: string;
  t3CatConsumables: string;
  t3CatLabor: string;
  t3CatAux: string;
  t3CatPower: string;
  t3WelderCount: string;
  t3ShiftHours: string;
  t3ItemComparisonTitle: string;
  t3BenchmarkTitle: string;

  // Tab 4: Export & WPS/PQR
  t4Card1Title: string;
  t4Card1Desc: string;
  t4Card1BtnXlsx: string;
  t4Card1BtnCsv: string;
  t4Card2Title: string;
  t4Card2Desc: string;
  t4Card2BtnXlsx: string;
  t4Card2BtnCsv: string;
  t4Card3Title: string;
  t4Card3Desc: string;
  t4Card3BtnTxt: string;
  t4Card3BtnPrint: string;
  t4LivePreviewTitle: string;
  t4CopyBtn: string;
  t4CopiedMsg: string;
  t4WpsLibraryTitle: string;
  t4CreateWpsBtn: string;
  t4AssignWpsMatchingBtn: string;
  t4AssignWpsAllBtn: string;
  t4DownloadWpsBtn: string;

  // Excel 14 Template Column Names
  excelCols: {
    weldTag: string;
    member: string;
    wpsCode: string;
    jointType: string;
    process: string;
    lengthM: string;
    quantity: string;
    filletSizeMm: string;
    filletMode: string;
    doubleSide: string;
    thicknessMm: string;
    grooveAngleDeg: string;
    rootGapMm: string;
    rootFaceMm: string;
  };
}

const VI_DICT: TranslationDictionary = {
  navTab1: 'Tính toán Liên kết',
  navTab2: 'Bảng Tổng hợp BOM',
  navTab3: 'Dự toán & Biểu đồ',
  navTab4: 'Xuất Báo cáo & WPS/PQR',
  headerExportCta: 'Xuất Excel BOM (.xlsx)',
  tab1Full: 'Tab 1: Tính toán Liên kết Hàn (Joint Calculator)',
  tab2Full: 'Tab 2: Bảng Tổng hợp Mối hàn & Nhập Excel (Weld BOM)',
  tab3Full: 'Tab 3: Báo cáo Chi phí & Biểu đồ (Cost & Charts)',
  tab4Full: 'Tab 4: Xuất Báo cáo Excel/CSV & Thư viện WPS/PQR',
  ctxCode: 'Mã dự án',
  ctxStandard: 'Tiêu chuẩn',
  ctxSystem: 'Hệ đo',
  ctxTotalCost: 'Tổng dự toán',

  sbLanguageTitle: 'Ngôn ngữ Quốc tế (12 Languages)',
  sbCurrencySuggestPrompt: 'Gợi ý tiền tệ chuẩn cho ngôn ngữ này:',
  sbApplyCurrencyBtn: 'Áp dụng',
  sbSec1Title: '1. Cấu hình Dự án & Vật liệu',
  sbResetBtn: 'Mặc định',
  sbProjectName: 'Tên công trình / Dự án',
  sbProjectCode: 'Mã dự án',
  sbEngineer: 'Kỹ sư lập',
  sbBaseMaterial: 'Mác thép chủ thể (Xác định ρ)',
  sbDensity: 'Khối lượng riêng ρ (g/cm³)',
  sbSec2Title: '2. Hệ Đơn vị & Tiêu chuẩn Hàn',
  sbUnitSystem: 'Hệ đơn vị đo lường',
  sbStandardRef: 'Tiêu chuẩn ký hiệu & quy chiếu',
  sbSec3Title: '3. Tiền tệ & Đơn giá Dự toán',
  sbCurrencySymbol: 'Ký hiệu tiền tệ (Tự nhập)',
  sbQuickPresets: 'Mẫu tiền tệ:',
  sbConsumablePrices: 'Đơn giá Vật tư hàn chính',
  sbAuxLaborPowerPrices: 'Vật tư phụ, Nhân công & Điện',
  sbShieldingGasPrice: 'Khí bảo vệ (CO₂/Ar) / m³',
  sbSawFluxPrice: 'Thuốc hàn SAW / kg',
  sbLaborPrice: 'Nhân công thợ hàn / giờ',
  sbPowerPrice: 'Giá điện công nghiệp / kWh',

  t1LibraryTitle: 'Thư viện Kiểu Liên kết Hàn',
  t1Sec1Title: '1. Định danh Đường hàn & Chiều dài Thi công',
  t1WeldTag: 'Ký hiệu mối hàn',
  t1MemberName: 'Tên cấu kiện / Vị trí kết cấu',
  t1WpsCode: 'Quy trình WPS',
  t1LengthPerWeld: 'Chiều dài 1 đường hàn L',
  t1Quantity: 'Số lượng cấu kiện / đường hàn',
  t1Reinforcement: 'Hệ số độ phồng dư',
  t1Sec2Title: '2. Thông số Kích thước Mặt cắt Hình học',
  t1FilletRule: 'Quy ước kích thước mối hàn góc',
  t1LegZ: 'Cạnh chân hàn z',
  t1ThroatA: 'Chiều dày họng a',
  t1FilletArrangement: 'Bố trí đường hàn góc',
  t1SingleFillet: 'Hàn 1 phía (Single)',
  t1DoubleFillet: 'Hàn 2 phía (Double)',
  t1EquivalentConv: 'Quy đổi tương đương (z = a × √2):',
  t1PlateThickness: 'Chiều dày tấm t',
  t1GrooveAngle: 'Góc vát tổng α (°)',
  t1BevelAngle: 'Góc vát mép β (°)',
  t1RootGap: 'Khe hở đáy R',
  t1RootFace: 'Mặt rễ / Cạnh đáy f',
  t1RootRadius: 'Bán kính đáy rãnh r',
  t1Sec3Title: '3. Phương pháp Hàn & Định mức Công nghệ',
  t1DepEfficiency: 'Hiệu suất đắp η (%)',
  t1DepRate: 'Tốc độ đắp (kg/h)',
  t1OpFactor: 'Hệ số làm việc (%)',
  t1GasFlow: 'Lưu lượng khí (L/phút)',
  t1FluxRatio: 'Tỷ lệ Thuốc / Dây SAW',
  t1NoAuxRequired: 'Không dùng Khí / Thuốc rời',
  t1TotalItemLength: 'Tổng chiều dài hạng mục:',
  t1AddBomBtn: 'Thêm Đường hàn vào Bảng Tổng hợp (BOM)',
  t1AddedBomMsg: 'Đã thêm vào Bảng Tổng hợp BOM!',
  t1ResultsTitle: 'Kết quả Định mức & Dự toán Đường hàn',
  t1CrossArea: 'Tiết diện ngang (A_total)',
  t1Theoretical: 'Lý thuyết',
  t1WeldVolume: 'Thể tích kim loại đắp (V)',
  t1NetWeight: 'KL Kim loại đắp thuần (W_net)',
  t1GrossWeight: 'KL Vật tư tiêu hao (W_gross)',
  t1AuxMaterial: 'Vật tư phụ đi kèm',
  t1ArcAndLaborTime: 'Giờ hồ quang / Tổng giờ công',
  t1EstimatedItemCost: 'Chi phí dự toán sơ bộ hạng mục:',
  bpCrossSection: 'MẶT CẮT KỸ THUẬT CAD 2D',
  bpWeldMetal: 'Kim loại đắp',
  bpBaseMetal: 'Thép cơ bản',
  bpReinforcement: 'Độ phồng dư',

  jointNames: {
    [JointType.FILLET]: 'Mối hàn góc (Fillet)',
    [JointType.SINGLE_V]: 'Giáp mối chữ V đơn',
    [JointType.DOUBLE_V]: 'Giáp mối chữ V kép (X)',
    [JointType.SINGLE_BEVEL]: 'Mối hàn vát đơn (Bevel)',
    [JointType.DOUBLE_BEVEL]: 'Mối hàn vát kép (K)',
    [JointType.SINGLE_U]: 'Giáp mối rãnh chữ U',
    [JointType.SINGLE_J]: 'Mối hàn rãnh chữ J',
    [JointType.SQUARE]: 'Giáp mối thẳng (Square)',
  },

  t2KpiNetWeight: 'Tổng KL Kim loại đắp (W_net)',
  t2KpiGrossWeight: 'Tổng Vật tư Que / Dây hàn (W_gross)',
  t2KpiAux: 'Vật tư phụ (Khí bảo vệ & Thuốc SAW)',
  t2KpiTotalCost: 'Tổng Chi phí Dự toán Toàn Dự án',
  t2ScheduleTitle: 'Danh mục Đường hàn Dự án & Nhập File Excel (.xlsx)',
  t2ScheduleDesc: 'Chỉnh sửa trực tiếp trên bảng hoặc tải lên file Excel (.xlsx, .xls, .csv) theo mẫu form hướng dẫn.',
  t2SearchPlaceholder: 'Tìm mã W-01, cấu kiện...',
  t2AllProcesses: 'Tất cả phương pháp',
  t2ExcelGuideBtn: 'Mẫu Form & Hướng dẫn Excel',
  t2DownloadTemplateBtn: 'Tải File Excel Mẫu (.xlsx)',
  t2UploadExcelBtn: 'Thêm File Excel (.xlsx / .csv)',
  t2ResetSampleBtn: 'Nạp mẫu chuẩn',
  t2GuidePanelTitle: 'Hướng dẫn Cấu trúc Form Nhập File Excel (.xlsx / .csv)',
  t2GuidePanelSubtitle: 'File Excel chỉ cần 1 Sheet dữ liệu chứa các cột dưới đây. Các cột thông số phụ nếu để trống sẽ tự động lấy giá trị tiêu chuẩn ngành.',
  t2GuideColHeader: 'Tên cột trong File Excel',
  t2GuideDescHeader: 'Ý nghĩa & Quy ước nhập liệu',
  t2GuideExampleHeader: 'Giá trị mẫu hợp lệ',
  t2GuideNoteCodes: 'Mã kiểu liên kết (Joint_Type): fillet, single_v, double_v, single_bevel, double_bevel, single_u, single_j, square · Phương pháp (Process): SMAW, GMAW, FCAW, GTAW, SAW',
  t2PreviewPanelTitle: 'Xem trước & Kiểm tra Hợp lệ Dữ liệu từ File Excel',
  t2PreviewValidRows: 'dòng hợp lệ sẵn sàng nhập',
  t2PreviewAutoRows: 'dòng tự động điền thông số phụ mặc định',
  t2AppendBtn: 'Gộp thêm vào Danh sách hiện tại',
  t2ReplaceBtn: 'Thay thế Danh sách hiện tại',
  t2CancelBtn: 'Hủy bỏ',
  t2ColTag: 'Mã hiệu',
  t2ColMember: 'Cấu kiện / Vị trí kết cấu',
  t2ColJointAndDim: 'Kiểu mối hàn & Kích thước',
  t2ColProcess: 'P.Pháp',
  t2ColLength: 'Dài 1 ĐH (m)',
  t2ColQty: 'SL',
  t2ColArea: 'Tiết diện (mm²)',
  t2ColNet: 'W_net (kg)',
  t2ColGross: 'W_gross (kg)',
  t2ColAux: 'Khí/Thuốc',
  t2ColLabor: 'Giờ công',
  t2ColCost: 'Thành tiền',
  t2ColAction: 'Thao tác',
  t2ConsumablesSummaryTitle: 'Bảng Tổng hợp Định mức Vật tư Hàn theo Phương pháp (Consumables BOM)',
  t2ConsumablesSummarySub: 'Dùng để lập phiếu yêu cầu mua vật tư (Material Requisition)',

  t3KpiTotalCost: 'Tổng Dự toán Chi phí Hàn',
  t3KpiArcTime: 'Thời gian Phơi Hồ quang (Arc-on)',
  t3KpiScheduleDays: 'Tiến độ Thi công Dự kiến',
  t3KpiPowerEnergy: 'Tổng Điện năng Máy hàn',
  t3CostStructureTitle: 'Cơ cấu Tỷ trọng Chi phí Hàn',
  t3CatConsumables: 'Que / Dây hàn tiêu hao',
  t3CatLabor: 'Nhân công thợ hàn',
  t3CatAux: 'Vật tư phụ (Khí bảo vệ & Thuốc SAW)',
  t3CatPower: 'Điện năng máy hàn tiêu thụ',
  t3WelderCount: 'Số lượng thợ hàn bố trí (Người)',
  t3ShiftHours: 'Số giờ làm việc / ca / ngày (Giờ)',
  t3ItemComparisonTitle: 'Biểu đồ So sánh Chi phí & Giờ công theo Hạng mục Đường hàn',
  t3BenchmarkTitle: 'Bảng Tham chiếu Kinh tế – Kỹ thuật giữa 5 Phương pháp Hàn',

  t4Card1Title: 'Xuất Bảng Chi tiết Welding BOM',
  t4Card1Desc: 'Xuất toàn bộ danh mục đường hàn với đầy đủ thông số hình học, khối lượng W_net, W_gross và chi phí.',
  t4Card1BtnXlsx: 'Tải Excel (.xlsx)',
  t4Card1BtnCsv: 'Tải CSV (UTF-8)',
  t4Card2Title: 'Xuất Tổng hợp Vật tư theo Phương pháp',
  t4Card2Desc: 'Tổng hợp khối lượng que/dây hàn, khí bảo vệ (m³), thuốc hàn SAW (kg) và giờ công theo từng nhóm công nghệ.',
  t4Card2BtnXlsx: 'Tải Tổng hợp (.xlsx)',
  t4Card2BtnCsv: 'Tải Tổng hợp (.csv)',
  t4Card3Title: 'Xuất Tóm tắt Hồ sơ Thầu (.TXT / PDF)',
  t4Card3Desc: 'Tải bản thuyết minh tóm tắt dự toán chi phí hàn đính kèm hồ sơ dự thầu hoặc in trực tiếp ra PDF.',
  t4Card3BtnTxt: 'Tải Hồ sơ (.TXT)',
  t4Card3BtnPrint: 'In Báo cáo PDF',
  t4LivePreviewTitle: 'Bản Xem trước Trực tiếp: Báo cáo Tóm tắt Dự toán Hồ sơ Thầu',
  t4CopyBtn: 'Sao chép Nội dung',
  t4CopiedMsg: 'Đã sao chép',
  t4WpsLibraryTitle: 'Thư viện Tra cứu & Gán Quy trình Hàn Mẫu (WPS / PQR Library)',
  t4CreateWpsBtn: 'Tạo mới Quy trình WPS',
  t4AssignWpsMatchingBtn: 'Gán mã WPS cho đường hàn cùng P.Pháp',
  t4AssignWpsAllBtn: 'Gán cho tất cả BOM',
  t4DownloadWpsBtn: 'Tải Phiếu WPS (.TXT)',

  excelCols: {
    weldTag: 'Ma_Duong_Han',
    member: 'Ten_Cau_Kien_Vi_Tri',
    wpsCode: 'Ma_WPS',
    jointType: 'Kieu_Lien_Ket',
    process: 'Phuong_Phap_Han',
    lengthM: 'Chieu_Dai_1_DH_m',
    quantity: 'So_Luong',
    filletSizeMm: 'Kich_Thuoc_Goc_z_a_mm',
    filletMode: 'Quy_Uoc_Goc_LEG_Z_THROAT_A',
    doubleSide: 'Han_2_Phia_TRUE_FALSE',
    thicknessMm: 'Chieu_Day_Tam_t_mm',
    grooveAngleDeg: 'Goc_Vat_Deg',
    rootGapMm: 'Khe_Ho_Day_R_mm',
    rootFaceMm: 'Mat_Re_f_mm',
  },
};

const EN_US_DICT: TranslationDictionary = {
  navTab1: 'Joint Calculator',
  navTab2: 'Weld BOM Schedule',
  navTab3: 'Cost & Labor Analytics',
  navTab4: 'Export & WPS/PQR',
  headerExportCta: 'Export BOM (.xlsx)',
  tab1Full: 'Tab 1: Joint Geometry & Volume Calculator (AWS A2.4 / ISO 2553)',
  tab2Full: 'Tab 2: Project Weld Schedule, BOM & Excel Import',
  tab3Full: 'Tab 3: Cost, Labor & Productivity Analytics',
  tab4Full: 'Tab 4: Export Excel/CSV Reports & WPS/PQR Library',
  ctxCode: 'Project ID',
  ctxStandard: 'Standard',
  ctxSystem: 'Units',
  ctxTotalCost: 'Total Estimate',

  sbLanguageTitle: 'Global Language (12 Languages)',
  sbCurrencySuggestPrompt: 'Suggested local currency for this language:',
  sbApplyCurrencyBtn: 'Apply',
  sbSec1Title: '1. Project & Base Metal Settings',
  sbResetBtn: 'Reset',
  sbProjectName: 'Project / Structure Name',
  sbProjectCode: 'Project Code',
  sbEngineer: 'Estimator / Engineer',
  sbBaseMaterial: 'Base Metal Grade (Density ρ)',
  sbDensity: 'Material Density ρ (g/cm³)',
  sbSec2Title: '2. Measurement Units & Standard',
  sbUnitSystem: 'Unit System',
  sbStandardRef: 'Welding Symbol Standard',
  sbSec3Title: '3. Currency & Unit Price Rates',
  sbCurrencySymbol: 'Currency Symbol (Custom)',
  sbQuickPresets: 'Quick presets:',
  sbConsumablePrices: 'Filler Metal Unit Prices',
  sbAuxLaborPowerPrices: 'Gas, Flux, Labor & Electric Power',
  sbShieldingGasPrice: 'Shielding Gas (CO₂/Ar) / m³',
  sbSawFluxPrice: 'SAW Granular Flux / kg',
  sbLaborPrice: 'Welder Labor Rate / hour',
  sbPowerPrice: 'Industrial Electricity / kWh',

  t1LibraryTitle: 'Standard Weld Joint Geometry Library',
  t1Sec1Title: '1. Weld Identification & Fabrication Length',
  t1WeldTag: 'Weld Tag / ID',
  t1MemberName: 'Structural Member / Location',
  t1WpsCode: 'WPS Reference',
  t1LengthPerWeld: 'Single Weld Length L',
  t1Quantity: 'Quantity of Identical Welds',
  t1Reinforcement: 'Reinforcement Factor',
  t1Sec2Title: '2. Cross-Section Geometric Dimensions',
  t1FilletRule: 'Fillet Dimensioning Method',
  t1LegZ: 'Leg Size z',
  t1ThroatA: 'Throat Thickness a',
  t1FilletArrangement: 'Fillet Joint Arrangement',
  t1SingleFillet: 'Single-Sided',
  t1DoubleFillet: 'Double-Sided',
  t1EquivalentConv: 'Equivalent Conversion (z = a × √2):',
  t1PlateThickness: 'Plate Thickness t',
  t1GrooveAngle: 'Included Groove Angle α (°)',
  t1BevelAngle: 'Bevel Angle β (°)',
  t1RootGap: 'Root Opening R',
  t1RootFace: 'Root Face f',
  t1RootRadius: 'Root Radius r',
  t1Sec3Title: '3. Welding Process & Deposition Parameters',
  t1DepEfficiency: 'Deposition Efficiency η (%)',
  t1DepRate: 'Deposition Rate (kg/h)',
  t1OpFactor: 'Operating Factor (%)',
  t1GasFlow: 'Gas Flow Rate (L/min)',
  t1FluxRatio: 'SAW Flux-to-Wire Ratio',
  t1NoAuxRequired: 'No External Gas / Flux',
  t1TotalItemLength: 'Total Item Weld Length:',
  t1AddBomBtn: 'Add Weld Seam to Project BOM',
  t1AddedBomMsg: 'Added to Project Weld BOM!',
  t1ResultsTitle: 'Weld Metal Volume, Weight & Cost Output',
  t1CrossArea: 'Total Cross-Section (A_total)',
  t1Theoretical: 'Theoretical',
  t1WeldVolume: 'Weld Metal Volume (V)',
  t1NetWeight: 'Net Deposited Metal (W_net)',
  t1GrossWeight: 'Gross Consumables (W_gross)',
  t1AuxMaterial: 'Auxiliary Gas / Flux',
  t1ArcAndLaborTime: 'Arc-On Time / Total Labor',
  t1EstimatedItemCost: 'Estimated Item Fabrication Cost:',
  bpCrossSection: 'CAD 2D CROSS-SECTION',
  bpWeldMetal: 'Deposited Weld Metal',
  bpBaseMetal: 'Base Metal',
  bpReinforcement: 'Reinforcement',

  jointNames: {
    [JointType.FILLET]: 'Fillet Weld (T / Lap)',
    [JointType.SINGLE_V]: 'Single-V Groove',
    [JointType.DOUBLE_V]: 'Double-V (X) Groove',
    [JointType.SINGLE_BEVEL]: 'Single-Bevel Groove',
    [JointType.DOUBLE_BEVEL]: 'Double-Bevel (K) Groove',
    [JointType.SINGLE_U]: 'Single-U Groove',
    [JointType.SINGLE_J]: 'Single-J Groove',
    [JointType.SQUARE]: 'Square Groove Butt',
  },

  t2KpiNetWeight: 'Total Net Deposited Metal (W_net)',
  t2KpiGrossWeight: 'Total Electrodes / Wire (W_gross)',
  t2KpiAux: 'Shielding Gas & SAW Flux',
  t2KpiTotalCost: 'Total Project Welding Cost',
  t2ScheduleTitle: 'Project Weld Schedule & Excel (.xlsx) Import',
  t2ScheduleDesc: 'Edit lengths/quantities inline or import an Excel workbook (.xlsx, .xls, .csv) using the guided template.',
  t2SearchPlaceholder: 'Search tag W-01, member...',
  t2AllProcesses: 'All Processes',
  t2ExcelGuideBtn: 'Excel Template & Form Guide',
  t2DownloadTemplateBtn: 'Download Sample Excel (.xlsx)',
  t2UploadExcelBtn: 'Import Excel File (.xlsx / .csv)',
  t2ResetSampleBtn: 'Load Sample Data',
  t2GuidePanelTitle: 'Excel Import Form Structure & Column Guide (.xlsx / .csv)',
  t2GuidePanelSubtitle: 'Your Excel file only needs 1 worksheet with the columns below. Optional geometry cells left blank will automatically use standard industry defaults.',
  t2GuideColHeader: 'Excel Column Header',
  t2GuideDescHeader: 'Engineering Description & Allowed Values',
  t2GuideExampleHeader: 'Valid Example',
  t2GuideNoteCodes: 'Allowed Joint_Type codes: fillet, single_v, double_v, single_bevel, double_bevel, single_u, single_j, square · Process codes: SMAW, GMAW, FCAW, GTAW, SAW',
  t2PreviewPanelTitle: 'Excel Import Preview & Validation Check',
  t2PreviewValidRows: 'valid rows ready to import',
  t2PreviewAutoRows: 'rows with auto-filled optional defaults',
  t2AppendBtn: 'Append to Current BOM',
  t2ReplaceBtn: 'Replace Current BOM',
  t2CancelBtn: 'Cancel',
  t2ColTag: 'Weld ID',
  t2ColMember: 'Structural Member / Location',
  t2ColJointAndDim: 'Joint Type & Dimensions',
  t2ColProcess: 'Process',
  t2ColLength: 'Length (m)',
  t2ColQty: 'Qty',
  t2ColArea: 'Area (mm²)',
  t2ColNet: 'W_net (kg)',
  t2ColGross: 'W_gross (kg)',
  t2ColAux: 'Gas/Flux',
  t2ColLabor: 'Labor (h)',
  t2ColCost: 'Total Cost',
  t2ColAction: 'Actions',
  t2ConsumablesSummaryTitle: 'Consumables Bill of Materials (BOM) by Welding Process',
  t2ConsumablesSummarySub: 'Ready for Material Requisition & Procurement',

  t3KpiTotalCost: 'Total Estimated Welding Cost',
  t3KpiArcTime: 'Total Arc-On Time',
  t3KpiScheduleDays: 'Estimated Fabrication Duration',
  t3KpiPowerEnergy: 'Total Welding Machine Energy',
  t3CostStructureTitle: 'Welding Cost Breakdown Structure',
  t3CatConsumables: 'Filler Metal (Electrodes / Wire)',
  t3CatLabor: 'Welder Direct Labor',
  t3CatAux: 'Auxiliary (Shielding Gas & SAW Flux)',
  t3CatPower: 'Electrical Power Consumption',
  t3WelderCount: 'Assigned Welders (Crew Size)',
  t3ShiftHours: 'Working Hours / Shift / Day',
  t3ItemComparisonTitle: 'Cost & Labor Hours Comparison by Weld Item',
  t3BenchmarkTitle: 'Techno-Economic Benchmark Across 5 Welding Processes',

  t4Card1Title: 'Export Detailed Welding BOM',
  t4Card1Desc: 'Export all weld schedule items with full geometry, net weight W_net, gross consumables W_gross, and cost breakdown.',
  t4Card1BtnXlsx: 'Download Excel (.xlsx)',
  t4Card1BtnCsv: 'Download CSV (UTF-8)',
  t4Card2Title: 'Export Consumables Summary by Process',
  t4Card2Desc: 'Aggregated electrode/wire weight, shielding gas (m³), SAW flux (kg), and man-hours grouped by process.',
  t4Card2BtnXlsx: 'Summary (.xlsx)',
  t4Card2BtnCsv: 'Summary (.csv)',
  t4Card3Title: 'Export Bid Summary Report (.TXT / PDF)',
  t4Card3Desc: 'Download the executive bid estimation summary for tender attachments or print directly to PDF.',
  t4Card3BtnTxt: 'Download (.TXT)',
  t4Card3BtnPrint: 'Print PDF Report',
  t4LivePreviewTitle: 'Live Preview: Executive Welding Bid Estimation Report',
  t4CopyBtn: 'Copy Report Text',
  t4CopiedMsg: 'Copied',
  t4WpsLibraryTitle: 'Standard Welding Procedure Specification (WPS / PQR) Library',
  t4CreateWpsBtn: 'Create Custom WPS',
  t4AssignWpsMatchingBtn: 'Assign WPS to Matching Process Items',
  t4AssignWpsAllBtn: 'Assign to All BOM',
  t4DownloadWpsBtn: 'Download WPS (.TXT)',

  excelCols: {
    weldTag: 'Weld_Tag',
    member: 'Structural_Member',
    wpsCode: 'WPS_Code',
    jointType: 'Joint_Type',
    process: 'Process',
    lengthM: 'Length_m',
    quantity: 'Quantity',
    filletSizeMm: 'Fillet_Size_mm',
    filletMode: 'Fillet_Mode',
    doubleSide: 'Double_Side',
    thicknessMm: 'Thickness_t_mm',
    grooveAngleDeg: 'Groove_Angle_deg',
    rootGapMm: 'Root_Gap_R_mm',
    rootFaceMm: 'Root_Face_f_mm',
  },
};

const EN_GB_DICT: TranslationDictionary = {
  ...EN_US_DICT,
  sbEngineer: 'Quantity Surveyor / Welding Engineer',
  sbLaborPrice: 'Welder Labour Rate / hour',
  t1ArcAndLaborTime: 'Arc-On Time / Total Labour',
  t2ColLabor: 'Labour (h)',
  t3CatLabor: 'Welder Direct Labour',
  t3ItemComparisonTitle: 'Cost & Labour Hours Comparison by Weld Item',
};

const ZH_DICT: TranslationDictionary = {
  ...EN_US_DICT,
  navTab1: '焊缝几何计算',
  navTab2: '焊材定额汇总表 (BOM)',
  navTab3: '成本与工时估算',
  navTab4: '导出报表与 WPS 库',
  headerExportCta: '导出 Excel BOM (.xlsx)',
  tab1Full: '选项 1：焊接接头几何与熔敷体积计算器',
  tab2Full: '选项 2：项目焊缝清单、焊材汇总 (BOM) 与 Excel 导入',
  tab3Full: '选项 3：焊接成本结构与施工工时图表分析',
  tab4Full: '选项 4：导出 Excel/CSV 报表、投标摘要与 WPS 工艺库',
  ctxCode: '项目编号',
  ctxStandard: '参考标准',
  ctxSystem: '单位制',
  ctxTotalCost: '预估总造价',

  sbLanguageTitle: '全球语言切换 (12种语言)',
  sbCurrencySuggestPrompt: '当前语言推荐货币单位：',
  sbApplyCurrencyBtn: '应用',
  sbSec1Title: '1. 项目信息与母材参数',
  sbResetBtn: '重置默认',
  sbProjectName: '工程项目名称',
  sbProjectCode: '项目代码',
  sbEngineer: '编制工程师',
  sbBaseMaterial: '母材钢号 (决定密度 ρ)',
  sbDensity: '金属密度 ρ (g/cm³)',
  sbSec2Title: '2. 计量单位与标准规范',
  sbUnitSystem: '测量单位系统',
  sbStandardRef: '焊接符号与标注标准',
  sbSec3Title: '3. 货币符号与单价配置',
  sbCurrencySymbol: '货币符号 (可自定义)',
  sbQuickPresets: '快捷货币：',
  sbConsumablePrices: '主焊材单价 (焊条/焊丝)',
  sbAuxLaborPowerPrices: '辅材、人工与工业电价',
  sbShieldingGasPrice: '保护气体 (CO₂/Ar) / m³',
  sbSawFluxPrice: '埋弧焊焊剂 SAW / kg',
  sbLaborPrice: '焊工人工单价 / 小时',
  sbPowerPrice: '工业电价 / kWh',

  t1LibraryTitle: '标准焊接接头几何图库',
  t1Sec1Title: '1. 焊缝编号与施工长度',
  t1WeldTag: '焊缝编号',
  t1MemberName: '构件名称 / 结构部位',
  t1WpsCode: '焊接工艺规程 WPS',
  t1LengthPerWeld: '单条焊缝长度 L',
  t1Quantity: '相同构件/焊缝数量',
  t1Reinforcement: '焊缝余高系数',
  t1Sec2Title: '2. 坡口与截面几何尺寸',
  t1FilletRule: '角焊缝尺寸标注方式',
  t1LegZ: '焊脚尺寸 z',
  t1ThroatA: '有效喉厚 a',
  t1FilletArrangement: '角焊缝布置形式',
  t1SingleFillet: '单侧角焊',
  t1DoubleFillet: '双侧对称角焊',
  t1EquivalentConv: '等效换算 (z = a × √2)：',
  t1PlateThickness: '板厚 t',
  t1GrooveAngle: '坡口总角度 α (°)',
  t1BevelAngle: '单边坡口角 β (°)',
  t1RootGap: '根部间隙 R',
  t1RootFace: '钝边高度 f',
  t1RootRadius: '根部圆弧半径 r',
  t1Sec3Title: '3. 焊接方法与熔敷效率参数',
  t1DepEfficiency: '熔敷效率 η (%)',
  t1DepRate: '熔敷速度 (kg/h)',
  t1OpFactor: '焊工暂载率/作业率 (%)',
  t1GasFlow: '保护气流量 (L/min)',
  t1FluxRatio: '埋弧焊剂/焊丝消耗比',
  t1NoAuxRequired: '无需外加保护气/焊剂',
  t1TotalItemLength: '分项焊缝总长度：',
  t1AddBomBtn: '添加焊缝至项目总表 (BOM)',
  t1AddedBomMsg: '已成功添加至焊材总表！',
  t1ResultsTitle: '单条焊缝熔敷重量与定额计算结果',
  t1CrossArea: '总截面积 (A_total)',
  t1Theoretical: '理论面积',
  t1WeldVolume: '熔敷金属体积 (V)',
  t1NetWeight: '纯熔敷金属重量 (W_net)',
  t1GrossWeight: '焊材消耗定额 (W_gross)',
  t1AuxMaterial: '配套辅材消耗',
  t1ArcAndLaborTime: '纯燃弧时间 / 总人工时',
  t1EstimatedItemCost: '分项焊缝预估造价：',
  bpCrossSection: 'CAD 2D 焊缝截面示意图',
  bpWeldMetal: '熔敷焊缝金属',
  bpBaseMetal: '母材钢板',
  bpReinforcement: '余高补偿',

  jointNames: {
    [JointType.FILLET]: '角焊缝 (T型/搭接)',
    [JointType.SINGLE_V]: '单V型坡口对接焊',
    [JointType.DOUBLE_V]: '双V型(X型)坡口焊',
    [JointType.SINGLE_BEVEL]: '单边V型坡口焊',
    [JointType.DOUBLE_BEVEL]: '双单边V型(K型)焊',
    [JointType.SINGLE_U]: 'U型坡口对接焊',
    [JointType.SINGLE_J]: 'J型坡口焊',
    [JointType.SQUARE]: 'I型(不开坡口)对接焊',
  },

  t2KpiNetWeight: '纯熔敷金属总重 (W_net)',
  t2KpiGrossWeight: '焊条/焊丝总消耗量 (W_gross)',
  t2KpiAux: '保护气体与埋弧焊剂总量',
  t2KpiTotalCost: '全项目焊接预估总造价',
  t2ScheduleTitle: '项目焊缝明细表与 Excel (.xlsx) 批量导入',
  t2ScheduleDesc: '可直接在表格中修改长度与数量，或按照指南模板上传 Excel 文件 (.xlsx, .xls, .csv)。',
  t2SearchPlaceholder: '搜索编号 W-01、构件...',
  t2AllProcesses: '全部焊接方法',
  t2ExcelGuideBtn: 'Excel 模板与填写指南',
  t2DownloadTemplateBtn: '下载 Excel 标准模板 (.xlsx)',
  t2UploadExcelBtn: '导入 Excel 文件 (.xlsx / .csv)',
  t2ResetSampleBtn: '恢复示例数据',
  t2GuidePanelTitle: 'Excel 批量导入表格结构与字段说明 (.xlsx / .csv)',
  t2GuidePanelSubtitle: 'Excel 文件仅需包含 1 个工作表 (Sheet)。选填几何参数若留空，系统将自动按行业标准默认值补齐。',
  t2GuideColHeader: 'Excel 列标题',
  t2GuideDescHeader: '工程含义与填写规范',
  t2GuideExampleHeader: '标准示例',
  t2GuideNoteCodes: '接头代码 (Joint_Type): fillet, single_v, double_v, single_bevel, double_bevel, single_u, single_j, square · 方法 (Process): SMAW, GMAW, FCAW, GTAW, SAW',
  t2PreviewPanelTitle: 'Excel 导入数据预览与合规性校验',
  t2PreviewValidRows: '行数据校验通过',
  t2PreviewAutoRows: '行已自动补齐默认几何参数',
  t2AppendBtn: '追加合并至当前列表',
  t2ReplaceBtn: '替换当前全部列表',
  t2CancelBtn: '取消',
  t2ColTag: '焊缝编号',
  t2ColMember: '结构构件 / 部位',
  t2ColJointAndDim: '接头形式与尺寸',
  t2ColProcess: '焊接方法',
  t2ColLength: '单长 (m)',
  t2ColQty: '数量',
  t2ColArea: '截面积 (mm²)',
  t2ColNet: '净重 W_net (kg)',
  t2ColGross: '毛重 W_gross (kg)',
  t2ColAux: '气体/焊剂',
  t2ColLabor: '工时 (h)',
  t2ColCost: '合价',
  t2ColAction: '操作',
  t2ConsumablesSummaryTitle: '按焊接方法分类的焊材采购定额汇总表 (Consumables BOM)',
  t2ConsumablesSummarySub: '可直接用于编制焊材采购申请单',

  t3KpiTotalCost: '焊接工程预算总造价',
  t3KpiArcTime: '总燃弧时间 (Arc-on)',
  t3KpiScheduleDays: '预计施工工期 (天)',
  t3KpiPowerEnergy: '焊机总耗电量',
  t3CostStructureTitle: '焊接成本构成比例分析',
  t3CatConsumables: '主焊材费用 (焊条/焊丝)',
  t3CatLabor: '焊工直接人工费',
  t3CatAux: '辅材费用 (保护气与焊剂)',
  t3CatPower: '电能消耗费用',
  t3WelderCount: '投入焊工人数 (人)',
  t3ShiftHours: '每日每班工作时长 (小时)',
  t3ItemComparisonTitle: '各分项焊缝成本与工时对比图',
  t3BenchmarkTitle: '五种主流焊接方法技术经济定额对比表',

  t4Card1Title: '导出焊缝明细表 (Detailed BOM)',
  t4Card1Desc: '导出完整焊缝计算明细（含几何尺寸、净重 W_net、消耗量 W_gross、工时与造价）。',
  t4Card1BtnXlsx: '下载 Excel (.xlsx)',
  t4Card1BtnCsv: '下载 CSV (UTF-8)',
  t4Card2Title: '导出按焊接方法分类的焊材汇总表',
  t4Card2Desc: '汇总各类焊条、焊丝、保护气 (m³)、埋弧焊剂 (kg) 与人工时，便于材料采购。',
  t4Card2BtnXlsx: '下载汇总 (.xlsx)',
  t4Card2BtnCsv: '下载汇总 (.csv)',
  t4Card3Title: '导出投标预算摘要报告 (.TXT / PDF)',
  t4Card3Desc: '下载用于投标文件附件的焊接工程量与造价摘要，或直接打印为 PDF 报告。',
  t4Card3BtnTxt: '下载报告 (.TXT)',
  t4Card3BtnPrint: '打印 PDF 报告',
  t4LivePreviewTitle: '实时预览：焊接工程投标预算与定额汇总报告',
  t4CopyBtn: '复制报告文本',
  t4CopiedMsg: '已复制',
  t4WpsLibraryTitle: '标准焊接工艺规程 (WPS / PQR) 查询与分配库',
  t4CreateWpsBtn: '新建自定义 WPS',
  t4AssignWpsMatchingBtn: '将此 WPS 分配给同方法焊缝',
  t4AssignWpsAllBtn: '分配给全部焊缝',
  t4DownloadWpsBtn: '下载 WPS 卡片 (.TXT)',

  excelCols: {
    weldTag: '焊缝编号_Weld_Tag',
    member: '构件部位_Member',
    wpsCode: '工艺编号_WPS_Code',
    jointType: '接头形式_Joint_Type',
    process: '焊接方法_Process',
    lengthM: '单条长度_Length_m',
    quantity: '数量_Quantity',
    filletSizeMm: '角焊尺寸_Fillet_mm',
    filletMode: '角焊模式_Fillet_Mode',
    doubleSide: '双侧焊接_Double_Side',
    thicknessMm: '板厚_Thickness_t_mm',
    grooveAngleDeg: '坡口角度_Angle_deg',
    rootGapMm: '根部间隙_Root_Gap_mm',
    rootFaceMm: '钝边_Root_Face_mm',
  },
};

const JA_DICT: TranslationDictionary = {
  ...EN_US_DICT,
  navTab1: '継手形状・体積計算',
  navTab2: '溶接集計表 (BOM)',
  navTab3: 'コスト・工数試算',
  navTab4: '帳票出力・WPS検索',
  headerExportCta: 'Excel BOM 出力 (.xlsx)',
  tab1Full: 'タブ 1：溶接継手形状・溶着金属体積計算 (JIS Z 3021 / ISO 2553)',
  tab2Full: 'タブ 2：プロジェクト溶接一覧表 (BOM) & Excel一括取込',
  tab3Full: 'タブ 3：溶接コスト内訳・所要工数グラフ分析',
  tab4Full: 'タブ 4：Excel/CSV帳票出力・見積要約・WPSライブラリ',
  ctxCode: '工事番号',
  ctxStandard: '適用規格',
  ctxSystem: '単位系',
  ctxTotalCost: '概算総費用',

  sbLanguageTitle: '表示言語 (12ヶ国語対応)',
  sbCurrencySuggestPrompt: 'この言語の推奨通貨単位：',
  sbApplyCurrencyBtn: '適用する',
  sbSec1Title: '1. 工事情報・母材設定',
  sbResetBtn: '初期化',
  sbProjectName: '工事名 / プロジェクト名',
  sbProjectCode: 'プロジェクト番号',
  sbEngineer: '担当技術者 / 積算者',
  sbBaseMaterial: '母材材質 (密度 ρ の設定)',
  sbDensity: '金属密度 ρ (g/cm³)',
  sbSec2Title: '2. 単位系・溶接記号規格',
  sbUnitSystem: '計測単位系',
  sbStandardRef: '参照規格 (JIS / ISO / AWS)',
  sbSec3Title: '3. 通貨・単価設定',
  sbCurrencySymbol: '通貨記号 (自由入力)',
  sbQuickPresets: '通貨プリセット：',
  sbConsumablePrices: '溶接材料単価 (棒/ワイヤ)',
  sbAuxLaborPowerPrices: 'ガス・フラックス・労務費・電力単価',
  sbShieldingGasPrice: 'シールドガス (CO₂/Ar) / m³',
  sbSawFluxPrice: 'SAW フラックス / kg',
  sbLaborPrice: '溶接工労務単価 / 時間',
  sbPowerPrice: '業務用電力単価 / kWh',

  t1LibraryTitle: '標準溶接継手ジオメトリライブラリ',
  t1Sec1Title: '1. 溶接番号・施工延長',
  t1WeldTag: '溶接番号 (Tag)',
  t1MemberName: '対象部材・部位名称',
  t1WpsCode: '適用 WPS 番号',
  t1LengthPerWeld: '1箇所あたり溶接長 L',
  t1Quantity: '同一部位・部材数',
  t1Reinforcement: '余盛係数 (Reinforcement)',
  t1Sec2Title: '2. 開先・断面形状寸法',
  t1FilletRule: 'すみ肉溶接の寸法指定方法',
  t1LegZ: '脚長 z',
  t1ThroatA: 'のど厚 a',
  t1FilletArrangement: 'すみ肉溶接の配置',
  t1SingleFillet: '片側すみ肉',
  t1DoubleFillet: '両側すみ肉',
  t1EquivalentConv: '換算値 (z = a × √2)：',
  t1PlateThickness: '板厚 t',
  t1GrooveAngle: '開先角度 α (°)',
  t1BevelAngle: 'ベベル角度 β (°)',
  t1RootGap: 'ルート間隔 R',
  t1RootFace: 'ルート面 f',
  t1RootRadius: 'ルート半径 r',
  t1Sec3Title: '3. 溶接法・溶着効率パラメータ',
  t1DepEfficiency: '溶着効率 η (%)',
  t1DepRate: '溶着速度 (kg/h)',
  t1OpFactor: 'アークタイム率 / 作業率 (%)',
  t1GasFlow: 'ガス流量 (L/min)',
  t1FluxRatio: 'フラックス消費比率',
  t1NoAuxRequired: '外部ガス・フラックス不要',
  t1TotalItemLength: '合計溶接延長：',
  t1AddBomBtn: '溶接集計表 (BOM) に追加',
  t1AddedBomMsg: 'BOMに追加しました！',
  t1ResultsTitle: '溶着金属重量・消費量・概算コスト計算結果',
  t1CrossArea: '全断面積 (A_total)',
  t1Theoretical: '理論断面積',
  t1WeldVolume: '溶着金属体積 (V)',
  t1NetWeight: '純溶着金属重量 (W_net)',
  t1GrossWeight: '溶接材料所要量 (W_gross)',
  t1AuxMaterial: '副資材消費量',
  t1ArcAndLaborTime: 'アーク時間 / 総所要工数',
  t1EstimatedItemCost: 'この項目の概算溶接費用：',
  bpCrossSection: 'CAD 2D 断面プレビュー',
  bpWeldMetal: '溶着金属',
  bpBaseMetal: '母材鋼板',
  bpReinforcement: '余盛率',

  jointNames: {
    [JointType.FILLET]: 'すみ肉溶接 (Fillet)',
    [JointType.SINGLE_V]: 'V形開先突合せ (Single-V)',
    [JointType.DOUBLE_V]: 'X形(両面V)開先 (Double-V)',
    [JointType.SINGLE_BEVEL]: 'レ形開先 (Single-Bevel)',
    [JointType.DOUBLE_BEVEL]: 'K形開先 (Double-Bevel)',
    [JointType.SINGLE_U]: 'U形開先 (Single-U)',
    [JointType.SINGLE_J]: 'J形開先 (Single-J)',
    [JointType.SQUARE]: 'I形開先突合せ (Square)',
  },

  t2KpiNetWeight: '純溶着金属総重量 (W_net)',
  t2KpiGrossWeight: '溶接ワイヤ・棒総所要量 (W_gross)',
  t2KpiAux: 'シールドガス・フラックス総量',
  t2KpiTotalCost: 'プロジェクト概算溶接総費用',
  t2ScheduleTitle: '溶接一覧表 (Weld Schedule) & Excel (.xlsx) 取込',
  t2ScheduleDesc: '表内で直接編集するか、ガイド用テンプレートに従ってExcelファイル (.xlsx, .xls, .csv) を読み込めます。',
  t2SearchPlaceholder: '番号 W-01、部材名で検索...',
  t2AllProcesses: 'すべての溶接法',
  t2ExcelGuideBtn: 'Excel様式・入力ガイド',
  t2DownloadTemplateBtn: '標準Excelテンプレート (.xlsx)',
  t2UploadExcelBtn: 'Excelファイル取込 (.xlsx / .csv)',
  t2ResetSampleBtn: 'サンプル復元',
  t2GuidePanelTitle: 'Excel取込フォームの列構成と入力ガイド (.xlsx / .csv)',
  t2GuidePanelSubtitle: 'Excelファイルは1シートのみで構いません。任意の寸法セルが空欄の場合は、標準的な初期値が自動補完されます。',
  t2GuideColHeader: 'Excel列ヘッダー名',
  t2GuideDescHeader: '内容と入力ルール',
  t2GuideExampleHeader: '入力例',
  t2GuideNoteCodes: '継手コード (Joint_Type): fillet, single_v, double_v, single_bevel, double_bevel, single_u, single_j, square · 溶接法 (Process): SMAW, GMAW, FCAW, GTAW, SAW',
  t2PreviewPanelTitle: 'Excel取込データのプレビューと検証',
  t2PreviewValidRows: '件の有効データ',
  t2PreviewAutoRows: '件の初期値自動補完データ',
  t2AppendBtn: '現在のリストに追加結合',
  t2ReplaceBtn: '現在のリストを置換',
  t2CancelBtn: 'キャンセル',
  t2ColTag: '番号',
  t2ColMember: '構造部材・部位',
  t2ColJointAndDim: '継手形式・寸法',
  t2ColProcess: '溶接法',
  t2ColLength: '長さ (m)',
  t2ColQty: '数量',
  t2ColArea: '断面積 (mm²)',
  t2ColNet: 'W_net (kg)',
  t2ColGross: 'W_gross (kg)',
  t2ColAux: 'ガス/Flux',
  t2ColLabor: '工数 (h)',
  t2ColCost: '概算金額',
  t2ColAction: '操作',
  t2ConsumablesSummaryTitle: '溶接法別 溶接材料所要量集計表 (Consumables BOM)',
  t2ConsumablesSummarySub: '資材発注・購買要求書用集計データ',

  t3KpiTotalCost: '溶接工事概算総費用',
  t3KpiArcTime: '総アークタイム (Arc-on)',
  t3KpiScheduleDays: '想定施工日数',
  t3KpiPowerEnergy: '溶接機総消費電力量',
  t3CostStructureTitle: '溶接コスト構成比',
  t3CatConsumables: '主溶接材料費 (棒/ワイヤ)',
  t3CatLabor: '溶接工労務費',
  t3CatAux: '副資材費 (ガス・フラックス)',
  t3CatPower: '電力費',
  t3WelderCount: '配置溶接工数 (人)',
  t3ShiftHours: '1日あたり稼働時間 (h/日)',
  t3ItemComparisonTitle: '項目別コストおよび所要工数比較',
  t3BenchmarkTitle: '5大溶接法の技術・経済性比較ベンチマーク',

  t4Card1Title: '詳細溶接BOM出力 (Detailed BOM)',
  t4Card1Desc: '全溶接項目の断面寸法・溶着量・所要量・工数・費用をExcel/CSV形式で出力します。',
  t4Card1BtnXlsx: 'Excel出力 (.xlsx)',
  t4Card1BtnCsv: 'CSV出力 (UTF-8)',
  t4Card2Title: '溶接法別 材料集計表出力',
  t4Card2Desc: '溶接法ごとにワイヤ重量、ガス量 (m³)、SAWフラックス (kg)、工数を集計して出力します。',
  t4Card2BtnXlsx: '集計表 (.xlsx)',
  t4Card2BtnCsv: '集計表 (.csv)',
  t4Card3Title: '見積要約レポート出力 (.TXT / PDF)',
  t4Card3Desc: '入札・見積添付用の溶接積算サマリーをダウンロード、またはPDF印刷します。',
  t4Card3BtnTxt: '要約保存 (.TXT)',
  t4Card3BtnPrint: 'PDF印刷',
  t4LivePreviewTitle: 'ライブプレビュー：溶接積算・材料所要量サマリーレポート',
  t4CopyBtn: 'テキストをコピー',
  t4CopiedMsg: 'コピー完了',
  t4WpsLibraryTitle: '標準溶接施工要領書 (WPS / PQR) ライブラリ',
  t4CreateWpsBtn: '新規 WPS 作成',
  t4AssignWpsMatchingBtn: '同一溶接法のBOM項目に適用',
  t4AssignWpsAllBtn: '全項目に適用',
  t4DownloadWpsBtn: 'WPS出力 (.TXT)',

  excelCols: {
    weldTag: '溶接番号_Weld_Tag',
    member: '部材部位_Member',
    wpsCode: 'WPS番号_WPS_Code',
    jointType: '継手形式_Joint_Type',
    process: '溶接法_Process',
    lengthM: '溶接長_Length_m',
    quantity: '数量_Quantity',
    filletSizeMm: 'すみ肉寸法_Fillet_mm',
    filletMode: '寸法モード_Fillet_Mode',
    doubleSide: '両側溶接_Double_Side',
    thicknessMm: '板厚_Thickness_t_mm',
    grooveAngleDeg: '開先角度_Angle_deg',
    rootGapMm: 'ルート間隔_Root_Gap_mm',
    rootFaceMm: 'ルート面_Root_Face_mm',
  },
};

const KO_DICT: TranslationDictionary = {
  ...EN_US_DICT,
  navTab1: '용접 이음부 계산',
  navTab2: '용접 물량 집계표 (BOM)',
  navTab3: '원가 및 공수 산출',
  navTab4: '보고서 출력 및 WPS',
  headerExportCta: 'Excel BOM 내보내기 (.xlsx)',
  tab1Full: '탭 1: 용접 이음부 단면 및 용착금속 체적 계산기 (KS B ISO 2553 / AWS A2.4)',
  tab2Full: '탭 2: 프로젝트 용접 일람표 (BOM) 및 Excel 일괄 업로드',
  tab3Full: '탭 3: 용접 원가 구조 및 작업 공수 차트 분석',
  tab4Full: '탭 4: Excel/CSV 내보내기, 입찰 내역서 및 WPS 라이브러리',
  ctxCode: '프로젝트 코드',
  ctxStandard: '적용 규격',
  ctxSystem: '단위계',
  ctxTotalCost: '총 예상 원가',

  sbLanguageTitle: '언어 선택 (12개국어)',
  sbCurrencySuggestPrompt: '선택한 언어의 권장 통화 단위:',
  sbApplyCurrencyBtn: '적용',
  sbSec1Title: '1. 프로젝트 및 모재 설정',
  sbResetBtn: '초기화',
  sbProjectName: '공사명 / 프로젝트명',
  sbProjectCode: '프로젝트 코드',
  sbEngineer: '작성 엔지니어',
  sbBaseMaterial: '모재 강종 (밀도 ρ 결정)',
  sbDensity: '비중 / 밀도 ρ (g/cm³)',
  sbSec2Title: '2. 측정 단위 및 적용 규격',
  sbUnitSystem: '측정 단위계',
  sbStandardRef: '용접 기호 참조 규격',
  sbSec3Title: '3. 통화 및 단가 설정',
  sbCurrencySymbol: '통화 기호 (직접 입력 가능)',
  sbQuickPresets: '빠른 통화 선택:',
  sbConsumablePrices: '주 용접재료 단가 (용접봉/와이어)',
  sbAuxLaborPowerPrices: '부자재, 노무비 및 전력 단가',
  sbShieldingGasPrice: '보호가스 (CO₂/Ar) / m³',
  sbSawFluxPrice: 'SAW 플럭스 / kg',
  sbLaborPrice: '용접사 노무 단가 / 시간',
  sbPowerPrice: '산업용 전력 단가 / kWh',

  t1LibraryTitle: '표준 용접 이음부 형상 라이브러리',
  t1Sec1Title: '1. 용접부 기호 및 시공 길이',
  t1WeldTag: '용접부 번호 (Tag)',
  t1MemberName: '구조 부재명 / 위치',
  t1WpsCode: '적용 WPS 번호',
  t1LengthPerWeld: '1개소당 용접 길이 L',
  t1Quantity: '동일 부재/용접부 수량',
  t1Reinforcement: '여유고(덧살) 할증률',
  t1Sec2Title: '2. 단면 기하학적 치수 입력',
  t1FilletRule: '필릿 용접 치수 기준',
  t1LegZ: '각장 z (Leg)',
  t1ThroatA: '목두께 a (Throat)',
  t1FilletArrangement: '필릿 용접 배치',
  t1SingleFillet: '편면 용접 (Single)',
  t1DoubleFillet: '양면 용접 (Double)',
  t1EquivalentConv: '등가 환산 (z = a × √2):',
  t1PlateThickness: '판 두께 t',
  t1GrooveAngle: '개선 각도 α (°)',
  t1BevelAngle: '베벨 각도 β (°)',
  t1RootGap: '루트 간격 R',
  t1RootFace: '루트 면 f',
  t1RootRadius: '루트 반경 r',
  t1Sec3Title: '3. 용접 프로세스 및 용착 효율',
  t1DepEfficiency: '용착 효율 η (%)',
  t1DepRate: '용착 속도 (kg/h)',
  t1OpFactor: '작업 효율 / 아크율 (%)',
  t1GasFlow: '가스 유량 (L/min)',
  t1FluxRatio: 'SAW 플럭스/와이어 비율',
  t1NoAuxRequired: '외부 가스/플럭스 불필요',
  t1TotalItemLength: '해당 항목 총 용접 길이:',
  t1AddBomBtn: '용접 집계표 (BOM)에 추가',
  t1AddedBomMsg: 'BOM 목록에 추가되었습니다!',
  t1ResultsTitle: '용착금속 중량, 소모량 및 원가 산출 결과',
  t1CrossArea: '총 단면적 (A_total)',
  t1Theoretical: '이론 단면적',
  t1WeldVolume: '용착금속 체적 (V)',
  t1NetWeight: '순수 용착금속 중량 (W_net)',
  t1GrossWeight: '용접재료 소모량 (W_gross)',
  t1AuxMaterial: '부자재 소요량',
  t1ArcAndLaborTime: '아크 시간 / 총 투입 공수',
  t1EstimatedItemCost: '항목 예상 용접 원가:',
  bpCrossSection: 'CAD 2D 단면 미리보기',
  bpWeldMetal: '용착 금속',
  bpBaseMetal: '모재 강판',
  bpReinforcement: '덧살 할증',

  jointNames: {
    [JointType.FILLET]: '필릿 용접 (Fillet)',
    [JointType.SINGLE_V]: '단일 V형 맞대기 (Single-V)',
    [JointType.DOUBLE_V]: '양면 V형 / X형 (Double-V)',
    [JointType.SINGLE_BEVEL]: '단일 베벨형 (Single-Bevel)',
    [JointType.DOUBLE_BEVEL]: '양면 베벨 / K형 (Double-Bevel)',
    [JointType.SINGLE_U]: 'U형 그루브 (Single-U)',
    [JointType.SINGLE_J]: 'J형 그루브 (Single-J)',
    [JointType.SQUARE]: 'I형 맞대기 (Square)',
  },

  t2KpiNetWeight: '총 순수 용착금속 중량 (W_net)',
  t2KpiGrossWeight: '총 용접봉/와이어 소요량 (W_gross)',
  t2KpiAux: '보호가스 및 SAW 플럭스 총량',
  t2KpiTotalCost: '프로젝트 총 예상 용접 원가',
  t2ScheduleTitle: '용접 일람표 (Weld Schedule) 및 Excel (.xlsx) 가져오기',
  t2ScheduleDesc: '표에서 직접 길이/수량을 수정하거나 양식 가이드에 맞춰 Excel 파일(.xlsx, .xls, .csv)을 업로드하세요.',
  t2SearchPlaceholder: '기호 W-01, 부재명 검색...',
  t2AllProcesses: '모든 용접법',
  t2ExcelGuideBtn: 'Excel 양식 및 입력 가이드',
  t2DownloadTemplateBtn: '표준 Excel 양식 다운로드 (.xlsx)',
  t2UploadExcelBtn: 'Excel 파일 업로드 (.xlsx / .csv)',
  t2ResetSampleBtn: '샘플 복원',
  t2GuidePanelTitle: 'Excel 업로드 양식 구조 및 컬럼 안내 (.xlsx / .csv)',
  t2GuidePanelSubtitle: 'Excel 파일은 1개의 시트만 있으면 됩니다. 선택 치수 칸을 비워두면 업계 표준 기본값이 자동 적용됩니다.',
  t2GuideColHeader: 'Excel 컬럼명',
  t2GuideDescHeader: '공학적 의미 및 입력 규칙',
  t2GuideExampleHeader: '유효 입력 예시',
  t2GuideNoteCodes: '이음부 코드 (Joint_Type): fillet, single_v, double_v, single_bevel, double_bevel, single_u, single_j, square · 용접법 (Process): SMAW, GMAW, FCAW, GTAW, SAW',
  t2PreviewPanelTitle: 'Excel 데이터 미리보기 및 유효성 검사',
  t2PreviewValidRows: '행 검증 완료',
  t2PreviewAutoRows: '행 기본값 자동 보완됨',
  t2AppendBtn: '현재 목록에 추가 병합',
  t2ReplaceBtn: '현재 목록 전체 교체',
  t2CancelBtn: '취소',
  t2ColTag: '용접기호',
  t2ColMember: '구조 부재 / 위치',
  t2ColJointAndDim: '이음부 형식 및 치수',
  t2ColProcess: '용접법',
  t2ColLength: '길이 (m)',
  t2ColQty: '수량',
  t2ColArea: '단면적 (mm²)',
  t2ColNet: 'W_net (kg)',
  t2ColGross: 'W_gross (kg)',
  t2ColAux: '가스/Flux',
  t2ColLabor: '공수 (h)',
  t2ColCost: '합계 금액',
  t2ColAction: '관리',
  t2ConsumablesSummaryTitle: '용접법별 용접재료 소요량 집계표 (Consumables BOM)',
  t2ConsumablesSummarySub: '자재 구매 청구서 작성용 집계 데이터',

  t3KpiTotalCost: '총 용접 예상 원가',
  t3KpiArcTime: '총 아크 시간 (Arc-on)',
  t3KpiScheduleDays: '예상 시공 소요일수',
  t3KpiPowerEnergy: '용접기 총 전력 소비량',
  t3CostStructureTitle: '용접 원가 비중 분석',
  t3CatConsumables: '주 용접재료비 (용접봉/와이어)',
  t3CatLabor: '용접사 직접 노무비',
  t3CatAux: '부자재비 (보호가스 및 플럭스)',
  t3CatPower: '전력 소비 비용',
  t3WelderCount: '투입 용접사 인원 (명)',
  t3ShiftHours: '일일 근무 시간 (시간/일)',
  t3ItemComparisonTitle: '항목별 용접 원가 및 투입 공수 비교',
  t3BenchmarkTitle: '5대 용접 프로세스 기술·경제성 비교표',

  t4Card1Title: '상세 용접 BOM 내보내기',
  t4Card1Desc: '전체 용접 항목의 단면 치수, 순중량 W_net, 소요량 W_gross, 공수 및 원가를 출력합니다.',
  t4Card1BtnXlsx: 'Excel 다운로드 (.xlsx)',
  t4Card1BtnCsv: 'CSV 다운로드 (UTF-8)',
  t4Card2Title: '용접법별 자재 집계표 내보내기',
  t4Card2Desc: '용접법별 와이어 중량, 보호가스(m³), SAW 플럭스(kg) 및 공수를 그룹화하여 출력합니다.',
  t4Card2BtnXlsx: '집계표 (.xlsx)',
  t4Card2BtnCsv: '집계표 (.csv)',
  t4Card3Title: '입찰 내역 요약서 출력 (.TXT / PDF)',
  t4Card3Desc: '입찰 서류 첨부용 용접 물량 및 원가 요약서를 다운로드하거나 PDF로 인쇄합니다.',
  t4Card3BtnTxt: '요약서 (.TXT)',
  t4Card3BtnPrint: 'PDF 보고서 인쇄',
  t4LivePreviewTitle: '실시간 미리보기: 용접 물량 및 입찰 원가 요약 보고서',
  t4CopyBtn: '보고서 복사',
  t4CopiedMsg: '복사됨',
  t4WpsLibraryTitle: '표준 용접절차시방서 (WPS / PQR) 라이브러리',
  t4CreateWpsBtn: '신규 WPS 등록',
  t4AssignWpsMatchingBtn: '동일 용접법 BOM 항목에 일괄 적용',
  t4AssignWpsAllBtn: '전체 BOM에 적용',
  t4DownloadWpsBtn: 'WPS 다운로드 (.TXT)',

  excelCols: {
    weldTag: '용접번호_Weld_Tag',
    member: '구조부재_Member',
    wpsCode: 'WPS번호_WPS_Code',
    jointType: '이음형식_Joint_Type',
    process: '용접법_Process',
    lengthM: '단위길이_Length_m',
    quantity: '수량_Quantity',
    filletSizeMm: '필릿치수_Fillet_mm',
    filletMode: '치수모드_Fillet_Mode',
    doubleSide: '양면여부_Double_Side',
    thicknessMm: '판두께_Thickness_t_mm',
    grooveAngleDeg: '개선각도_Angle_deg',
    rootGapMm: '루트간격_Root_Gap_mm',
    rootFaceMm: '루트면_Root_Face_mm',
  },
};

const RU_DICT: TranslationDictionary = {
  ...EN_US_DICT,
  navTab1: 'Расчет сварного шва',
  navTab2: 'Ведомость швов (BOM)',
  navTab3: 'Смета и трудоемкость',
  navTab4: 'Экспорт и база WPS',
  headerExportCta: 'Экспорт BOM (.xlsx)',
  tab1Full: 'Вкладка 1: Калькулятор геометрии и массы наплавленного металла (ГОСТ / ISO 2553)',
  tab2Full: 'Вкладка 2: Ведомость сварных швов (BOM) и импорт из Excel',
  tab3Full: 'Вкладка 3: Анализ стоимости, трудозатрат и диаграммы',
  tab4Full: 'Вкладка 4: Экспорт отчетов Excel/CSV, тендерная сводка и база WPS/PQR',
  ctxCode: 'Шифр проекта',
  ctxStandard: 'Стандарт',
  ctxSystem: 'Система единиц',
  ctxTotalCost: 'Итоговая смета',
  sbLanguageTitle: 'Язык интерфейса (12 языков)',
  sbCurrencySuggestPrompt: 'Рекомендуемая валюта для выбранного языка:',
  sbApplyCurrencyBtn: 'Применить',
  sbSec1Title: '1. Параметры проекта и основного металла',
  sbProjectName: 'Наименование объекта / проекта',
  sbProjectCode: 'Шифр проекта',
  sbEngineer: 'Инженер-сметчик / IWE',
  sbBaseMaterial: 'Марка стали (плотность ρ)',
  sbDensity: 'Плотность металла ρ (г/см³)',
  sbSec2Title: '2. Система единиц и стандарт',
  sbSec3Title: '3. Валюта и единичные расценки',
  t1LibraryTitle: 'Библиотека типов сварных соединений',
  t1AddBomBtn: 'Добавить шов в ведомость проекта (BOM)',
  t2ScheduleTitle: 'Ведомость сварных швов и импорт из Excel (.xlsx)',
  t2ExcelGuideBtn: 'Шаблон и инструкция Excel',
  t2DownloadTemplateBtn: 'Скачать шаблон Excel (.xlsx)',
  t2UploadExcelBtn: 'Загрузить файл Excel (.xlsx / .csv)',
  t2AppendBtn: 'Добавить к текущему списку',
  t2ReplaceBtn: 'Заменить текущий список',
  jointNames: {
    [JointType.FILLET]: 'Угловой шов (Fillet)',
    [JointType.SINGLE_V]: 'Стыковой V-образный (Single-V)',
    [JointType.DOUBLE_V]: 'Стыковой X-образный (Double-V)',
    [JointType.SINGLE_BEVEL]: 'Со скосом одной кромки (Single-Bevel)',
    [JointType.DOUBLE_BEVEL]: 'K-образный шов (Double-Bevel)',
    [JointType.SINGLE_U]: 'U-образный шов (Single-U)',
    [JointType.SINGLE_J]: 'J-образный шов (Single-J)',
    [JointType.SQUARE]: 'Бесскосный стыковой (Square)',
  },
};

const TH_DICT: TranslationDictionary = {
  ...EN_US_DICT,
  navTab1: 'คำนวณรอยเชื่อม',
  navTab2: 'ตารางรายการเชื่อม (BOM)',
  navTab3: 'ประมาณราคาและเวลา',
  navTab4: 'ส่งออกรายงาน & WPS',
  headerExportCta: 'ส่งออก Excel (.xlsx)',
  tab1Full: 'แท็บ 1: คำนวณปริมาตรและน้ำหนักโลหะเชื่อม (Joint Calculator)',
  tab2Full: 'แท็บ 2: ตารางสรุปรอยเชื่อม (Weld BOM) และนำเข้าไฟล์ Excel',
  tab3Full: 'แท็บ 3: วิเคราะห์ต้นทุน ชั่วโมงทำงาน และกราฟ',
  tab4Full: 'แท็บ 4: ส่งออกรายงาน Excel/CSV สรุปใบเสนอราคา และคลัง WPS/PQR',
  sbLanguageTitle: 'ภาษา (รองรับ 12 ภาษา)',
  sbCurrencySuggestPrompt: 'สกุลเงินที่แนะนำสำหรับภาษานี้:',
  sbApplyCurrencyBtn: 'ใช้งาน',
  t1AddBomBtn: 'เพิ่มรอยเชื่อมลงในตารางสรุป (BOM)',
  t2ScheduleTitle: 'ตารางรายการรอยเชื่อมและนำเข้าไฟล์ Excel (.xlsx)',
  t2ExcelGuideBtn: 'คู่มือและแบบฟอร์ม Excel',
  t2DownloadTemplateBtn: 'ดาวน์โหลดไฟล์ตัวอย่าง (.xlsx)',
  t2UploadExcelBtn: 'อัปโหลดไฟล์ Excel (.xlsx / .csv)',
  t2AppendBtn: 'เพิ่มต่อท้ายรายการเดิม',
  t2ReplaceBtn: 'แทนที่รายการเดิมทั้งหมด',
  jointNames: {
    [JointType.FILLET]: 'รอยเชื่อมฟิลเล็ต (Fillet)',
    [JointType.SINGLE_V]: 'รอยเชื่อมร่องวีเดี่ยว (Single-V)',
    [JointType.DOUBLE_V]: 'รอยเชื่อมร่องวีคู่ / X (Double-V)',
    [JointType.SINGLE_BEVEL]: 'รอยเชื่อมบากเดี่ยว (Single-Bevel)',
    [JointType.DOUBLE_BEVEL]: 'รอยเชื่อมบากคู่ / K (Double-Bevel)',
    [JointType.SINGLE_U]: 'รอยเชื่อมร่องยู (Single-U)',
    [JointType.SINGLE_J]: 'รอยเชื่อมร่องเจ (Single-J)',
    [JointType.SQUARE]: 'รอยเชื่อมชนไม่บาก (Square)',
  },
};

const HI_DICT: TranslationDictionary = {
  ...EN_US_DICT,
  navTab1: 'वेल्ड जोड़ गणना',
  navTab2: 'वेल्ड सूची (BOM)',
  navTab3: 'लागत और श्रम अनुमान',
  navTab4: 'रिपोर्ट निर्यात और WPS',
  headerExportCta: 'Excel BOM निर्यात (.xlsx)',
  tab1Full: 'टैब 1: वेल्ड जोड़ ज्यामिति और धातु भार कैलकुलेटर',
  tab2Full: 'टैब 2: प्रोजेक्ट वेल्ड अनुसूची (BOM) और Excel आयात',
  tab3Full: 'टैब 3: लागत विश्लेषण, श्रम घंटे और चार्ट',
  tab4Full: 'टैब 4: Excel/CSV निर्यात, निविदा सारांश और WPS/PQR लाइब्रेरी',
  sbLanguageTitle: 'वैश्विक भाषा (12 भाषाएँ)',
  sbCurrencySuggestPrompt: 'इस भाषा के लिए सुझाई गई मुद्रा:',
  sbApplyCurrencyBtn: 'लागू करें',
  t1AddBomBtn: 'प्रोजेक्ट BOM में वेल्ड जोड़ें',
  t2ScheduleTitle: 'प्रोजेक्ट वेल्ड सूची और Excel (.xlsx) आयात',
  t2ExcelGuideBtn: 'Excel फॉर्म गाइड और टेम्पलेट',
  t2DownloadTemplateBtn: 'नमूना Excel डाउनलोड करें (.xlsx)',
  t2UploadExcelBtn: 'Excel फ़ाइल अपलोड करें (.xlsx / .csv)',
  t2AppendBtn: 'वर्तमान सूची में जोड़ें',
  t2ReplaceBtn: 'वर्तमान सूची बदलें',
  jointNames: {
    [JointType.FILLET]: 'फ़िलेट वेल्ड (Fillet)',
    [JointType.SINGLE_V]: 'सिंगल-V ग्रूव (Single-V)',
    [JointType.DOUBLE_V]: 'डबल-V / X ग्रूव (Double-V)',
    [JointType.SINGLE_BEVEL]: 'सिंगल-बेवल ग्रूव (Single-Bevel)',
    [JointType.DOUBLE_BEVEL]: 'डबल-बेवल / K ग्रूव (Double-Bevel)',
    [JointType.SINGLE_U]: 'सिंगल-U ग्रूव (Single-U)',
    [JointType.SINGLE_J]: 'सिंगल-J ग्रूव (Single-J)',
    [JointType.SQUARE]: 'स्क्वायर बट वेल्ड (Square)',
  },
};

const DE_DICT: TranslationDictionary = {
  ...EN_US_DICT,
  navTab1: 'Nahtberechnung',
  navTab2: 'Schweißnahtliste (BOM)',
  navTab3: 'Kosten & Arbeitszeit',
  navTab4: 'Export & WPS-Archiv',
  headerExportCta: 'Excel BOM Export (.xlsx)',
  tab1Full: 'Tab 1: Schweißnahtgeometrie & Schweißgutvolumen (DIN EN ISO 2553)',
  tab2Full: 'Tab 2: Projekt-Schweißnahtliste (BOM) & Excel-Import',
  tab3Full: 'Tab 3: Kostenstruktur, Fertigungsstunden & Diagramme',
  tab4Full: 'Tab 4: Excel/CSV-Berichte, Angebotszusammenfassung & WPS-Bibliothek',
  sbLanguageTitle: 'Sprache (12 Sprachen)',
  sbCurrencySuggestPrompt: 'Empfohlene Währung für diese Sprache:',
  sbApplyCurrencyBtn: 'Übernehmen',
  t1AddBomBtn: 'Schweißnaht zur Stückliste (BOM) hinzufügen',
  t2ScheduleTitle: 'Projekt-Schweißnahtliste & Excel (.xlsx) Import',
  t2ExcelGuideBtn: 'Excel-Vorlage & Anleitung',
  t2DownloadTemplateBtn: 'Muster-Excel herunterladen (.xlsx)',
  t2UploadExcelBtn: 'Excel-Datei importieren (.xlsx / .csv)',
  t2AppendBtn: 'An aktuelle Liste anhängen',
  t2ReplaceBtn: 'Aktuelle Liste ersetzen',
  jointNames: {
    [JointType.FILLET]: 'Kehlnaht (Fillet)',
    [JointType.SINGLE_V]: 'V-Naht (Single-V)',
    [JointType.DOUBLE_V]: 'Doppel-V / X-Naht (Double-V)',
    [JointType.SINGLE_BEVEL]: 'HV-Naht (Single-Bevel)',
    [JointType.DOUBLE_BEVEL]: 'Doppel-HV / K-Naht (Double-Bevel)',
    [JointType.SINGLE_U]: 'U-Naht (Single-U)',
    [JointType.SINGLE_J]: 'HU / J-Naht (Single-J)',
    [JointType.SQUARE]: 'I-Naht (Square)',
  },
};

const FR_DICT: TranslationDictionary = {
  ...EN_US_DICT,
  navTab1: 'Calcul des Joints',
  navTab2: 'Nomenclature (BOM)',
  navTab3: 'Coûts & Main-d’œuvre',
  navTab4: 'Export & Bibliothèque WPS',
  headerExportCta: 'Exporter BOM (.xlsx)',
  tab1Full: 'Onglet 1 : Calculateur de Géométrie et Volume de Soudure (NF EN ISO 2553)',
  tab2Full: 'Onglet 2 : Liste des Soudures (BOM) & Importation Excel (.xlsx)',
  tab3Full: 'Onglet 3 : Estimation des Coûts, Heures de Soudage & Graphiques',
  tab4Full: 'Onglet 4 : Export Excel/CSV, Devis Récapitulatif & Bibliothèque DMOS/WPS',
  sbLanguageTitle: 'Langue (12 Langues)',
  sbCurrencySuggestPrompt: 'Devise recommandée pour cette langue :',
  sbApplyCurrencyBtn: 'Appliquer',
  t1AddBomBtn: 'Ajouter le cordon à la nomenclature (BOM)',
  t2ScheduleTitle: 'Nomenclature des Soudures & Import Excel (.xlsx)',
  t2ExcelGuideBtn: 'Guide & Modèle Excel',
  t2DownloadTemplateBtn: 'Télécharger Modèle Excel (.xlsx)',
  t2UploadExcelBtn: 'Importer Fichier Excel (.xlsx / .csv)',
  t2AppendBtn: 'Ajouter à la liste actuelle',
  t2ReplaceBtn: 'Remplacer la liste actuelle',
  jointNames: {
    [JointType.FILLET]: 'Soudure d’angle (Fillet)',
    [JointType.SINGLE_V]: 'Chanfrein en V (Single-V)',
    [JointType.DOUBLE_V]: 'Chanfrein en X (Double-V)',
    [JointType.SINGLE_BEVEL]: 'Demi-V (Single-Bevel)',
    [JointType.DOUBLE_BEVEL]: 'Chanfrein en K (Double-Bevel)',
    [JointType.SINGLE_U]: 'Chanfrein en U (Single-U)',
    [JointType.SINGLE_J]: 'Chanfrein en J (Single-J)',
    [JointType.SQUARE]: 'Bords droits en I (Square)',
  },
};

const ES_DICT: TranslationDictionary = {
  ...EN_US_DICT,
  navTab1: 'Cálculo de Uniones',
  navTab2: 'Lista de Soldaduras (BOM)',
  navTab3: 'Costos y Mano de Obra',
  navTab4: 'Exportar y Biblioteca WPS',
  headerExportCta: 'Exportar BOM (.xlsx)',
  tab1Full: 'Pestaña 1: Calculadora de Geometría y Volumen de Soldadura (ISO 2553 / AWS A2.4)',
  tab2Full: 'Pestaña 2: Planilla de Soldaduras (BOM) e Importación Excel (.xlsx)',
  tab3Full: 'Pestaña 3: Análisis de Costos, Horas Hombre y Gráficos',
  tab4Full: 'Pestaña 4: Exportación Excel/CSV, Resumen de Licitación y WPS/PQR',
  sbLanguageTitle: 'Idioma Global (12 Idiomas)',
  sbCurrencySuggestPrompt: 'Moneda sugerida para este idioma:',
  sbApplyCurrencyBtn: 'Aplicar',
  t1AddBomBtn: 'Añadir soldadura a la planilla (BOM)',
  t2ScheduleTitle: 'Planilla de Soldaduras e Importación Excel (.xlsx)',
  t2ExcelGuideBtn: 'Guía y Plantilla Excel',
  t2DownloadTemplateBtn: 'Descargar Plantilla Excel (.xlsx)',
  t2UploadExcelBtn: 'Importar Archivo Excel (.xlsx / .csv)',
  t2AppendBtn: 'Añadir a la lista actual',
  t2ReplaceBtn: 'Reemplazar la lista actual',
  jointNames: {
    [JointType.FILLET]: 'Soldadura de filete (Fillet)',
    [JointType.SINGLE_V]: 'Bisel en V simple (Single-V)',
    [JointType.DOUBLE_V]: 'Bisel en Doble V / X (Double-V)',
    [JointType.SINGLE_BEVEL]: 'Bisel simple (Single-Bevel)',
    [JointType.DOUBLE_BEVEL]: 'Doble bisel / K (Double-Bevel)',
    [JointType.SINGLE_U]: 'Ranura en U (Single-U)',
    [JointType.SINGLE_J]: 'Ranura en J (Single-J)',
    [JointType.SQUARE]: 'A tope bordes rectos (Square)',
  },
};

export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  vi: VI_DICT,
  'en-US': EN_US_DICT,
  'en-GB': EN_GB_DICT,
  zh: ZH_DICT,
  ja: JA_DICT,
  ko: KO_DICT,
  ru: RU_DICT,
  th: TH_DICT,
  hi: HI_DICT,
  de: DE_DICT,
  fr: FR_DICT,
  es: ES_DICT,
};

export function getTranslation(lang?: LanguageCode): TranslationDictionary {
  return TRANSLATIONS[lang || 'vi'] || VI_DICT;
}

export function getLanguageOption(lang?: LanguageCode): LanguageOption {
  return (
    LANGUAGE_OPTIONS.find((o) => o.code === (lang || 'vi')) ||
    LANGUAGE_OPTIONS[0]
  );
}
