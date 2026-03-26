"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [fetching, setFetching] = useState(false);
  const [fetchResult, setFetchResult] = useState("");
  const [origin, setOrigin] = useState("");

  async function triggerFetch() {
    setFetching(true);
    setFetchResult("");
    try {
      const res = await fetch(
        `/api/cron/fetch-laws?secret=${encodeURIComponent(
          process.env.NEXT_PUBLIC_CRON_SECRET || "cron-secret-change-in-production"
        )}`
      );
      const data = await res.json();
      if (data.error) {
        setFetchResult(`Fel: ${data.error}`);
      } else {
        setFetchResult(
          `Hämtade ${data.lawsFound} lagar, skapade ${data.matchesCreated} matchningar.`
        );
      }
    } catch {
      setFetchResult("Kunde inte ansluta till servern.");
    }
    setFetching(false);
  }

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Inställningar</h1>

      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Laghämtning</h2>
          <p className="text-sm text-gray-600 mb-4">
            Trigga manuell hämtning av nya lagar från Riksdagen. Detta sker
            normalt automatiskt via CRON-endpoint.
          </p>
          <button
            onClick={triggerFetch}
            disabled={fetching}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {fetching ? "Hämtar..." : "Hämta nya lagar"}
          </button>
          {fetchResult && (
            <p className="text-sm text-gray-700 mt-3 bg-gray-50 p-3 rounded-lg">
              {fetchResult}
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">
            CRON-konfiguration
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            För att automatisera laghämtning, konfigurera en extern CRON-tjänst
            som anropar:
          </p>
          <code className="text-sm bg-gray-100 px-3 py-2 rounded block text-gray-800 break-all" suppressHydrationWarning>
            GET {origin}/api/cron/fetch-laws?secret=CRON_SECRET
          </code>
          <p className="text-xs text-gray-500 mt-2">
            Rekommenderad frekvens: en gång per dag.
          </p>
        </div>
      </div>
    </div>
  );
}
