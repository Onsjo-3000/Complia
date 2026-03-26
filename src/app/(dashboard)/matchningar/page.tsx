import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getIndustryLabel } from "@/lib/constants";
import MatchActions from "@/components/matches/MatchActions";

export default async function MatchesPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const matches = await prisma.lawMatch.findMany({
    where: { client: { userId } },
    include: { law: true, client: true },
    orderBy: [
      { contacted: "asc" },
      { dismissed: "asc" },
      { relevanceScore: "desc" },
    ],
  });

  const pending = matches.filter((m) => !m.contacted && !m.dismissed);
  const handled = matches.filter((m) => m.contacted || m.dismissed);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Matchningar</h1>

      {matches.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Inga matchningar ännu.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Ohanterade */}
          {pending.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Ohanterade ({pending.length})
              </h2>
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                {pending.map((match) => (
                  <div key={match.id} className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-gray-900">
                            {match.client.name}
                          </span>
                          <span className="text-xs text-gray-400">
                            {getIndustryLabel(match.client.industry)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {match.law.designation} - {match.law.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {match.matchReason}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            match.recommendation === "kontakta"
                              ? "bg-red-100 text-red-700"
                              : match.recommendation === "bevaka"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {match.recommendation}
                        </span>
                        <span className="text-xs text-gray-400">
                          {match.relevanceScore}%
                        </span>
                        <MatchActions matchId={match.id} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hanterade */}
          {handled.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-500 mb-3">
                Hanterade ({handled.length})
              </h2>
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 opacity-60">
                {handled.map((match) => (
                  <div key={match.id} className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-sm text-gray-700">
                          {match.client.name}
                        </span>
                        <span className="text-xs text-gray-400 ml-2">
                          {match.law.designation}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          match.contacted
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {match.contacted ? "Kontaktad" : "Avfärdad"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
