import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getIndustryLabel } from "@/lib/constants";

export default async function ClientsPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const clients = await prisma.client.findMany({
    where: { userId },
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          matches: { where: { contacted: false, dismissed: false } },
        },
      },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-serif">Klienter</h1>
        <Link
          href="/klienter/ny"
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          + Ny klient
        </Link>
      </div>

      {clients.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Inga klienter ännu.</p>
          <Link
            href="/klienter/ny"
            className="text-black hover:underline text-sm mt-2 inline-block"
          >
            Lägg till din första klient
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left p-4 text-sm font-medium text-gray-500">Namn</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Bransch</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Kontaktperson</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Matchningar</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <Link
                      href={`/klienter/${client.id}`}
                      className="text-sm font-medium text-black hover:underline"
                    >
                      {client.name}
                    </Link>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-600">
                      {getIndustryLabel(client.industry)}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {client.contactPerson || "-"}
                  </td>
                  <td className="p-4">
                    {client._count.matches > 0 ? (
                      <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                        {client._count.matches}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">0</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        client.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {client.active ? "Aktiv" : "Inaktiv"}
                    </span>
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
