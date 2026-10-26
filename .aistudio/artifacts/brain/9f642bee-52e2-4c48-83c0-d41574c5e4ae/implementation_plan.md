# Tối ưu Thanh Điều hướng & Xuất Nhật ký Thảo luận Theo Khoảng Thời gian (WeldCalc Pro)

Bản kế hoạch nâng cấp giao diện điều hướng tinh gọn (loại bỏ thanh tab phụ màu xám mang nhãn `Tab 1: .. Tab 5:`, chỉ sử dụng thanh điều hướng chính trên cùng) và bổ sung bộ lọc khoảng thời gian (**Từ ngày – Đến ngày** kèm nút chọn nhanh **7 ngày**, **30 ngày**, **Tất cả**) đồng bộ 12 ngôn ngữ để lọc trực tiếp danh sách thảo luận cũng như biên bản xuất Excel (`.xlsx`) / Text (`.txt`).

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Các quyết định thiết kế dưới đây đã được xác nhận theo lựa chọn của bạn:

- **Quyết định Đã Xác nhận 1 (Loại bỏ thanh tab màu xám `Tab 1: .. Tab 5:`)**: Xóa hoàn toàn thanh chuyển tab phụ màu xám (`Tab 1: ...` đến `Tab 5: ...`) bên dưới khung thông tin dự án; hợp nhất toàn bộ thao tác chuyển trang lên **Thanh điều hướng trên cùng (Top Navigation Bar)** với nhãn súc tích, không đánh số `Tab 1..5`, hiển thị đầy đủ trên cả màn hình máy tính và thiết bị nhỏ.
- **Quyết định Đã Xác nhận 2 (Lọc & Xuất Nhật ký Thảo luận theo Khoảng thời gian)**: Tích hợp thanh chọn **Từ ngày (`From`) – Đến ngày (`To`)** kết hợp 3 nút chọn nhanh (**7 ngày qua**, **30 ngày qua**, **Tất cả thời gian**) đồng bộ 12 ngôn ngữ. Khoảng thời gian đang chọn sẽ **lọc đồng thời danh sách thảo luận hiển thị trên màn hình và dữ liệu xuất ra file Excel (`.xlsx`) / Text (`.txt`)**, kèm ghi chú rõ kỳ báo cáo trong biên bản xuất.

---

## 1. Overview & Core Concept

- **What It Does**:
  1. **Tinh gọn hệ thống điều hướng**: Loại bỏ sự trùng lặp giữa thanh điều hướng trên cùng và thanh tab xám bên dưới, giúp không gian làm việc thoáng đãng, không bị tràn chữ hay cắt cụt nhãn `Tab 5: ...`.
  2. **Truy xuất & Xuất biên bản Q&A theo kỳ thời gian**: Cho phép kỹ sư, QA/QC và Chủ đầu tư tra cứu và trích xuất sổ nhật ký Nhận xét & Hỏi đáp kỹ thuật theo đúng giai đoạn thi công (ví dụ: 7 ngày nghiệm thu gần nhất, 30 ngày trong tháng, hoặc khoảng ngày tùy chỉnh).
- **Target Audience / Persona**: Kỹ sư Hàn, Giám sát QA/QC, Kỹ sư Dự toán và Quản lý Dự án đa quốc gia cần trích xuất biên bản giải trình kỹ thuật (Technical Query Log) theo tuần/tháng để trình ký nghiệm thu.
- **Key Value**: Giao diện chuẩn mực trên 1 hàng duy nhất và khả năng xuất báo cáo thảo luận chính xác theo từng mốc thời gian kiểm tra.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Chuyển đổi chức năng trên Top Navigation Bar**: Người dùng chuyển giữa 5 phân hệ (*Tính toán Mối hàn*, *Bảng Tổng hợp BOM*, *Phân tích Chi phí*, *Báo cáo & WPS*, *Nhận xét & Hỏi đáp*) ngay trên thanh Header cố định đầu trang mà không còn thanh tab xám thứ hai gây rối mắt.
  2. **Chọn nhanh hoặc tùy chỉnh Khoảng thời gian thảo luận**:
     - Bấm nút chọn nhanh **7 ngày**, **30 ngày**, hoặc **Tất cả** để tự động điền mốc `Từ ngày – Đến ngày`.
     - Hoặc chọn trực tiếp ngày bắt đầu và ngày kết thúc trên ô lịch (`date input`).
  3. **Kiểm tra danh sách & Xuất báo cáo theo kỳ**:
     - Danh sách thảo luận trên màn hình cập nhật tức thì theo khoảng ngày đã chọn (hiển thị số lượng bản ghi khớp điều kiện).
     - Khi bấm **Xuất Excel (`.xlsx`)** hoặc **Xuất TXT (`.txt`)**, hệ thống xuất đúng các thảo luận & phản hồi nằm trong khoảng thời gian đã lọc, đồng thời ghi rõ kỳ thời gian (`Từ ngày ... Đến ngày ...`) ở phần thông tin chung của báo cáo và tên file.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Industrial Precision Studio — bề mặt sáng (`bg-slate-50`, `bg-white`), đường viền mảnh `1px solid` (`border-slate-200`), điểm nhấn cam hồ quang (`#EA580C`) và xanh lục nghiệm thu (`#059669`).
  - *Typography & Hierarchy*: Toàn bộ ngày tháng (`YYYY-MM-DD`), bộ đếm bản ghi và điểm sao sử dụng `font-mono tabular-nums` để căn thẳng hàng tuyệt đối.
  - *Layout Integrity*: Thanh lọc thời gian được bố trí gọn trong thanh công cụ của mục Nhận xét & Hỏi đáp, kết hợp hài hòa với ô tìm kiếm từ khóa và danh mục.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Hợp nhất điều hướng duy nhất tại Top Header**
  - *Chosen Approach*: Loại bỏ thanh segmented tab bar màu xám trong vùng workspace và cho phép thanh `<nav>` trên Header hiển thị linh hoạt (hỗ trợ cuộn ngang mượt trên màn hình hẹp nếu cần) để dùng chung trên mọi kích thước màn hình.
  - *Why*: Tránh lặp lại 2 thanh điều hướng cùng chức năng và giải quyết triệt để hiện tượng nhãn `Tab 1: ... Tab 5:` quá dài bị cắt chữ như trong ảnh chụp màn hình.
