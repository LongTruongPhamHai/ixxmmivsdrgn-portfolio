# STATE.md - Project State Tracking

**Last Updated:** 2026-09-05  
**Current Phase:** Refactor complete

---

## Refactor Plan - Component Extraction

### Priority 1: TĨNH - Không phụ thuộc (✅ DONE)

#### 1. `BackgroundPattern` | organism ✅
- **File đích:** `src/components/organisms/BackgroundPattern.tsx`
- **Extract từ:** `layout.tsx` (dòng 33-74)
- **Mức độ phụ thuộc:** ⭐ Không phụ thuộc gì (SVG tĩnh)
- **Props:** Không cần props
- **Mô tả:** Camo pattern SVG + grid overlay
- **Lý do tách:** 40+ dòng SVG làm layout.tsx khó đọc
- **Status:** ✅ Completed - Extracted successfully

#### 2. `Footer` | organism ✅
- **File đích:** `src/components/organisms/Footer.tsx`
- **Extract từ:** `layout.tsx` (dòng 113-117)
- **Mức độ phụ thuộc:** ⭐ Chỉ cần year hiện tại (built-in JS)
- **Props:** Không cần props
- **Mô tả:** Footer tĩnh với copyright
- **Lý do tách:** Đơn giản, tách dễ, ít rủi ro
- **Status:** ✅ Completed - Extracted successfully

#### 3. `Header` | organism ✅
- **File đích:** `src/components/organisms/Header.tsx`
- **Extract từ:** `layout.tsx` (dòng 77-107)
- **Mức độ phụ thuộc:** ⭐⭐ Cần `locale` prop
- **Props:** `{ locale: string }`
- **Dependencies:** NavLinks, LanguageSwitcher, ThemeToggle, MobileNav (đã có)
- **Mô tả:** Navbar với desktop/mobile layout, scanline divider
- **Lý do tách:** 30+ dòng, logic responsive rõ ràng
- **Status:** ✅ Completed - Extracted successfully

---

### Priority 2: CÓ PROPS ĐƠN GIẢN (✅ DONE)

#### 4. `HeroSection` | organism ✅
- **File đích:** `src/components/organisms/HeroSection.tsx`
- **Extract từ:** `page.tsx` (dòng 38-68)
- **Mức độ phụ thuộc:** ⭐⭐ Props từ profile data + translations
- **Props:**
```tsx
{
  objective: string
  fullName: string | null
  dateOfBirth: string | null
  address: string | null
  translations: any
}
```
- **Dependencies:** `Button` (atom)
- **Mô tả:** Hero với title, objective, personal info, CTA buttons
- **Lý do tách:** Section lớn nhất (30+ dòng)
- **Status:** ✅ Completed - Extracted successfully

#### 5. `ContactSection` | organism ✅
- **File đích:** `src/components/organisms/ContactSection.tsx`
- **Extract từ:** `page.tsx` (dòng 227-255)
- **Mức độ phụ thuộc:** ⭐⭐ Props từ profile + translations
- **Props:**
```tsx
{
  phone: string | null
  email: string | null
  translations: any
}
```
- **Dependencies:** `Button` (atom)
- **Mô tả:** CTA section với background pattern, contact info
- **Lý do tách:** Self-contained, dễ reuse
- **Status:** ✅ Completed - Extracted successfully

---

### Priority 3: CÓ LOGIC PHỨC TẠP (Làm cuối)

#### 6. `ProjectsSection` | organism ✅
- **File đích:** `src/components/organisms/ProjectsSection.tsx`
- **Extract từ:** `page.tsx` (dòng 127-149)
- **Mức độ phụ thuộc:** ⭐⭐ Array data + translations
- **Props:** `{ projects: any[], translations: any }`
- **Dependencies:** `ProjectCard` (molecule, đã có)
- **Mô tả:** Grid layout projects
- **Lý do tách:** Logic đơn giản, chỉ map array
- **Status:** ✅ Completed - Extracted successfully

#### 7. `ExperienceSection` | organism ✅
- **File đích:** `src/components/organisms/ExperienceSection.tsx`
- **Extract từ:** `page.tsx` (dòng 70-125)
- **Mức độ phụ thuộc:** ⭐⭐⭐ Array data + date formatting
- **Props:** `{ experiences: any[], translations: any }`
- **Dependencies:** None
- **Mô tả:** Timeline của experience với date range
- **Lý do tách:** 50+ dòng, có thể tách thêm `ExperienceCard` molecule
- **Cân nhắc:** Có thể tách thêm molecule bên trong
- **Status:** ✅ Completed - Extracted successfully

