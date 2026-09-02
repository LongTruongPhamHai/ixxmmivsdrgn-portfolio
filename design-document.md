# Tài Liệu Thiết Kế Hệ Thống — Developer Portfolio

**Codename:** `OPS-PORTFOLIO`
**Phiên bản:** 1.0
**Stack:** Next.js (App Router) + PayloadCMS 3 + TailwindCSS + MongoDB
**Phong cách:** Technical / Tactical — gọn gàng, kỷ luật, công nghệ, trẻ trung

---

## 1. Tổng quan & Triết lý thiết kế

### 1.1 Mục tiêu
Xây dựng một portfolio không phải là "trang tĩnh" mà là một **hệ thống** — nơi nội dung (dự án, kỹ năng, bài viết) được quản lý qua CMS, tách biệt hoàn toàn khỏi trình bày (presentation), để có thể mở rộng theo thời gian mà không cần viết lại code.

### 1.2 Nguyên tắc cốt lõi
| Nguyên tắc | Ý nghĩa |
|---|---|
| **Content as Data** | Mọi nội dung hiển thị đều đến từ Payload Collections, không hardcode trong component |
| **Composable UI** | Giao diện dựng từ khối (blocks) có thể tái sắp xếp, không phải trang cứng |
| **Single Source of Truth** | MongoDB qua Payload là nguồn dữ liệu duy nhất — kể cả CV, social links, meta SEO |
| **Progressive Extensibility** | Thêm tính năng mới = thêm Collection/Block mới, không sửa core |
| **Convention over Configuration** | Đặt tên, cấu trúc thư mục nhất quán để dễ mở rộng bởi chính bạn 6 tháng sau |

### 1.3 Định hướng thẩm mỹ — "Technical Soldier"
Ý tưởng: một người lính kỹ thuật — kỷ luật, chính xác, gọn gàng ngăn nắp, mang màu sắc **quân phục xanh olive/camo**, không phải hacker/terminal tối màu. Ẩn dụ thị giác:

- **Bố cục:** nền **sáng** (be/xám nhạt ngả xanh), dạng lưới (grid) rõ ràng, nhiều khoảng trắng (whitespace) để tạo cảm giác ngăn nắp, kỷ luật — không dày đặc, không "đen kịt"
- **Ngôn ngữ chữ:** sans-serif hiện đại, sạch sẽ làm chủ đạo cho toàn bộ nội dung; monospace chỉ dùng **tiết chế** cho nhãn nhỏ (status, ngày, số thứ tự) — không phủ toàn trang như terminal
- **Màu sắc:** tông xanh olive/xanh lục quân đội làm màu chủ đạo trên nền sáng — giống áo lính, bản đồ tác chiến giấy, không phải đèn neon cảnh báo
- **Micro-copy:** dùng thuật ngữ quân sự/kỹ thuật **nhẹ nhàng, tinh tế** — `MISSION LOG` thay vì "Projects", `STATUS: ACTIVE` — nhưng trình bày như nhãn/tag gọn gàng, không phải dòng lệnh terminal
- **Chi tiết:** đường kẻ mảnh, khối màu phẳng (flat color block) kiểu huy hiệu/patch quân phục, bo góc nhẹ vừa đủ hiện đại — tránh corner bracket `[ ]` và hiệu ứng nhấp nháy con trỏ vì tạo cảm giác hacker

---

## 2. Kiến trúc tổng thể (System Architecture)

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                      │
│              Next.js App Router (RSC + SSG/ISR)            │
└───────────────────────┬────────────────────────────────────┘
                         │ fetch (REST/Local API)
┌───────────────────────▼────────────────────────────────────┐
│                  PAYLOAD CMS (Next.js custom server)         │
│   Admin UI  │  Access Control  │  Hooks  │  REST/GraphQL API │
└───────────────────────┬────────────────────────────────────┘
                         │ Mongoose Adapter
