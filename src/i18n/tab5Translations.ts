import { LanguageCode } from '../types/welding';

export type FeedbackType = 'question' | 'review';
export type FeedbackCategory =
  | 'technical_qa'
  | 'wps_review'
  | 'cost_bom'
  | 'general';
export type FeedbackStatus = 'resolved' | 'open';

export interface FeedbackReply {
  id: string;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: string;
}

export interface FeedbackThread {
  id: string;
  isSample?: boolean;
  type: FeedbackType;
  category: FeedbackCategory;
  authorName: string;
  authorRole: string;
  createdAt: string;
  rating: number; // 1..5
  linkedWeldTag: string;
  linkedWpsCode: string;
  title: string;
  content: string;
  status: FeedbackStatus;
  upvotes: number;
  replies: FeedbackReply[];
}

export interface Tab5Localization {
  navTab5: string;
  tab5Full: string;

  // 4 Top KPIs
  kpiAvgRatingTitle: string;
  kpiAvgRatingSub: string;
  kpiTotalThreadsTitle: string;
  kpiTotalThreadsSubFmt: (questions: number, reviews: number) => string;
  kpiResolvedTitle: string;
  kpiResolvedSubFmt: (resolved: number, open: number) => string;
  kpiLinkedTitle: string;
  kpiLinkedSub: string;

  // Left Post Composer Form
  formHeaderTitle: string;
  formHeaderSub: string;
  modeQuestionBtn: string;
  modeReviewBtn: string;
  authorNameLabel: string;
  authorNamePlaceholder: string;
  authorRoleLabel: string;
  roles: {
    welding_eng: string;
    qa_qc: string;
    estimator: string;
    client_pm: string;
  };
  ratingLabel: string;
  categoryLabel: string;
  categories: Record<FeedbackCategory, string>;
  linkWeldTagLabel: string;
  linkNoneOption: string;
  linkWpsLabel: string;
  titleLabel: string;
  titlePlaceholder: string;
  contentLabel: string;
  contentPlaceholder: string;
  submitBtn: string;
  submittedToast: string;

  // Right Feed & Toolbar
  feedTitle: string;
  feedSub: string;
  searchPlaceholder: string;
  filterAll: string;
  filterQuestions: string;
  filterReviews: string;
  filterResolved: string;
  filterOpen: string;
  allCategoriesOption: string;
  exportXlsxBtn: string;
  exportTxtBtn: string;
  resetSampleBtn: string;

  // Thread Card & Replies
  badgeQuestion: string;
  badgeReview: string;
  statusResolved: string;
  statusOpen: string;
  markResolvedBtn: string;
  reopenBtn: string;
  helpfulBtn: string;
  replyBtn: string;
  repliesHeader: string;
  replyPlaceholder: string;
  replySubmitBtn: string;
  emptyStateText: string;

  // 4 Localized Sample Engineering Q&A & Review Threads
  sampleThreads: FeedbackThread[];
}

const VI_TAB5: Tab5Localization = {
  navTab5: 'Nhận xét & Hỏi đáp',
  tab5Full: 'Tab 5: Nhận xét, Đánh giá & Hỏi đáp Kỹ thuật (Reviews & Q&A)',

  kpiAvgRatingTitle: 'Điểm Đánh giá Hồ sơ & Công cụ',
  kpiAvgRatingSub: 'Trung bình đánh giá từ Kỹ sư & QA/QC',
  kpiTotalThreadsTitle: 'Tổng số Nhận xét & Câu hỏi',
  kpiTotalThreadsSubFmt: (q, r) => `${q} câu hỏi Q&A · ${r} nhận xét đánh giá`,
  kpiResolvedTitle: 'Tỷ lệ Giải đáp Kỹ thuật (TQ)',
  kpiResolvedSubFmt: (res, open) =>
    `${res} đã giải đáp · ${open} chờ phản hồi`,
  kpiLinkedTitle: 'Liên kết Đường hàn & WPS',
  kpiLinkedSub: 'Số thảo luận gắn trực tiếp mã W-Tag / WPS',

  formHeaderTitle: 'Gửi Nhận xét hoặc Đặt Câu hỏi Kỹ thuật',
  formHeaderSub:
    'Đính kèm mã đường hàn (BOM) hoặc mã quy trình WPS để trao đổi chính xác.',
  modeQuestionBtn: 'Đặt Câu hỏi (Q&A)',
  modeReviewBtn: 'Nhận xét & Đánh giá ★',
  authorNameLabel: 'Họ tên người gửi',
  authorNamePlaceholder: 'VD: KS. Nguyễn Hoàng Nam',
  authorRoleLabel: 'Vai trò / Bộ phận',
  roles: {
    welding_eng: 'Kỹ sư Hàn (IWE / Welding Eng)',
    qa_qc: 'Giám sát QA/QC & NDT',
    estimator: 'Kỹ sư Dự toán & Vật tư',
    client_pm: 'Chủ đầu tư / Tư vấn Giám sát',
  },
  ratingLabel: 'Mức độ đánh giá (1 – 5 Sao)',
  categoryLabel: 'Chủ đề thảo luận',
  categories: {
    technical_qa: 'Hỏi đáp Kỹ thuật Hàn',
    wps_review: 'Rà soát Quy trình WPS / PQR',
    cost_bom: 'Góp ý Định mức & Dự toán BOM',
    general: 'Nhận xét & Đề xuất Chung',
  },
  linkWeldTagLabel: 'Đính kèm Mã đường hàn (BOM)',
  linkNoneOption: '— Không đính kèm —',
  linkWpsLabel: 'Đính kèm Mã quy trình WPS',
  titleLabel: 'Tiêu đề câu hỏi / nhận xét',
  titlePlaceholder: 'Nhập tóm tắt vấn đề kỹ thuật hoặc nhận xét...',
  contentLabel: 'Nội dung chi tiết',
  contentPlaceholder:
    'Mô tả rõ yêu cầu kỹ thuật, thông số mối hàn, chiều dày tấm hoặc ý kiến góp ý...',
  submitBtn: 'Đăng Nhận xét / Câu hỏi',
  submittedToast: 'Đã đăng vào danh sách thảo luận!',

  feedTitle: 'Nhật ký Thảo luận, Nhận xét & Giải trình Kỹ thuật (Q&A Log)',
  feedSub:
    'Tra cứu, phản hồi trực tiếp và xuất biên bản tổng hợp hỏi đáp kỹ thuật.',
  searchPlaceholder: 'Tìm theo nội dung, người gửi, W-01, WPS...',
  filterAll: 'Tất cả',
  filterQuestions: 'Câu hỏi Q&A',
  filterReviews: 'Đánh giá ★',
  filterResolved: 'Đã giải đáp',
  filterOpen: 'Chờ phản hồi',
  allCategoriesOption: 'Tất cả chủ đề',
  exportXlsxBtn: 'Xuất Excel Q&A (.xlsx)',
  exportTxtBtn: 'Xuất Biên bản (.txt)',
  resetSampleBtn: 'Khôi phục mẫu',

  badgeQuestion: 'CÂU HỎI Q&A',
  badgeReview: 'ĐÁNH GIÁ',
  statusResolved: 'Đã giải đáp',
  statusOpen: 'Chờ phản hồi',
  markResolvedBtn: 'Đánh dấu Đã giải đáp',
  reopenBtn: 'Mở lại câu hỏi',
  helpfulBtn: 'Hữu ích',
  replyBtn: 'Trả lời phản hồi',
  repliesHeader: 'Phản hồi & Giải trình kỹ thuật',
  replyPlaceholder: 'Nhập nội dung giải đáp hoặc phản hồi kỹ thuật...',
  replySubmitBtn: 'Gửi trả lời',
  emptyStateText:
    'Không tìm thấy câu hỏi hoặc nhận xét nào khớp với bộ lọc hiện tại.',

  sampleThreads: [
    {
      id: 'sample-qa-1',
      isSample: true,
      type: 'question',
      category: 'wps_review',
      authorName: 'KS. Trần Minh Đức',
      authorRole: 'Giám sát QA/QC & NDT',
      createdAt: '2026-10-24 09:15',
      rating: 5,
      linkedWeldTag: 'W-02',
      linkedWpsCode: 'WPS-FCAW-CJP-03',
      title:
        'Kiểm soát nhiệt độ gia nhiệt sơ bộ khi hàn nối đối đầu cánh dầm dày 20mm (W-02)?',
      content:
        'Đối với mối hàn giáp mối chữ V đơn ngấu hoàn toàn (CJP) trên bản cánh dầm vượt nhịp W-02 dùng dây lõi thuốc E71T-1C, đề nghị xác nhận nhiệt độ gia nhiệt sơ bộ tối thiểu tại xưởng khi độ ẩm môi trường cao.',
      status: 'resolved',
      upvotes: 8,
      replies: [
        {
          id: 'rep-101',
          authorName: 'KS. Lê Quang Huy',
          authorRole: 'Kỹ sư Hàn (IWE / Welding Eng)',
          content:
            'Theo WPS-FCAW-CJP-03 và AWS D1.1 Bảng 5.8, với thép Q345B/S355 chiều dày t = 20 mm, gia nhiệt sơ bộ duy trì 60°C – 80°C trong phạm vi 75 mm hai bên mép rãnh hàn và kiểm tra bằng phấn đo nhiệt trước khi đính.',
          createdAt: '2026-10-24 10:05',
        },
      ],
    },
    {
      id: 'sample-qa-2',
      isSample: true,
      type: 'review',
      category: 'cost_bom',
      authorName: 'KS. Phạm Thu Hà',
      authorRole: 'Kỹ sư Dự toán & Vật tư',
      createdAt: '2026-10-24 14:30',
      rating: 5,
      linkedWeldTag: 'W-01',
      linkedWpsCode: 'WPS-SAW-HB-02',
      title:
        'Định mức thuốc hàn SAW (tỷ lệ 1.1 kg thuốc / kg dây) và xuất bảng BOM Excel rất sát thực tế',
      content:
        'Bảng tổng hợp vật tư ở Tab 2 và Tab 4 tách riêng khối lượng đắp thuần W_net, khối lượng dây hàn W_gross theo hiệu suất η và lượng thuốc hàn SAW cho hạng mục dầm H600×300 (W-01) giúp phòng vật tư lên phiếu mua hàng rất nhanh và chính xác.',
      status: 'resolved',
      upvotes: 12,
      replies: [
        {
          id: 'rep-102',
          authorName: 'Ban Quản lý Dự án',
          authorRole: 'Chủ đầu tư / Tư vấn Giám sát',
          content:
            'Đã đối chiếu khối lượng W_gross trong hồ sơ dự thầu, thống nhất sử dụng hệ số thu hồi thuốc SAW chuẩn 1.10 cho toàn bộ 8 dầm chính.',
          createdAt: '2026-10-24 16:10',
        },
      ],
    },
    {
      id: 'sample-qa-3',
      isSample: true,
      type: 'question',
      category: 'technical_qa',
      authorName: 'KS. Vũ Hoàng Anh',
      authorRole: 'Chủ đầu tư / Tư vấn Giám sát',
      createdAt: '2026-10-25 08:45',
      rating: 5,
      linkedWeldTag: 'W-04',
      linkedWpsCode: 'WPS-SAW-HB-02',
      title:
        'Yêu cầu vát mép chữ X đối xứng (Double-V) cho thân bồn dày 28mm (W-04) để giảm biến dạng?',
      content:
        'Khi chuyển từ rãnh chữ V đơn sang chữ V kép (X) cho tấm dày 28mm ở hạng mục W-04, tiết diện kim loại đắp giảm gần 48%. Xưởng cần lưu ý trình tự lật trở và thổi hồ quang chân (Back-gouging) như thế nào?',
      status: 'open',
      upvotes: 5,
      replies: [],
    },
    {
      id: 'sample-qa-4',
      isSample: true,
      type: 'review',
      category: 'general',
      authorName: 'KS. Đỗ Thành Công',
      authorRole: 'Kỹ sư Hàn (IWE / Welding Eng)',
      createdAt: '2026-10-25 15:20',
      rating: 5,
      linkedWeldTag: 'W-03',
      linkedWpsCode: 'WPS-GMAW-CS-01',
      title:
        'Bản vẽ mặt cắt 2D CAD và chuyển đổi tự động z ↔ a theo ISO 2553 / AWS A2.4 rất trực quan',
      content:
        'Tính năng tự động quy đổi giữa cạnh chân hàn z và chiều dày họng hàn a (z = a × √2) kèm mặt cắt kỹ thuật 2D giúp kỹ sư tránh hoàn toàn nhầm lẫn khi đọc bản vẽ thiết kế từ các tư vấn nước ngoài.',
      status: 'resolved',
      upvotes: 9,
      replies: [],
    },
  ],
};

