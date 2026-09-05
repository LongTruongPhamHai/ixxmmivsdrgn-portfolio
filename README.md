# 🎖️ Developer Portfolio - Technical Soldier

Portfolio cá nhân theo phong cách **Technical Soldier**, xây dựng với Next.js và Payload CMS. Ứng dụng trình bày hồ sơ, kinh nghiệm, kỹ năng và dự án qua giao diện song ngữ Việt/Anh; nội dung được quản lý tập trung trong Payload Admin.

## Công nghệ

- **Frontend:** Next.js 16, App Router, React Server Components, TypeScript
- **CMS:** Payload CMS 3, tích hợp trực tiếp trong Next.js
- **Database:** MongoDB thông qua Payload MongoDB adapter
- **Styling:** Tailwind CSS 4 và CSS Variables
- **UI:** Tactical UI với theme sáng/tối, Lucide React và responsive layout
- **Localization:** Tiếng Việt (`/vi`) và Tiếng Anh (`/en`)
- **Testing:** Vitest cho integration test, Playwright cho end-to-end test

## Tính năng

- Quản lý hồ sơ cá nhân qua `Profile` global.
- Quản lý học vấn, kỹ năng, kinh nghiệm, bài viết, media và dự án qua Payload CMS.
- Dự án hỗ trợ tech stack, ảnh cover và liên kết repository/demo.
- Kinh nghiệm hỗ trợ danh sách dự án đã tham gia trong từng công ty.
- Trang public dùng Local API của Payload để lấy dữ liệu theo locale.
- Root path `/` tự chuyển đến locale mặc định `/vi`.

## Yêu cầu

- Node.js `18.20.2+` hoặc `20.9+`
- pnpm `9+` (khuyến nghị) hoặc npm
- MongoDB local hoặc MongoDB Atlas

## Cài đặt local

### 1. Cài dependencies

```bash
git clone <repo-url>
cd ixxmmivsdrgn-portfolio
pnpm install
```

Có thể thay `pnpm` bằng `npm` trong các lệnh tương ứng nếu cần.

### 2. Cấu hình môi trường

Tạo file `.env` ở thư mục gốc:

```env
# MongoDB local hoặc MongoDB Atlas
DATABASE_URL=mongodb://127.0.0.1:27017/portfolio-db

# Secret ngẫu nhiên dùng để mã hóa session/token của Payload
PAYLOAD_SECRET=replace-with-a-long-random-secret
```

Ứng dụng đọc biến `DATABASE_URL`; `DATABASE_URI` không được sử dụng.

### 3. Chạy development server

```bash
pnpm dev
```

- Website: <http://localhost:3000/vi>
- Payload Admin: <http://localhost:3000/admin>

Ở lần đầu truy cập Admin, tạo tài khoản người dùng quản trị theo form của Payload.

## Chạy bằng Docker Compose

Docker Compose khởi động cả MongoDB và development server:

```bash
docker compose up
```

Khi chạy trong Docker, dùng hostname `mongo` trong `.env`:

```env
DATABASE_URL=mongodb://mongo:27017/portfolio-db
PAYLOAD_SECRET=replace-with-a-long-random-secret
```

Dừng và xóa container:

```bash
docker compose down
```

Dữ liệu MongoDB được lưu trong Docker volume `data`.

## Các lệnh thường dùng

| Lệnh | Mục đích |
| --- | --- |
| `pnpm dev` | Chạy development server |
| `pnpm devsafe` | Xóa `.next` rồi chạy development server |
| `pnpm build` | Build production |
| `pnpm start` | Chạy bản production đã build |
| `pnpm lint` | Kiểm tra ESLint |
| `pnpm generate:types` | Sinh lại `src/payload-types.ts` |
| `pnpm generate:importmap` | Sinh lại Payload import map |
| `pnpm test:int` | Chạy integration tests bằng Vitest |
| `pnpm test:e2e` | Chạy end-to-end tests bằng Playwright |
| `pnpm test` | Chạy toàn bộ test |

Sau khi thay đổi schema trong `src/collections` hoặc `src/globals`, chạy `pnpm generate:types`. Không chỉnh sửa thủ công file `src/payload-types.ts`.

## Cấu trúc chính

```text
src/
├── app/(payload)/       # Admin UI và API của Payload
├── app/[locale]/        # Website public theo locale
├── collections/         # Schema Projects, Skills, Experience, Posts...
├── globals/             # Global Profile
├── components/          # UI theo Atomic Design
├── i18n/                # Dictionary vi/en
├── styles/              # CSS variables và theme
└── payload.config.ts    # Cấu hình Payload CMS
```

## Kiểm thử

Integration tests cần MongoDB và các biến môi trường trong `.env`. E2E tests sử dụng Playwright theo cấu hình trong `playwright.config.ts`.

```bash
pnpm test:int
pnpm test:e2e
```

---

**Designed & Developed with precision.**
