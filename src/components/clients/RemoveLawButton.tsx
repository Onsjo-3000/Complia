"use client";

import { removeLawFromClientAction } from "@/actions/client-law-actions";

export default function RemoveLawButton({ matchId }: { matchId: string }) {
  async function handleRemove() {
    if (!confirm("Vill du ta bort denna lag från klienten?")) return;
    await removeLawFromClientAction(matchId);
  }

  return (
    <button
      onClick={handleRemove}
      className="text-xs text-gray-400 hover:text-red-600 transition-colors"
      title="Ta bort från klient"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );
}
