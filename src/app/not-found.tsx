import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Home, Search, Calendar } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md">
          <h1 className="font-display text-6xl font-bold text-navy mb-4">404</h1>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">
            Page Not Found
          </h2>
          <p className="text-muted mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild>
              <Link href="/">
                <Home className="mr-1.5 h-4 w-4" />
                Home
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/meetings">
                <Calendar className="mr-1.5 h-4 w-4" />
                Meetings
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/search">
                <Search className="mr-1.5 h-4 w-4" />
                Search
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
