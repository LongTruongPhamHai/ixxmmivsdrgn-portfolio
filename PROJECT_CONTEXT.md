# PROJECT_CONTEXT.md

Context tổng hợp cho việc sinh prompt task cho agent. File này chứa các quyết định thiết kế, ràng buộc và quy ước mà KHÔNG thể tự suy ra bằng cách đọc code.

---

## Stack & Kiến trúc

**Core Stack:**
- Next.js 15+ (App Router, React Server Components)
- Payload CMS 3 (integrated native trong Next.js - KHÔNG phải headless riêng)
- MongoDB (Mongoose adapter)
- Tailwind CSS v4 (sử dụng CSS Variables thay vì JIT classes)
- TypeScript (strict mode)
- Localization: vi/en (custom implementation, không dùng next-intl)

**Testing:**
- Vitest (integration tests) - `npm run test:int`
- Playwright (e2e tests) - `npm run test:e2e`

**Kiến trúc quan trọng:**
- Payload chạy TRONG Next.js (cùng 1 deployment, cùng 1 process)
- Server Components fetch trực tiếp qua Local API của Payload (`payload.find()`) - KHÔNG qua REST API
- Middleware redirect root `/` → `/vi` (default locale)
- Static site generation (SSG) + ISR cho public pages

**Lý do chọn:**
- Payload native → giảm 1 deployment, không cần server riêng, Local API nhanh hơn HTTP
- MongoDB → linh hoạt schema, dễ thêm field mới
- CSS Variables → thay đổi theme tập trung, không rải rác trong component

---

## Cấu trúc thư mục

```
src/
├── app/
│   ├── (payload)/          # Payload admin routes (admin/, api/)
│   ├── [locale]/           # Public routes với i18n (vi, en)
│   │   ├── layout.tsx      # Root layout (navbar, footer, theme provider)
│   │   ├── page.tsx        # Homepage (fetch all collections)
│   │   └── ...
│   └── middleware.ts       # Redirect root to /vi
├── collections/            # Payload Collections (data schema)
│   ├── Projects.ts
│   ├── Skills.ts
│   ├── Experience.ts
│   ├── Posts.ts
│   ├── Education.ts
│   ├── Users.ts
│   └── Media.ts
├── globals/                # Payload Globals (singleton data)
│   └── Profile.ts
├── components/             # UI Components (Atomic Design)
│   ├── atoms/              # Button, StatusPill, etc.
│   ├── molecules/          # ProjectCard, ThemeToggle, LanguageSwitcher
│   ├── organisms/          # BackgroundPattern, Header, Footer, HeroSection, ContactSection, ProjectsSection, ExperienceSection, EducationSection, SkillsSection
│   └── providers/          # ThemeProvider
├── i18n/
│   └── dictionaries.ts     # Translation dictionaries (vi, en)
├── lib/
│   └── utils.ts            # cn() helper (clsx + tailwind-merge)
├── styles/
│   └── globals.css         # CSS variables, theme definitions
├── payload.config.ts       # Payload configuration
└── payload-types.ts        # Auto-generated types (DO NOT EDIT)
```

**Giải thích:**
- `app/(payload)`: Route group cho Payload admin UI + API routes
- `app/[locale]`: Dynamic segment cho i18n, render public site
- `collections/`: Define schema cho từng entity (Projects, Skills, etc.)
- `globals/`: Singleton data (Profile - chỉ có 1 instance)
- `components/`: Atomic Design (atoms → molecules → organisms)

---

## Module/Domain chính

### 1. Payload CMS Core
**Files:** `src/payload.config.ts`, `src/collections/*`, `src/globals/*`

**Vai trò:** Quản lý data schema và admin UI. Mọi nội dung đều qua Payload.

**Khi cần sửa:**
- Thêm collection mới → tạo file trong `collections/`, import vào `payload.config.ts`
- Thêm field vào collection → sửa file collection tương ứng, chạy `npm run generate:types`
- Thêm global → tạo file trong `globals/`, import vào config

