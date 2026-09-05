export function BackgroundPattern() {
  return (
    <>
      {/* Global Camo Background & Grid */}
      <svg
        className="fixed inset-0 w-full h-full opacity-30 pointer-events-none z-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="pixel-camo"
            width="120"
            height="120"
            patternUnits="userSpaceOnUse"
            patternTransform="scale(3)"
          >
            {/* Background Color */}
            <rect width="120" height="120" fill="var(--color-bg-primary)" />
            {/* Pattern Layer 1 */}
            <path
              d="M0 0h20v20H0zm40 20h20v20H40zm-20 40h20v20H20zm40-20h20v20H60zm20-40h20v20H80zm-40 80h20v20H40z"
              fill="var(--color-bg-secondary)"
            />
            {/* Pattern Layer 2 */}
            <path
              d="M20 0h20v20H20zm40 0h20v20H60zM0 40h20v20H0zm40 20h20v20H40zm-20 20h20v20H20zm60 20h20v20H80zM80 40h20v20H80z"
              fill="var(--color-bg-elevated)"
            />
            {/* Pattern Layer 3 */}
            <path
              d="M0 20h20v20H0zm20 20h20v20H20zm40 20h20v20H60zm20 40h20v20H80zM100 0h20v20h-20z"
              fill="var(--color-border-default)"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pixel-camo)" />
      </svg>
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.15] mix-blend-overlay"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-text-secondary) 1px, transparent 1px), linear-gradient(90deg, var(--color-text-secondary) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      ></div>
    </>
  )
}
