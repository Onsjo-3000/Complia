import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getIndustryLabel } from "@/lib/constants";

export default async function LawDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user!.id!;

  const law = await prisma.law.findUnique({
    where: { id },
    include: {
      matches: {
        where: { client: { userId } },
        include: { client: true },
        orderBy: { relevanceScore: "desc" },
      },
    },
  });

  if (!law) notFound();

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/lagar" className="hover:text-gray-700">
          Lagar
        </Link>
        <span>/</span>
        <span className="text-gray-900">{law.designation}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Laginfo */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h1 className="text-xl font-bold text-gray-900 mb-2 font-serif">
            {law.designation}
          </h1>
          <h2 className="text-sm text-gray-700 mb-4">{law.title}</h2>

          <dl className="space-y-3">
            {law.summary && (
              <div>
                <dt className="text-xs text-gray-500">Sammanfattning</dt>
                <dd className="text-sm mt-1">{law.summary}</dd>
              </div>
            )}
            {law.category && (
              <div>
                <dt className="text-xs text-gray-500">Kategori</dt>
                <dd className="text-sm">{law.category}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs text-gray-500">Publiceringsdatum</dt>
              <dd className="text-sm">
                {law.publishedDate.toLocaleDateString("sv-SE")}
              </dd>
            </div>
            {law.documentUrl && (
              <div>
                <a
                  href={law.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-black hover:underline"
                >
                  Visa på Riksdagen.se
                </a>
              </div>
            )}
          </dl>
        </div>

        {/* Matchade kunder */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">
              Påverkade kunder ({law.matches.length})
            </h2>
          </div>
          {law.matches.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">
              Inga av dina kunder matchas av denna lag.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {law.matches.map((match) => (
                <div key={match.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link
                        href={`/klienter/${match.client.id}`}
                        className="text-sm font-medium text-black hover:underline"
                      >
                        {match.client.name}
                      </Link>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {getIndustryLabel(match.client.industry)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {match.matchReason}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-400">
                        {match.relevanceScore}%
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          match.recommendation === "kontakta"
                            ? "bg-red-100 text-red-700"
                            : match.recommendation === "bevaka"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {match.recommendation}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