**Collections hiện có:**
- `Projects` (slug: projects): Dự án cá nhân - có `slug`, `techStack` (relationship → skills), `links.repo/demo`, `coverImage`
- `Skills` (slug: skills): Kỹ năng - phân loại `category` (Technical/Language/Other), có `yearsOfUse`
- `Experience` (slug: experience): Kinh nghiệm - có nested array `projects[]` chứa dự án công ty
- `Posts` (slug: posts): Blog posts - có `slug`, `readingTime` (readonly)
- `Education` (slug: education): Học vấn - có `gpa`, `graduationType` (Excellent/Good/Fair/Average)
- `Users` (slug: users): Authentication
- `Media` (slug: media): File uploads

**Globals:**
- `Profile`: Singleton chứa `objective` (mục tiêu nghề nghiệp)

**Ràng buộc:**
- Tất cả collections public có `access: { read: () => true }` để anonymous đọc được
- Localization enabled: `locales: ['vi', 'en']`, `defaultLocale: 'vi'`
- KHÔNG được sửa `payload-types.ts` bằng tay - file auto-generated

### 2. i18n System
**Files:** `src/i18n/dictionaries.ts`, `src/middleware.ts`, `src/app/[locale]/*`

**Vai trò:** Hỗ trợ song ngữ vi/en. Không dùng thư viện bên ngoài.

**Cách hoạt động:**
- Middleware redirect `/` → `/vi`
- Layout nhận `params.locale` từ dynamic segment `[locale]`
- Components gọi `getDictionary(locale)` để lấy text tương ứng
- Payload fetch data với `locale: locale as any` để lấy bản dịch đúng

**Khi cần sửa:**
- Thêm translation → update `dictionaries.vi` và `dictionaries.en` trong `dictionaries.ts`
- Thêm locale mới → update `payload.config.ts` locales + middleware logic

**Ràng buộc:**
- Mọi text hiển thị phải qua dictionary, KHÔNG hardcode tiếng Việt/Anh trong JSX
- LanguageSwitcher component chuyển giữa `/vi/...` và `/en/...`

### 3. Theme System
**Files:** `src/styles/globals.css`, `src/components/providers/ThemeProvider.tsx`, `tailwind.config.ts`

**Vai trò:** Dark/Light mode dùng CSS variables, không dùng Tailwind JIT classes

**Cách hoạt động:**
- CSS variables define trong `globals.css` với `:root` (light) và `.dark` (dark)
- ThemeProvider wrap toàn bộ app, sử dụng `next-themes`
- ThemeToggle component toggle attribute `class="dark"` trên `<html>`
- Tailwind config map CSS variables: `bg-bg-primary` → `var(--bg-primary)`

**Khi cần sửa:**
- Đổi màu theme → sửa CSS variables trong `globals.css`
- Thêm màu mới → thêm variable trong CSS, map trong `tailwind.config.ts`

**Ràng buộc:**
- KHÔNG dùng `bg-white`, `text-black` trực tiếp → dùng `bg-bg-primary`, `text-text-primary`
- SVG camo background dùng `var(--color-bg-primary)` để theo theme

### 4. UI Components (Atomic Design)
**Files:** `src/components/atoms/*`, `src/components/molecules/*`

**Vai trò:** Tái sử dụng UI elements theo pattern Atomic Design

**Atoms:**
- `Button.tsx`: Base button với tactical style
- `StatusPill.tsx`: Status indicator (ACTIVE/COMPLETED/ARCHIVED)

**Molecules:**
- `ProjectCard.tsx`: Card hiển thị project trong grid, có corner brackets animation
- `ThemeToggle.tsx`: Toggle dark/light
- `LanguageSwitcher.tsx`: Toggle vi/en

**Organisms:**
- `BackgroundPattern.tsx`: SVG camo pattern + grid overlay (tĩnh, không props)
- `Header.tsx`: Navbar với desktop/mobile layout, scanline divider (nhận `locale` prop)
- `Footer.tsx`: Footer tĩnh với copyright (không props)
- `HeroSection.tsx`: Hero section với title, objective, personal info, CTA buttons
- `ContactSection.tsx`: CTA section với background pattern, contact info
- `ProjectsSection.tsx`: Grid layout projects (dùng ProjectCard molecule)
- `ExperienceSection.tsx`: Timeline của experience với date range
- `EducationSection.tsx`: Danh sách education với GPA và graduation type
- `SkillsSection.tsx`: Skills với 3 categories (Technical, Language, Other)