const EN_TAB5: Tab5Localization = {
  navTab5: 'Reviews & Q&A',
  tab5Full: 'Tab 5: User Comments, Star Reviews & Engineering Q&A',

  kpiAvgRatingTitle: 'Overall Engineering Rating',
  kpiAvgRatingSub: 'Average rating from Welding & QA/QC Engineers',
  kpiTotalThreadsTitle: 'Total Comments & Questions',
  kpiTotalThreadsSubFmt: (q, r) => `${q} Q&A questions · ${r} star reviews`,
  kpiResolvedTitle: 'Technical Resolution Rate',
  kpiResolvedSubFmt: (res, open) => `${res} resolved · ${open} pending reply`,
  kpiLinkedTitle: 'Linked Weld Tags & WPS',
  kpiLinkedSub: 'Threads linked to specific BOM W-Tags or WPS',

  formHeaderTitle: 'Post a Comment, Review or Technical Question',
  formHeaderSub:
    'Link a specific BOM Weld Tag or WPS procedure code for precise engineering review.',
  modeQuestionBtn: 'Ask Question (Q&A)',
  modeReviewBtn: 'Star Review & Comment ★',
  authorNameLabel: 'Your Name',
  authorNamePlaceholder: 'e.g., James Miller, CWI',
  authorRoleLabel: 'Engineering Role / Department',
  roles: {
    welding_eng: 'Welding Engineer (IWE / CWI)',
    qa_qc: 'QA/QC & NDT Inspector',
    estimator: 'Cost & Material Estimator',
    client_pm: 'Client / Project Manager',
  },
  ratingLabel: 'Star Rating (1 – 5 Stars)',
  categoryLabel: 'Discussion Topic',
  categories: {
    technical_qa: 'Welding Engineering Q&A',
    wps_review: 'WPS / PQR Procedure Review',
    cost_bom: 'BOM & Cost Estimation Feedback',
    general: 'General Review & Suggestion',
  },
  linkWeldTagLabel: 'Attach BOM Weld Tag',
  linkNoneOption: '— None —',
  linkWpsLabel: 'Attach WPS Procedure Code',
  titleLabel: 'Headline / Question Summary',
  titlePlaceholder: 'Summarize your technical question or review...',
  contentLabel: 'Detailed Comment / Question',
  contentPlaceholder:
    'Describe joint parameters, plate thickness, preheat, or cost feedback...',
  submitBtn: 'Submit Post',
  submittedToast: 'Posted to Discussion & Q&A Feed!',

  feedTitle: 'Engineering Reviews, Clarifications & Q&A Log',
  feedSub:
    'Filter by status, post threaded technical replies, and export the Q&A log.',
  searchPlaceholder: 'Search text, author, W-01, WPS...',
  filterAll: 'All',
  filterQuestions: 'Questions (Q&A)',
  filterReviews: 'Reviews ★',
  filterResolved: 'Resolved',
  filterOpen: 'Pending',
  allCategoriesOption: 'All Topics',
  exportXlsxBtn: 'Export Q&A Excel (.xlsx)',
  exportTxtBtn: 'Export Log (.txt)',
  resetSampleBtn: 'Reset Samples',

  badgeQuestion: 'TECHNICAL Q&A',
  badgeReview: 'REVIEW',
  statusResolved: 'Resolved',
  statusOpen: 'Pending Reply',
  markResolvedBtn: 'Mark Resolved',
  reopenBtn: 'Reopen',
  helpfulBtn: 'Helpful',
  replyBtn: 'Reply',
  repliesHeader: 'Technical Replies & Clarifications',
  replyPlaceholder: 'Write a technical response or clarification...',
  replySubmitBtn: 'Post Reply',
  emptyStateText: 'No comments or questions match the current filter.',

  sampleThreads: [
    {
      id: 'sample-qa-1',
      isSample: true,
      type: 'question',
      category: 'wps_review',
      authorName: 'Michael Vance, CWI',
      authorRole: 'QA/QC & NDT Inspector',
      createdAt: '2026-10-24 09:15',
      rating: 5,
      linkedWeldTag: 'W-02',
      linkedWpsCode: 'WPS-FCAW-CJP-03',
      title:
        'Minimum preheat temperature verification for 20mm Top Flange CJP Butt Splice (W-02)?',
      content:
        'For the Complete Joint Penetration (CJP) Single-V butt weld on W-02 using E71T-1C flux-cored wire, please confirm the mandatory preheat temperature in high ambient humidity conditions.',
      status: 'resolved',
      upvotes: 8,
      replies: [
        {
          id: 'rep-101',
          authorName: 'Robert Chen, IWE',
          authorRole: 'Welding Engineer (IWE / CWI)',
          content:
            'Per WPS-FCAW-CJP-03 and AWS D1.1 Table 5.8, for 20mm S355/A572 Gr.50 plate, maintain 60°C – 80°C minimum preheat within 75mm of the groove edges and verify with temp-sticks prior to tacking.',
          createdAt: '2026-10-24 10:05',
        },
      ],
    },
    {
      id: 'sample-qa-2',
      isSample: true,
      type: 'review',
      category: 'cost_bom',
      authorName: 'Sarah Jenkins',
      authorRole: 'Cost & Material Estimator',
      createdAt: '2026-10-24 14:30',
      rating: 5,
      linkedWeldTag: 'W-01',
      linkedWpsCode: 'WPS-SAW-HB-02',
      title:
        'Accurate SAW flux-to-wire ratio (1.1) and Excel BOM requisition export',
      content:
        'The automatic separation of net deposited metal (W_net), gross wire weight (W_gross) with deposition efficiency η, and SAW flux weight on item W-01 makes material requisitioning fast and audit-ready.',
      status: 'resolved',
      upvotes: 12,
      replies: [
        {
          id: 'rep-102',
          authorName: 'Project Engineering Lead',
          authorRole: 'Client / Project Manager',
          content:
            'Verified against shop fabrication records. The 1.10 flux ratio is approved for all 8 main girders in the tender package.',
          createdAt: '2026-10-24 16:10',
        },
      ],
    },
    {
      id: 'sample-qa-3',
      isSample: true,
      type: 'question',
      category: 'technical_qa',
      authorName: 'David Thorne',
      authorRole: 'Client / Project Manager',
      createdAt: '2026-10-25 08:45',
      rating: 5,
      linkedWeldTag: 'W-04',
      linkedWpsCode: 'WPS-SAW-HB-02',
      title:
        'Back-gouging and balanced welding sequence for 28mm Double-V Vessel Shell (W-04)?',
      content:
        'Switching from Single-V to Double-V (X-groove) on the 28mm shell plate W-04 cuts weld metal volume by ~48%. What back-gouging and NDT inspection method is required on the root before welding Side B?',
      status: 'open',
      upvotes: 5,
      replies: [],
    },
    {
      id: 'sample-qa-4',
      isSample: true,
      type: 'review',
      category: 'general',
      authorName: 'Elena Rostova, IWE',
      authorRole: 'Welding Engineer (IWE / CWI)',
      createdAt: '2026-10-25 15:20',
      rating: 5,
      linkedWeldTag: 'W-03',
      linkedWpsCode: 'WPS-GMAW-CS-01',
      title:
        'Real-time 2D CAD cross-section & ISO 2553 throat (a) vs AWS leg (z) conversion',
      content:
        'Having instant conversion between throat thickness (a) and leg length (z = a × √2) alongside the 2D CAD blueprint prevents costly misinterpretations between European ISO and US AWS shop drawings.',
      status: 'resolved',
      upvotes: 9,
      replies: [],
    },
  ],
};

const ZH_TAB5: Tab5Localization = {
  navTab5: '评论与问答',
  tab5Full: 'Tab 5: 用户评价、星级评分与焊接技术问答 (Reviews & Q&A)',

  kpiAvgRatingTitle: '工程综合评分',
  kpiAvgRatingSub: '来自焊接工程师与 QA/QC 的平均评价',
  kpiTotalThreadsTitle: '评论与技术提问总数',
  kpiTotalThreadsSubFmt: (q, r) => `${q} 条技术提问 · ${r} 条星级评价`,
  kpiResolvedTitle: '技术问题解答率',
  kpiResolvedSubFmt: (res, open) => `${res} 已解答 · ${open} 待回复`,
  kpiLinkedTitle: '关联焊缝与 WPS 编号',
  kpiLinkedSub: '已绑定具体 W-Tag 焊缝或 WPS 的讨论',

  formHeaderTitle: '发表评价或提出焊接技术问题',
  formHeaderSub: '可关联具体 BOM 焊缝编号或 WPS 工艺规程，便于技术澄清。',
  modeQuestionBtn: '提出技术问题 (Q&A)',
  modeReviewBtn: '星级评价与建议 ★',
  authorNameLabel: '您的姓名',
  authorNamePlaceholder: '例如：张工 (IWE 国际焊接工程师)',
  authorRoleLabel: '岗位 / 部门角色',
  roles: {
    welding_eng: '焊接工程师 (IWE / 工艺工程师)',
    qa_qc: 'QA/QC 质量检验与无损检测',
    estimator: '造价预算与材料计划工程师',
    client_pm: '业主代表 / 项目监理',
  },
  ratingLabel: '星级评分 (1 – 5 星)',
  categoryLabel: '讨论主题分类',
  categories: {
    technical_qa: '焊接工艺与技术问答',
    wps_review: 'WPS / PQR 规程审查',
    cost_bom: 'BOM 工程量与预算定额反馈',
    general: '综合评价与功能建议',
  },
  linkWeldTagLabel: '关联 BOM 焊缝编号',
  linkNoneOption: '— 不关联 —',
  linkWpsLabel: '关联 WPS 工艺编号',
  titleLabel: '标题 / 问题摘要',
  titlePlaceholder: '简要概括您的技术问题或评价意见...',
  contentLabel: '详细内容',
  contentPlaceholder: '请填写坡口参数、板厚、预热要求或成本定额建议...',
  submitBtn: '发布评论 / 提问',
  submittedToast: '已成功发布至技术问答与评论列表！',

  feedTitle: '焊接技术澄清、用户评价与问答记录 (Q&A Log)',
  feedSub: '支持按状态筛选、直接回复技术解答，并导出 Excel/TXT 纪要。',
  searchPlaceholder: '搜索关键词、发布人、W-01、WPS...',
  filterAll: '全部',
  filterQuestions: '技术提问',
  filterReviews: '星级评价 ★',
  filterResolved: '已解答',
  filterOpen: '待回复',
  allCategoriesOption: '所有主题',
  exportXlsxBtn: '导出问答 Excel (.xlsx)',
  exportTxtBtn: '导出纪要 (.txt)',
  resetSampleBtn: '恢复示例',

  badgeQuestion: '技术提问 Q&A',
  badgeReview: '用户评价',
  statusResolved: '已解答',
  statusOpen: '待回复',
  markResolvedBtn: '标记为已解答',
  reopenBtn: '重新打开',
  helpfulBtn: '有帮助',
  replyBtn: '回复解答',
  repliesHeader: '技术回复与澄清记录',
  replyPlaceholder: '输入您的技术解答或审核意见...',
  replySubmitBtn: '发送回复',
  emptyStateText: '未找到符合当前筛选条件的评论或提问。',

  sampleThreads: [
    {
      id: 'sample-qa-1',
      isSample: true,
      type: 'question',
      category: 'wps_review',
      authorName: '陈志强 (QA/QC)',
      authorRole: 'QA/QC 质量检验与无损检测',
      createdAt: '2026-10-24 09:15',
      rating: 5,
      linkedWeldTag: 'W-02',
      linkedWpsCode: 'WPS-FCAW-CJP-03',
      title: '关于 20mm 翼缘板全熔透对接焊缝 (W-02) 最低预热温度的确认？',
      content:
        '针对 W-02 主梁翼缘板单V坡口全熔透焊缝（采用 E71T-1C 药芯焊丝），在车间环境湿度较高时，焊前最低预热温度及测温范围如何控制？',
      status: 'resolved',
      upvotes: 8,
      replies: [
        {
          id: 'rep-101',
          authorName: '王建国 (IWE)',
          authorRole: '焊接工程师 (IWE / 工艺工程师)',
          content:
            '依据 WPS-FCAW-CJP-03 及 AWS D1.1 规范，对于 20mm 厚 Q355B/S355 钢板，定位焊及正式焊前应在坡口两侧各 75mm 范围内预热至 60°C – 80°C，去除表面水分后再施焊。',
          createdAt: '2026-10-24 10:05',
        },
      ],
    },
    {
      id: 'sample-qa-2',
      isSample: true,
      type: 'review',
      category: 'cost_bom',
      authorName: '林晓雯',
      authorRole: '造价预算与材料计划工程师',
      createdAt: '2026-10-24 14:30',
      rating: 5,
      linkedWeldTag: 'W-01',
      linkedWpsCode: 'WPS-SAW-HB-02',
      title: '埋弧焊剂消耗比 (1.1) 与 Excel 采购汇总表非常贴合车间实际',
      content:
        'Tab 2 与 Tab 4 能够自动区分理论熔敷金属量 W_net、考虑熔敷效率 η 后的焊丝采购量 W_gross 以及埋弧焊剂重量，极大提升了编制材料申购单的准确度。',
      status: 'resolved',
      upvotes: 12,
      replies: [],
    },
    {
      id: 'sample-qa-3',
      isSample: true,
      type: 'question',
      category: 'technical_qa',
      authorName: '赵海峰',
      authorRole: '业主代表 / 项目监理',
      createdAt: '2026-10-25 08:45',
      rating: 5,
      linkedWeldTag: 'W-04',
      linkedWpsCode: 'WPS-SAW-HB-02',
      title: '28mm 厚压力容器纵缝 (W-04) 双V坡口背面清根及无损检测要求？',
      content:
        'W-04 采用双V (X型) 对称坡口相比单V坡口节省了近 48% 焊材。请明确反面埋弧焊前的碳弧气刨清根深度及磁粉检测 (MT) 要求。',
      status: 'open',
      upvotes: 5,
      replies: [],
    },
    {
      id: 'sample-qa-4',
      isSample: true,
      type: 'review',
      category: 'general',
      authorName: '刘明远 (IWE)',
      authorRole: '焊接工程师 (IWE / 工艺工程师)',
      createdAt: '2026-10-25 15:20',
      rating: 5,
      linkedWeldTag: 'W-03',
      linkedWpsCode: 'WPS-GMAW-CS-01',
      title: '2D CAD 实时截面图及 ISO 2553 有效喉厚 (a) 与 AWS 焊脚 (z) 转换非常直观',
      content:
        '在涉外钢结构项目中经常遇到欧标喉厚 a 与美标焊脚 z 混用的情况，自动换算 (z = a × √2) 配合 CAD 图纸展示完全消除了现场技术员的读图误差。',
      status: 'resolved',
      upvotes: 9,
      replies: [],
    },
  ],
};

