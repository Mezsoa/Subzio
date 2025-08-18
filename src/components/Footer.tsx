export default function Footer() {
  return (
    <footer className="w-full border-t border-black/5 mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-black/60">
          <span className="font-medium text-black">Subscription Killer</span> © {new Date().getFullYear()}
        </div>
        <div className="flex items-center gap-6 text-sm">
          <a className="hover:underline" href="#">Privacy</a>
          <a className="hover:underline" href="#">Terms</a>
        </div>
      </div>
    </footer>
  );
}