┌───────────────────────▼────────────────────────────────────┐
│                        MongoDB Atlas                         │
│     Collections: Projects, Skills, Experience, Posts...      │
└───────────────────────────────────────────────────────────┘
```

**Lý do chọn kiến trúc này:**
- Payload 3 chạy **native trong Next.js** (cùng một app, cùng một deployment) → không cần server riêng, giảm độ phức tạp vận hành
- Server Components fetch trực tiếp qua Local API của Payload (`payload.find()`) — nhanh hơn REST vì bỏ qua HTTP round-trip
- MongoDB linh hoạt về schema → phù hợp khi bạn liên tục thêm field mới cho từng "chiến dịch" (dự án)

---

## 3. Cấu trúc thư mục (Folder Structure)

```
portfolio/
├── src/
│   ├── app/
│   │   ├── (frontend)/              # Route group cho site công khai
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Trang chủ
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx          # Danh sách dự án
│   │   │   │   └── [slug]/page.tsx   # Chi tiết dự án
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── about/page.tsx
│   │   │   └── (api)/                # API routes riêng của frontend nếu cần
│   │   └── (payload)/                # Route group Payload tự sinh (admin, api)
│   │       ├── admin/[[...segments]]/page.tsx
│   │       └── api/[...slug]/route.ts
│   │
│   ├── collections/                  # ĐỊNH NGHĨA DỮ LIỆU — trái tim hệ thống
│   │   ├── Projects.ts
│   │   ├── Skills.ts
│   │   ├── Experience.ts
│   │   ├── Posts.ts
│   │   ├── Media.ts
│   │   └── Users.ts
│   │
│   ├── blocks/                       # Content blocks tái sử dụng (Payload Blocks field)
│   │   ├── Hero/
│   │   ├── ProjectGrid/
│   │   ├── SkillMatrix/
│   │   ├── Timeline/
│   │   └── CTASection/
│   │
│   ├── components/                   # UI components (Atomic Design)
│   │   ├── atoms/                    # Button, Badge, Tag, Divider...
│   │   ├── molecules/                # ProjectCard, SkillBar, StatusPill...
│   │   ├── organisms/                # Navbar, Footer, ProjectList...
│   │   └── templates/                # Page-level layout wrappers
│   │
│   ├── lib/
│   │   ├── payload/                  # getPayload(), helper query
│   │   └── utils/                    # cn(), formatDate(), slugify()
│   │
│   ├── styles/
│   │   └── globals.css               # Tailwind layers + design tokens (CSS vars)
│   │
│   └── payload.config.ts             # Config trung tâm — nơi "khai báo hệ thống"
│
├── public/
├── tailwind.config.ts
└── package.json
```

> **Quy tắc mở rộng:** Mỗi tính năng mới đi theo bộ ba `Collection → Block (nếu cần render động) → Component`. Không viết component đọc thẳng dữ liệu cứng.

---

## 4. Mô hình dữ liệu (Data Model / Payload Collections)

### 4.1 `Projects`
| Field | Type | Ghi chú |
|---|---|---|
| `title` | text | Tên dự án |
| `slug` | text (unique, auto) | Dùng cho URL |
| `status` | select: `ACTIVE / COMPLETED / ARCHIVED` | Theo tinh thần "mission status" |
| `codeName` | text | Ví dụ "OP-ALPHA" — chi tiết theme |
| `summary` | textarea | Mô tả ngắn cho card |
| `content` | richText (lexical) | Nội dung chi tiết |
| `techStack` | relationship → `Skills` (many) | Liên kết tới bảng kỹ năng |
| `coverImage` | upload → `Media` | |
| `gallery` | array of upload | |
| `links` | group `{ repo, demo, caseStudy }` | |
| `year` | number | |
| `featured` | checkbox | Ưu tiên hiển thị trang chủ |
| `order` | number | Sắp xếp thủ công |

### 4.2 `Skills`
| Field | Type | Ghi chú |
|---|---|---|
| `name` | text | |
| `category` | select: `Language / Framework / Infra / Tool` | |
| `rank` | select: `RECRUIT / OPERATIVE / SPECIALIST / VETERAN` | Ẩn dụ level thay vì % thô |
| `icon` | upload hoặc text (icon key) | |
| `yearsOfUse` | number | |

### 4.3 `Experience`
| Field | Type | Ghi chú |
|---|---|---|
| `role` | text | |
| `organization` | text | |
| `startDate` / `endDate` | date | |
| `description` | richText | |
| `type` | select: `FULL_TIME / FREELANCE / MISSION` (dự án ngắn hạn) | |

### 4.4 `Posts` (Blog kỹ thuật)
| Field | Type | Ghi chú |
|---|---|---|
| `title`, `slug`, `content` (lexical), `excerpt` | | |
| `tags` | relationship → self-managed taxonomy | |
| `publishedAt` | date | |
| `readingTime` | number (auto-tính qua hook) | |

### 4.5 `Media` & `Users`
Mặc định của Payload, mở rộng thêm field `alt` bắt buộc cho SEO/accessibility ở `Media`.

### 4.6 `Globals` (Payload Globals — cấu hình toàn site)
- `SiteSettings`: tên, tagline, social links, resume file, SEO mặc định
- `Navigation`: menu items (để đổi menu không cần deploy)

> **Điểm mở rộng quan trọng:** vì `techStack` là relationship tới `Skills`, khi bạn thêm công nghệ mới, nó tự động xuất hiện ở cả trang Skills và được gắn nhãn trong từng dự án — không cần sửa hai nơi.

---

## 5. Hệ thống thiết kế (Design System)

### 5.1 Design Tokens (CSS variables trong `globals.css`, map vào Tailwind config)

```css
:root {
  /* Nền — sáng, ngả xanh olive nhạt, cảm giác giấy bản đồ/canvas quân phục */
  --bg-primary: #F5F4EC;      /* be sáng, ấm */
  --bg-secondary: #ECEADC;    /* nền section xen kẽ */
  --bg-elevated: #FFFFFF;     /* card nổi trên nền */

  /* Chữ */
  --text-primary: #232619;    /* gần đen, ngả olive tối — không dùng đen thuần */
  --text-secondary: #5C6152;

  /* Màu chủ đạo — xanh olive/camo quân đội */
  --olive-900: #2E3421;       /* dùng cho heading nhấn mạnh, nav active */
  --olive-700: #4A5238;       /* màu chủ đạo — nút, badge, icon */
  --olive-500: #6B7454;       /* accent phụ, hover state */
  --khaki-300: #C7C2A6;       /* border, chip nền nhạt */

  /* Trạng thái (dùng tiết chế, không rực) */
  --status-active: #4A5A2E;   /* olive đậm */
  --status-done: #7A6A4A;     /* khaki nâu */
  --status-archived: #8A8A80; /* xám trung tính */

  /* Border / structure */
  --border-default: #D8D4C2;
  --border-active: var(--olive-700);

  /* Typography */
  --font-mono: 'JetBrains Mono', monospace;  /* chỉ dùng cho nhãn nhỏ, số liệu */
  --font-sans: 'Inter', sans-serif;           /* chủ đạo toàn site */
}
```

> Lưu ý khi áp dụng: nền tối (`--bg-primary` phiên bản dark) có thể để làm **dark mode tùy chọn**, nhưng mặc định site nên chạy nền sáng để đúng tinh thần "gọn gàng, ngăn nắp, hiện đại" thay vì hacker/terminal.

### 5.2 Typography Scale
| Cấp | Font | Size | Dùng cho |
|---|---|---|---|
| Display | sans, bold | 56–72px | Hero heading |
| H1–H3 | sans, semibold | 32/24/20px | Tiêu đề section |
| Body | sans, regular | 16px | Nội dung |
| Mono Label | mono, medium, uppercase, letter-spacing wide | 12–13px | Nhãn kỹ thuật, timestamp, status |
| Mono Data | mono, regular | 14px | Số liệu, tech stack tag |

### 5.3 Component Patterns đặc trưng theme
- **Status Pill:** `[● ACTIVE]` — chấm màu + text mono uppercase, border 1px
- **Corner Bracket Card:** card có 4 góc dạng `⌐ ¬ L ⌐` xuất hiện khi hover, gợi khung ngắm
- **Index Counter:** mỗi project card có số thứ tự dạng `N° 003` góc trên
- **Divider dạng scanline:** đường kẻ mảnh có gradient để trông như radar sweep
- **Terminal-style CTA:** nút bấm có prefix `>` và con trỏ nhấp nháy khi hover

### 5.4 Spacing & Grid
- Base unit: `4px`, dùng thang Tailwind mặc định
- Layout chính: 12-column grid, `max-width: 1280px`
- Section rhythm nhất quán: `py-24` desktop / `py-16` mobile

---

## 6. Kiến trúc Component (Atomic Design)

```
atoms/       → Button, Tag, StatusDot, Divider, Icon
molecules/   → ProjectCard, SkillRankBar, TimelineItem, NavLink
organisms/   → Navbar, Footer, ProjectGrid, SkillMatrix, Hero
templates/   → PageShell (header/footer wrapper), ProjectDetailLayout
blocks/      → Payload Blocks map 1-1 sang organisms để dựng trang linh hoạt
```

**Luồng render trang động (ví dụ trang chủ dựng từ Blocks):**
```
payload.config.ts (Pages collection có field "layout": blocks[])
        ↓
