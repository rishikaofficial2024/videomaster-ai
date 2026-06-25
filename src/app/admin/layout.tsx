"use client";

import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen flex bg-[#03010a]">
        <AdminSidebar />
        <div className="flex-1 relative overflow-x-hidden">
          {children}
        </div>
      </div>
    </AdminGuard>
  );
}
