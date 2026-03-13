"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MEETING_TYPES } from "@/lib/constants";

interface Prefs {
  emailEnabled: boolean;
  smsEnabled: boolean;
  notifyOnNewMeeting: boolean;
  notifyOnAgendaPosted: boolean;
  notifyOnMinutes: boolean;
  meetingTypes: string[];
  daysBefore: number;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [prefs, setPrefs] = useState<Prefs>({
    emailEnabled: true,
    smsEnabled: false,
    notifyOnNewMeeting: true,
    notifyOnAgendaPosted: true,
    notifyOnMinutes: false,
    meetingTypes: [],
    daysBefore: 3,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/notifications/preferences")
      .then((r) => r.json())
      .then((data) => {
        if (data.preferences) setPrefs(data.preferences);
      })
      .catch(() => {});
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/notifications/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // handle error
    }
    setSaving(false);
  }

  function toggle(key: keyof Prefs) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  }

  function toggleMeetingType(type: string) {
    setPrefs((p) => ({
      ...p,
      meetingTypes: p.meetingTypes.includes(type)
        ? p.meetingTypes.filter((t) => t !== type)
        : [...p.meetingTypes, type],
    }));
  }

  return (
    <div className="max-w-content mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-navy mb-6">
        Notification Preferences
      </h1>

      <div className="max-w-lg space-y-6">
        {/* Channels */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Channels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm">Email notifications</span>
              <input
                type="checkbox"
                checked={prefs.emailEnabled}
                onChange={() => toggle("emailEnabled")}
                className="h-4 w-4 rounded border-gray-300"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">SMS notifications</span>
              <input
                type="checkbox"
                checked={prefs.smsEnabled}
                onChange={() => toggle("smsEnabled")}
                className="h-4 w-4 rounded border-gray-300"
              />
            </label>
          </CardContent>
        </Card>

        {/* What to notify */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notify me when...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm">New meeting scheduled</span>
              <input
                type="checkbox"
                checked={prefs.notifyOnNewMeeting}
                onChange={() => toggle("notifyOnNewMeeting")}
                className="h-4 w-4 rounded border-gray-300"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">Agenda posted</span>
              <input
                type="checkbox"
                checked={prefs.notifyOnAgendaPosted}
                onChange={() => toggle("notifyOnAgendaPosted")}
                className="h-4 w-4 rounded border-gray-300"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">Minutes published</span>
              <input
                type="checkbox"
                checked={prefs.notifyOnMinutes}
                onChange={() => toggle("notifyOnMinutes")}
                className="h-4 w-4 rounded border-gray-300"
              />
            </label>
          </CardContent>
        </Card>

        {/* Reminder timing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Reminder timing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {[1, 2, 3, 7].map((d) => (
                <button
                  key={d}
                  onClick={() => setPrefs((p) => ({ ...p, daysBefore: d }))}
                  className={`rounded-full px-3 py-1 text-sm border transition-colors ${
                    prefs.daysBefore === d
                      ? "bg-navy text-white border-navy"
                      : "bg-white text-muted border-border hover:border-navy"
                  }`}
                >
                  {d} day{d !== 1 ? "s" : ""} before
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Meeting types */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Meeting types</CardTitle>
            <p className="text-xs text-muted">
              Leave all unchecked to receive notifications for all types.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {MEETING_TYPES.map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={prefs.meetingTypes.includes(type)}
                    onChange={() => toggleMeetingType(type)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span className="text-sm">{type}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Preferences"}
          </Button>
          {saved && (
            <span className="text-sm text-green-700">Saved!</span>
          )}
        </div>
      </div>
    </div>
  );
}
