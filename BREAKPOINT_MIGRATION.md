# Breakpoint Migration Report

**Generated:** 2026-09-05  
**Status:** Config đã update, component chưa sửa

---

## Mapping Breakpoint Cũ → Mới

| Breakpoint Cũ | Min Width | Breakpoint Mới | Min Width | Ghi chú |
|---------------|-----------|----------------|-----------|---------|
| `sm:` | 640px | `tablet:` | 426px | Dùng `tablet:` cho hầu hết case |
| `md:` | 768px | `tablet:` hoặc `laptop:` | 426px / 769px | Xem context: nav/layout → `tablet:`, typography → `laptop:` |
| `lg:` | 1024px | `laptop-lg:` | 1025px | Gần như tương đương (chênh 1px) |
| `xl:` / `2xl:` | 1280px+ | `laptop-lg:` | 1025px | Merge vào laptop-lg hoặc xóa |

---

## Files Cần Sửa

### 1. **src/app/[locale]/layout.tsx** - 11 vị trí

**Dòng 78** - Navbar container (nhiều breakpoint):
```tsx
// CŨ:
className="max-w-7xl mx-auto px-4 flex flex-row md:flex-col lg:flex-row items-center justify-between md:justify-center lg:justify-between h-16 md:h-auto md:py-3 lg:h-16 lg:py-0 gap-0 md:gap-3 lg:gap-0"

// MỚI (đề xuất):
className="max-w-7xl mx-auto px-4 flex flex-row tablet:flex-col laptop-lg:flex-row items-center justify-between tablet:justify-center laptop-lg:justify-between h-16 tablet:h-auto tablet:py-3 laptop-lg:h-16 laptop-lg:py-0 gap-0 tablet:gap-3 laptop-lg:gap-0"
```
**Logic:** Layout thay đổi ở tablet (426px) và laptop lớn (1025px)

**Dòng 82** - Title font size:
```tsx
// CŨ: className="... text-sm md:text-base"
// MỚI: className="... text-sm tablet:text-base"
```

**Dòng 88** - Desktop nav:
```tsx
// CŨ: className="hidden md:flex ..."
// MỚI: className="hidden tablet:flex ..."
```

**Dòng 98** - Mobile controls:
```tsx
// CŨ: className="flex md:hidden ..."
// MỚI: className="flex tablet:hidden ..."
```

---

### 2. **src/app/[locale]/page.tsx** - 8 vị trí

**Dòng 38** - Hero grid layout:
```tsx
// CŨ: className="pt-12 grid grid-cols-1 lg:grid-cols-5 ..."
// MỚI: className="pt-12 grid grid-cols-1 laptop-lg:grid-cols-5 ..."
```
**Logic:** Photo chỉ hiện ở laptop lớn (1025px+)

**Dòng 39** - Hero content column:
```tsx
// CŨ: className="space-y-8 lg:col-span-3"
// MỚI: className="space-y-8 laptop-lg:col-span-3"
```

**Dòng 44** - H1 font size:
```tsx
// CŨ: className="text-6xl md:text-8xl ..."
// MỚI: className="text-6xl laptop:text-8xl ..."
```
**Logic:** Scale up ở laptop nhỏ (769px)

**Dòng 49** - Paragraph font size:
```tsx
// CŨ: className="text-lg md:text-xl ..."
// MỚI: className="text-lg laptop:text-xl ..."
```

**Dòng 71** - Photo container:
```tsx
// CŨ: className="hidden lg:flex lg:col-span-2 ..."
// MỚI: className="hidden laptop-lg:flex laptop-lg:col-span-2 ..."
```

**Dòng 134** - Projects grid:
```tsx
// CŨ: className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ..."
// MỚI: className="grid grid-cols-1 tablet:grid-cols-2 laptop-lg:grid-cols-3 ..."
```
**Logic:** 1 col mobile → 2 cols tablet (426px) → 3 cols laptop lớn (1025px)

**Dòng 152** - Education & Skills grid:
```tsx
// CŨ: className="grid grid-cols-1 md:grid-cols-2 ..."
// MỚI: className="grid grid-cols-1 tablet:grid-cols-2 ..."
```

**Dòng 237** - Contact info flex:
```tsx
// CŨ: className="flex flex-col sm:flex-row ..."
// MỚI: className="flex flex-col tablet:flex-row ..."
```
**Note:** Đây là duy nhất dùng `sm:`, chuyển sang `tablet:`

---

### 3. **src/components/molecules/MobileNav.tsx** - 3 vị trí

**Dòng 39** - Hamburger button:
```tsx
// CŨ: className="md:hidden ..."
// MỚI: className="tablet:hidden ..."
```

**Dòng 49** - Backdrop:
```tsx
// CŨ: className={`... md:hidden ...`}
// MỚI: className={`... tablet:hidden ...`}
```

**Dòng 54** - Menu content:
```tsx
// CŨ: className={`... md:hidden ...`}
// MỚI: className={`... tablet:hidden ...`}
```

**Logic:** Mobile menu ẩn từ tablet (426px) trở lên

---

## Tóm tắt

**Tổng số:** 22 vị trí (3 files)

**Phân loại theo breakpoint:**
- `sm:` → `tablet:` - **1 vị trí** (page.tsx line 237)
- `md:` → `tablet:` - **16 vị trí** (layout nav/controls, page grids, MobileNav)
- `lg:` → `laptop-lg:` - **5 vị trí** (page hero layout, photo, project grid 3-col)
- `md:` → `laptop:` - **2 vị trí** (page typography: h1, paragraph)

**Pattern chính:**
1. **Navigation/Controls:** `md:` → `tablet:` (hiện/ẩn menu ở 426px)
2. **Grid layouts:** `md:` → `tablet:`, `lg:` → `laptop-lg:` (responsive columns)
3. **Typography scaling:** `md:` → `laptop:` (font size lớn hơn ở 769px)
4. **Complex layouts:** `lg:` → `laptop-lg:` (hero 2-col, photo visible ở 1025px+)

---

## Action Items cho Task Tiếp Theo

1. Sửa `src/app/[locale]/layout.tsx` (11 vị trí)
2. Sửa `src/app/[locale]/page.tsx` (8 vị trí)
3. Sửa `src/components/molecules/MobileNav.tsx` (3 vị trí)
4. Test responsive ở 4 breakpoint: 375px, 600px, 900px, 1200px
5. Verify không còn class `sm:`, `md:`, `lg:`, `xl:` trong codebase
