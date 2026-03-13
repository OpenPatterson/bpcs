import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home — Better Patterson Council Site",
  description:
    "Stay informed about Patterson, CA city council meetings. View agendas, AI summaries, and sign up for meeting reminders.",
};

export default function HomePage() {
  return (
    <div className="max-w-content mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero - Next Meeting */}
      <section className="mb-12">
        <h1 className="font-display text-3xl font-bold text-navy mb-2 sm:text-4xl">
          Patterson City Government
        </h1>
        <p className="text-lg text-muted mb-8">
          Making local government accessible to every resident.
        </p>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted mb-1">
            Next Meeting
          </p>
          <p className="text-muted">
            No upcoming meetings found. Run the scraper to populate meeting data.
          </p>
        </div>
      </section>

      {/* Upcoming Meetings */}
      <section className="mb-12">
        <h2 className="font-display text-2xl font-bold text-navy mb-4">
          Upcoming Meetings
        </h2>
        <p className="text-muted">No upcoming meetings yet.</p>
      </section>

      {/* Recent Meetings */}
      <section className="mb-12">
        <h2 className="font-display text-2xl font-bold text-navy mb-4">
          Recent Meetings
        </h2>
        <p className="text-muted">No recent meetings yet.</p>
      </section>

      {/* Notification Strip */}
      <section className="rounded-lg bg-navy p-6 text-white text-center">
        <h2 className="font-display text-xl font-bold mb-2">
          Get Meeting Reminders
        </h2>
        <p className="text-navy-200 mb-4">
          Sign up to get notified before Patterson city meetings.
        </p>
        <div className="flex max-w-md mx-auto gap-2">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 rounded-md px-4 py-2 text-text bg-white placeholder:text-muted"
            disabled
          />
          <button
            className="rounded-md bg-red px-6 py-2 font-semibold text-white hover:bg-red-600 transition-colors"
            disabled
          >
            Notify Me
          </button>
        </div>
        <p className="text-xs text-navy-300 mt-2">
          Account signup coming soon.
        </p>
      </section>
    </div>
  );
}
