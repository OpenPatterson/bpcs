import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserById } from "@/lib/db/users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bell, Settings, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your BPCS account settings.",
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await getUserById(session.user.id);
  if (!user) redirect("/login");

  return (
    <div className="max-w-content mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-navy mb-6">
        Account
      </h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Name</span>
              <span>{user.name || "—"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Email</span>
              <span>{user.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Phone</span>
              <span>
                {user.phone || "Not set"}
                {user.phone && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    {user.phoneVerified ? "Verified" : "Unverified"}
                  </Badge>
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">District</span>
              <span>{user.district ? `District ${user.district}` : "Not set"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Language</span>
              <span className="capitalize">{user.preferredLanguage}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Role</span>
              <Badge variant="outline" className="text-xs capitalize">{user.role}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user.preferences ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Email</span>
                  <span>{user.preferences.emailEnabled ? "On" : "Off"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">SMS</span>
                  <span>{user.preferences.smsEnabled ? "On" : "Off"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Reminder</span>
                  <span>{user.preferences.daysBefore} days before</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">New meeting</span>
                  <span>{user.preferences.notifyOnNewMeeting ? "On" : "Off"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Agenda posted</span>
                  <span>{user.preferences.notifyOnAgendaPosted ? "On" : "Off"}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted">No notification preferences set.</p>
            )}
            <Button asChild variant="outline" size="sm" className="mt-4 w-full">
              <Link href="/account/notifications">
                Manage Notifications
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Admin link */}
        {user.role === "admin" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Admin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin">Admin Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