**Khi cần sửa:**
- Thêm component nhỏ → tạo trong `atoms/`
- Component kết hợp nhiều atoms → tạo trong `molecules/`
- Component phức tạp (sections) → tạo trong `organisms/`

**Quy ước:**
- Dùng `cn()` helper từ `lib/utils.ts` để merge className
- Props typing nghiêm ngặt, không dùng `any`
- Component nên nhận `className?` prop để override style

### 5. Public Pages (App Router)
**Files:** `src/app/[locale]/page.tsx`, `src/app/[locale]/layout.tsx`

**Vai trò:** Render public site với data từ Payload

**Cách fetch data:**
```typescript
const payload = await getPayload({ config: configPromise })
const projects = await payload.find({ 
  collection: 'projects', 
  locale: locale as any,
  sort: '-completionDate' 
})
```

**Khi cần sửa:**
- Thêm page mới → tạo folder trong `app/[locale]/`
- Fetch thêm collection → gọi `payload.find()` trong Server Component
- Thêm navigation → update `layout.tsx` navbar

**Ràng buộc:**
- Mọi page phải là Server Component (async function)
- KHÔNG fetch data qua REST API `/api/...` - dùng Local API
- Phải await `props.params` trước khi destructure (Next.js 15 async params)

---

## Quy ước code hiện tại

### Naming Conventions
- Collections: PascalCase file, camelCase slug (`Projects.ts`, slug: `'projects'`)
- Components: PascalCase file + export (`Button.tsx` → `export function Button()`)
- Variables: camelCase, descriptive (`projectsRes`, `technicalSkills`)
- Types: PascalCase interface/type (`ProjectCardProps`)

### Code Style
- TypeScript strict mode enabled
- ESLint + Prettier configured
- Import alias: `@/*` → `./src/*`, `@payload-config` → `./src/payload.config.ts`
- Async/await preferred over `.then()`
- Functional components only (no class components)

### Payload Conventions
- Field names: camelCase (`completionDate`, `techStack`)
- Labels: Vietnamese (vì admin UI chủ yếu dùng tiếng Việt)
- Access control: `read: () => true` cho public collections
- Sort: use `-` prefix for descending (`sort: '-startDate'`)

### UI/UX Conventions
- Font: Inter (sans) cho body text, JetBrains Mono (mono) cho labels/code
- Spacing: base unit 4px, section padding `py-24` (desktop) / `py-16` (mobile)
- Colors: dùng semantic tokens (`text-text-primary`, `bg-bg-secondary`)
- Animation: `transition-colors`, `transition-all` - smooth, không quá nhanh

### Design Theme: "Technical Soldier"
**QUAN TRỌNG - Aesthetic cốt lõi của project:**
- Phong cách: quân đội kỹ thuật (tactical), KHÔNG phải hacker/terminal tối màu
- Màu chủ đạo: olive/lime green (military) trên nền SÁNG (beige/light gray)
- Typography: sans-serif làm chủ, mono chỉ dùng cho labels/status (KHÔNG phải toàn terminal)
- Visual language: clean, disciplined, grid-based, nhiều whitespace
- Micro-details: corner brackets `[ ]`, scanline dividers, status pills, tactical decorations
- Background: digital camo SVG pattern (blend with theme), subtle grid overlay

**TRÁNH:**
- Đen kịt như terminal/hacker theme
- Neon colors quá chói
- Text toàn bộ là monospace
- Hiệu ứng typing/glitch quá nhiều

---

## Lưu ý khi sinh prompt task

### 1. Vùng nhạy cảm cần SCOPE kỹ
- **`payload.config.ts`**: Nếu task chỉ cần thêm field vào collection → KHÔNG sửa config, chỉ sửa file collection
- **`payload-types.ts`**: KHÔNG BAO GIỜ sửa trực tiếp, luôn chạy `npm run generate:types`
- **`middleware.ts`**: Đụng tới routing logic → cần test kỹ các edge cases
- **`globals.css`**: Sửa CSS variables → phải test cả light & dark mode