const JA_TAB5: Tab5Localization = {
  navTab5: 'レビュー・Q&A',
  tab5Full: 'Tab 5: ユーザーレビュー・星評価・溶接技術 Q&A',

  kpiAvgRatingTitle: '総合エンジニアリング評価',
  kpiAvgRatingSub: '溶接技術者・QA/QC からの平均評価スコア',
  kpiTotalThreadsTitle: 'コメント・質問総数',
  kpiTotalThreadsSubFmt: (q, r) => `技術質問 ${q} 件 · レビュー ${r} 件`,
  kpiResolvedTitle: '技術照会 (TQ) 解決率',
  kpiResolvedSubFmt: (res, open) => `解決済 ${res} 件 · 回答待ち ${open} 件`,
  kpiLinkedTitle: '溶接番号・WPS 紐付け数',
  kpiLinkedSub: 'BOM の W-Tag または WPS に紐付いたスレッド',

  formHeaderTitle: 'レビュー投稿・溶接技術に関する質問',
  formHeaderSub:
    'BOM の溶接番号 (W-01等) や WPS 番号を紐付けて投稿できます。',
  modeQuestionBtn: '技術質問を投稿 (Q&A)',
  modeReviewBtn: '星評価・コメント ★',
  authorNameLabel: '投稿者名',
  authorNamePlaceholder: '例：佐藤 健一 (WES 1級)',
  authorRoleLabel: '担当業務・役割',
  roles: {
    welding_eng: '溶接管理技術者 (IWE / WES)',
    qa_qc: 'QA/QC 品質管理・非破壊検査',
    estimator: '積算・資材調達エンジニア',
    client_pm: '発注者・監理技術者',
  },
  ratingLabel: '評価ランク (1 – 5 つ星)',
  categoryLabel: 'カテゴリー',
  categories: {
    technical_qa: '溶接施工・技術 Q&A',
    wps_review: 'WPS / PQR 施工要領レビュー',
    cost_bom: 'BOM 数量・積算コストフィードバック',
    general: '全般レビュー・改善提案',
  },
  linkWeldTagLabel: 'BOM 溶接番号を添付',
  linkNoneOption: '— 指定なし —',
  linkWpsLabel: 'WPS 施工要領番号を添付',
  titleLabel: '件名・質問タイトル',
  titlePlaceholder: '質問の要点またはレビュー件名を入力...',
  contentLabel: '詳細コメント・質問内容',
  contentPlaceholder:
    '開先形状、板厚、予熱条件、または積算結果に関するコメントを入力...',
  submitBtn: '投稿する',
  submittedToast: 'レビュー・Q&A リストに投稿しました！',

  feedTitle: '技術質疑応答・レビュー履歴 (Q&A Log)',
  feedSub:
    'ステータス絞り込み、スレッド返信、および Excel/TXT 議事録出力に対応。',
  searchPlaceholder: 'キーワード、投稿者、W-01、WPS を検索...',
  filterAll: 'すべて',
  filterQuestions: '技術質問 Q&A',
  filterReviews: 'レビュー ★',
  filterResolved: '解決済',
  filterOpen: '回答待ち',
  allCategoriesOption: '全カテゴリー',
  exportXlsxBtn: 'Q&A Excel 出力 (.xlsx)',
  exportTxtBtn: '記録出力 (.txt)',
  resetSampleBtn: 'サンプル復元',

  badgeQuestion: '技術質問 Q&A',
  badgeReview: 'レビュー',
  statusResolved: '解決済',
  statusOpen: '回答待ち',
  markResolvedBtn: '解決済にする',
  reopenBtn: '未解決に戻す',
  helpfulBtn: '参考になった',
  replyBtn: '返信する',
  repliesHeader: '技術回答・コメント返信',
  replyPlaceholder: '技術回答またはコメントを入力してください...',
  replySubmitBtn: '返信を送信',
  emptyStateText: '現在のフィルター条件に一致する投稿はありません。',

  sampleThreads: [
    {
      id: 'sample-qa-1',
      isSample: true,
      type: 'question',
      category: 'wps_review',
      authorName: '高橋 誠 (QA/QC)',
      authorRole: 'QA/QC 品質管理・非破壊検査',
      createdAt: '2026-10-24 09:15',
      rating: 5,
      linkedWeldTag: 'W-02',
      linkedWpsCode: 'WPS-FCAW-CJP-03',
      title:
        '板厚20mm 上フランジ突合せ溶接 (W-02) における予熱温度管理について？',
      content:
        'W-02（SM490/S355 板厚20mm、FCAW E71T-1C ワイヤ使用）の完全溶込み突合せ継手において、高湿度環境下での最低予熱温度と測定位置を確認したいです。',
      status: 'resolved',
      upvotes: 8,
      replies: [
        {
          id: 'rep-101',
          authorName: '鈴木 恒一 (IWE)',
          authorRole: '溶接管理技術者 (IWE / WES)',
          content:
            'WPS-FCAW-CJP-03 に従い、開先両側 75mm の範囲を 60°C〜80°C に予熱し、チョーク型温度計で確認後に仮付け・本溶接を実施してください。',
          createdAt: '2026-10-24 10:05',
        },
      ],
    },
    {
      id: 'sample-qa-2',
      isSample: true,
      type: 'review',
      category: 'cost_bom',
      authorName: '山本 彩',
      authorRole: '積算・資材調達エンジニア',
      createdAt: '2026-10-24 14:30',
      rating: 5,
      linkedWeldTag: 'W-01',
      linkedWpsCode: 'WPS-SAW-HB-02',
      title:
        'SAW フラックス消費率 (1.1) とプロセス別 Excel 集計表が購買手配に非常に便利',
      content:
        '純溶着金属量 W_net と溶着効率 η を反映した必要ワイヤ重量 W_gross、さらに SAW フラックス重量が自動算出されるため、資材発注書作成の工数が大幅に削減できました。',
      status: 'resolved',
      upvotes: 12,
      replies: [],
    },
    {
      id: 'sample-qa-3',
      isSample: true,
      type: 'question',
      category: 'technical_qa',
      authorName: '井上 剛',
      authorRole: '発注者・監理技術者',
      createdAt: '2026-10-25 08:45',
      rating: 5,
      linkedWeldTag: 'W-04',
      linkedWpsCode: 'WPS-SAW-HB-02',
      title:
        '板厚28mm 圧力容器胴体 (W-04) X形開先の裏ハツリおよび非破壊検査手順は？',
      content:
        'W-04 で両面V（X形）開先を採用することで溶着金属量が約48%削減されています。裏面溶接前のガウジング処理と磁粉探傷試験（MT）のタイミングを明記してください。',
      status: 'open',
      upvotes: 5,
      replies: [],
    },
    {
      id: 'sample-qa-4',
      isSample: true,
      type: 'review',
      category: 'general',
      authorName: '渡辺 健太 (IWE)',
      authorRole: '溶接管理技術者 (IWE / WES)',
      createdAt: '2026-10-25 15:20',
      rating: 5,
      linkedWeldTag: 'W-03',
      linkedWpsCode: 'WPS-GMAW-CS-01',
      title:
        '2D CAD 断面図と ISO 2553 のど厚 (a) ⇔ AWS 脚長 (z) のリアルタイム換算が優秀',
      content:
        '海外案件で頻発するのど厚 a と脚長 z の取り違えが、自動換算表示と CAD 断面図によって完全に防止できています。',
      status: 'resolved',
      upvotes: 9,
      replies: [],
    },
  ],
};

