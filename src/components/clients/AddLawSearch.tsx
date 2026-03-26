"use client";

import { useState } from "react";
import { searchLawsAction, addLawToClientAction } from "@/actions/client-law-actions";

interface SearchResult {
  id: string;
  designation: string;
  title: string;
  publishedDate: string;
}

export default function AddLawSearch({ clientId }: { clientId: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSearch(value: string) {
    setQuery(value);
    setMessage("");
    if (value.length < 2) {
      setResults([]);
      return;
    }

    setSearching(true);
    const laws = await searchLawsAction(value);
    setResults(laws);
    setSearching(false);
  }

  async function handleAdd(lawId: string) {
    const result = await addLawToClientAction(clientId, lawId);
    if (result.error) {
      setMessage(result.error);
    } else {
      setMessage("Lagen har lagts till.");
      setResults((prev) => prev.filter((r) => r.id !== lawId));
    }
  }

  return (
    <div>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Sök lag (t.ex. SFS 2026 eller miljö)..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none text-sm"
        />
        {searching && (
          <span className="absolute right-3 top-2.5 text-xs text-gray-400">
            Söker...
          </span>
        )}
      </div>

      {message && (
        <p className={`text-xs mt-2 ${message.includes("lagts till") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}

      {results.length > 0 && (
        <div className="mt-2 border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-60 overflow-y-auto">
          {results.map((law) => (
            <div key={law.id} className="p-3 flex items-center justify-between gap-3 hover:bg-gray-50">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {law.designation}
                </p>
                <p className="text-xs text-gray-500 truncate">{law.title}</p>
              </div>
              <button
                onClick={() => handleAdd(law.id)}
                className="text-xs bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors flex-shrink-0"
              >
                Lägg till
              </button>
            </div>
          ))}
        </div>
      )}

      {query.length >= 2 && results.length === 0 && !searching && (
        <p className="text-xs text-gray-400 mt-2">Inga lagar hittades.</p>
      )}
    </div>
  );
}
