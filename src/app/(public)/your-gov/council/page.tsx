import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "City Council",
  description: "Patterson, CA City Council members, contact information, and salaries.",
};

// Council member data — update as terms change
const councilMembers = [
  {
    name: "TBD",
    role: "Mayor",
    district: 1,
    termEnd: "2026",
    salary: "$1,200/month",
    email: "council@ci.patterson.ca.us",
    phone: "(209) 895-8000",
  },
  {
    name: "TBD",
    role: "Mayor Pro Tem",
    district: 2,
    termEnd: "2028",
    salary: "$900/month",
    email: "council@ci.patterson.ca.us",
    phone: "(209) 895-8000",
  },
  {
    name: "TBD",
    role: "Council Member",
    district: 3,
    termEnd: "2026",
    salary: "$900/month",
    email: "council@ci.patterson.ca.us",
    phone: "(209) 895-8000",
  },
  {
    name: "TBD",
    role: "Council Member",
    district: 4,
    termEnd: "2028",
    salary: "$900/month",
    email: "council@ci.patterson.ca.us",
    phone: "(209) 895-8000",
  },
  {
    name: "TBD",
    role: "Council Member",
    district: 5,
    termEnd: "2026",
    salary: "$900/month",
    email: "council@ci.patterson.ca.us",
    phone: "(209) 895-8000",
  },
];

const cityStaff = [
  { name: "TBD", role: "City Manager", email: "citymanager@ci.patterson.ca.us" },
  { name: "TBD", role: "City Clerk", email: "cityclerk@ci.patterson.ca.us" },
  { name: "TBD", role: "City Attorney", email: "cityattorney@ci.patterson.ca.us" },
];

export default function CouncilPage() {
  return (
    <div className="max-w-content mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-navy mb-2">
        City Council
      </h1>
      <p className="text-muted mb-8">
        Patterson&apos;s five elected council members serve four-year staggered terms.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12">
        {councilMembers.map((member) => (
          <Card key={member.district}>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-navy text-white border-transparent">
                  District {member.district}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {member.role}
                </Badge>
              </div>
              <h2 className="font-display text-lg font-bold text-navy">
                {member.name}
              </h2>
              <p className="text-xs text-muted mt-1">
                Term ends: {member.termEnd} &middot; {member.salary}
              </p>
              <div className="mt-3 space-y-1">
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center gap-1.5 text-xs text-navy hover:underline"
                >
                  <Mail className="h-3 w-3" />
                  {member.email}
                </a>
                <a
                  href={`tel:${member.phone}`}
                  className="flex items-center gap-1.5 text-xs text-navy hover:underline"
                >
                  <Phone className="h-3 w-3" />
                  {member.phone}
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="font-display text-2xl font-bold text-navy mb-4">
        City Staff
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {cityStaff.map((staff) => (
          <Card key={staff.role}>
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-1">
                {staff.role}
              </p>
              <h3 className="font-display text-lg font-bold text-navy">
                {staff.name}
              </h3>
              <a
                href={`mailto:${staff.email}`}
                className="flex items-center gap-1.5 text-xs text-navy hover:underline mt-2"
              >
                <Mail className="h-3 w-3" />
                {staff.email}
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