const KO_TAB5: Tab5Localization = {
  navTab5: '의견 및 Q&A',
  tab5Full: 'Tab 5: 사용자 의견, 별점 평가 및 용접 기술 Q&A',

  kpiAvgRatingTitle: '종합 엔지니어링 평점',
  kpiAvgRatingSub: '용접 엔지니어 및 QA/QC 평균 만족도',
  kpiTotalThreadsTitle: '총 의견 및 질문 수',
  kpiTotalThreadsSubFmt: (q, r) => `기술 질문 ${q}건 · 별점 리뷰 ${r}건`,
  kpiResolvedTitle: '기술 질의(TQ) 해결률',
  kpiResolvedSubFmt: (res, open) => `해결됨 ${res}건 · 답변 대기 ${open}건`,
  kpiLinkedTitle: '용접기호 및 WPS 연동',
  kpiLinkedSub: 'BOM 용접기호(W-Tag) 또는 WPS가 첨부된 글',

  formHeaderTitle: '의견 남기기 또는 용접 기술 질문 등록',
  formHeaderSub:
    'BOM 용접기호(W-01 등) 또는 WPS 번호를 지정하여 정확한 기술 검토가 가능합니다.',
  modeQuestionBtn: '기술 질문하기 (Q&A)',
  modeReviewBtn: '별점 평가 및 의견 ★',
  authorNameLabel: '작성자 성명',
  authorNamePlaceholder: '예: 김태호 수석 (IWE)',
  authorRoleLabel: '담당 직무 / 부서',
  roles: {
    welding_eng: '용접 엔지니어 (IWE / CWI)',
    qa_qc: 'QA/QC 품질검사 및 비파괴검사',
    estimator: '적산 및 자재구매 엔지니어',
    client_pm: '발주처 / 감리단',
  },
  ratingLabel: '별점 평가 (1 – 5점)',
  categoryLabel: '토론 주제 분류',
  categories: {
    technical_qa: '용접 기술 및 시공 Q&A',
    wps_review: 'WPS / PQR 절차서 검토',
    cost_bom: 'BOM 물량 및 적산 단가 의견',
    general: '일반 리뷰 및 개선 건의',
  },
  linkWeldTagLabel: 'BOM 용접기호 첨부',
  linkNoneOption: '— 선택 안 함 —',
  linkWpsLabel: 'WPS 절차서 번호 첨부',
  titleLabel: '제목 / 핵심 요약',
  titlePlaceholder: '질문 요지 또는 리뷰 제목을 입력하세요...',
  contentLabel: '상세 내용',
  contentPlaceholder:
    '개선 형상, 판두께, 예열 온도 또는 물량 산출에 대한 의견을 작성하세요...',
  submitBtn: '의견 / 질문 등록',
  submittedToast: '기술 Q&A 및 의견 목록에 등록되었습니다!',

  feedTitle: '기술 질의응답 및 사용자 리뷰 목록 (Q&A Log)',
  feedSub: '상태별 필터링, 댓글 답변 작성 및 Excel/TXT 회의록 내보내기 지원.',
  searchPlaceholder: '내용, 작성자, W-01, WPS 검색...',
  filterAll: '전체',
  filterQuestions: '기술 질문 Q&A',
  filterReviews: '별점 리뷰 ★',
  filterResolved: '해결됨',
  filterOpen: '답변 대기',
  allCategoriesOption: '모든 주제',
  exportXlsxBtn: 'Q&A 엑셀 내보내기 (.xlsx)',
  exportTxtBtn: '기록 내보내기 (.txt)',
  resetSampleBtn: '샘플 복원',

  badgeQuestion: '기술 질문 Q&A',
  badgeReview: '별점 리뷰',
  statusResolved: '해결됨',
  statusOpen: '답변 대기',
  markResolvedBtn: '해결됨으로 표시',
  reopenBtn: '다시 열기',
  helpfulBtn: '도움됨',
  replyBtn: '답변 작성',
  repliesHeader: '기술 답변 및 검토 의견',
  replyPlaceholder: '기술 답변이나 검토 의견을 입력하세요...',
  replySubmitBtn: '답변 등록',
  emptyStateText: '현재 필터 조건에 해당하는 질문이나 의견이 없습니다.',

  sampleThreads: [
    {
      id: 'sample-qa-1',
      isSample: true,
      type: 'question',
      category: 'wps_review',
      authorName: '박준영 책임 (QA/QC)',
      authorRole: 'QA/QC 품질검사 및 비파괴검사',
      createdAt: '2026-10-24 09:15',
      rating: 5,
      linkedWeldTag: 'W-02',
      linkedWpsCode: 'WPS-FCAW-CJP-03',
      title:
        '두께 20mm 상부 플랜지 맞대기 용접(W-02) 시 최소 예열 온도 확인 요청',
      content:
        'W-02 장경간 거더 플랜지 단일 V형 CJP 맞대기 이음(E71T-1C 플럭스 코어드 와이어 적용)에서 우기 고습도 환경 작업 시 최소 예열 온도 기준을 확인 부탁드립니다.',
      status: 'resolved',
      upvotes: 8,
      replies: [
        {
          id: 'rep-101',
          authorName: '이성민 수석 (IWE)',
          authorRole: '용접 엔지니어 (IWE / CWI)',
          content:
            'WPS-FCAW-CJP-03 및 AWS D1.1 기준에 따라 두께 20mm SM355/S355 강판은 개선면 양측 75mm 범위를 60°C~80°C로 예열 후 가접 및 본용접을 진행해야 합니다.',
          createdAt: '2026-10-24 10:05',
        },
      ],
    },
    {
      id: 'sample-qa-2',
      isSample: true,
      type: 'review',
      category: 'cost_bom',
      authorName: '최지현 프로',
      authorRole: '적산 및 자재구매 엔지니어',
      createdAt: '2026-10-24 14:30',
      rating: 5,
      linkedWeldTag: 'W-01',
      linkedWpsCode: 'WPS-SAW-HB-02',
      title:
        'SAW 플럭스 소모비(1.1) 및 공정별 엑셀 자재 집계표가 구매 발주에 매우 유용합니다',
      content:
        '순수 용착금속량 W_net과 용착효율 η가 반영된 실제 와이어 소요량 W_gross, 그리고 SAW 플럭스 물량이 자동 분리 산출되어 자재 청구서 작성 시간이 크게 단축되었습니다.',
      status: 'resolved',
      upvotes: 12,
      replies: [],
    },
    {
      id: 'sample-qa-3',
      isSample: true,
      type: 'question',
      category: 'technical_qa',
      authorName: '정현우 단장',
      authorRole: '발주처 / 감리단',
      createdAt: '2026-10-25 08:45',
      rating: 5,
      linkedWeldTag: 'W-04',
      linkedWpsCode: 'WPS-SAW-HB-02',
      title:
        '두께 28mm 압력용기 종방향 이음(W-04) 양면 X형 그루브 백가우징 및 비파괴검사 절차?',
      content:
        'W-04 항목에 양면 V(X형) 그루브를 적용하여 용착량이 약 48% 절감되었습니다. 이면 용접 전 아크 에어 가우징 및 자분탐상검사(MT) 적용 기준을 명시해 주시기 바랍니다.',
      status: 'open',
      upvotes: 5,
      replies: [],
    },
    {
      id: 'sample-qa-4',
      isSample: true,
      type: 'review',
      category: 'general',
      authorName: '강동훈 (IWE)',
      authorRole: '용접 엔지니어 (IWE / CWI)',
      createdAt: '2026-10-25 15:20',
      rating: 5,
      linkedWeldTag: 'W-03',
      linkedWpsCode: 'WPS-GMAW-CS-01',
      title:
        '2D CAD 단면도 및 ISO 2553 목두께(a) ⇔ AWS 각장(z) 실시간 변환 기능 호평',
      content:
        '유럽 ISO 도면의 목두께(a)와 미국 AWS 도면의 각장(z) 혼용으로 인한 현장 오작업을 완벽히 방지할 수 있어 매우 실용적입니다.',
      status: 'resolved',
      upvotes: 9,
      replies: [],
    },
  ],
};

const RU_TAB5: Tab5Localization = {
  navTab5: 'Отзывы и Вопросы',
  tab5Full: 'Tab 5: Отзывы, Оценки и Технические Вопросы (Reviews & Q&A)',

  kpiAvgRatingTitle: 'Средняя инженерная оценка',
  kpiAvgRatingSub: 'Оценка от инженеров по сварке и специалистов ОТК',
  kpiTotalThreadsTitle: 'Всего отзывов и вопросов',
  kpiTotalThreadsSubFmt: (q, r) => `${q} тех. вопросов · ${r} отзывов`,
  kpiResolvedTitle: 'Доля решенных вопросов',
  kpiResolvedSubFmt: (res, open) => `${res} решено · ${open} ожидает ответа`,
  kpiLinkedTitle: 'Привязка к швам и WPS',
  kpiLinkedSub: 'Записи с привязкой к коду шва W-Tag или карте WPS',

  formHeaderTitle: 'Оставить отзыв или задать технический вопрос',
  formHeaderSub:
    'Прикрепите код сварного шва из ведомости BOM или номер карты WPS для точного обсуждения.',
  modeQuestionBtn: 'Задать вопрос (Q&A)',
  modeReviewBtn: 'Отзыв и Оценка ★',
  authorNameLabel: 'ФИО автора',
  authorNamePlaceholder: 'Напр.: Иванов А.С., IWE',
  authorRoleLabel: 'Должность / Отдел',
  roles: {
    welding_eng: 'Главный сварщик / Инженер (IWE)',
    qa_qc: 'Инженер СКК / ОТК и НК',
    estimator: 'Инженер-сметчик / Снабжение',
    client_pm: 'Заказчик / Технадзор',
  },
  ratingLabel: 'Оценка (1 – 5 звезд)',
  categoryLabel: 'Категория обсуждения',
  categories: {
    technical_qa: 'Технические вопросы по сварке',
    wps_review: 'Проверка технологических карт WPS/PQR',
    cost_bom: 'Нормы расхода и смета BOM',
    general: 'Общий отзыв и предложения',
  },
  linkWeldTagLabel: 'Привязать код шва (BOM)',
  linkNoneOption: '— Без привязки —',
  linkWpsLabel: 'Привязать карту WPS',
  titleLabel: 'Тема вопроса / Заголовок отзыва',
  titlePlaceholder: 'Кратко сформулируйте технический вопрос или отзыв...',
  contentLabel: 'Подробное описание',
  contentPlaceholder:
    'Укажите параметры разделки кромок, толщину проката, режим подогрева или комментарий по смете...',
  submitBtn: 'Опубликовать запись',
  submittedToast: 'Запись добавлена в журнал обсуждений!',

  feedTitle: 'Журнал технических запросов, отзывов и разъяснений (Q&A Log)',
  feedSub:
    'Фильтрация по статусу, ответы в ветках и экспорт протокола в Excel/TXT.',
  searchPlaceholder: 'Поиск по тексту, автору, W-01, WPS...',
  filterAll: 'Все',
  filterQuestions: 'Вопросы Q&A',
  filterReviews: 'Отзывы ★',
  filterResolved: 'Решено',
  filterOpen: 'Ожидает ответа',
  allCategoriesOption: 'Все категории',
  exportXlsxBtn: 'Экспорт Q&A Excel (.xlsx)',
  exportTxtBtn: 'Скачать протокол (.txt)',
  resetSampleBtn: 'Сбросить примеры',

  badgeQuestion: 'ВОПРОС Q&A',
  badgeReview: 'ОТЗЫВ',
  statusResolved: 'Решено',
  statusOpen: 'Ожидает ответа',
  markResolvedBtn: 'Отметить решенным',
  reopenBtn: 'Открыть снова',
  helpfulBtn: 'Полезно',
  replyBtn: 'Ответить',
  repliesHeader: 'Технические ответы и согласования',
  replyPlaceholder: 'Введите технический ответ или согласование...',
  replySubmitBtn: 'Отправить ответ',
  emptyStateText: 'Записей по выбранным фильтрам не найдено.',

  sampleThreads: [
    {
      id: 'sample-qa-1',
      isSample: true,
      type: 'question',
      category: 'wps_review',
      authorName: 'Смирнов Д.В. (СКК)',
      authorRole: 'Инженер СКК / ОТК и НК',
      createdAt: '2026-10-24 09:15',
      rating: 5,
      linkedWeldTag: 'W-02',
      linkedWpsCode: 'WPS-FCAW-CJP-03',
      title:
        'Контроль температуры предварительного подогрева стыка полки балки 20 мм (W-02)?',
      content:
        'Для стыкового шва с полным проваром W-02 (порошковая проволока E71T-1C) прошу уточнить минимальную температуру подогрева кромок при повышенной влажности в цехе.',
      status: 'resolved',
      upvotes: 8,
      replies: [
        {
          id: 'rep-101',
          authorName: 'Морозов И.П. (IWE)',
          authorRole: 'Главный сварщик / Инженер (IWE)',
          content:
            'Согласно карте WPS-FCAW-CJP-03 для стали С345/S355 толщиной 20 мм необходимо выполнить предварительный подогрев до 60°C – 80°C в зоне 75 мм от кромок с контролем термокарандашом.',
          createdAt: '2026-10-24 10:05',
        },
      ],
    },
    {
      id: 'sample-qa-2',
      isSample: true,
      type: 'review',
      category: 'cost_bom',
      authorName: 'Соколова Е.А.',
      authorRole: 'Инженер-сметчик / Снабжение',
      createdAt: '2026-10-24 14:30',
      rating: 5,
      linkedWeldTag: 'W-01',
      linkedWpsCode: 'WPS-SAW-HB-02',
      title:
        'Точный расчет нормы флюса SAW (1.1) и выгрузка сводной ведомости закупки в Excel',
      content:
        'Автоматическое разделение чистой массы наплавленного металла W_net, расхода проволоки W_gross с учетом КПД η и массы флюса по шву W-01 значительно ускоряет подготовку лимитно-заборных карт.',
      status: 'resolved',
      upvotes: 12,
      replies: [],
    },
    {
      id: 'sample-qa-3',
      isSample: true,
      type: 'question',
      category: 'technical_qa',
      authorName: 'Волков А.Н.',
      authorRole: 'Заказчик / Технадзор',
      createdAt: '2026-10-25 08:45',
      rating: 5,
      linkedWeldTag: 'W-04',
      linkedWpsCode: 'WPS-SAW-HB-02',
      title:
        'Выборка корня шва и контроль МПД для Х-образной разделки обечайки 28 мм (W-04)?',
      content:
        'Переход на двустороннюю Х-образную разделку для листа 28 мм (W-04) снижает массу наплавки почти на 48%. Какой метод выборки корня с обратной стороны предусмотрен перед сваркой второго прохода?',
      status: 'open',
      upvotes: 5,
      replies: [],
    },
    {
      id: 'sample-qa-4',
      isSample: true,
      type: 'review',
      category: 'general',
      authorName: 'Белов К.С. (IWE)',
      authorRole: 'Главный сварщик / Инженер (IWE)',
      createdAt: '2026-10-25 15:20',
      rating: 5,
      linkedWeldTag: 'W-03',
      linkedWpsCode: 'WPS-GMAW-CS-01',
      title:
        'Удобный 2D CAD чертеж сечения и пересчет толщины шва (a) в катет (z)',
      content:
        'Мгновенный пересчет между европейским обозначением толщины шва a (ISO 2553) и катетом z (z = a × √2) полностью исключает ошибки чтения чертежей КМД в цехе.',
      status: 'resolved',
      upvotes: 9,
      replies: [],
    },
  ],
};