#### 8. `EducationSection` | organism ✅
- **File đích:** `src/components/organisms/EducationSection.tsx`
- **Extract từ:** `page.tsx` (dòng 152-224, phần Education)
- **Mức độ phụ thuộc:** ⭐⭐ Array data
- **Props:** `{ educations: any[], translations: any }`
- **Dependencies:** None
- **Mô tả:** Danh sách education với GPA và graduation type
- **Lý do tách:** Tách từ EducationSkillsSection theo khuyến nghị
- **Status:** ✅ Completed - Extracted successfully

#### 9. `SkillsSection` | organism ✅
- **File đích:** `src/components/organisms/SkillsSection.tsx`
- **Extract từ:** `page.tsx` (dòng 152-224, phần Skills)
- **Mức độ phụ thuộc:** ⭐⭐⭐ 3 skill categories
- **Props:**
```tsx
{
  technicalSkills: any[]
  languageSkills: any[]
  otherSkills: any[]
  translations: any
}
```
- **Dependencies:** None
- **Mô tả:** Skills với 3 categories (Technical, Language, Other)
- **Lý do tách:** Tách từ EducationSkillsSection theo khuyến nghị
- **Cân nhắc:** Giữ nguyên layout bento/justified đã làm ở phase responsive
- **Status:** ✅ Completed - Extracted successfully

---

## Tóm tắt Thứ tự Ưu tiên

| # | Component | File | Phụ thuộc | Dòng | Ưu tiên | Lý do | Status |
|---|-----------|------|-----------|------|---------|-------|--------|
| 1 | `BackgroundPattern` | `layout.tsx` | ⭐ | ~40 | **CAO** | Tĩnh, 0 rủi ro | ✅ |
| 2 | `Footer` | `layout.tsx` | ⭐ | ~5 | **CAO** | Đơn giản nhất | ✅ |
| 3 | `Header` | `layout.tsx` | ⭐⭐ | ~30 | **CAO** | Molecules có sẵn | ✅ |
| 4 | `ContactSection` | `page.tsx` | ⭐⭐ | ~25 | **TB** | Self-contained | ✅ |
| 5 | `HeroSection` | `page.tsx` | ⭐⭐ | ~30 | **TB** | Props rõ ràng | ✅ |
| 6 | `ProjectsSection` | `page.tsx` | ⭐⭐ | ~20 | **TB** | Dùng ProjectCard | ✅ |
| 7 | `ExperienceSection` | `page.tsx` | ⭐⭐⭐ | ~50 | **THẤP** | Map phức tạp | ✅ |
| 8 | `EducationSection` | `page.tsx` | ⭐⭐ | ~30 | **THẤP** | Tách từ EducationSkillsSection | ✅ |
| 9 | `SkillsSection` | `page.tsx` | ⭐⭐⭐ | ~40 | **THẤP** | Tách từ EducationSkillsSection | ✅ |

---

## Recommendations

### Phase 1 (Ít rủi ro) ✅ COMPLETED
1. ✅ `BackgroundPattern` - 0 dependency
2. ✅ `Footer` - 0 dependency  
3. ✅ `Header` - 1 prop

**Kết quả:** `layout.tsx` giảm từ 123 dòng → 44 dòng ✅

### Phase 2 (Trung bình) ✅ COMPLETED
4. ✅ `ContactSection`
5. ✅ `HeroSection`
6. ✅ `ProjectsSection`

**Kết quả:** `page.tsx` giảm từ 258 dòng → 168 dòng ✅

### Phase 3 (Phức tạp) ✅ COMPLETED
7. ✅ `ExperienceSection` (có thể tách thêm `ExperienceCard` molecule)
8. ✅ `EducationSection` (tách từ EducationSkillsSection)
9. ✅ `SkillsSection` (tách từ EducationSkillsSection)

**Kết quả:** `page.tsx` còn 71 dòng (chỉ data fetching + render sections) ✅

---

## Notes

- **Atomic Design:** Tất cả sections → organisms (phức tạp, tự quản layout)
- **Server Components:** Không cần `'use client'`, vẫn là async components
- **i18n:** Pass translations từ parent, không import `getDictionary` trong organisms
- **Data fetching:** Giữ nguyên ở `page.tsx`, chỉ pass processed data xuống

## Final Results ✅

- **layout.tsx:** 123 dòng → 44 dòng (giảm 79 dòng / 64%)
- **page.tsx:** 258 dòng → 71 dòng (giảm 187 dòng / 72%)
- **Total organisms created:** 9 (BackgroundPattern, Footer, Header, HeroSection, ContactSection, ProjectsSection, ExperienceSection, EducationSection, SkillsSection)
- **Build status:** ✅ Successful
- **UI unchanged:** ✅ All layouts preserved

---

**Status:** ✅ Planning complete, ready for implementation

---

## Breakpoint Refactor Plan

**Generated:** 2026-09-05  
**Chuẩn tham chiếu:** `src/lib/breakpoints.ts` (Tailwind defaults: sm:640px, md:768px, lg:1024px, xl:1280px, 2xl:1536px)

