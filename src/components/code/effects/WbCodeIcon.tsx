/**
 * WB Code logo icon — vectores originales exportados desde Inkscape.
 * Paths exactos del diseño final: A rellena + estrella de 4 puntas.
 */
interface Props {
  size?: number;
  className?: string;
}

export default function WbCodeIcon({ size = 48, className = '' }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="363 213 828 625"
      width={size}
      height={size}
      preserveAspectRatio="xMidYMid meet"
      className={className}
      aria-label="WB Code"
    >
      {/* A shape — original Inkscape path */}
      <path
        fill="white"
        d="m 392.99365,807.03469 325.16854,-563.52021 116.80812,-0.78923 325.16849,565.09867 c 0,0 -89.6961,9.29959 -108.6681,-21.96341 C 961.52623,637.64556 777.35549,336.64527 777.35549,336.64527 c 0,0 -185.96032,305.05446 -277.02462,449.07981 -20.10899,31.80401 -107.33722,21.30961 -107.33722,21.30961 z"
      />
      {/* 4-pointed sparkle star — original Inkscape path */}
      <path
        fill="white"
        d="m 662.12587,663.39229 c 64.47957,-17.24645 96.06425,-62.90204 114.44039,-119.96508 22.53814,53.14943 49.76744,102.83147 119.96508,120.75431 -48.15118,18.90426 -96.16474,38.13666 -117.59737,120.75433 -16.85867,-76.39021 -67.14305,-98.4637 -116.8081,-121.54356 z"
      />
    </svg>
  );
}
