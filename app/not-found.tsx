import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-3xl font-black text-gray-950 mb-3">Page Not Found</h2>
      <p className="text-sm text-gray-600 mb-6 font-medium">The requested page could not be found.</p>
      <Link href="/" className="btn-red px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider">
        Return to Home
      </Link>
    </div>
  );
}
