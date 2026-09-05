/**
 * RESPONSIVE DESIGN SYSTEM - Code Dream CMS
 *
 * Mobile-first approach với 5 breakpoints chính:
 * sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px
 *
 * Sử dụng: `className="md:text-lg lg:text-xl"`
 */

// ==================== BREAKPOINTS ====================
export const BREAKPOINTS = {
  sm: 640, // Mobile lớn
  md: 768, // Tablet nhỏ
  lg: 1024, // Tablet lớn/Laptop nhỏ
  xl: 1280, // Laptop/Desktop
  '2xl': 1536, // Desktop lớn

  // Special breakpoints từ trang Giới thiệu
  narrowMobile: 560, // Mobile hẹp (giữ từ trang Giới thiệu)
} as const

export type Breakpoint = keyof typeof BREAKPOINTS

// ==================== CONTAINER SIZES ====================
export const CONTAINER_WIDTHS = {
  sm: '100%',
  md: '100%',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// ==================== SPACING SCALE ====================
export const SPACING = {
  // Fluid spacing (đã định nghĩa trong styles.css)
  fluid: {
    0: 'var(--spacing-fluid-0)',
    1: 'var(--spacing-fluid-1)', // 4-8px
    2: 'var(--spacing-fluid-2)', // 8-16px
    3: 'var(--spacing-fluid-3)', // 12-24px
    4: 'var(--spacing-fluid-4)', // 16-32px
    5: 'var(--spacing-fluid-5)', // 24-48px
    6: 'var(--spacing-fluid-6)', // 32-64px
    7: 'var(--spacing-fluid-7)', // 48-96px
    8: 'var(--spacing-fluid-8)', // 64-128px
  },

  // Fixed spacing (Tailwind defaults)
  fixed: {
    1: '0.25rem', // 4px
    2: '0.5rem', // 8px
    3: '0.75rem', // 12px
    4: '1rem', // 16px
    6: '1.5rem', // 24px
    8: '2rem', // 32px
  },
} as const

// ==================== TYPOGRAPHY SCALE ====================
export const TYPOGRAPHY = {
  fluid: {
    xs: 'text-fluid-xs', // 12-16px
    sm: 'text-fluid-sm', // 14-18px
    base: 'text-fluid-base', // 16-20px
    lg: 'text-fluid-lg', // 18-24px
    xl: 'text-fluid-xl', // 20-28px
    '2xl': 'text-fluid-2xl', // 24-32px
    '3xl': 'text-fluid-3xl', // 30-40px
    '4xl': 'text-fluid-4xl', // 36-48px
  },

  // Font weights
  weights: {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  },
} as const

// ==================== GRID SYSTEM ====================
export const GRID = {
  columns: {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  },

  responsiveColumns: {
    mobile: 'grid-cols-1',
    tablet: 'md:grid-cols-2',
    laptop: 'lg:grid-cols-3',
    desktop: 'xl:grid-cols-4',
  },

  gaps: {
    1: 'gap-1', // 4px
    2: 'gap-2', // 8px
    3: 'gap-3', // 12px
    4: 'gap-4', // 16px
    6: 'gap-6', // 24px
    8: 'gap-8', // 32px
  },
} as const
