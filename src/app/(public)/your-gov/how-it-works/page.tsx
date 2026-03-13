import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "How It Works",
  description: "Learn how Patterson city meetings work and how to participate as a resident.",
};

const timeline = [
  {
    step: 1,
    title: "Agenda Published",
    desc: "The City Clerk posts the meeting agenda at least 72 hours before a regular meeting. Special meetings require 24-hour notice.",
  },
  {
    step: 2,
    title: "Agenda Packet Available",
    desc: "Staff reports, draft resolutions, and supporting documents are bundled into the agenda packet, usually available a few days before the meeting.",
  },
  {
    step: 3,
    title: "Public Comment Period",
    desc: "At the start of the meeting, residents can speak on items not on the agenda. Later, each agenda item has its own public comment period.",
  },
  {
    step: 4,
    title: "Council Discussion & Vote",
    desc: "Council members discuss each item, ask staff questions, and vote. A majority (3 of 5) is needed to pass most items.",
  },
  {
    step: 5,
    title: "Minutes Published",
    desc: "After the meeting, the City Clerk prepares minutes that are approved at the next regular meeting and posted online.",
  },
];

const faqs = [
  {
    q: "Can I speak at a meeting?",
    a: "Yes. During the Public Comment period, any resident can speak for up to 3 minutes on items not on the agenda. For items on the agenda, there is a separate comment period. Fill out a speaker card with the City Clerk before the meeting starts.",
  },
  {
    q: "How do I submit written public comment?",
    a: "Email the City Clerk before the meeting with your name, the agenda item number (if applicable), and your comment. Written comments are entered into the official record.",
  },
  {
    q: "What's a Closed Session?",
    a: "Some meetings begin with a Closed Session where the Council discusses legal matters, personnel issues, or real estate negotiations in private, as allowed by the Brown Act. No public comment is taken during Closed Session, but the Council must report any actions taken.",
  },
  {
    q: "What's the difference between a Regular and Special meeting?",
    a: "Regular meetings follow a set schedule (typically 1st and 3rd Tuesday at 7 PM). Special meetings are called for urgent business and require 24-hour public notice. The Council can only discuss items listed on the Special meeting agenda.",
  },
  {
    q: "Where can I watch meetings online?",
    a: "Check the City of Patterson website for live stream links. Some meetings are broadcast on local cable access channels. Recordings may be available after the meeting.",
  },
  {
    q: "How do I get notified about meetings?",
    a: "Sign up for a BPCS account to receive email or SMS reminders before meetings. You can choose which meeting types to follow and how far in advance to be notified.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="max-w-content mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-navy mb-2">
        How City Meetings Work
      </h1>
      <p className="text-muted mb-8 max-w-2xl">
        Understanding the meeting process helps you participate effectively in
        Patterson&apos;s local government.
      </p>

      {/* Timeline */}
      <section className="mb-12">
        <h2 className="font-display text-2xl font-bold text-navy mb-6">
          The Meeting Lifecycle
        </h2>
        <div className="space-y-4">
          {timeline.map((item) => (
            <div key={item.step} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-white text-sm font-bold">
                  {item.step}
                </div>
                {item.step < timeline.length && (
                  <div className="w-0.5 flex-1 bg-navy/20 mt-1" />
                )}
              </div>
              <div className="pb-6">
                <h3 className="font-semibold text-navy">{item.title}</h3>
                <p className="text-sm text-muted mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="font-display text-2xl font-bold text-navy mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <h3 className="font-semibold text-navy mb-2">{faq.q}</h3>
                <p className="text-sm text-muted leading-relaxed">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
