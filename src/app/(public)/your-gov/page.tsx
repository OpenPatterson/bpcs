import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Map, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Your Government",
  description: "Learn about Patterson, CA city government — council members, districts, and how to participate.",
};

export default function YourGovPage() {
  return (
    <div className="max-w-content mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-navy mb-3">
        Your Government
      </h1>
      <p className="text-lg text-muted mb-8 max-w-2xl">
        Patterson operates under a Council-Manager form of government. The City
        Council sets policy and the City Manager handles day-to-day operations.
        The council has a Mayor and four Council Members, each representing one
        of Patterson&apos;s five districts.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/your-gov/council">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <Users className="h-8 w-8 text-navy mb-3" />
              <h2 className="font-display text-lg font-bold text-navy mb-2">
                City Council
              </h2>
              <p className="text-sm text-muted">
                Meet your elected officials — Mayor, Council Members, and key city staff.
                View contact info, term dates, and salaries.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/your-gov/districts">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <Map className="h-8 w-8 text-navy mb-3" />
              <h2 className="font-display text-lg font-bold text-navy mb-2">
                District Map
              </h2>
              <p className="text-sm text-muted">
                Interactive map of Patterson&apos;s five council districts. Find which
                district you live in and who represents you.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/your-gov/how-it-works">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <HelpCircle className="h-8 w-8 text-navy mb-3" />
              <h2 className="font-display text-lg font-bold text-navy mb-2">
                How It Works
              </h2>
              <p className="text-sm text-muted">
                Learn about the meeting process, how to participate in public
                comment, and answers to common questions.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold text-navy mb-4">
          Government Structure
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-navy mb-2">City Council</h3>
              <p className="text-sm text-muted">
                Five elected members (Mayor + 4 Council Members) set policy, approve
                budgets, and pass ordinances. Regular meetings are typically held on the
                1st and 3rd Tuesday of each month.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-navy mb-2">City Manager</h3>
              <p className="text-sm text-muted">
                Appointed by the City Council to manage all city departments and
                implement council policies. Oversees daily operations, budget execution,
                and city staff.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-navy mb-2">Commissions & Committees</h3>
              <p className="text-sm text-muted">
                Advisory bodies appointed by the Council — Planning Commission, Parks &
                Recreation Commission, Downtown Revitalization Committee, and more.
                These bodies review issues and make recommendations.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-navy mb-2">City Clerk & Attorney</h3>
              <p className="text-sm text-muted">
                The City Clerk manages records, agendas, and public notices. The City
                Attorney provides legal counsel to the Council and city departments.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
