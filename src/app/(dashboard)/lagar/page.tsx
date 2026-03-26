import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function LawsPage() {
  const laws = await prisma.law.findMany({
    orderBy: { publishedDate: "desc" },
    include: {
      _count: { select: { matches: true } },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Lagar</h1>

      {laws.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Inga lagar hämtade ännu.</p>
          <p className="text-sm text-gray-400 mt-1">
            Trigga en hämtning via CRON-endpointen eller inställningar.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left p-4 text-sm font-medium text-gray-500">Beteckning</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Titel</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Kategori</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Datum</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Matchningar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {laws.map((law) => (
                <tr key={law.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <Link
                      href={`/lagar/${law.id}`}
                      className="text-sm font-medium text-black hover:underline"
                    >
                      {law.designation}
                    </Link>
                  </td>
                  <td className="p-4 text-sm text-gray-900 max-w-md truncate">
                    {law.title}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {law.category || "-"}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {law.publishedDate.toLocaleDateString("sv-SE")}
                  </td>
                  <td className="p-4">
                    {law._count.matches > 0 ? (
                      <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                        {law._count.matches}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">0</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