- **Decision 2: Đồng bộ dữ liệu mẫu với mốc thời gian thực tế**
  - *Chosen Approach*: Cập nhật mốc thời gian của 4 luồng thảo luận mẫu bám sát thời gian hiện tại (trải đều trong 30 ngày gần nhất và 7 ngày gần nhất) để khi người dùng bấm thử các nút lọc nhanh **7 ngày** / **30 ngày** / **Tất cả**, kết quả lọc thay đổi trực quan và sinh động ngay lập tức.
  - *Why*: Giúp người dùng kiểm chứng ngay hiệu quả của bộ lọc 7 ngày / 30 ngày mà không gặp trạng thái trống do dữ liệu mẫu cố định ở ngày cũ.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:
```
┌────────────────────────────────────────────────────────────────────────────┐
│                           WeldCalc Pro (App.tsx)                           │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Top Navigation Bar (Single Unified Navigation — 12 Languages)        │  │
│  │ [WeldCalc Pro]  [Tính toán] [Bảng BOM] [Chi phí] [Báo cáo] [Hỏi đáp] │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│  *(Removed redundant gray Segmented Tab Bar: "Tab 1: ... Tab 5: ...")*     │
├──────────────────────┬─────────────────────────────────────────────────────┤
│   SidebarConfig      │            TabCommentsQA (Hỏi đáp & Nhận xét)       │
│  (12 Languages,      │  ┌───────────────────────────────────────────────┐  │
│   Project & Prices)  │  │ Toolbar: Search + Category + Status Filters   │  │
│                      │  │ Date Filter Bar (12 Languages):               │  │
│                      │  │  • Presets: [Tất cả] [7 ngày] [30 ngày]       │  │
│                      │  │  • Inputs : [Từ ngày YYYY-MM-DD] → [Đến ngày] │  │
│                      │  │  • Export : [Xuất Excel (.xlsx)] [Xuất TXT]   │  │
│                      │  └───────────────────────┬───────────────────────┘  │
│                      │                          ▼                          │
│                      │  ┌───────────────────────────────────────────────┐  │
│                      │  │ Filtered Threads (Matched by Date + Filters)  │  │
│                      │  │  ├─ On-screen Thread Cards & Replies          │  │
│                      │  │  └─ Period-scoped Excel (.xlsx) & TXT Export  │  │
│                      │  └───────────────────────────────────────────────┘  │
└──────────────────────┴─────────────────────────────────────────────────────┘
```

- **Data Model & State**:
  - `datePreset`: `'all' | '7d' | '30d' | 'custom'` — trạng thái chọn nhanh khoảng thời gian.
  - `dateFrom`: `string` (`YYYY-MM-DD` hoặc rỗng) — mốc ngày bắt đầu.
  - `dateTo`: `string` (`YYYY-MM-DD` hoặc rỗng) — mốc ngày kết thúc.
- **Interactive Component & State Mapping**:
  - Khi người dùng bấm **7 ngày** hoặc **30 ngày**, hệ thống tự động tính ngày hiện tại (`today`) và ngày lùi về trước 7 hoặc 30 ngày để cập nhật `dateFrom` và `dateTo`.
  - Khi người dùng chỉnh sửa trực tiếp ô `Từ ngày` hoặc `Đến ngày`, `datePreset` chuyển sang `'custom'` và lọc danh sách `filteredThreads` theo điều kiện `threadDate >= dateFrom && threadDate <= dateTo` (so sánh chuỗi chuẩn ISO `YYYY-MM-DD`).
  - Hàm `handleExportExcel` và `handleExportTxt` xuất trực tiếp từ tập `filteredThreads` (đã áp dụng bộ lọc khoảng thời gian), bổ sung dòng thông tin kỳ báo cáo (`Period: YYYY-MM-DD -> YYYY-MM-DD`) vào cả Sheet Excel và Header của file TXT.
