import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f3f3f3] text-[#0d1b35]">
      <AdminSidebar />

      <div className="lg:pl-[262px]">
        {/* <AdminHeader /> */}

        <main className="px-6 pb-10 pt-6 sm:px-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}