"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

export default function AdminLayout({ children }) {
  const [admin, setAdmin] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const info = localStorage.getItem("admin");
    if (!info) {
      router.push("/admin-login");
    } else {
      try {
        const parsed = JSON.parse(info);
        if (parsed.role !== "admin") {
          router.push("/admin-login");
        } else {
          setAdmin(parsed);
        }
      } catch {
        router.push("/admin-login");
      }
    }
  }, [router]);

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Markups", href: "/admin/markups" },
    { name: "Users", href: "/admin/users" },
    { name: "Bookings", href: "/admin/bookings" },
    { name: "Reports", href: "/admin/reports" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    router.push("/admin-login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header/Navbar */}
      <header className="bg-gray-800 text-white shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand + Nav */}
            <div className="flex items-center space-x-8">
              <Link href="/admin/dashboard" className="text-xl font-semibold">
                Admin Panel
              </Link>

              <nav className="hidden md:flex space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === item.href
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right: Profile + Icons */}
            <div className="flex items-center space-x-4">
       

              {admin && (
                <div className="hidden sm:flex items-center space-x-2">
                  <img
                    src={admin?.avatar || "/assets/profile-default.jpg"}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full border border-gray-600"
                  />
                  <span className="text-sm">{admin?.name || "Admin"}</span>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 bg-lime-600 hover:bg-lime-700 text-white px-3 py-1 rounded-md text-sm"
              >
                <LogOut size={16} /> 
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Page Header (Title Section) */}
      <div className="bg-white border-b shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 capitalize">
            {pathname.split("/").pop() || "Dashboard"}
          </h1>
        </div>
      </div>

      {/* Page Content */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
