/**
 * RESPONSIVE DESIGN SYSTEM - Portfolio
 *
 * Mobile-first approach với 5 breakpoints chính (Tailwind defaults):
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
  // Fixed spacing (Tailwind defaults)
  fixed: {
    1: '0.25rem', // 4px
    2: '0.5rem', // 8px
    3: '0.75rem', // 12px
    4: '1rem', // 16px
    6: '1.5rem', // 24px
    8: '2rem', // 32px
    12: '3rem', // 48px
    16: '4rem', // 64px
  },
} as const

// ==================== TYPOGRAPHY SCALE ====================
export const TYPOGRAPHY = {
  // Font sizes (Tailwind defaults)
  sizes: {
    xs: 'text-xs', // 12px
    sm: 'text-sm', // 14px
    base: 'text-base', // 16px
    lg: 'text-lg', // 18px
    xl: 'text-xl', // 20px
    '2xl': 'text-2xl', // 24px
    '3xl': 'text-3xl', // 30px
    '4xl': 'text-4xl', // 36px
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
    6: 'grid-cols-6',
    12: 'grid-cols-12',
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
    12: 'gap-12', // 48px
  },
} as const

// ==================== UTILITY FUNCTIONS ====================
/**
 * Media query helper cho JavaScript/TypeScript
 * @param breakpoint - Tên breakpoint (sm, md, lg, xl, 2xl)
 * @returns Media query string
 */
export function getMediaQuery(breakpoint: Breakpoint): string {
  return `(min-width: ${BREAKPOINTS[breakpoint]}px)`
}

/**
 * Check nếu screen size match breakpoint
 * @param breakpoint - Tên breakpoint
 * @returns Boolean (chỉ hoạt động client-side)
 */
export function matchesBreakpoint(breakpoint: Breakpoint): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(getMediaQuery(breakpoint)).matches
}
