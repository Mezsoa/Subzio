export default function Navbar() {
  return (
    <header className="w-full border-b border-black/5">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#" className="text-sm font-semibold tracking-tight">
          Subscription Killer
        </a>
        <a
          href="#waitlist"
          className="inline-flex items-center justify-center h-11 px-5 rounded-md bg-black text-white text-sm font-semibold hover:bg-black/90 transition"
        >
          Join Waitlist
        </a>
      </nav>
    </header>
  );
}