### Tổng quan

Code hiện tại đang sử dụng **Tailwind defaults** (sm:/md:/lg:/xl:/2xl:) và đã **NHẤT QUÁN** với breakpoints.ts. Tuy nhiên, có thể cần xem xét lại semantic usage (md: cho layout vs typography) và một số inconsistency nhỏ.

### Danh sách File Sử Dụng Responsive Classes

#### 🟢 Layout & Organisms (Không cần sửa - Low Risk)

| File | Breakpoint hiện tại | Mục đích | Đánh giá | Mức rủi ro |
|------|-------------------|----------|----------|-----------|
| **Header.tsx** | `md:flex`, `md:hidden` | Show/hide desktop nav (≥768px) vs mobile menu (<768px) | ✅ Nhất quán, semantic đúng | 🟢 THẤP |
| **HeroSection.tsx** | `lg:grid-cols-5`, `lg:col-span-3`, `lg:col-span-2`, `lg:flex` | Hero 2-column layout (≥1024px), ẩn photo <1024px | ✅ Nhất quán, logic hợp lý | 🟢 THẤP |
| **HeroSection.tsx** | `md:text-8xl`, `md:text-xl` | Scale font size (base → md:) | ✅ Nhất quán | 🟢 THẤP |
| **ProjectsSection.tsx** | `md:grid-cols-2`, `lg:grid-cols-3` | Grid: 1 col mobile → 2 cols tablet → 3 cols laptop | ✅ Nhất quán, pattern chuẩn | 🟢 THẤP |
| **ContactSection.tsx** | `sm:flex-row` | Flex direction: col (mobile) → row (≥640px) | ⚠️ Duy nhất dùng `sm:`, cần xem xét | 🟡 TRUNG BÌNH |
| **page.tsx** | `lg:grid-cols-2` | Education/Skills grid 2 columns (≥1024px) | ✅ Nhất quán | 🟢 THẤP |
| **MobileNav.tsx** | `md:hidden` (3 vị trí) | Ẩn mobile menu ≥768px | ✅ Nhất quán với Header | 🟢 THẤP |

#### 🔵 Components Không Dùng Responsive Classes

**Organisms:** ExperienceSection, EducationSection, SkillsSection, Footer, BackgroundPattern  
**Molecules:** NavLinks, LanguageSwitcher, ThemeToggle, ProjectCard  
**Atoms:** Button, StatusPill, ScrollToTopButton

### Phân tích Nhất quán

#### ✅ Patterns Nhất quán (Không cần sửa)

1. **Navigation Pattern:**
   - `md:flex` / `md:hidden` cho desktop nav (Header)
   - `md:hidden` cho mobile menu (MobileNav)
   - **Breakpoint:** 768px (md:)
   - **Semantic:** Đúng - tablet+ là ngưỡng hợp lý cho nav full

2. **Grid Layout Pattern:**
   - 1 col mobile → `md:grid-cols-2` → `lg:grid-cols-3`
   - **Ví dụ:** ProjectsSection
   - **Breakpoint:** 768px (md:), 1024px (lg:)
   - **Semantic:** Đúng - progressive enhancement

3. **Hero Complex Layout:**
   - `lg:grid-cols-5`, `lg:col-span-*`, `lg:flex` (photo visible)
   - **Breakpoint:** 1024px (lg:)
   - **Semantic:** Đúng - layout phức tạp cần màn lớn

4. **Typography Scaling:**
   - `md:text-8xl`, `md:text-xl`
   - **Breakpoint:** 768px (md:)
   - **Semantic:** Đúng - scale up từ tablet

#### ⚠️ Inconsistencies / Điểm cần xem xét

1. **ContactSection.tsx - Line 21:**
   - **Current:** `sm:flex-row` (640px)
   - **Issue:** Duy nhất trong toàn project dùng `sm:`, các chỗ khác dùng `md:` cho tương tự
   - **Đề xuất:** Đổi sang `md:flex-row` để nhất quán với pattern chung (hoặc giữ nguyên nếu cố ý muốn responsive sớm hơn)
   - **Mức độ:** 🟡 Minor inconsistency

2. **Grid Pattern Variations:**
   - ProjectsSection: 1 → 2 (md) → 3 (lg) ✅
   - Education/Skills (page.tsx): 1 → 2 (lg) ⚠️ Bỏ qua md:
   - **Issue:** Education/Skills không có intermediate 2-col ở tablet như Projects
   - **Đề xuất:** Có thể thêm `md:grid-cols-2` vào page.tsx line 57 để nhất quán
   - **Mức độ:** 🟡 Pattern inconsistency

### Nhóm theo Khu vực

