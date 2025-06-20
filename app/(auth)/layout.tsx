import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative min-h-screen w-full bg-primary overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/Shape.png"
          alt="Shape"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        {children}
      </div>
    </main>
  );
}
