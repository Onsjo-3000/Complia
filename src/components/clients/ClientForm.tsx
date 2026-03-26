"use client";

import { useState } from "react";
import { INDUSTRIES, LEGAL_AREAS } from "@/lib/constants";

interface ClientFormProps {
  action: (formData: FormData) => Promise<{ error?: string } | undefined>;
  initialData?: {
    id?: string;
    name: string;
    organizationNr: string | null;
    industry: string;
    legalAreas: string;
    contactEmail: string | null;
    contactPerson: string | null;
    notes: string | null;
    active?: boolean;
  };
}

export default function ClientForm({ action, initialData }: ClientFormProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const selectedAreas = initialData?.legalAreas?.split(",") || [];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await action(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {initialData?.id && (
        <input type="hidden" name="clientId" value={initialData.id} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Klientnamn *
          </label>
          <input
            type="text"
            name="name"
            required
            defaultValue={initialData?.name}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organisationsnummer
          </label>
          <input
            type="text"
            name="organizationNr"
            defaultValue={initialData?.organizationNr || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
            placeholder="XXXXXX-XXXX"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bransch *
        </label>
        <select
          name="industry"
          required
          defaultValue={initialData?.industry || ""}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
        >
          <option value="">Välj bransch...</option>
          {INDUSTRIES.map((i) => (
            <option key={i.value} value={i.value}>
              {i.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rättsområden * (välj ett eller flera)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {LEGAL_AREAS.map((area) => (
            <label
              key={area.value}
              className="flex items-center gap-2 text-sm text-gray-700"
            >
              <input
                type="checkbox"
                name="legalAreas"
                value={area.value}
                defaultChecked={selectedAreas.includes(area.value)}
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              {area.label}
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kontaktperson
          </label>
          <input
            type="text"
            name="contactPerson"
            defaultValue={initialData?.contactPerson || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kontakt e-post
          </label>
          <input
            type="email"
            name="contactEmail"
            defaultValue={initialData?.contactEmail || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Anteckningar
        </label>
        <textarea
          name="notes"
          rows={3}
          defaultValue={initialData?.notes || ""}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
        />
      </div>

      {initialData && (
        <div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="hidden"
              name="active"
              value={initialData.active !== false ? "true" : "false"}
            />
            <input
              type="checkbox"
              defaultChecked={initialData.active !== false}
              onChange={(e) => {
                const hidden = e.target.previousSibling as HTMLInputElement;
                hidden.value = e.target.checked ? "true" : "false";
              }}
              className="rounded border-gray-300 text-black focus:ring-black"
            />
            Aktiv klient
          </label>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
      >
        {loading ? "Sparar..." : initialData ? "Uppdatera" : "Skapa klient"}
      </button>
    </form>
  );
}