#### A. Layout (Header/Footer/Background)
- **Header.tsx** - 2 vị trí (`md:flex`, `md:hidden`)
- **Footer.tsx** - Không dùng responsive
- **BackgroundPattern.tsx** - Không dùng responsive
- **Trạng thái:** ✅ Nhất quán

#### B. Sections (Homepage Organisms)

**B1. HeroSection** - 6 vị trí: `lg:` (4), `md:` (2)
- **Mục đích:** Layout 2-col + typography scaling
- **Trạng thái:** ✅ Nhất quán

**B2. ExperienceSection** - Không dùng responsive classes
- **Note:** Có thể cần thêm responsive cho project cards trong future

**B3. ProjectsSection** - 2 vị trí: `md:grid-cols-2`, `lg:grid-cols-3`
- **Trạng thái:** ✅ Nhất quán, pattern chuẩn

**B4. Education/Skills Container (page.tsx)** - 1 vị trí: `lg:grid-cols-2`
- **Trạng thái:** ⚠️ Thiếu `md:grid-cols-2` intermediate step

**B5. ContactSection** - 1 vị trí: `sm:flex-row`
- **Trạng thái:** ⚠️ Dùng `sm:` thay vì `md:`

#### C. Molecules

**MobileNav.tsx** - 3 vị trí: `md:hidden`
- **Trạng thái:** ✅ Nhất quán với Header

**Các molecules khác:** Không dùng responsive

### Thứ tự Ưu tiên Refactor

#### Priority 1: MINOR FIXES - Rủi ro thấp ✅

**1.1. ContactSection.tsx** (Line 21)
```tsx
// CŨ: className="flex flex-col sm:flex-row gap-4 ..."
// MỚI: className="flex flex-col md:flex-row gap-4 ..."
```
- **Lý do:** Nhất quán với pattern `md:` trong toàn project
- **Rủi ro:** 🟢 Rất thấp - chỉ delay responsive từ 640px → 768px
- **Impact:** UI thay đổi nhỏ ở 640-767px range

#### Priority 2: PATTERN CONSISTENCY - Rủi ro thấp ⚠️

**2.1. page.tsx** (Line 57)
```tsx
// CŨ: className="grid grid-cols-1 lg:grid-cols-2 gap-16"
// MỚI: className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-16"
// HOẶC GIỮ NGUYÊN nếu cố ý muốn single-col ở tablet
```
- **Lý do:** Nhất quán với ProjectsSection pattern (1→2→3 cols)
- **Rủi ro:** 🟡 Thấp-Trung bình - thay đổi layout ở 768-1023px
- **Impact:** Education/Skills sẽ 2-col ở tablet thay vì 1-col
- **Cần xác nhận:** Có đủ không gian cho 2-col ở tablet không?

#### Priority 3: KHÔNG CẦN SỬA ✅

Tất cả các file khác đã nhất quán với breakpoints.ts và không có issue.

### Kết luận

**Tổng số file có responsive:** 7 files  
**File cần sửa:** 1-2 files (ContactSection bắt buộc, page.tsx tùy chọn)  
**Mức độ nhất quán:** 95% - Rất tốt  

**Khuyến nghị:**
1. ✅ Sửa ContactSection.tsx `sm:` → `md:` (bắt buộc để nhất quán)
2. ⚠️ Xem xét thêm `md:grid-cols-2` cho Education/Skills grid (tùy chọn, cần test UX)
3. ✅ Giữ nguyên tất cả breakpoint khác

**Breakpoints sử dụng:**
- `sm:` (640px) - 1 vị trí duy nhất (ContactSection - cần sửa)
- `md:` (768px) - 8 vị trí (Header, MobileNav, ProjectsSection, HeroSection typography)
- `lg:` (1024px) - 7 vị trí (HeroSection layout, ProjectsSection, page.tsx grid)
- `xl:` / `2xl:` - Không sử dụng

**Next Steps:**
1. Confirm với designer/owner về Priority 2 (Education/Skills grid)
2. Implement Priority 1 fix (ContactSection)
3. Test responsive ở 4 breakpoints: 375px, 640px, 768px, 1024px

---

**Last Updated:** 2026-09-05

---

## Fix plan

**Generated:** 2026-09-05  

## Đang làm (In Progress)
- [x] Task 1: Contact me href → scroll to Contact section ✅ (2026-09-05)
- [x] Task 2: i18n + theme toggle → floating button (làm trước Task 4) ✅ (2026-09-05)
- [x] Task 3: Header tăng chiều cao + shrink khi scroll (phụ thuộc Task 3 xong) ✅ (2026-09-05)

## Đã hoàn thành (Completed)
- Đổi VỊ TRÍ HIỂN THỊ floating button (bottom-* values): ScrollToTopButton cao nhất (bottom-40) → LanguageSwitcher giữa (bottom-24) → ThemeToggle thấp nhất (bottom-8) ✅ (2026-09-05)

---

**Last Updated:** 2026-09-05