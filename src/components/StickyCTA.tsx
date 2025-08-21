export default function StickyCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 sm:hidden">
      <div className="mx-auto max-w-2xl px-4 pb-4">
        <a
          href="#waitlist"
          className="block w-full text-center h-12 leading-[3rem] rounded-md bg-primary text-on-primary text-sm font-semibold shadow-lg"
          onClick={() => {
            if (typeof window !== 'undefined' && window.gtag) {
              window.gtag('event', 'cta_click', { location: 'sticky' });
            }
          }}
        >
          Join the waitlist
        </a>
      </div>
    </div>
  );
}

