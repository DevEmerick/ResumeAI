import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="w-full border-t border-slate-800 bg-slate-900/50 py-8 mt-16 transition-colors duration-300"
      aria-label="Rodapé do site"
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} ResumeAI. All rights reserved.</div>
        <nav className="flex gap-6" aria-label="Links do rodapé">
          <Link href="/features" className="hover:text-blue-500 text-slate-400 text-sm transition-colors focus:outline-none focus:underline">Features</Link>
          <Link href="/how-it-works" className="hover:text-blue-500 text-slate-400 text-sm transition-colors focus:outline-none focus:underline">How it works</Link>
          <Link href="/dashboard" className="hover:text-blue-500 text-slate-400 text-sm transition-colors focus:outline-none focus:underline">Dashboard</Link>
        </nav>
      </div>
    </footer>
  );
}
