export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-black tracking-tight font-serif">Complia</h1>
          <p className="text-gray-400 text-sm mt-2">Bevaka lagar. Skydda kunder.</p>
        </div>
        {children}
      </div>
    </div>
  );
}