const TH_TAB5: Tab5Localization = {
  navTab5: 'ความคิดเห็น & Q&A',
  tab5Full: 'Tab 5: ความคิดเห็น การให้คะแนน และถาม-ตอบทางวิศวกรรม (Reviews & Q&A)',

  kpiAvgRatingTitle: 'คะแนนประเมินเฉลี่ยทางวิศวกรรม',
  kpiAvgRatingSub: 'คะแนนเฉลี่ยจากวิศวกรการเชื่อมและ QA/QC',
  kpiTotalThreadsTitle: 'ความคิดเห็นและคำถามทั้งหมด',
  kpiTotalThreadsSubFmt: (q, r) => `คำถาม Q&A ${q} รายการ · รีวิว ${r} รายการ`,
  kpiResolvedTitle: 'อัตราการตอบข้อซักถามเทคนิค',
  kpiResolvedSubFmt: (res, open) =>
    `ตอบแล้ว ${res} รายการ · รอตอบ ${open} รายการ`,
  kpiLinkedTitle: 'การอ้างอิงรหัสรอยเชื่อมและ WPS',
  kpiLinkedSub: 'กระทู้ที่ผูกกับรหัส W-Tag หรือรหัส WPS โดยตรง',

  formHeaderTitle: 'ส่งความคิดเห็นหรือตั้งคำถามทางเทคนิคการเชื่อม',
  formHeaderSub:
    'แนบรหัสรอยเชื่อมจาก BOM หรือรหัส WPS เพื่อการตรวจสอบที่แม่นยำ',
  modeQuestionBtn: 'ตั้งคำถามเทคนิค (Q&A)',
  modeReviewBtn: 'รีวิวและให้คะแนน ★',
  authorNameLabel: 'ชื่อผู้ส่ง',
  authorNamePlaceholder: 'เช่น วศ. สมชาย ใจดี (IWE)',
  authorRoleLabel: 'ตำแหน่ง / แผนก',
  roles: {
    welding_eng: 'วิศวกรการเชื่อม (IWE / CWI)',
    qa_qc: 'วิศวกรตรวจสอบคุณภาพ QA/QC & NDT',
    estimator: 'วิศวกรประเมินราคาและจัดซื้อวัสดุ',
    client_pm: 'เจ้าของโครงการ / ที่ปรึกษาควบคุมงาน',
  },
  ratingLabel: 'ระดับคะแนน (1 – 5 ดาว)',
  categoryLabel: 'หมวดหมู่หัวข้อ',
  categories: {
    technical_qa: 'ถาม-ตอบเทคนิคการเชื่อม',
    wps_review: 'ตรวจสอบข้อกำหนด WPS / PQR',
    cost_bom: 'ข้อเสนอแนะปริมาณวัสดุและราคา BOM',
    general: 'ความคิดเห็นและข้อเสนอแนะทั่วไป',
  },
  linkWeldTagLabel: 'แนบรหัสรอยเชื่อม (BOM)',
  linkNoneOption: '— ไม่ระบุ —',
  linkWpsLabel: 'แนบรหัสระเบียบวิธีเชื่อม WPS',
  titleLabel: 'หัวข้อคำถาม / ความคิดเห็น',
  titlePlaceholder: 'สรุปประเด็นคำถามทางเทคนิคหรือข้อเสนอแนะ...',
  contentLabel: 'รายละเอียด',
  contentPlaceholder:
    'ระบุขนาดร่องเชื่อม ความหนาเหล็ก อุณหภูมิอุ่นชิ้นงาน หรือข้อคิดเห็นด้านงบประมาณ...',
  submitBtn: 'โพสต์ความคิดเห็น / คำถาม',
  submittedToast: 'บันทึกเข้าสู่รายการถาม-ตอบเรียบร้อยแล้ว!',

  feedTitle: 'บันทึกการถาม-ตอบทางเทคนิคและรีวิวผู้ใช้งาน (Q&A Log)',
  feedSub:
    'กรองตามสถานะ ตอบกลับรายกระทู้ และส่งออกรายงานเป็นไฟล์ Excel/TXT',
  searchPlaceholder: 'ค้นหาข้อความ, ชื่อผู้ส่ง, W-01, WPS...',
  filterAll: 'ทั้งหมด',
  filterQuestions: 'คำถาม Q&A',
  filterReviews: 'รีวิว ★',
  filterResolved: 'แก้ไข/ตอบแล้ว',
  filterOpen: 'รอการตอบกลับ',
  allCategoriesOption: 'ทุกหมวดหมู่',
  exportXlsxBtn: 'ส่งออก Excel Q&A (.xlsx)',
  exportTxtBtn: 'ดาวน์โหลดรายงาน (.txt)',
  resetSampleBtn: 'คืนค่าตัวอย่าง',

  badgeQuestion: 'คำถาม Q&A',
  badgeReview: 'รีวิว',
  statusResolved: 'ตอบแล้ว',
  statusOpen: 'รอตอบกลับ',
  markResolvedBtn: 'ทำเครื่องหมายว่าตอบแล้ว',
  reopenBtn: 'เปิดคำถามอีกครั้ง',
  helpfulBtn: 'มีประโยชน์',
  replyBtn: 'ตอบกลับ',
  repliesHeader: 'คำตอบและการชี้แจงทางวิศวกรรม',
  replyPlaceholder: 'พิมพ์คำตอบทางเทคนิคหรือความเห็นเพิ่มเติม...',
  replySubmitBtn: 'ส่งคำตอบ',
  emptyStateText: 'ไม่พบความคิดเห็นหรือคำถามที่ตรงกับตัวกรองปัจจุบัน',

  sampleThreads: [
    {
      id: 'sample-qa-1',
      isSample: true,
      type: 'question',
      category: 'wps_review',
      authorName: 'วศ. กิตติพงศ์ (QA/QC)',
      authorRole: 'วิศวกรตรวจสอบคุณภาพ QA/QC & NDT',
      createdAt: '2026-10-24 09:15',
      rating: 5,
      linkedWeldTag: 'W-02',
      linkedWpsCode: 'WPS-FCAW-CJP-03',
      title:
        'การควบคุมอุณหภูมิอุ่นชิ้นงานก่อนเชื่อมรอยต่อชนปีกคานหนา 20 มม. (W-02)?',
      content:
        'สำหรับรอยเชื่อมชนร่องตัว V เดี่ยวซึมลึกสมบูรณ์ (CJP) รายการ W-02 ที่ใช้ลวดฟลักซ์คอร์ E71T-1C ขอทราบเกณฑ์อุณหภูมิอุ่นชิ้นงานขั้นต่ำเมื่อความชื้นสัมพัทธ์ในโรงงานสูง',
      status: 'resolved',
      upvotes: 8,
      replies: [
        {
          id: 'rep-101',
          authorName: 'วศ. ธีรภัทร (IWE)',
          authorRole: 'วิศวกรการเชื่อม (IWE / CWI)',
          content:
            'ตาม WPS-FCAW-CJP-03 และ AWS D1.1 สำหรับเหล็กหนา 20 มม. ให้ทำการอุ่นชิ้นงานที่ 60°C – 80°C ในระยะ 75 มม. ทั้งสองฝั่งของร่องเชื่อมและวัดด้วยชอล์กวัดอุณหภูมิก่อนเชื่อมยึด',
          createdAt: '2026-10-24 10:05',
        },
      ],
    },
    {
      id: 'sample-qa-2',
      isSample: true,
      type: 'review',
      category: 'cost_bom',
      authorName: 'นภัสสร (ฝ่ายประเมินราคา)',
      authorRole: 'วิศวกรประเมินราคาและจัดซื้อวัสดุ',
      createdAt: '2026-10-24 14:30',
      rating: 5,
      linkedWeldTag: 'W-01',
      linkedWpsCode: 'WPS-SAW-HB-02',
      title:
        'การคำนวณฟลักซ์ SAW (อัตราส่วน 1.1) และการส่งออกตาราง BOM Excel แม่นยำมาก',
      content:
        'ตารางสรุปวัสดุใน Tab 2 และ Tab 4 แยกน้ำหนักเนื้อเชื่อมสุทธิ W_net และน้ำหนักลวดรวมสูญเสีย W_gross พร้อมปริมาณฟลักซ์สำหรับคาน H-Beam (W-01) ช่วยให้ฝ่ายจัดซื้อออกใบขอซื้อได้ทันที',
      status: 'resolved',
      upvotes: 12,
      replies: [],
    },
    {
      id: 'sample-qa-3',
      isSample: true,
      type: 'question',
      category: 'technical_qa',
      authorName: 'พงศ์ศักดิ์ (ที่ปรึกษาโครงการ)',
      authorRole: 'เจ้าของโครงการ / ที่ปรึกษาควบคุมงาน',
      createdAt: '2026-10-25 08:45',
      rating: 5,
      linkedWeldTag: 'W-04',
      linkedWpsCode: 'WPS-SAW-HB-02',
      title:
        'ขั้นตอนการเซาะรากแนวเชื่อม (Back-gouging) สำหรับถังหนา 28 มม. ร่องตัว X (W-04)?',
      content:
        'การใช้ร่องตัว V คู่ (X) ในรายการ W-04 ช่วยลดปริมาตรลวดเชื่อมลงเกือบ 48% ขอทราบข้อกำหนดการเซาะรากด้านหลังและการตรวจสอบ MT ก่อนเชื่อมด้านที่สอง',
      status: 'open',
      upvotes: 5,
      replies: [],
    },
    {
      id: 'sample-qa-4',
      isSample: true,
      type: 'review',
      category: 'general',
      authorName: 'วศ. อานนท์ (IWE)',
      authorRole: 'วิศวกรการเชื่อม (IWE / CWI)',
      createdAt: '2026-10-25 15:20',
      rating: 5,
      linkedWeldTag: 'W-03',
      linkedWpsCode: 'WPS-GMAW-CS-01',
      title:
        'ภาพตัดขวาง 2D CAD และการแปลงค่าระหว่างความหนาคอเชื่อม (a) กับขาเชื่อม (z) มีประโยชน์มาก',
      content:
        'ช่วยลดความผิดพลาดในการอ่านแบบระหว่างมาตรฐานยุโรป ISO 2553 (ค่า a) และมาตรฐานอเมริกัน AWS A2.4 (ค่า z) ในหน้างานจริงได้อย่างดีเยี่ยม',
      status: 'resolved',
      upvotes: 9,
      replies: [],
    },
  ],
};

