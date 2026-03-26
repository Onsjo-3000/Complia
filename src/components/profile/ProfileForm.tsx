"use client";

import { useState } from "react";
import { updateProfileAction } from "@/actions/profile-actions";

interface ProfileFormProps {
  initialData: {
    email: string;
    firmName: string;
    phone: string;
  };
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    try {
      const result = await updateProfileAction(formData);

      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setSuccess(true);
      }
    } catch {
      setError("Något gick fel. Försök igen.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">
          Profilen har uppdaterats.
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Byrånamn *
        </label>
        <input
          type="text"
          name="firmName"
          required
          defaultValue={initialData.firmName}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          E-postadress *
        </label>
        <input
          type="email"
          name="email"
          required
          defaultValue={initialData.email}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Telefonnummer
        </label>
        <input
          type="tel"
          name="phone"
          defaultValue={initialData.phone}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
          placeholder="08-123 456"
        />
      </div>

      <hr className="border-gray-200" />

      <p className="text-sm text-gray-500">
        Lämna lösenordsfälten tomma om du inte vill byta lösenord.
      </p>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nuvarande lösenord
        </label>
        <input
          type="password"
          name="currentPassword"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nytt lösenord (minst 6 tecken)
        </label>
        <input
          type="password"
          name="newPassword"
          minLength={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
      >
        {loading ? "Sparar..." : "Spara ändringar"}
      </button>
    </form>
  );
}
