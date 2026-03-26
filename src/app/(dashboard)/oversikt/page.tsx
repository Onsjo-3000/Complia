import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getIndustryLabel } from "@/lib/constants";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const [clientCount, lawCount, matchCount, recentLaws, urgentMatches] =
    await Promise.all([
      prisma.client.count({ where: { userId, active: true } }),
      prisma.law.count(),
      prisma.lawMatch.count({
        where: {
          client: { userId },
          contacted: false,
          dismissed: false,
        },
      }),
      prisma.law.findMany({
        orderBy: { publishedDate: "desc" },
        take: 5,
      }),
      prisma.lawMatch.findMany({
        where: {
          client: { userId },
          contacted: false,
          dismissed: false,
        },
        include: { law: true, client: true },
        orderBy: { relevanceScore: "desc" },
        take: 5,
      }),
    ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Översikt</h1>

      {/* Statistikkort */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-sm text-gray-500">Aktiva klienter</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{clientCount}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-sm text-gray-500">Bevakade lagar</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{lawCount}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-sm text-gray-500">Ohanterade matchningar</p>
          <p className="text-3xl font-bold text-blue-700 mt-1">{matchCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Senaste lagar */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Senaste lagar</h2>
            <Link href="/lagar" className="text-sm text-blue-700 hover:underline">
              Visa alla
            </Link>
          </div>
          {recentLaws.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">
              Inga lagar hämtade ännu. Trigga en hämtning via inställningar.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentLaws.map((law) => (
                <Link
                  key={law.id}
                  href={`/lagar/${law.id}`}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <p className="text-sm font-medium text-gray-900">
                    {law.designation} - {law.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {law.publishedDate.toLocaleDateString("sv-SE")}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Brådskande matchningar */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Brådskande matchningar</h2>
            <Link href="/matchningar" className="text-sm text-blue-700 hover:underline">
              Visa alla
            </Link>
          </div>
          {urgentMatches.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">
              Inga ohanterade matchningar.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {urgentMatches.map((match) => (
                <div key={match.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {match.client.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {match.law.designation} - {match.law.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getIndustryLabel(match.client.industry)}
                      </p>
                    </div>
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
