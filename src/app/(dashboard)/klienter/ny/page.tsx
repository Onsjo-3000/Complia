import Link from "next/link";
import ClientForm from "@/components/clients/ClientForm";
import { createClientAction } from "@/actions/client-actions";

export default function NewClientPage() {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/klienter" className="hover:text-gray-700">
          Klienter
        </Link>
        <span>/</span>
        <span className="text-gray-900">Ny klient</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Ny klient</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ClientForm action={createClientAction} />
      </div>
    </div>
  );
}
