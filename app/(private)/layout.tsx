import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/Sidebar";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      <div className="sticky top-0 h-screen z-20">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="sticky top-0 z-20">
          <Navbar />
        </div>
        <main className="p-5">{children}</main>
      </div>
    </div>
  );
}
