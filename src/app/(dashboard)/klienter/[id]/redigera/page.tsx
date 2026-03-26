import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ClientForm from "@/components/clients/ClientForm";
import { updateClientAction } from "@/actions/client-actions";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user!.id!;

  const client = await prisma.client.findFirst({
    where: { id, userId },
  });

  if (!client) notFound();

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/klienter" className="hover:text-gray-700">
          Klienter
        </Link>
        <span>/</span>
        <Link href={`/klienter/${client.id}`} className="hover:text-gray-700">
          {client.name}
        </Link>
        <span>/</span>
        <span className="text-gray-900">Redigera</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6 font-serif">
        Redigera {client.name}
      </h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ClientForm
          action={updateClientAction}
          initialData={{
            id: client.id,
            name: client.name,
            organizationNr: client.organizationNr,
            industry: client.industry,
            legalAreas: client.legalAreas,
            contactEmail: client.contactEmail,
            contactPerson: client.contactPerson,
            notes: client.notes,
            active: client.active,
          }}
        />
      </div>
    </div>
  );
}