### 2. Nguyên tắc mở rộng (từ design-document.md)
- **Content as Data**: Không hardcode content trong component → lưu vào Payload
- **Progressive Extensibility**: Thêm tính năng = thêm collection/field MỚI, KHÔNG refactor collection cũ
- **Additive approach**: Thêm optional field, không đổi required field của collection đã có data
- **Convention over Configuration**: Follow pattern hiện tại, không tạo pattern mới trừ khi cần thiết

### 3. Workflow chuẩn khi thêm tính năng mới

**Thêm data model mới:**
1. Tạo file collection trong `src/collections/[Name].ts`
2. Define CollectionConfig với fields, access control
3. Import vào `payload.config.ts` → thêm vào array `collections`
4. Chạy `npm run generate:types`
5. Tạo UI component để hiển thị data
6. Fetch data trong Server Component qua `payload.find()`

**Thêm field vào collection có sẵn:**
1. Sửa file collection (ví dụ `Projects.ts`)
2. Thêm field definition (set `required: false` nếu data cũ không có field này)
3. Chạy `npm run generate:types`
4. Update UI component để hiển thị field mới
5. Update i18n dictionaries nếu field có label hiển thị

**Thêm page mới:**
1. Tạo folder trong `src/app/[locale]/[page-name]/`
2. Tạo `page.tsx` (Server Component)
3. Fetch data qua Payload Local API
4. Render với components có sẵn hoặc tạo mới
5. Update navbar trong `layout.tsx`

### 4. Những chỗ hay bug/cần cẩn thận
- **Async params trong Next.js 15**: Phải `await props.params` trước khi destructure
- **Locale typing**: Payload expect string literal `'vi' | 'en'`, phải cast `locale as any`
- **Image paths**: Payload media có path `/api/media/file/...`, config trong `next.config.ts`
- **Sort order**: Default là ascending, dùng `-` prefix cho descending
- **Relationship fields**: Khi fetch, nếu muốn populate relationship → dùng `depth: 1`

### 5. Testing requirements
- Integration tests: đặt trong `/tests`, dùng Vitest
- E2E tests: Playwright config tại `playwright.config.ts`
- Khi thêm feature critical (auth, payment) → BẮT BUỘC có test
- Run test trước khi commit: `npm run test`

### 6. Commands quan trọng
```bash
npm run dev              # Khởi động dev server (Next.js + Payload)
npm run build            # Build production
npm run generate:types   # Regenerate payload-types.ts (SAU KHI sửa schema)
npm run test             # Run all tests
npm run test:int         # Integration tests only
npm run test:e2e         # E2E tests only
```

### 7. Environment variables
```env
DATABASE_URI=mongodb://...    # MongoDB connection string
PAYLOAD_SECRET=...            # Payload secret key (bất kỳ string nào)
```

**Lưu ý:** `.env` KHÔNG commit vào git, có `.env.example` làm template

---

## Responsive Breakpoints

Dự án sử dụng **custom breakpoint** được thiết kế riêng, không dùng default Tailwind.

### Chuẩn Breakpoint

| Breakpoint | Min Width | Range | Thiết bị | Sử dụng |
|------------|-----------|-------|----------|---------|
| `(base)` | 0px | 320px - 425px | **Mobile** | Default styles, mobile-first |
| `tablet:` | 426px | 426px - 768px | **Tablet** | Ngưỡng chính mobile ↔ tablet |
| `laptop:` | 769px | 769px - 1024px | **Small Laptop** | Ngưỡng laptop nhỏ |
| `laptop-lg:` | 1025px | ≥ 1025px | **Big Laptop** | Desktop lớn, màn rộng |

### Quy ước Sử dụng

**1. Thiết bị chính (Core Devices):**
- **Mobile**: `320px - 425px` (base, không cần prefix)
- **Tablet**: `426px - 768px` (từ `tablet:` đến dưới `laptop:`)
- **Small Laptop**: `769px - 1024px` (từ `laptop:` đến dưới `laptop-lg:`)
- **Big Laptop**: `≥ 1025px` (từ `laptop-lg:` trở lên)

