import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "About the Better Patterson Council Site and Open Patterson volunteer organization.",
};

export default function AboutPage() {
  return (
    <div className="max-w-content mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-navy mb-6">
        About BPCS
      </h1>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <section>
            <h2 className="font-display text-xl font-bold text-navy mb-3">
              Our Mission
            </h2>
            <p className="text-foreground leading-relaxed">
              The Better Patterson Council Site (BPCS) makes Patterson, CA local
              government accessible to every resident. We believe that civic
              engagement starts with knowing what your city government is doing —
              and making that information easy to find, read, and understand.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-navy mb-3">
              What We Do
            </h2>
            <ul className="space-y-2 text-foreground">
              <li className="flex gap-2">
                <span className="text-navy font-bold">1.</span>
                <span>
                  <strong>Aggregate meeting data</strong> from the city&apos;s official
                  platforms and present it in a clean, searchable interface.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-navy font-bold">2.</span>
                <span>
                  <strong>Summarize agendas with AI</strong> so residents can quickly
                  understand what&apos;s being discussed without reading 100-page packets.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-navy font-bold">3.</span>
                <span>
                  <strong>Send notifications</strong> so you never miss a meeting that
                  matters to you.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-navy font-bold">4.</span>
                <span>
                  <strong>Explain how city government works</strong> in plain language,
                  including how to participate in public meetings.
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-navy mb-3">
              Open Source
            </h2>
            <p className="text-foreground leading-relaxed mb-3">
              BPCS is fully open source under the MIT license. We believe civic
              technology should be transparent, auditable, and replicable. If your
              city needs a similar tool, fork our code and adapt it.
            </p>
            <Button asChild variant="outline" size="sm">
              <a
                href="https://github.com/OpenPatterson/bpcs"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-1.5 h-4 w-4" />
                View on GitHub
              </a>
            </Button>
          </section>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="font-display text-xl font-bold text-navy mb-3">
                Open Patterson
              </h2>
              <p className="text-foreground leading-relaxed mb-4">
                BPCS is built by Open Patterson, a volunteer civic-technology
                organization focused on the Patterson, CA and greater Stanislaus
                County area. We build tools that help residents engage with their
                local government.
              </p>
              <div className="space-y-2">
                <a
                  href="https://openpatterson.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-navy hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  openpatterson.org
                </a>
                <a
                  href="mailto:carlos@openpatterson.org"
                  className="flex items-center gap-2 text-sm text-navy hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  carlos@openpatterson.org
                </a>
                <a
                  href="https://github.com/OpenPatterson"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-navy hover:underline"
                >
                  <Github className="h-4 w-4" />
                  github.com/OpenPatterson
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="font-display text-xl font-bold text-navy mb-3">
                AI Transparency
              </h2>
              <p className="text-foreground leading-relaxed">
                BPCS uses Anthropic&apos;s Claude AI to generate plain-language
                summaries of meeting agendas and to translate content into
                Spanish, Chinese, Vietnamese, and Tagalog. AI summaries are
                clearly labeled and always accompanied by links to official
                documents. They are intended to improve accessibility, not to
                replace authoritative city records.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="font-display text-xl font-bold text-navy mb-3">
                Feedback
              </h2>
              <p className="text-foreground leading-relaxed">
                Found a bug? Have a feature idea? Want to volunteer?
                Reach out at{" "}
                <a
                  href="mailto:carlos@openpatterson.org"
                  className="text-navy underline"
                >
                  carlos@openpatterson.org
                </a>{" "}
                or open an issue on{" "}
                <a
                  href="https://github.com/OpenPatterson/bpcs/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-navy underline"
                >
                  GitHub
                </a>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
