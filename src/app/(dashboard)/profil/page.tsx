import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProfileForm from "@/components/profile/ProfileForm";

export default async function ProfilePage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const user = await prisma.user.findUnique({ where: { id: userId } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Profil</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
        <ProfileForm
          initialData={{
            email: user!.email,
            firmName: user!.firmName,
            phone: user!.phone || "",
          }}
        />
      </div>
    </div>
  );
}