**2. Mobile-First Approach:**
```tsx
// ✅ ĐÚNG: Base = mobile, override lên tablet/laptop
<div className="text-sm tablet:text-base laptop:text-lg">
<div className="grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3">
<nav className="hidden tablet:flex"> {/* Ẩn mobile, hiện tablet+ */}
<button className="tablet:hidden"> {/* Hiện mobile, ẩn tablet+ */}

// ❌ SAI: Không viết desktop-first
<div className="text-lg laptop:text-sm"> {/* Confusing, tránh */}
```

**3. Pattern Chuẩn:**

**Navigation:**
```tsx
{/* Mobile menu: < tablet */}
<MobileNav className="tablet:hidden" />

{/* Desktop nav: >= tablet */}
<nav className="hidden tablet:flex">
```

**Grid Layouts:**
```tsx
{/* 1 col mobile, 2 cols tablet, 3 cols laptop */}
<div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3">

{/* Full width mobile, sidebar laptop */}
<div className="grid grid-cols-1 laptop:grid-cols-[1fr_300px]">
```

**Typography:**
```tsx
{/* Scale up font size theo screen */}
<h1 className="text-4xl tablet:text-6xl laptop:text-8xl">
<p className="text-sm tablet:text-base laptop:text-lg">
```

**Spacing & Layout:**
```tsx
{/* Increase spacing trên màn lớn */}
<div className="gap-4 tablet:gap-6 laptop:gap-8">
<div className="px-4 tablet:px-6 laptop:px-8">

{/* Flex direction change */}
<div className="flex-col tablet:flex-row">
```

**4. Breakpoint Priority:**
- **`tablet:` (426px)**: Ngưỡng quan trọng nhất, phân biệt mobile vs tablet
- **`laptop:` (769px)**: Ngưỡng phụ, layout laptop nhỏ
- **`laptop-lg:` (1025px)**: Tối ưu màn rộng, ít dùng hơn

**5. Testing Checklist:**
Khi implement responsive, test ở 4 breakpoint:
- [ ] **375px** (iPhone SE) - Mobile
- [ ] **600px** - Tablet nhỏ, ngưỡng `tablet:` (426px)
- [ ] **900px** - Laptop nhỏ, ngưỡng `laptop:` (769px)
- [ ] **1200px** - Big laptop, ngưỡng `laptop-lg:` (1025px)

**6. Component-Specific Patterns:**

**Navbar (layout.tsx):**
- Mobile (< tablet): Hamburger menu, controls inline
- Tablet+ (>= tablet): Full nav, controls separate

**Hero Section (page.tsx):**
- Mobile (< laptop): Single column, no photo
- Laptop+ (>= laptop): 2 columns (3:2 ratio), photo visible

**Project Grid:**
- Mobile: 1 column
- Tablet (>= tablet): 2 columns
- Laptop (>= laptop): 3 columns

---

## Điểm đặc biệt của project này

1. **Payload 3 native integration**: Không phải headless CMS riêng, chạy trong Next.js → các task liên quan deploy phải deploy 1 lần duy nhất
2. **Custom i18n**: Không dùng next-intl hay react-intl → khi cần thêm translation phải update dictionaries.ts manually
3. **Theme qua CSS Variables**: Không dùng Tailwind dark: prefix → phải define trong globals.css
4. **Design philosophy rất cụ thể**: "Technical Soldier" không phải dark theme → các task UI phải tuân thủ aesthetic này
5. **Server Components first**: Fetch data ở server, không dùng useEffect/client fetching trừ khi cần interactivity
6. **MongoDB flexible schema**: Dễ thêm field, nhưng cần cẩn thận với optional vs required để tránh break data cũ
7. **Responsive Design**: Mobile-first với 3 custom breakpoint `tablet:` (426px), `laptop:` (769px), `laptop-lg:` (1025px) → xem mục "Responsive Breakpoints"

---

**File version:** 1.1  
**Last updated:** 2026-09-05  
**Maintained by:** Project owner
