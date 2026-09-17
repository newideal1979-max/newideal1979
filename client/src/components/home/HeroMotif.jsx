// A composed abstract visual built entirely from the institute's own material vocabulary:
// a measuring-tape tick scale, a dress-pattern curve, and a running stitch line.
// No stock photography — deliberate, per the brief's instruction to avoid unrelated imagery.
export default function HeroMotif() {
  return (
    <svg viewBox="0 0 520 620" fill="none" className="w-full h-auto max-w-md mx-auto" aria-hidden="true">
      <defs>
        <linearGradient id="patternFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1A2038" />
          <stop offset="100%" stopColor="#121729" />
        </linearGradient>
      </defs>

      {/* pattern-paper card, slightly rotated like a garment pattern laid on a table */}
      <g transform="rotate(-4 260 300)">
        <rect x="90" y="90" width="340" height="440" rx="10" fill="url(#patternFill)" stroke="#242C48" />
        {/* dress-pattern curve, hand-drafted look */}
        <path
          d="M140 500 C 150 380, 130 300, 180 220 C 220 160, 300 140, 340 170 C 380 200, 370 260, 330 300 C 300 330, 260 340, 250 400 C 245 440, 260 480, 300 500"
          stroke="#C89B3C"
          strokeWidth="2"
          strokeDasharray="6 5"
        />
        {/* seam allowance guide lines */}
        <path d="M160 500 C168 390,150 300,196 224" stroke="#4A6CF7" strokeOpacity="0.5" strokeWidth="1.5" />
      </g>

      {/* measuring tape strip along the left edge */}
      <g transform="translate(40,60)">
        <rect x="0" y="0" width="30" height="500" rx="15" fill="#171D33" stroke="#242C48" />
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={i}
            x1="6"
            y1={16 + i * 21}
            x2={i % 4 === 0 ? "24" : "16"}
            y2={16 + i * 21}
            stroke="#8A90AC"
            strokeWidth="1"
          />
        ))}
      </g>

      {/* running stitch arcing across the composition */}
      <path
        d="M60 40 C 180 10, 340 10, 470 70"
        stroke="#9563E0"
        strokeWidth="2"
        strokeDasharray="1 10"
        strokeLinecap="round"
      />

      {/* scissors mark, minimal line-art */}
      <g transform="translate(360,480)" stroke="#E3B856" strokeWidth="2.2" strokeLinecap="round">
        <circle cx="0" cy="0" r="9" fill="none" />
        <circle cx="0" cy="26" r="9" fill="none" />
        <line x1="7" y1="7" x2="46" y2="46" />
        <line x1="7" y1="19" x2="46" y2="-20" />
      </g>
    </svg>
  );
}
