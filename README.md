# 🎖️ Developer Portfolio - Technical Soldier

Một dự án Portfolio cá nhân được thiết kế chuyên biệt theo phong cách **"Technical Soldier"** mạnh mẽ, kỷ luật và đậm chất kỹ thuật. Hệ thống sở hữu kiến trúc hiện đại, tích hợp sẵn Headless CMS để chủ nhân có thể quản lý, số hóa CV và danh mục dự án cá nhân một cách chuyên nghiệp nhất.

---

## 🚀 Công nghệ sử dụng

- **Frontend Core:** Next.js 15 (App Router, React Server Components)
- **Backend / CMS:** Payload CMS 3 (Tích hợp liền mạch vào Next.js)
- **Styling:** Tailwind CSS v4 (Sử dụng CSS Variables Native)
- **Database:** MongoDB
- **Theming:** Hệ thống Theme (Light/Dark mode) tự xây dựng không phụ thuộc thư viện bên ngoài.
- **Localization (i18n):** Hỗ trợ song ngữ Tiếng Việt & Tiếng Anh.

---

## ✨ Tính năng nổi bật

### 1. Cấu trúc Dữ liệu Chuẩn CV Giấy
Hệ thống Payload CMS được tái cấu trúc để mô phỏng hoàn hảo các thành phần của một bản CV truyền thống:
- `Profile` (Global): Tóm tắt mục tiêu nghề nghiệp.
- `Education` (Collection): Quản lý bằng cấp, GPA, chuyên ngành.
- `Skills` (Collection): Nhóm kỹ năng Chuyên môn, Ngoại ngữ và Khác.
- `Experience` (Collection): Kinh nghiệm làm việc (hỗ trợ nested array để liệt kê chi tiết từng dự án đã đóng góp trong công ty).
- `Projects` (Collection): Showcase dự án cá nhân với Tech Stack và Link Demo.

### 2. Giao diện Tactical UI/UX
- Lấy cảm hứng từ giao diện HUD, Radar quân sự và Terminal.
- Typography đặc trưng kết hợp giữa **Inter** (chuẩn mực) và **JetBrains Mono** (mã code).
- Họa tiết **Digital Camo** bằng Inline SVG động: Tự động đổi tone màu chìm (Blend) một cách mượt mà theo giao diện Sáng/Tối mà không làm giảm độ tương phản của chữ.

### 3. Đa ngôn ngữ (Bilingual)
- Routing Frontend linh hoạt nhận diện `/vi/` và `/en/`.
- CMS cho phép nhập liệu hai bản dịch độc lập (VI/EN) cho cùng một bài viết hoặc kỹ năng.

---

## 🛠️ Hướng dẫn cài đặt & Khởi chạy

### 1. Clone Source Code
```bash
git clone <repo-url>
cd ixxmmivsdrgn-portfolio
```

### 2. Cài đặt thư viện
```bash
npm install
```

### 3. Cấu hình Biến môi trường
Tạo file `.env` ở thư mục gốc của dự án và điền các thông số:
```env
# Chuỗi kết nối MongoDB (Local hoặc MongoDB Atlas)
DATABASE_URI=mongodb://127.0.0.1/portfolio-db

# Secret key cho Payload (chuỗi ngẫu nhiên bất kỳ)
PAYLOAD_SECRET=your-secret-key
```

### 4. Khởi chạy Server
```bash
npm run dev
```
- Truy cập Frontend: `http://localhost:3000` (Hệ thống sẽ tự động chuyển về `/vi`).
- Truy cập Admin Panel: `http://localhost:3000/admin`.

### 5. Cập nhật Typescript cho Payload (Nếu cần thiết)
Mỗi khi bạn tự code thêm hoặc thay đổi Schema trong thư mục `src/collections`, hãy chạy lệnh sau để sinh lại Type Definition:
```bash
npm run generate:types
```

---
**Designed & Developed with precision.**