const HI_TAB5: Tab5Localization = {
  navTab5: 'समीक्षा और Q&A',
  tab5Full: 'Tab 5: उपयोगकर्ता टिप्पणियाँ, स्टार रेटिंग और तकनीकी प्रश्नोत्तर (Reviews & Q&A)',

  kpiAvgRatingTitle: 'औसत इंजीनियरिंग रेटिंग',
  kpiAvgRatingSub: 'वेल्डिंग और QA/QC इंजीनियरों द्वारा औसत मूल्यांकन',
  kpiTotalThreadsTitle: 'कुल टिप्पणियाँ और प्रश्न',
  kpiTotalThreadsSubFmt: (q, r) => `${q} तकनीकी प्रश्न · ${r} स्टार समीक्षाएं`,
  kpiResolvedTitle: 'तकनीकी समाधान दर (TQ)',
  kpiResolvedSubFmt: (res, open) => `${res} हल किए गए · ${open} उत्तर लंबित`,
  kpiLinkedTitle: 'लिंक किए गए वेल्ड टैग और WPS',
  kpiLinkedSub: 'BOM वेल्ड टैग या WPS कोड से जुड़े विषय',

  formHeaderTitle: 'टिप्पणी दर्ज करें या तकनीकी प्रश्न पूछें',
  formHeaderSub:
    'सटीक तकनीकी चर्चा के लिए BOM वेल्ड टैग (W-01) या WPS कोड संलग्न करें।',
  modeQuestionBtn: 'तकनीकी प्रश्न पूछें (Q&A)',
  modeReviewBtn: 'स्टार समीक्षा और टिप्पणी ★',
  authorNameLabel: 'आपका नाम',
  authorNamePlaceholder: 'उदा.: इंजी. राजेश शर्मा (IWE)',
  authorRoleLabel: 'पद / विभाग',
  roles: {
    welding_eng: 'वेल्डिंग इंजीनियर (IWE / CWI)',
    qa_qc: 'QA/QC एवं NDT निरीक्षक',
    estimator: 'लागत एवं सामग्री अनुमानक',
    client_pm: 'क्लाइंट / प्रोजेक्ट मैनेजर',
  },
  ratingLabel: 'स्टार रेटिंग (1 – 5 स्टार)',
  categoryLabel: 'चर्चा का विषय',
  categories: {
    technical_qa: 'वेल्डिंग इंजीनियरिंग प्रश्नोत्तर',
    wps_review: 'WPS / PQR प्रक्रिया समीक्षा',
    cost_bom: 'BOM एवं लागत अनुमान फीडबैक',
    general: 'सामान्य समीक्षा और सुझाव',
  },
  linkWeldTagLabel: 'BOM वेल्ड टैग जोड़ें',
  linkNoneOption: '— कोई नहीं —',
  linkWpsLabel: 'WPS प्रक्रिया कोड जोड़ें',
  titleLabel: 'शीर्षक / प्रश्न सारांश',
  titlePlaceholder: 'अपने तकनीकी प्रश्न या समीक्षा का संक्षिप्त शीर्षक लिखें...',
  contentLabel: 'विस्तृत विवरण',
  contentPlaceholder:
    'जोड़ के मापदंड, प्लेट की मोटाई, प्रीहीट तापमान या लागत अनुमान पर विवरण लिखें...',
  submitBtn: 'टिप्पणी / प्रश्न सबमिट करें',
  submittedToast: 'चर्चा और प्रश्नोत्तर सूची में सफलतापूर्वक जोड़ा गया!',

  feedTitle: 'तकनीकी स्पष्टीकरण, समीक्षाएं और प्रश्नोत्तर लॉग (Q&A Log)',
  feedSub:
    'स्थिति के अनुसार फ़िल्टर करें, सीधे उत्तर दें और Excel/TXT रिपोर्ट निर्यात करें।',
  searchPlaceholder: 'टेक्स्ट, लेखक, W-01, WPS खोजें...',
  filterAll: 'सभी',
  filterQuestions: 'प्रश्न (Q&A)',
  filterReviews: 'समीक्षाएं ★',
  filterResolved: 'हल किया गया',
  filterOpen: 'लंबित',
  allCategoriesOption: 'सभी विषय',
  exportXlsxBtn: 'Q&A Excel निर्यात (.xlsx)',
  exportTxtBtn: 'लॉग डाउनलोड (.txt)',
  resetSampleBtn: 'नमूना रीसेट करें',

  badgeQuestion: 'तकनीकी प्रश्न Q&A',
  badgeReview: 'समीक्षा',
  statusResolved: 'हल किया गया',
  statusOpen: 'उत्तर लंबित',
  markResolvedBtn: 'हल किया गया चिह्नित करें',
  reopenBtn: 'पुनः खोलें',
  helpfulBtn: 'उपयोगी',
  replyBtn: 'उत्तर दें',
  repliesHeader: 'तकनीकी उत्तर और स्पष्टीकरण',
  replyPlaceholder: 'अपना तकनीकी उत्तर या स्पष्टीकरण लिखें...',
  replySubmitBtn: 'उत्तर भेजें',
  emptyStateText: 'वर्तमान फ़िल्टर से मेल खाने वाला कोई प्रश्न या टिप्पणी नहीं मिली।',

  sampleThreads: [
    {
      id: 'sample-qa-1',
      isSample: true,
      type: 'question',
      category: 'wps_review',
      authorName: 'इंजी. अमित वर्मा (QA/QC)',
      authorRole: 'QA/QC एवं NDT निरीक्षक',
      createdAt: '2026-10-24 09:15',
      rating: 5,
      linkedWeldTag: 'W-02',
      linkedWpsCode: 'WPS-FCAW-CJP-03',
      title:
        '20 मिमी गर्डर फ्लैंज बट स्प्लाइस (W-02) के लिए न्यूनतम प्रीहीट तापमान की पुष्टि?',
      content:
        'W-02 पर E71T-1C फ्लक्स-कोर्ड वायर के साथ सिंगल-V CJP बट वेल्ड के लिए उच्च आर्द्रता में न्यूनतम प्रीहीट तापमान क्या रखा जाना चाहिए?',
      status: 'resolved',
      upvotes: 8,
      replies: [
        {
          id: 'rep-101',
          authorName: 'इंजी. संदीप कुलकर्णी (IWE)',
          authorRole: 'वेल्डिंग इंजीनियर (IWE / CWI)',
          content:
            'WPS-FCAW-CJP-03 और AWS D1.1 के अनुसार 20 मिमी प्लेट के लिए ग्रूव के दोनों ओर 75 मिमी क्षेत्र में 60°C – 80°C प्रीहीट बनाए रखें।',
          createdAt: '2026-10-24 10:05',
        },
      ],
    },
    {
      id: 'sample-qa-2',
      isSample: true,
      type: 'review',
      category: 'cost_bom',
      authorName: 'प्रिया नायर',
      authorRole: 'लागत एवं सामग्री अनुमानक',
      createdAt: '2026-10-24 14:30',
      rating: 5,
      linkedWeldTag: 'W-01',
      linkedWpsCode: 'WPS-SAW-HB-02',
      title:
        'SAW फ्लक्स अनुपात (1.1) और Excel BOM निर्यात खरीद योजना के लिए अत्यंत सटीक है',
      content:
        'शुद्ध वेल्ड धातु W_net, दक्षता η के साथ कुल वायर W_gross और SAW फ्लक्स का अलग-अलग विवरण मिलने से सामग्री खरीद ऑर्डर तैयार करना बहुत आसान हो गया है।',
      status: 'resolved',
      upvotes: 12,
      replies: [],
    },
    {
      id: 'sample-qa-3',
      isSample: true,
      type: 'question',
      category: 'technical_qa',
      authorName: 'विक्रम सिंह',
      authorRole: 'क्लाइंट / प्रोजेक्ट मैनेजर',
      createdAt: '2026-10-25 08:45',
      rating: 5,
      linkedWeldTag: 'W-04',
      linkedWpsCode: 'WPS-SAW-HB-02',
      title:
        '28 मिमी प्रेशर वेसल शेल (W-04) में डबल-V ग्रूव के लिए बैक-गाउजिंग और NDT प्रक्रिया?',
      content:
        'W-04 में डबल-V (X) ग्रूव से वेल्ड वॉल्यूम ~48% कम हो गया है। दूसरी तरफ वेल्डिंग से पहले रूट बैक-गाउजिंग और MT जांच का क्रम स्पष्ट करें।',
      status: 'open',
      upvotes: 5,
      replies: [],
    },
    {
      id: 'sample-qa-4',
      isSample: true,
      type: 'review',
      category: 'general',
      authorName: 'रोहित देशमुख (IWE)',
      authorRole: 'वेल्डिंग इंजीनियर (IWE / CWI)',
      createdAt: '2026-10-25 15:20',
      rating: 5,
      linkedWeldTag: 'W-03',
      linkedWpsCode: 'WPS-GMAW-CS-01',
      title:
        '2D CAD क्रॉस-सेक्शन और ISO 2553 थ्रोट (a) ⇔ AWS लेग (z) रूपांतरण बहुत उपयोगी है',
      content:
        'थ्रोट मोटाई a और लेग लंबाई z (z = a × √2) के बीच तत्काल रूपांतरण से ड्राइंग पढ़ने में होने वाली त्रुटियाँ पूरी तरह समाप्त हो जाती हैं।',
      status: 'resolved',
      upvotes: 9,
      replies: [],
    },
  ],
};

const DE_TAB5: Tab5Localization = {
  navTab5: 'Bewertungen & Q&A',
  tab5Full: 'Tab 5: Kommentare, Bewertungen & Schweißtechnische Q&A',

  kpiAvgRatingTitle: 'Durchschnittliche Fachbewertung',
  kpiAvgRatingSub: 'Bewertung durch Schweißfachingenieure (IWE) & QS',
  kpiTotalThreadsTitle: 'Kommentare & Fragen gesamt',
  kpiTotalThreadsSubFmt: (q, r) => `${q} Fachfragen · ${r} Bewertungen`,
  kpiResolvedTitle: 'Klärungsquote (TQ)',
  kpiResolvedSubFmt: (res, open) => `${res} geklärt · ${open} offen`,
  kpiLinkedTitle: 'Verknüpfte Nähte & WPS',
  kpiLinkedSub: 'Beiträge mit direktem Bezug zu W-Tag oder WPS-Nr.',

  formHeaderTitle: 'Kommentar abgeben oder Technische Frage stellen',
  formHeaderSub:
    'Verknüpfen Sie eine Naht-Nr. aus der Stückliste (BOM) oder eine WPS für präzise Rückfragen.',
  modeQuestionBtn: 'Technische Frage (Q&A)',
  modeReviewBtn: 'Sterne-Bewertung & Kommentar ★',
  authorNameLabel: 'Name des Verfassers',
  authorNamePlaceholder: 'z. B. Dipl.-Ing. Markus Weber, IWE',
  authorRoleLabel: 'Funktion / Abteilung',
  roles: {
    welding_eng: 'Schweißfachingenieur (IWE / SFI)',
    qa_qc: 'QS / ZfP-Prüfaufsicht',
    estimator: 'Kalkulation & Arbeitsvorbereitung',
    client_pm: 'Auftraggeber / Bauüberwachung',
  },
  ratingLabel: 'Bewertung (1 – 5 Sterne)',
  categoryLabel: 'Themenkategorie',
  categories: {
    technical_qa: 'Schweißtechnische Fragen (Q&A)',
    wps_review: 'WPS / WPQR-Prüfung',
    cost_bom: 'Stückliste (BOM) & Kalkulations-Feedback',
    general: 'Allgemeines Feedback & Vorschläge',
  },
  linkWeldTagLabel: 'Naht-Nr. (BOM) verknüpfen',
  linkNoneOption: '— Keine Auswahl —',
  linkWpsLabel: 'WPS-Schweißanweisung verknüpfen',
  titleLabel: 'Betreff / Kurzfassung',
  titlePlaceholder: 'Kurze Zusammenfassung Ihrer Frage oder Bewertung...',
  contentLabel: 'Detaillierte Beschreibung',
  contentPlaceholder:
    'Nahtgeometrie, Blechdicke, Vorwärmtemperatur oder Kalkulationshinweise beschreiben...',
  submitBtn: 'Beitrag veröffentlichen',
  submittedToast: 'Beitrag wurde im Q&A-Protokoll gespeichert!',

  feedTitle: 'Protokoll für Technische Klärungen, Kommentare & Q&A',
  feedSub:
    'Filtern nach Status, direkte Fachantworten und Export als Excel/TXT-Protokoll.',
  searchPlaceholder: 'Suche nach Text, Autor, W-01, WPS...',
  filterAll: 'Alle',
  filterQuestions: 'Fragen (Q&A)',
  filterReviews: 'Bewertungen ★',
  filterResolved: 'Geklärt',
  filterOpen: 'Offen',
  allCategoriesOption: 'Alle Kategorien',
  exportXlsxBtn: 'Q&A-Excel exportieren (.xlsx)',
  exportTxtBtn: 'Protokoll (.txt)',
  resetSampleBtn: 'Beispiele zurücksetzen',

  badgeQuestion: 'FACHFRAGE Q&A',
  badgeReview: 'BEWERTUNG',
  statusResolved: 'Geklärt',
  statusOpen: 'Offen',
  markResolvedBtn: 'Als geklärt markieren',
  reopenBtn: 'Wieder öffnen',
  helpfulBtn: 'Hilfreich',
  replyBtn: 'Antworten',
  repliesHeader: 'Technische Antworten & Freigaben',
  replyPlaceholder: 'Technische Antwort oder Stellungnahme eingeben...',
  replySubmitBtn: 'Antwort senden',
  emptyStateText:
    'Keine Kommentare oder Fragen für die aktuelle Filterauswahl gefunden.',

  sampleThreads: [
    {
      id: 'sample-qa-1',
      isSample: true,
      type: 'question',
      category: 'wps_review',
      authorName: 'Thomas Becker (ZfP / QS)',
      authorRole: 'QS / ZfP-Prüfaufsicht',
      createdAt: '2026-10-24 09:15',
      rating: 5,
      linkedWeldTag: 'W-02',
      linkedWpsCode: 'WPS-FCAW-CJP-03',
      title:
        'Vorwärmtemperatur beim voll durchgeschweißten Obergurt-Stumpfstoß t=20mm (W-02)?',
      content:
        'Für die V-Stumpfnaht W-02 mit Fülldraht E71T-1C bitten wir um Bestätigung der Mindestvorwärmtemperatur nach EN 1090-2 / AWS D1.1 bei hoher Hallenluftfeuchtigkeit.',
      status: 'resolved',
      upvotes: 8,
      replies: [
        {
          id: 'rep-101',
          authorName: 'Dipl.-Ing. Klaus Richter (IWE)',
          authorRole: 'Schweißfachingenieur (IWE / SFI)',
          content:
            'Gemäß WPS-FCAW-CJP-03 ist bei S355J2 (t = 20 mm) eine Vorwärmung auf 60°C – 80°C im Bereich von 75 mm beidseitig der Nahtfuge vor dem Heften zwingend einzuhalten.',
          createdAt: '2026-10-24 10:05',
        },
      ],
    },
    {
      id: 'sample-qa-2',
      isSample: true,
      type: 'review',
      category: 'cost_bom',
      authorName: 'Julia Hartmann',
      authorRole: 'Kalkulation & Arbeitsvorbereitung',
      createdAt: '2026-10-24 14:30',
      rating: 5,
      linkedWeldTag: 'W-01',
      linkedWpsCode: 'WPS-SAW-HB-02',
      title:
        'Präzise UP-Pulver-Kalkulation (Verhältnis 1,1) und sauberer Excel-Stücklistenexport',
      content:
        'Die Trennung von reinem Schweißgut W_net, Brutto-Drahtbedarf W_gross (inkl. Abschmelzwirkungsgrad η) und UP-Schweißpulver für Position W-01 erleichtert die Materialbestellung enorm.',
      status: 'resolved',
      upvotes: 12,
      replies: [],
    },
    {
      id: 'sample-qa-3',
      isSample: true,
      type: 'question',
      category: 'technical_qa',
      authorName: 'Dr. Stefan König',
      authorRole: 'Auftraggeber / Bauüberwachung',
      createdAt: '2026-10-25 08:45',
      rating: 5,
      linkedWeldTag: 'W-04',
      linkedWpsCode: 'WPS-SAW-HB-02',
      title:
        'Wurzelausfugen und MT-Prüfung bei der 28mm Doppel-V-Längsnaht (W-04)?',
      content:
        'Durch die X-Naht bei Position W-04 sinkt das Nahtvolumen um fast 48%. Bitte das Verfahren zum rückseitigen Ausfugen der Wurzel vor dem Schweißen der Gegenseite spezifizieren.',
      status: 'open',
      upvotes: 5,
      replies: [],
    },
    {
      id: 'sample-qa-4',
      isSample: true,
      type: 'review',
      category: 'general',
      authorName: 'Andreas Neumann (IWE)',
      authorRole: 'Schweißfachingenieur (IWE / SFI)',
      createdAt: '2026-10-25 15:20',
      rating: 5,
      linkedWeldTag: 'W-03',
      linkedWpsCode: 'WPS-GMAW-CS-01',
      title:
        '2D-CAD-Nahtvorschau und direkte Umrechnung zwischen a-Maß (ISO 2553) und z-Maß (AWS)',
      content:
        'Die automatische Umrechnung zwischen Nahtdicke a und Schenkellänge z (z = a × √2) verhindert zuverlässig Verwechslungen bei internationalen Projekten.',
      status: 'resolved',
      upvotes: 9,
      replies: [],
    },
  ],
};