Server Component đọc page.layout
        ↓
Map từng block.blockType → Component tương ứng (RenderBlocks.tsx)
        ↓
Hero, ProjectGrid, SkillMatrix... render theo thứ tự admin sắp xếp
```
→ Đây là chìa khóa **mở rộng không cần code**: sau này bạn có thể thêm section mới trên trang chủ chỉ bằng cách kéo-thả trong Payload Admin, miễn block đó đã được định nghĩa sẵn.

---

## 7. Lộ trình mở rộng (Extensibility Roadmap)

| Giai đoạn | Tính năng thêm | Việc cần làm |
|---|---|---|
| **Phase 1 (MVP)** | Home, Projects, About, Contact | Collections cơ bản + 3–4 blocks |
| **Phase 2** | Blog kỹ thuật | Thêm `Posts` collection, RSS route, reading-time hook |
| **Phase 3** | Đa ngôn ngữ (VI/EN) | Bật `localization` trong `payload.config.ts`, không đổi schema |
| **Phase 4** | Analytics + Comment | Thêm collection `Comments`, tích hợp Plausible/Umami |
| **Phase 5** | Case Study chuyên sâu | Thêm block `ProcessTimeline`, `BeforeAfter` cho từng dự án |
| **Phase 6** | Newsletter / RSS | Global `NewsletterSettings` + route `/api/subscribe` |

Nguyên tắc xuyên suốt: **mỗi phase là additive** — không refactor lại collection cũ, chỉ thêm field optional hoặc collection mới.

---

## 8. Hiệu năng, SEO & Vận hành

- **Rendering:** SSG cho trang tĩnh (About), ISR (`revalidate: 3600`) cho Projects/Blog để cập nhật không cần rebuild toàn bộ
- **SEO:** field `meta` (title, description, ogImage) ở mọi collection có thể publish công khai — dùng chung 1 SEO plugin của Payload
- **Ảnh:** Payload tự sinh nhiều size qua `imageSizes`, kết hợp `next/image`
- **Deploy đề xuất:** Vercel (Next.js) + MongoDB Atlas — cả admin và site chạy chung 1 deployment, giảm chi phí vận hành
- **Access Control:** chỉ `Users` với role `admin` được sửa nội dung; site công khai chỉ đọc (`read: () => true`, `create/update/delete: () => false` cho anonymous)

---

## 9. Tóm tắt quyết định thiết kế

| Quyết định | Lý do |
|---|---|
| Payload 3 nhúng trong Next.js thay vì headless riêng | Giảm 1 deployment, tận dụng Local API nhanh hơn REST |
| Dữ liệu tách khỏi component qua Collections + Blocks | Cho phép mở rộng nội dung/tính năng mà không sửa code core |
| Design token dạng CSS variables | Đổi theme (màu, font) tập trung 1 file, không rải rác trong component |
| Atomic Design cho component | Tái sử dụng cao, dễ onboard nếu sau này có người khác tham gia |
| Ẩn dụ "technical soldier" áp cả vào tên field (status, rank) | Đồng bộ ngôn ngữ thiết kế từ database đến UI |

---

*Tài liệu này là bản thiết kế sống — cập nhật khi hệ thống phát triển thêm collection/block mới.*