export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">LagBevakning</h1>
          <p className="text-blue-600 mt-1">Bevaka lagar. Skydda kunder.</p>
        </div>
        {children}
      </div>
    </div>
  );
}
