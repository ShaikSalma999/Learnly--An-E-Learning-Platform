/*
 * Illustrated course badge: a gradient backdrop with soft highlights, a dotted
 * texture and a frosted glass tile holding a topic-specific glyph. The glyphs
 * use three paint roles – white outlines, translucent white fills (g-soft) and
 * the course accent colour (g-accent) – so every course gets its own palette.
 */
const glyphs = {
  react: (
    <>
      <ellipse cx="32" cy="32" rx="23" ry="9" />
      <ellipse cx="32" cy="32" rx="23" ry="9" transform="rotate(60 32 32)" />
      <ellipse cx="32" cy="32" rx="23" ry="9" transform="rotate(120 32 32)" />
      <circle cx="32" cy="32" r="5" className="g-accent" />
    </>
  ),
  js: (
    <>
      <rect x="8" y="8" width="48" height="48" rx="11" className="g-soft" />
      <text x="32" y="42" textAnchor="middle" fontSize="25" fontWeight="800" fontFamily="Inter, sans-serif" fill="#fff" stroke="none">JS</text>
      <circle cx="49" cy="16" r="4" className="g-accent" />
    </>
  ),
  node: (
    <>
      <path d="M32 6l21 12v28L32 58 11 46V18z" className="g-soft" />
      <path d="M24 41V24l16 17V24" />
      <circle cx="32" cy="6" r="4" className="g-accent" />
    </>
  ),
  analytics: (
    <>
      <rect x="8" y="34" width="11" height="22" rx="3" className="g-soft" />
      <rect x="26" y="22" width="11" height="34" rx="3" className="g-soft" />
      <rect x="44" y="10" width="11" height="46" rx="3" className="g-accent" />
      <path d="M8 24l18-10 18 8 14-12" />
    </>
  ),
  ml: (
    <>
      <path d="M12 18L32 24M12 18L32 40M12 32L32 24M12 32L32 40M12 46L32 24M12 46L32 40M32 24L52 32M32 40L52 32" strokeWidth="2" opacity="0.8" />
      <circle cx="12" cy="18" r="5" className="g-soft" />
      <circle cx="12" cy="32" r="5" className="g-soft" />
      <circle cx="12" cy="46" r="5" className="g-soft" />
      <circle cx="32" cy="24" r="5.5" className="g-accent" />
      <circle cx="32" cy="40" r="5.5" className="g-accent" />
      <circle cx="52" cy="32" r="6" className="g-soft" />
    </>
  ),
  sql: (
    <>
      <path d="M14 16v32c0 3.9 8 7 18 7s18-3.1 18-7V16" className="g-soft" />
      <path d="M14 32c0 3.9 8 7 18 7s18-3.1 18-7" />
      <ellipse cx="32" cy="16" rx="18" ry="7" className="g-accent" />
    </>
  ),
  design: (
    <>
      <path d="M12 52l5-15L42 12a5.5 5.5 0 0 1 8 8L25 45z" className="g-soft" />
      <path d="M12 52l5-15 10 10z" className="g-accent" />
      <path d="M37 17l10 10" />
    </>
  ),
  figma: (
    <>
      <circle cx="20" cy="20" r="10" className="g-accent" />
      <rect x="34" y="10" width="20" height="20" rx="5" className="g-soft" />
      <rect x="10" y="34" width="20" height="20" rx="5" className="g-soft" />
      <path d="M34 44h20M44 34v20" />
    </>
  ),
  brand: (
    <>
      <path d="M30 8c2 14 8 20 22 22-14 2-20 8-22 22-2-14-8-20-22-22 14-2 20-8 22-22z" className="g-soft" transform="translate(2 4)" />
      <path d="M50 4c.8 5 2.4 6.6 7 7.4-4.6.8-6.2 2.4-7 7.4-.8-5-2.4-6.6-7-7.4 4.6-.8 6.2-2.4 7-7.4z" className="g-accent" />
    </>
  ),
  product: (
    <>
      <circle cx="32" cy="32" r="22" />
      <path d="M43 21l-6 15-15 7 6-15z" className="g-accent" />
      <circle cx="32" cy="32" r="2.5" fill="#fff" stroke="none" />
    </>
  ),
  marketing: (
    <>
      <path d="M10 26h10l22-12v36L20 38H10z" className="g-soft" />
      <path d="M20 38l4 14h8l-4-14" />
      <path d="M50 25a9 9 0 0 1 0 14" />
      <circle cx="53" cy="13" r="4" className="g-accent" />
    </>
  ),
  finance: (
    <>
      <circle cx="24" cy="40" r="15" className="g-soft" />
      <text x="24" y="47" textAnchor="middle" fontSize="20" fontWeight="800" fontFamily="Inter, sans-serif" fill="#fff" stroke="none">₹</text>
      <path d="M36 24l7-7 6 6 10-12" />
      <path d="M51 11h8v8" />
      <circle cx="43" cy="17" r="3" className="g-accent" />
    </>
  ),
  book: (
    <>
      <path d="M10 14a4 4 0 0 1 4-4h18v40H14a4 4 0 0 0-4 4z" className="g-soft" />
      <path d="M54 14a4 4 0 0 0-4-4H32v40h18a4 4 0 0 1 4 4z" className="g-accent" />
    </>
  ),
};

export default function CourseArt({ thumbnail, size = 'lg' }) {
  const { from, to, accent, art } = thumbnail;

  return (
    <div
      className={`course-art course-art--${size}`}
      style={{ '--art-from': from, '--art-to': to, '--art-accent': accent }}
      aria-hidden="true"
    >
      <span className="course-art__texture" />
      <span className="course-art__blob course-art__blob--one" />
      <span className="course-art__blob course-art__blob--two" />
      <span className="course-art__dot" />
      <span className="course-art__tile">
        <svg viewBox="0 0 64 64" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" focusable="false">
          {glyphs[art] ?? glyphs.book}
        </svg>
      </span>
    </div>
  );
}
