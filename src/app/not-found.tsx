import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-7xl font-serif text-white mb-4">404</p>
        <p className="text-2xl font-serif text-white mb-3">Lost in space</p>
        <p className="text-slate-400 mb-8">
          That page drifted into the void. Try one of these instead:
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/" className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.1] rounded-full text-white text-sm">
            Home
          </Link>
          <Link href="/sky" className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.1] rounded-full text-white text-sm">
            Tonight&rsquo;s sky
          </Link>
          <Link href="/markets" className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.1] rounded-full text-white text-sm">
            Markets
          </Link>
        </div>
      </div>
    </div>
  );
}
