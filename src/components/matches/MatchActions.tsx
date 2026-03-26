"use client";

import { markContactedAction, markDismissedAction } from "@/actions/match-actions";

export default function MatchActions({ matchId }: { matchId: string }) {
  return (
    <div className="flex gap-1">
      <button
        onClick={() => markContactedAction(matchId)}
        className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded hover:bg-green-100 transition-colors"
        title="Markera som kontaktad"
      >
        Kontaktad
      </button>
      <button
        onClick={() => markDismissedAction(matchId)}
        className="text-xs bg-gray-50 text-gray-500 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
        title="Avfärda"
      >
        Avfärda
      </button>
    </div>
  );
}
