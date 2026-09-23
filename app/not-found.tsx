import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
      <h1 className="font-display text-2xl text-graphite-100 mb-2">Page not found</h1>
      <p className="text-graphite-400 mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="focus-ring rounded-lg bg-graphite-800 px-4 py-2.5 text-sm text-graphite-100 hover:bg-graphite-700">
        Back to Dashboard
      </Link>
    </div>
  );
}
