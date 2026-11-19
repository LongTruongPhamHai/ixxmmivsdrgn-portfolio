# STATE.md - Project State Tracking

**Last Updated:** 2026-09-06  
**Current Phase:** Production ready

---

## Đang làm (In Progress)

**[ALL CLEAR - 2026-09-06]** 
- ✅ URL/Link Feature - Phase hoàn thành (3/3 tasks done)
- ✅ Education Degree Classification i18n Bug - Fixed (2026-09-06)
- ⏳ **Next:** User cần điền URLs qua Admin UI để test links (13 URLs pending)

---

## Project Map - URL/Link Feature

### 1. Schema (✅ DONE - đã có field)

**Experience Collection:**
- File: `src/collections/Experience.ts`
- Field company URL: `url` (text, optional) - line 20-23
- Field project URL: `projects[].url` (text, optional) - line 61-64
- Generated types: `src/payload-types.ts` lines 237-255, 476-493

**Education Collection:**
- File: `src/collections/Education.ts`
- Field school URL: `schoolUrl` (text, optional) - line 21-27
- Generated types: `src/payload-types.ts` lines 289-301, 512-522

**Projects Collection (Personal Projects):**
- File: `src/collections/Projects.ts`
- ⚠️ KHÔNG có field `url` trực tiếp
- Có `links.repo` và `links.demo` (group fields) - lines 62-68
- Generated types: `src/payload-types.ts` lines 182-211

**Skills Collection:**
- File: `src/collections/Skills.ts`
- Field docs URL: `docsUrl` (text, optional) - line 56-62
- Generated types: `src/payload-types.ts` lines 216-232

### 2. Data Location

**Database:**
- MongoDB (Mongoose adapter)
- Connection: `process.env.DATABASE_URL` từ file `.env`
- Config: `src/payload.config.ts` line 39-41
- ⚠️ Không có seed file (chỉ có `tests/helpers/seedUser.ts` cho test user)
- Data được quản lý qua Payload Admin UI tại `http://localhost:3000/admin`

**Data Fetch (Server Components):**
- File: `src/app/[locale]/page.tsx`
  - Line 18-22: `payload.find({ collection: 'education' })`
  - Line 23: `payload.find({ collection: 'skills' })`
  - Line 24-28: `payload.find({ collection: 'experience' })`
  - Line 29-33: `payload.find({ collection: 'projects' })`

### 3. UI Components (cần render link)

**Company Name (Experience):**
- File: `src/components/organisms/ExperienceSection.tsx`
- Location: Line 21
- Current: `<span className="text-accent-lime">{exp.company}</span>`
- Status: ❌ Chưa có link, cần wrap bằng `<a href={exp.url}>`

**School Name (Education):**
- File: `src/components/organisms/EducationSection.tsx`
- Location: Line 18
- Current: `<h3 className="...">{edu.school}</h3>`
- Status: ❌ Chưa có link, cần wrap bằng `<a href={edu.schoolUrl}>`

**Project Name trong Experience (Dự án tham gia):**
- File: `src/components/organisms/ExperienceSection.tsx`
- Location: Line 34
- Current: `<h4 className="...">{proj.projectName}</h4>`
- Status: ❌ Chưa có link, cần wrap bằng `<a href={proj.url}>`

**Personal Project Title:**
- File: `src/components/molecules/ProjectCard.tsx`
- Location: Line 44-66 (toàn bộ card là 1 link)
- Current: `<Link href={`/projects/${slug}`}>` - link nội bộ đến detail page
- Status: ⚠️ Đã có link nhưng là internal route, KHÔNG phải external URL
- Note: Collection không có field `url`, chỉ có `links.repo` và `links.demo`

**Skill Name:**
- File: `src/components/organisms/SkillsSection.tsx`
- Locations:
  - Line 30: Technical skills `{skill.name}`
  - Line 41: Language skills `{skill.name}`
  - Line 52: Other skills `{skill.name}`
- Status: ❌ Chưa có link, cần wrap bằng `<a href={skill.docsUrl}>`

### 4. i18n Dictionary

**File:** `src/i18n/dictionaries.ts`

**Structure:**
```typescript
export const dictionaries = {
  en: { key: 'value', ... },
  vi: { key: 'giá trị', ... }
}
export const getDictionary = (locale: string) => { ... }
```

**Usage Pattern:**
- Import: `import { getDictionary } from '@/i18n/dictionaries'`
- Call: `const t = getDictionary(locale)`
- Use: `t.keyName` (e.g., `t.experience`, `t.education`)

**Current Keys (relevant):**
- `experience`, `education`, `personalProjectsLabel`, `skillsLabel`
- `projectsLabel` (for Experience.projects)
- `technical`, `language`, `other` (for skill categories)

