import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getIndustryLabel, getLegalAreaLabel } from "@/lib/constants";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user!.id!;

  const client = await prisma.client.findFirst({
    where: { id, userId },
    include: {
      matches: {
        include: { law: true },
        orderBy: { relevanceScore: "desc" },
      },
    },
  });

  if (!client) notFound();

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/klienter" className="hover:text-gray-700">
          Klienter
        </Link>
        <span>/</span>
        <span className="text-gray-900">{client.name}</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
        <Link
          href={`/klienter/${client.id}/redigera`}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          Redigera
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Klientinfo */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Klientinformation</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs text-gray-500">Bransch</dt>
              <dd className="text-sm font-medium">{getIndustryLabel(client.industry)}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Rättsområden</dt>
              <dd className="text-sm">
                {client.legalAreas
                  .split(",")
                  .map(getLegalAreaLabel)
                  .join(", ")}
              </dd>
            </div>
            {client.organizationNr && (
              <div>
                <dt className="text-xs text-gray-500">Org.nummer</dt>
                <dd className="text-sm">{client.organizationNr}</dd>
              </div>
            )}
            {client.contactPerson && (
              <div>
                <dt className="text-xs text-gray-500">Kontaktperson</dt>
                <dd className="text-sm">{client.contactPerson}</dd>
              </div>
            )}
            {client.contactEmail && (
              <div>
                <dt className="text-xs text-gray-500">E-post</dt>
                <dd className="text-sm">{client.contactEmail}</dd>
              </div>
            )}
            {client.notes && (
              <div>
                <dt className="text-xs text-gray-500">Anteckningar</dt>
                <dd className="text-sm">{client.notes}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs text-gray-500">Status</dt>
              <dd>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    client.active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {client.active ? "Aktiv" : "Inaktiv"}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        {/* Matchade lagar */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">
              Matchade lagar ({client.matches.length})
            </h2>
          </div>
          {client.matches.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">Inga matchade lagar ännu.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {client.matches.map((match) => (
                <div key={match.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link
                        href={`/lagar/${match.law.id}`}
                        className="text-sm font-medium text-blue-700 hover:underline"
                      >
                        {match.law.designation} - {match.law.title}
                      </Link>
                      <p className="text-xs text-gray-500 mt-1">
                        {match.matchReason}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Poäng: {match.relevanceScore}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${
                        match.recommendation === "kontakta"
                          ? "bg-red-100 text-red-700"
                          : match.recommendation === "bevaka"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {match.recommendation}
                    </span>
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