const FR_TAB5: Tab5Localization = {
  navTab5: 'Avis & Questions',
  tab5Full: 'Tab 5: Avis, Évaluations & Questions Techniques (Reviews & Q&A)',

  kpiAvgRatingTitle: 'Note Technique Moyenne',
  kpiAvgRatingSub: 'Évaluation par les ingénieurs soudeurs (IWE) et QA/QC',
  kpiTotalThreadsTitle: 'Total Avis & Questions',
  kpiTotalThreadsSubFmt: (q, r) => `${q} questions Q&A · ${r} avis étoilés`,
  kpiResolvedTitle: 'Taux de Résolution (TQ)',
  kpiResolvedSubFmt: (res, open) => `${res} résolus · ${open} en attente`,
  kpiLinkedTitle: 'Liaisons Cordons & DMOS',
  kpiLinkedSub: 'Sujets rattachés à un repère W-Tag ou un code WPS/DMOS',

  formHeaderTitle: 'Publier un Avis ou Poser une Question Technique',
  formHeaderSub:
    'Rattachez un repère de soudure (BOM) ou un code DMOS/WPS pour un suivi précis.',
  modeQuestionBtn: 'Poser une Question (Q&A)',
  modeReviewBtn: 'Avis & Note Étoilée ★',
  authorNameLabel: 'Nom de l’auteur',
  authorNamePlaceholder: 'Ex. : Laurent Moreau, IWE',
  authorRoleLabel: 'Fonction / Service',
  roles: {
    welding_eng: 'Ingénieur Soudeur (IWE / Coordinateur)',
    qa_qc: 'Inspecteur QA/QC & CND',
    estimator: 'Ingénieur Chiffrage & Achats',
    client_pm: 'Maître d’Ouvrage / Maître d’Œuvre',
  },
  ratingLabel: 'Note d’évaluation (1 à 5 Étoiles)',
  categoryLabel: 'Catégorie du sujet',
  categories: {
    technical_qa: 'Questions Techniques Soudage (Q&A)',
    wps_review: 'Revue des DMOS / QMOS (WPS/PQR)',
    cost_bom: 'Retour sur Nomenclature BOM & Coûts',
    general: 'Avis Général & Suggestions',
  },
  linkWeldTagLabel: 'Rattacher un repère de soudure (BOM)',
  linkNoneOption: '— Aucun —',
  linkWpsLabel: 'Rattacher un code DMOS / WPS',
  titleLabel: 'Titre de la question / de l’avis',
  titlePlaceholder: 'Résumez votre question technique ou votre commentaire...',
  contentLabel: 'Description détaillée',
  contentPlaceholder:
    'Précisez les paramètres du joint, l’épaisseur, le préchauffage ou votre remarque chiffrage...',
  submitBtn: 'Publier le message',
  submittedToast: 'Message publié dans le journal Q&A !',

  feedTitle: 'Journal des Clarifications Techniques, Avis & Questions (Q&A Log)',
  feedSub:
    'Filtrez par statut, répondez directement aux questions et exportez le registre en Excel/TXT.',
  searchPlaceholder: 'Rechercher texte, auteur, W-01, WPS...',
  filterAll: 'Tous',
  filterQuestions: 'Questions Q&A',
  filterReviews: 'Avis ★',
  filterResolved: 'Résolu',
  filterOpen: 'En attente',
  allCategoriesOption: 'Toutes les catégories',
  exportXlsxBtn: 'Exporter Excel Q&A (.xlsx)',
  exportTxtBtn: 'Exporter Registre (.txt)',
  resetSampleBtn: 'Réinitialiser exemples',

  badgeQuestion: 'QUESTION Q&A',
  badgeReview: 'AVIS',
  statusResolved: 'Résolu',
  statusOpen: 'En attente',
  markResolvedBtn: 'Marquer comme résolu',
  reopenBtn: 'Rouvrir',
  helpfulBtn: 'Utile',
  replyBtn: 'Répondre',
  repliesHeader: 'Réponses & Clarifications Techniques',
  replyPlaceholder: 'Saisissez votre réponse technique ou validation...',
  replySubmitBtn: 'Envoyer la réponse',
  emptyStateText: 'Aucun avis ou question ne correspond aux filtres sélectionnés.',

  sampleThreads: [
    {
      id: 'sample-qa-1',
      isSample: true,
      type: 'question',
      category: 'wps_review',
      authorName: 'Marc Lefèvre (QA/QC)',
      authorRole: 'Inspecteur QA/QC & CND',
      createdAt: '2026-10-24 09:15',
      rating: 5,
      linkedWeldTag: 'W-02',
      linkedWpsCode: 'WPS-FCAW-CJP-03',
      title:
        'Température minimale de préchauffage pour le joint bout à bout de semelle ép. 20mm (W-02) ?',
      content:
        'Pour la soudure bout à bout en V à pleine pénétration W-02 avec fil fourré E71T-1C, merci de confirmer la température de préchauffage requise en atelier par temps humide.',
      status: 'resolved',
      upvotes: 8,
      replies: [
        {
          id: 'rep-101',
          authorName: 'Philippe Garnier (IWE)',
          authorRole: 'Ingénieur Soudeur (IWE / Coordinateur)',
          content:
            'Selon le DMOS WPS-FCAW-CJP-03 et l’EN 1090-2, maintenir un préchauffage de 60°C à 80°C sur 75 mm de part et d’autre du chanfrein avant pointage.',
          createdAt: '2026-10-24 10:05',
        },
      ],
    },
    {
      id: 'sample-qa-2',
      isSample: true,
      type: 'review',
      category: 'cost_bom',
      authorName: 'Claire Dubois',
      authorRole: 'Ingénieur Chiffrage & Achats',
      createdAt: '2026-10-24 14:30',
      rating: 5,
      linkedWeldTag: 'W-01',
      linkedWpsCode: 'WPS-SAW-HB-02',
      title:
        'Ratio de flux SAW (1,1) et export Excel des consommables très précis pour les achats',
      content:
        'La distinction automatique entre la masse nette déposée W_net, la masse brute de fil W_gross (avec rendement η) et le flux en poudre sur le repère W-01 fiabilise totalement nos réquisitions d’achat.',
      status: 'resolved',
      upvotes: 12,
      replies: [],
    },
    {
      id: 'sample-qa-3',
      isSample: true,
      type: 'question',
      category: 'technical_qa',
      authorName: 'Antoine Bernard',
      authorRole: 'Maître d’Ouvrage / Maître d’Œuvre',
      createdAt: '2026-10-25 08:45',
      rating: 5,
      linkedWeldTag: 'W-04',
      linkedWpsCode: 'WPS-SAW-HB-02',
      title:
        'Gougeage envers et contrôle magnétoscopique (MT) sur virole ép. 28mm en X (W-04) ?',
      content:
        'Le chanfrein en X sur le poste W-04 réduit le volume de métal déposé de ~48%. Quelle est la procédure exacte de gougeage arc-air à l’envers avant soudage de la seconde face ?',
      status: 'open',
      upvotes: 5,
      replies: [],
    },
    {
      id: 'sample-qa-4',
      isSample: true,
      type: 'review',
      category: 'general',
      authorName: 'Nicolas Mercier (IWE)',
      authorRole: 'Ingénieur Soudeur (IWE / Coordinateur)',
      createdAt: '2026-10-25 15:20',
      rating: 5,
      linkedWeldTag: 'W-03',
      linkedWpsCode: 'WPS-GMAW-CS-01',
      title:
        'Schéma 2D CAD temps réel et conversion gorge (a) ISO 2553 ⇔ côté (z) AWS A2.4',
      content:
        'La conversion instantanée entre l’épaisseur de gorge a et le côté z (z = a × √2) évite toute erreur d’interprétation entre plans européens et américains.',
      status: 'resolved',
      upvotes: 9,
      replies: [],
    },
  ],
};

const ES_TAB5: Tab5Localization = {
  navTab5: 'Comentarios y Q&A',
  tab5Full: 'Tab 5: Comentarios, Valoraciones y Preguntas Técnicas (Reviews & Q&A)',

  kpiAvgRatingTitle: 'Valoración Técnica Media',
  kpiAvgRatingSub: 'Puntuación media de Ingenieros de Soldadura y QA/QC',
  kpiTotalThreadsTitle: 'Total Comentarios y Preguntas',
  kpiTotalThreadsSubFmt: (q, r) => `${q} preguntas Q&A · ${r} valoraciones`,
  kpiResolvedTitle: 'Tasa de Resolución (TQ)',
  kpiResolvedSubFmt: (res, open) => `${res} resueltas · ${open} pendientes`,
  kpiLinkedTitle: 'Vínculos a Cordones y WPS',
  kpiLinkedSub: 'Hilos vinculados a un código W-Tag del BOM o WPS',

  formHeaderTitle: 'Publicar un Comentario o Pregunta Técnica de Soldadura',
  formHeaderSub:
    'Vincule un código de cordón (BOM) o procedimiento WPS para una revisión técnica precisa.',
  modeQuestionBtn: 'Hacer Pregunta (Q&A)',
  modeReviewBtn: 'Valoración y Comentario ★',
  authorNameLabel: 'Nombre del autor',
  authorNamePlaceholder: 'Ej.: Ing. Carlos Mendoza, CWI',
  authorRoleLabel: 'Rol / Departamento',
  roles: {
    welding_eng: 'Ingeniero de Soldadura (IWE / CWI)',
    qa_qc: 'Inspector QA/QC y END',
    estimator: 'Ingeniero de Costos y Compras',
    client_pm: 'Cliente / Dirección de Proyecto',
  },
  ratingLabel: 'Valoración (1 – 5 Estrellas)',
  categoryLabel: 'Categoría del tema',
  categories: {
    technical_qa: 'Preguntas Técnicas de Soldadura (Q&A)',
    wps_review: 'Revisión de Procedimientos WPS / PQR',
    cost_bom: 'Comentarios sobre BOM y Presupuesto',
    general: 'Opinión General y Sugerencias',
  },
  linkWeldTagLabel: 'Adjuntar Código de Soldadura (BOM)',
  linkNoneOption: '— Ninguno —',
  linkWpsLabel: 'Adjuntar Código WPS',
  titleLabel: 'Título de la pregunta / comentario',
  titlePlaceholder: 'Resuma su consulta técnica o valoración...',
  contentLabel: 'Descripción detallada',
  contentPlaceholder:
    'Describa parámetros de bisel, espesor de chapa, precalentamiento o comentarios de costos...',
  submitBtn: 'Publicar Comentario / Pregunta',
  submittedToast: '¡Publicado en el registro de comentarios y Q&A!',

  feedTitle: 'Registro de Consultas Técnicas, Valoraciones y Respuestas (Q&A Log)',
  feedSub:
    'Filtre por estado, responda en hilo y exporte el acta en formato Excel/TXT.',
  searchPlaceholder: 'Buscar texto, autor, W-01, WPS...',
  filterAll: 'Todos',
  filterQuestions: 'Preguntas Q&A',
  filterReviews: 'Valoraciones ★',
  filterResolved: 'Resuelto',
  filterOpen: 'Pendiente',
  allCategoriesOption: 'Todas las categorías',
  exportXlsxBtn: 'Exportar Excel Q&A (.xlsx)',
  exportTxtBtn: 'Descargar Acta (.txt)',
  resetSampleBtn: 'Restaurar ejemplos',

  badgeQuestion: 'PREGUNTA Q&A',
  badgeReview: 'VALORACIÓN',
  statusResolved: 'Resuelto',
  statusOpen: 'Pendiente',
  markResolvedBtn: 'Marcar como resuelto',
  reopenBtn: 'Reabrir',
  helpfulBtn: 'Útil',
  replyBtn: 'Responder',
  repliesHeader: 'Respuestas y Aclaraciones Técnicas',
  replyPlaceholder: 'Escriba su respuesta o aclaración técnica...',
  replySubmitBtn: 'Enviar respuesta',
  emptyStateText:
    'No se encontraron comentarios ni preguntas con el filtro actual.',

  sampleThreads: [
    {
      id: 'sample-qa-1',
      isSample: true,
      type: 'question',
      category: 'wps_review',
      authorName: 'Ing. Javier Morales (QA/QC)',
      authorRole: 'Inspector QA/QC y END',
      createdAt: '2026-10-24 09:15',
      rating: 5,
      linkedWeldTag: 'W-02',
      linkedWpsCode: 'WPS-FCAW-CJP-03',
      title:
        '¿Verificación de temperatura mínima de precalentamiento en empalme de ala de 20mm (W-02)?',
      content:
        'Para la unión a tope en V simple de penetración completa (CJP) en W-02 con alambre tubular E71T-1C, favor confirmar la temperatura mínima de precalentamiento en taller con alta humedad.',
      status: 'resolved',
      upvotes: 8,
      replies: [
        {
          id: 'rep-101',
          authorName: 'Ing. Roberto Navarro (IWE)',
          authorRole: 'Ingeniero de Soldadura (IWE / CWI)',
          content:
            'Según el WPS-FCAW-CJP-03 y AWS D1.1 Tabla 5.8, para chapa S355/A572 de 20 mm se debe precalentar entre 60°C y 80°C en una franja de 75 mm a cada lado del bisel antes del punteado.',
          createdAt: '2026-10-24 10:05',
        },
      ],
    },
    {
      id: 'sample-qa-2',
      isSample: true,
      type: 'review',
      category: 'cost_bom',
      authorName: 'Lucía Fernández',
      authorRole: 'Ingeniero de Costos y Compras',
      createdAt: '2026-10-24 14:30',
      rating: 5,
      linkedWeldTag: 'W-01',
      linkedWpsCode: 'WPS-SAW-HB-02',
      title:
        'Excelente cálculo de relación de fundente SAW (1.1) y exportación de requisición BOM a Excel',
      content:
        'El desglose automático entre peso neto depositado W_net, alambre bruto requerido W_gross según eficiencia η y fundente SAW en la partida W-01 agiliza enormemente las compras de materiales.',
      status: 'resolved',
      upvotes: 12,
      replies: [],
    },
    {
      id: 'sample-qa-3',
      isSample: true,
      type: 'question',
      category: 'technical_qa',
      authorName: 'Fernando Silva',
      authorRole: 'Cliente / Dirección de Proyecto',
      createdAt: '2026-10-25 08:45',
      rating: 5,
      linkedWeldTag: 'W-04',
      linkedWpsCode: 'WPS-SAW-HB-02',
      title:
        '¿Saneado de raíz (Back-gouging) y ensayo MT en virola de 28mm con bisel en Doble-V (W-04)?',
      content:
        'El bisel en Doble-V (X) en la partida W-04 reduce el volumen de soldadura en casi un 48%. Favor detallar el método de repelomado de raíz por el reverso antes de soldar la segunda cara.',
      status: 'open',
      upvotes: 5,
      replies: [],
    },
    {
      id: 'sample-qa-4',
      isSample: true,
      type: 'review',
      category: 'general',
      authorName: 'Diego Herrera (IWE)',
      authorRole: 'Ingeniero de Soldadura (IWE / CWI)',
      createdAt: '2026-10-25 15:20',
      rating: 5,
      linkedWeldTag: 'W-03',
      linkedWpsCode: 'WPS-GMAW-CS-01',
      title:
        'Plano 2D CAD en tiempo real y conversión garganta (a) ISO 2553 ⇔ cateto (z) AWS A2.4',
      content:
        'La conversión automática entre el espesor de garganta a y el lado de pierna z (z = a × √2) evita errores de interpretación entre planos europeos y americanos en planta.',
      status: 'resolved',
      upvotes: 9,
      replies: [],
    },
  ],
};