**Status:** ⚠️ Có thể cần thêm keys mới nếu cần label cho link (ví dụ: tooltips, "Visit website", etc.)

---

## Open Questions

### Q1: Personal Projects - Schema Decision ✅ RESOLVED (2026-09-06)
**Issue:** Collection `Projects` không có field `url` như các collection khác. Hiện có `links.repo` và `links.demo` (group fields).

**Options:**
- A) Thêm field `url` mới (consistent với Experience.projects)
- B) Dùng `links.demo` làm URL chính ✅ CHỌN OPTION NÀY
- C) Không cần external URL cho Personal Projects (vì đã có internal detail page)

**Decision:** Option B - Sử dụng `links.demo` làm URL chính
- Lý do: Field đã có sẵn, tránh thêm field mới, phù hợp với mục đích
- Projects collection KHÔNG cần thêm field `url` mới

**Impact:** Task 1 với Projects chỉ cần kiểm tra links.demo, không cần update schema

### Q2: Data Records Status ✅ RESOLVED (2026-09-06)
**Issue:** Chưa xác định được bản ghi nào đã có/chưa có giá trị url/docsUrl vì:
- Không có seed file
- Không thể query MongoDB trực tiếp từ scan này

**Solution:** Đã tạo script `scripts/check-url-fields.ts` và chạy kiểm tra

**Kết quả:**

**Experience Collection (1 record):**
- ❌ Companies without URL: 1
  - CodeDream (cần thêm URL)
- ❌ Projects without URL: 2
  - CodeDream / CDOJ - CodeDream Online Judge
  - CodeDream / CDCMS - CodeDream CMS

