# STATE.md - Project State Tracking

**Last Updated:** 2026-09-05  
**Current Phase:** Production ready

---

## Đang làm (In Progress)

*(Không có task đang làm)*

---

## Known Issues

*(Không có issue đang mở)*

---

## Quyết định tạm thời

1. **ThemeProvider custom implementation**: Không dùng `next-themes`, tự implement bằng React Context + localStorage để kiểm soát tốt hơn logic dark/light mode
2. **Breakpoint migration**: Đã định nghĩa custom breakpoints (`tablet:`, `laptop:`, `laptop-lg:`) nhưng code vẫn dùng breakpoint cũ (`sm:`, `md:`, `lg:`) - chưa migrate vì chưa có yêu cầu cụ thể

---

## Mốc quan trọng đã hoàn thành

- ✅ **Component Extraction (2026-09-05)**: Tách toàn bộ sections thành organisms (BackgroundPattern, Header, Footer, HeroSection, ContactSection, ProjectsSection, ExperienceSection, EducationSection, SkillsSection)
- ✅ **Floating Controls (2026-09-05)**: ScrollToTopButton, LanguageSwitcher, ThemeToggle đã được chuyển sang floating buttons với z-index phân tầng
- ✅ **Header Shrink (2026-09-05)**: Header có animation shrink khi scroll
- ✅ **Smooth Scroll Navigation (2026-09-05)**: Contact me button scroll mượt đến Contact section

---

**Last Updated:** 2026-09-05
