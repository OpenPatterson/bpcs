"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle, XCircle } from "lucide-react";

interface ScraperResult {
  success: boolean;
  count?: number;
  created?: number;
  updated?: number;
  processed?: number;
  failed?: number;
  summarized?: number;
  error?: string;
}

const scrapers = [
  {
    id: "civicplus",
    name: "CivicPlus (Current)",
    desc: "Scrapes pattersonca.gov/AgendaCenter for meetings from Oct 2025 onward.",
    endpoint: "/api/scrape/civicplus",
  },
  {
    id: "iqm2",
    name: "IQM2 (Legacy)",
    desc: "Scrapes pattersonca.iqm2.com for historical meetings (2020-2025).",
    endpoint: "/api/scrape/iqm2",
  },
  {
    id: "agendas",
    name: "Agenda Content",
    desc: "Fetches agenda HTML and converts to Markdown for meetings missing agenda text.",
    endpoint: "/api/scrape/agendas",
  },
  {
    id: "summarize",
    name: "AI Summarize",
    desc: "Generates AI summaries for meetings with agendas but no summary.",
    endpoint: "/api/scrape/summarize",
  },
];

export default function ScraperPage() {
  const [results, setResults] = useState<Record<string, ScraperResult>>({});
  const [running, setRunning] = useState<Record<string, boolean>>({});

  async function runScraper(id: string, endpoint: string) {
    setRunning((r) => ({ ...r, [id]: true }));
    setResults((r) => ({ ...r, [id]: undefined as unknown as ScraperResult }));

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${prompt("Enter CRON_SECRET:")}`,
        },
      });
      const data = await res.json();
      setResults((r) => ({ ...r, [id]: data }));
    } catch (error) {
      setResults((r) => ({
        ...r,
        [id]: { success: false, error: "Network error" },
      }));
    }

    setRunning((r) => ({ ...r, [id]: false }));
  }

  return (
    <div className="max-w-content mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-navy mb-6">
        Scraper Management
      </h1>

      <div className="space-y-4">
        {scrapers.map((scraper) => (
          <Card key={scraper.id}>
            <CardHeader>
              <CardTitle className="text-lg">{scraper.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted mb-3">{scraper.desc}</p>
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  onClick={() => runScraper(scraper.id, scraper.endpoint)}
                  disabled={running[scraper.id]}
                >
                  <RefreshCw
                    className={`mr-1.5 h-4 w-4 ${running[scraper.id] ? "animate-spin" : ""}`}
                  />
                  {running[scraper.id] ? "Running..." : "Run Now"}
                </Button>
                {results[scraper.id] && (
                  <span className="flex items-center gap-1 text-sm">
                    {results[scraper.id].success ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-700">
                          {results[scraper.id].count !== undefined &&
                            `${results[scraper.id].count} found`}
                          {results[scraper.id].created !== undefined &&
                            `, ${results[scraper.id].created} created`}
                          {results[scraper.id].updated !== undefined &&
                            `, ${results[scraper.id].updated} updated`}
                          {results[scraper.id].processed !== undefined &&
                            `${results[scraper.id].processed} processed`}
                          {results[scraper.id].summarized !== undefined &&
                            `${results[scraper.id].summarized} summarized`}
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="text-red-700">
                          {results[scraper.id].error || "Failed"}
                        </span>
                      </>
                    )}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