export interface Tab5DateFilterLabels {
  dateFilterLabel: string;
  fromDateLabel: string;
  toDateLabel: string;
  presetAll: string;
  preset7Days: string;
  preset30Days: string;
  clearDateBtn: string;
  matchedCountFmt: (matched: number, total: number) => string;
  exportPeriodFmt: (from: string, to: string) => string;
}

const DATE_FILTER_LABELS_MAP: Record<LanguageCode, Tab5DateFilterLabels> = {
  vi: {
    dateFilterLabel: 'Kỳ thảo luận & xuất nhật ký:',
    fromDateLabel: 'Từ ngày',
    toDateLabel: 'Đến ngày',
    presetAll: 'Tất cả',
    preset7Days: '7 ngày',
    preset30Days: '30 ngày',
    clearDateBtn: 'Xóa lọc ngày',
    matchedCountFmt: (m, t) => `Hiển thị & xuất ${m} / ${t} thảo luận`,
    exportPeriodFmt: (from, to) =>
      !from && !to
        ? 'Toàn bộ thời gian (Tất cả)'
        : `${from || '...'} → ${to || '...'}`,
  },
  'en-US': {
    dateFilterLabel: 'Discussion & Export Period:',
    fromDateLabel: 'From',
    toDateLabel: 'To',
    presetAll: 'All Time',
    preset7Days: 'Last 7 Days',
    preset30Days: 'Last 30 Days',
    clearDateBtn: 'Reset Dates',
    matchedCountFmt: (m, t) => `Showing & exporting ${m} / ${t} threads`,
    exportPeriodFmt: (from, to) =>
      !from && !to
        ? 'All Time'
        : `${from || '...'} → ${to || '...'}`,
  },
  'en-GB': {
    dateFilterLabel: 'Discussion & Export Period:',
    fromDateLabel: 'From',
    toDateLabel: 'To',
    presetAll: 'All Time',
    preset7Days: 'Last 7 Days',
    preset30Days: 'Last 30 Days',
    clearDateBtn: 'Reset Dates',
    matchedCountFmt: (m, t) => `Showing & exporting ${m} / ${t} threads`,
    exportPeriodFmt: (from, to) =>
      !from && !to
        ? 'All Time'
        : `${from || '...'} → ${to || '...'}`,
  },
  zh: {
    dateFilterLabel: '讨论与导出时间段：',
    fromDateLabel: '从日期',
    toDateLabel: '至日期',
    presetAll: '全部时间',
    preset7Days: '近 7 天',
    preset30Days: '近 30 天',
    clearDateBtn: '重置日期',
    matchedCountFmt: (m, t) => `显示并导出 ${m} / ${t} 条记录`,
    exportPeriodFmt: (from, to) =>
      !from && !to
        ? '全部时间'
        : `${from || '...'} → ${to || '...'}`,
  },
  ja: {
    dateFilterLabel: '対象期間（表示・出力）：',
    fromDateLabel: '開始日',
    toDateLabel: '終了日',
    presetAll: '全期間',
    preset7Days: '直近7日間',
    preset30Days: '直近30日間',
    clearDateBtn: '期間リセット',
    matchedCountFmt: (m, t) => `${m} / ${t} 件を表示・出力`,
    exportPeriodFmt: (from, to) =>
      !from && !to
        ? '全期間'
        : `${from || '...'} → ${to || '...'}`,
  },
  ko: {
    dateFilterLabel: '토론 및 내보내기 기간:',
    fromDateLabel: '시작일',
    toDateLabel: '종료일',
    presetAll: '전체 기간',
    preset7Days: '최근 7일',
    preset30Days: '최근 30일',
    clearDateBtn: '날짜 초기화',
    matchedCountFmt: (m, t) => `${m} / ${t}건 표시 및 내보내기`,
    exportPeriodFmt: (from, to) =>
      !from && !to
        ? '전체 기간'
        : `${from || '...'} → ${to || '...'}`,
  },
  ru: {
    dateFilterLabel: 'Период журнала и экспорта:',
    fromDateLabel: 'С даты',
    toDateLabel: 'По дату',
    presetAll: 'Все время',
    preset7Days: '7 дней',
    preset30Days: '30 дней',
    clearDateBtn: 'Сбросить даты',
    matchedCountFmt: (m, t) => `Показано и в экспорте: ${m} из ${t}`,
    exportPeriodFmt: (from, to) =>
      !from && !to
        ? 'За все время'
        : `${from || '...'} → ${to || '...'}`,
  },
  th: {
    dateFilterLabel: 'ช่วงเวลาบันทึกและส่งออก:',
    fromDateLabel: 'ตั้งแต่วันที่',
    toDateLabel: 'ถึงวันที่',
    presetAll: 'ทั้งหมด',
    preset7Days: '7 วันล่าสุด',
    preset30Days: '30 วันล่าสุด',
    clearDateBtn: 'ล้างวันที่',
    matchedCountFmt: (m, t) => `แสดงและส่งออก ${m} / ${t} รายการ`,
    exportPeriodFmt: (from, to) =>
      !from && !to
        ? 'ทุกช่วงเวลา'
        : `${from || '...'} → ${to || '...'}`,
  },
  hi: {
    dateFilterLabel: 'चर्चा और निर्यात अवधि:',
    fromDateLabel: 'प्रारंभ तिथि',
    toDateLabel: 'अंतिम तिथि',
    presetAll: 'सभी समय',
    preset7Days: 'पिछले 7 दिन',
    preset30Days: 'पिछले 30 दिन',
    clearDateBtn: 'तिथि रीसेट',
    matchedCountFmt: (m, t) => `${m} / ${t} चर्चाएं प्रदर्शित व निर्यात`,
    exportPeriodFmt: (from, to) =>
      !from && !to
        ? 'सभी समय'
        : `${from || '...'} → ${to || '...'}`,
  },
  de: {
    dateFilterLabel: 'Zeitraum (Anzeige & Export):',
    fromDateLabel: 'Von',
    toDateLabel: 'Bis',
    presetAll: 'Gesamt',
    preset7Days: '7 Tage',
    preset30Days: '30 Tage',
    clearDateBtn: 'Zurücksetzen',
    matchedCountFmt: (m, t) => `${m} / ${t} Einträge angezeigt & exportiert`,
    exportPeriodFmt: (from, to) =>
      !from && !to
        ? 'Gesamter Zeitraum'
        : `${from || '...'} → ${to || '...'}`,
  },
  fr: {
    dateFilterLabel: 'Période (Affichage & Export) :',
    fromDateLabel: 'Du',
    toDateLabel: 'Au',
    presetAll: 'Tout',
    preset7Days: '7 jours',
    preset30Days: '30 jours',
    clearDateBtn: 'Réinitialiser',
    matchedCountFmt: (m, t) => `${m} / ${t} sujets affichés et exportés`,
    exportPeriodFmt: (from, to) =>
      !from && !to
        ? 'Toute la période'
        : `${from || '...'} → ${to || '...'}`,
  },
  es: {
    dateFilterLabel: 'Período (Vista y Exportación):',
    fromDateLabel: 'Desde',
    toDateLabel: 'Hasta',
    presetAll: 'Todo',
    preset7Days: '7 días',
    preset30Days: '30 días',
    clearDateBtn: 'Restablecer',
    matchedCountFmt: (m, t) => `Mostrando y exportando ${m} / ${t} temas`,
    exportPeriodFmt: (from, to) =>
      !from && !to
        ? 'Todo el período'
        : `${from || '...'} → ${to || '...'}`,
  },
};

export function getTab5DateFilterLabels(
  lang?: LanguageCode
): Tab5DateFilterLabels {
  return DATE_FILTER_LABELS_MAP[lang || 'vi'] || DATE_FILTER_LABELS_MAP.vi;
}

const TAB5_MAP: Record<LanguageCode, Tab5Localization> = {
  vi: VI_TAB5,
  'en-US': EN_TAB5,
  'en-GB': EN_TAB5,
  zh: ZH_TAB5,
  ja: JA_TAB5,
  ko: KO_TAB5,
  ru: RU_TAB5,
  th: TH_TAB5,
  hi: HI_TAB5,
  de: DE_TAB5,
  fr: FR_TAB5,
  es: ES_TAB5,
};

function formatRelativeSampleTimestamp(daysAgo: number, timeStr: string): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${timeStr}`;
}

export function getTab5Translation(lang?: LanguageCode): Tab5Localization {
  const base = TAB5_MAP[lang || 'vi'] || VI_TAB5;
  // Distribute sample thread dates across Last 7 Days (2d, 5d), Last 30 Days (16d), and Older (42d)
  const dayOffsets = [2, 5, 16, 42];
  const times = ['09:30', '14:10', '08:45', '15:20'];
  const replyTimes = ['10:15', '16:40'];

  return {
    ...base,
    tab5Full: base.tab5Full.replace(/^Tab\s*5\s*:\s*/i, ''),
    sampleThreads: base.sampleThreads.map((thread, idx) => {
      const daysAgo = dayOffsets[idx] ?? 3;
      const createdAt = formatRelativeSampleTimestamp(
        daysAgo,
        times[idx] || '10:00'
      );
      return {
        ...thread,
        createdAt,
        replies: thread.replies.map((rep, rIdx) => ({
          ...rep,
          createdAt: formatRelativeSampleTimestamp(
            Math.max(0, daysAgo - (rIdx === 0 ? 0 : 1)),
            replyTimes[rIdx] || '11:30'
          ),
        })),
      };
    }),
  };
}

