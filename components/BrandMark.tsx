export default function BrandMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- SVG mark; next/image
  // blocks SVGs without an extra security opt-in in next.config.js, and a
  // small vector icon gets no benefit from image optimization anyway.
  return <img src="/brand/brandhorse-mark.svg" alt="Brandhorse" width={size} height={size} className={className} />;
}
