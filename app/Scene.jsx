const blur = (id) => (
  <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
    <feGaussianBlur stdDeviation="2.2" />
  </filter>
);

function Dancer({ x, flip, c }) {
  return (
    <g transform={`translate(${x} 0) scale(${flip ? -1 : 1} 1)`}>
      <circle cx="0" cy="92" r="9" fill="#3a0c16" />
      <path d="M0 101 L-4 130 L-30 176 H30 L4 130Z" fill={c} />
      <path d="M-2 108 L-30 84 M2 108 L26 96 L34 74" stroke="#3a0c16" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M-30 176 Q0 160 30 176" fill="#d4a94f" opacity=".7" />
    </g>
  );
}

export default function Scene({ kind }) {
  const id = `bl-${kind}`;
  return (
    <svg className="scene" viewBox="0 0 300 190" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        {blur(id)}
        <radialGradient id={`gl-${kind}`} cx=".5" cy=".9" r=".7">
          <stop offset="0" stopColor="#ffd25a" stopOpacity=".9" />
          <stop offset="1" stopColor="#ffd25a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g filter={`url(#${id})`}>
        {kind === "sangeet" && (
          <>
            <rect width="300" height="190" fill="#4a1226" />
            <rect width="300" height="190" fill="url(#gl-sangeet)" opacity=".5" />
            <path d="M0 20 Q75 50 150 22 T300 24" stroke="#f0d48a" strokeWidth="1.2" fill="none" />
            {Array.from({ length: 13 }, (_, k) => (
              <circle key={k} cx={k * 25 + 6} cy={22 + Math.sin(k * 0.9) * 12 + 8} r="4" fill="#ffe08a" />
            ))}
            <Dancer x={95} c="#e8798c" />
            <Dancer x={205} flip c="#d4a94f" />
            <rect y="176" width="300" height="14" fill="#2a0810" />
          </>
        )}
        {kind === "haldi" && (
          <>
            <rect width="300" height="190" fill="#f7d75a" />
            <rect width="300" height="190" fill="url(#gl-haldi)" />
            {Array.from({ length: 22 }, (_, k) => (
              <g key={k}>
                <circle cx={(k * 61) % 300} cy={(k * 37) % 120 + 6} r={10 + (k % 3) * 4} fill={k % 2 ? "#f39a12" : "#ffbf1f"} />
                <circle cx={(k * 61) % 300} cy={(k * 37) % 120 + 6} r={5} fill="#d9700a" opacity=".6" />
              </g>
            ))}
            <ellipse cx="150" cy="168" rx="70" ry="14" fill="#a87a2a" />
            <path d="M80 150 Q150 205 220 150Z" fill="#c9952f" />
            <ellipse cx="150" cy="150" rx="70" ry="12" fill="#f2c230" />
            <path d="M96 150 q12 -8 24 0 q12 -8 24 0 q12 -8 24 0 q12 -8 24 0" stroke="#e0a800" strokeWidth="3" fill="none" />
          </>
        )}
        {kind === "pheras" && (
          <>
            <rect width="300" height="190" fill="#7a1a24" />
            <rect width="300" height="190" fill="url(#gl-pheras)" />
            <path d="M40 60 Q150 -10 260 60 Z" fill="#d4a94f" />
            <path d="M30 60 H270 V68 H30Z" fill="#f0d48a" />
            {[50, 110, 190, 250].map((x) => (
              <rect key={x} x={x - 5} y="66" width="10" height="110" fill="#e9c46a" />
            ))}
            {Array.from({ length: 9 }, (_, k) => (
              <circle key={k} cx={52 + k * 25} cy="76" r="6" fill="#f39a12" />
            ))}
            <rect x="112" y="160" width="76" height="16" fill="#8a5a1a" />
            <path d="M150 104 C132 128 130 146 150 160 C170 146 168 128 150 104Z" fill="#ff8a1f" />
            <path d="M150 122 C140 136 140 148 150 158 C160 148 160 136 150 122Z" fill="#ffe08a" />
            <rect y="176" width="300" height="14" fill="#4a0a18" />
          </>
        )}
      </g>
    </svg>
  );
}
