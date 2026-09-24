import Image from "next/image";

// Official Brandhorse mark — a raster PNG (public/brand/brandhorse-mark.png),
// used standalone. Never combine it with the "PROMPT PACK BUILDER" wordmark
// inside the image itself; pair them as separate elements in the layout
// where needed (see Sidebar.tsx for the desktop mark + wordmark pairing).
export default function BrandMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src="/brand/brandhorse-mark.png"
      alt="Brandhorse"
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}