**Education Collection (1 record):**
- ✅ Schools with schoolUrl: 1
  - Trường Đại học Thủy Lợi (đã có: https://tlu.edu.vn)
- ✅ KHÔNG CẦN UPDATE

**Skills Collection (10 records):**
- ❌ All 10 skills without docsUrl:
  - FastAPI, Django, PayloadCMS, PostgreSQL, Python
  - TypeScript, Git/GitHub, MongoDB, Next.js, JavaScript

**Projects Collection (1 record):**
- ✅ With links.demo: 1
  - Smart Parking IoT (đã có URL)
- ✅ KHÔNG CẦN UPDATE

**ACTION REQUIRED:**
Cần điền 13 URLs qua Admin UI (localhost:3000/admin):
- Experience: 1 company URL + 2 project URLs
- Skills: 10 documentation URLs

---

## Tasks (TODO)

### Task 1: Data Update [pending - chờ user điền URL]
**Goal:** Cập nhật MongoDB records để gắn giá trị url/docsUrl vào các bản ghi hiện có

**Status:** ✅ Khảo sát hoàn tất - Đã xác định records cần update
- ✅ Script kiểm tra: `scripts/check-url-fields.ts` (đã tạo và chạy thành công)
- ⏳ Chờ user điền 13 URLs qua Payload Admin UI

**Scope:**
- Experience: Thêm `url` cho company CodeDream, `projects[].url` cho 2 projects
- Education: ✅ Đã có schoolUrl - KHÔNG CẦN UPDATE
- Skills: Thêm `docsUrl` cho 10 skills
- Projects: ✅ Đã có links.demo - KHÔNG CẦN UPDATE

**Files Involved:**
- ✅ Script created: `scripts/check-url-fields.ts`
- Data access: Via Payload Admin UI (localhost:3000/admin)
- Collections: `experience`, `skills`

**Dependencies:**
- ✅ Q1: Resolved - Projects dùng links.demo
- ✅ Q2: Resolved - Đã có list bản ghi cần update

---

### Task 2: UI Render Links [✅ DONE - 2026-09-06]
**Goal:** Update UI components để render clickable links từ url/docsUrl fields

**Files Edited:**
- ✅ `src/components/organisms/ExperienceSection.tsx`:
  - Line 21-32: Wrapped `exp.company` với conditional `<a href={exp.url}>` (underline dotted, hover accent-amber)
  - Line 45-56: Wrapped `proj.projectName` với conditional `<a href={proj.url}>` (underline dotted, hover accent-amber)
- ✅ `src/components/organisms/EducationSection.tsx`:
  - Line 18-29: Wrapped `edu.school` với conditional `<a href={edu.schoolUrl}>` (underline dotted, hover accent-amber)
- ✅ `src/components/organisms/SkillsSection.tsx`:
  - Lines 30-42: Technical skills conditional link wrap với `<a href={skill.docsUrl}>`
  - Lines 53-65: Language skills conditional link wrap với `<a href={skill.docsUrl}>` (brightness-125 effect)
  - Lines 76-88: Other skills conditional link wrap với `<a href={skill.docsUrl}>`
- ✅ `src/components/molecules/ProjectCard.tsx`:
  - Added `demoUrl?: string` prop (line 11)
  - Added external link icon button for `links.demo` (lines 65-94)
  - Kept internal Link navigation intact, external link stops propagation
- ✅ `src/components/organisms/ProjectsSection.tsx`:
  - Line 27: Added `demoUrl={project.links?.demo}` prop to ProjectCard

**Implementation Details:**
- ✅ Conditional rendering: links only render when URL field has value
- ✅ All external links use `target="_blank" rel="noopener noreferrer"`
- ✅ Hover states: accent-amber for text links, accent-lime for demo icon
- ✅ ProjectCard: internal Link preserved, external demo link as separate icon with stopPropagation
- ✅ Styling consistent with "Technical Soldier" theme (dotted underline, border hover effects)

---

### Task 3: i18n Dictionary Update [✅ DONE - 2026-09-06]
**Goal:** Thêm translation keys mới cho text liên quan đến links (nếu cần)

**Files Edited:**
- ✅ `src/i18n/dictionaries.ts`:
  - Line 26: Added `viewDemo: 'View Demo'` (en)
  - Line 64: Added `viewDemo: 'Xem Demo'` (vi)
- ✅ `src/components/molecules/ProjectCard.tsx`:
  - Lines 12-15: Added `viewDemo: string` to translations interface
  - Line 79: Changed hardcoded `title="View Demo"` to `title={translations.viewDemo}`

**Implementation Details:**
- ✅ Only 1 new text found in Task 2: tooltip for demo button
- ✅ Other components (Experience, Education, Skills) only wrap existing content with links, no new text
- ✅ Followed camelCase convention consistent with existing keys
- ✅ Both en and vi translations added

---

## Vừa sửa (Recently Fixed)

### Bug: Education Degree Classification Always Shows English [✅ FIXED - 2026-09-06]

**Nguyên nhân:**
- Dictionary key mismatch: `dictionaries.ts` có key `'Fair'` nhưng `Education.ts` schema có option value `'Very good'`
- Component `EducationSection.tsx` line 33 lookup `t.graduation[edu.graduationType]` trả về `undefined` cho value `'Very good'`
- Fallback về raw English value thay vì hiển thị bản dịch tiếng Việt

**Files sửa:**
- ✅ `src/i18n/dictionaries.ts`:
  - Line 36: Thay `Good: 'Good'` → `'Very good': 'Very good'` (en)
  - Line 37: Thay `Fair: 'Fair'` → `Good: 'Good'` (en)
  - Line 75: Thay `Good: 'Giỏi'` → `'Very good': 'Giỏi'` (vi)
  - Line 76: Thay `Fair: 'Khá'` → `Good: 'Khá'` (vi)

**Mapping chuẩn:**
- `Excellent` → `'Xuất sắc'` (vi) / `'Excellent'` (en)
- `Very good` → `'Giỏi'` (vi) / `'Very good'` (en)
- `Good` → `'Khá'` (vi) / `'Good'` (en)
- `Average` → `'Trung bình'` (vi) / `'Average'` (en)

**Related schema:** `src/collections/Education.ts` lines 58-67 (select field với 4 options cố định)

---

## Known Issues

*(Không có issue đang mở)*

---

## Quyết định tạm thời

1. **ThemeProvider custom implementation**: Không dùng `next-themes`, tự implement bằng React Context + localStorage để kiểm soát tốt hơn logic dark/light mode
2. **Breakpoint migration**: Đã định nghĩa custom breakpoints (`tablet:`, `laptop:`, `laptop-lg:`) nhưng code vẫn dùng breakpoint cũ (`sm:`, `md:`, `lg:`) - chưa migrate vì chưa có yêu cầu cụ thể

---

## Mốc quan trọng đã hoàn thành

- ✅ **Schema Update (2026-09-06)**: Đã thêm field `url`/`docsUrl` vào Experience, Education, Skills collections
- ✅ **Component Extraction (2026-09-05)**: Tách toàn bộ sections thành organisms (BackgroundPattern, Header, Footer, HeroSection, ContactSection, ProjectsSection, ExperienceSection, EducationSection, SkillsSection)
- ✅ **Floating Controls (2026-09-05)**: ScrollToTopButton, LanguageSwitcher, ThemeToggle đã được chuyển sang floating buttons với z-index phân tầng
- ✅ **Header Shrink (2026-09-05)**: Header có animation shrink khi scroll
- ✅ **Smooth Scroll Navigation (2026-09-05)**: Contact me button scroll mượt đến Contact section

---

**Last Updated:** 2026-09-06
