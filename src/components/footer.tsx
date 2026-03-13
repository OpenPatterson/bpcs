import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-white mt-auto no-print">
      <div className="max-w-content mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <p className="font-display text-lg font-bold text-navy">BPCS</p>
            <p className="mt-1 text-sm text-muted">
              Making Patterson, CA local government accessible to every
              resident.
            </p>
            <p className="mt-2 text-sm text-muted">
              Built by{" "}
              <a
                href="https://openpatterson.org"
                className="underline hover:text-navy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Patterson
              </a>
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-sm font-semibold text-text mb-2">Quick Links</p>
            <ul className="space-y-1 text-sm text-muted">
              <li>
                <Link href="/meetings" className="hover:text-navy">
                  Meeting Archive
                </Link>
              </li>
              <li>
                <Link href="/your-gov" className="hover:text-navy">
                  Your Government
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-navy">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-navy">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-sm font-semibold text-text mb-2">Contact</p>
            <ul className="space-y-1 text-sm text-muted">
              <li>
                <a
                  href="mailto:carlos@openpatterson.org"
                  className="hover:text-navy"
                >
                  carlos@openpatterson.org
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/OpenPatterson/bpcs"
                  className="hover:text-navy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-4 text-center text-xs text-muted">
          &copy; {new Date().getFullYear()} Open Patterson. Open source under
          MIT License.
        </div>
      </div>
    </footer>
  );
}
