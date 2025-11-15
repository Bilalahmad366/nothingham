"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";

export default function AdminLayout({ children }) {
  const [admin, setAdmin] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
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
    { name: "Bookings", href: "/admin/bookings" },
    { name: "Tailer made Queries", href: "/admin/tailer-made-queries" },
    { name: "Manage Offers", href: "/admin/offers" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    router.push("/admin-login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header/Navbar */}
      <header className="bg-[#2A7B9B] text-white shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Brand */}
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard" className="text-xl font-semibold">
                <img
                  className="inline h-14 ltr:-ml-1 rtl:-mr-1 mb-1"
                  src="/assets/Notigham-logo.png"
                  alt="logo nottingham"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
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

            {/* Right: Profile + Logout */}
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

              {/* Mobile menu button */}
              <button
                className="md:hidden flex items-center ml-2"
                onClick={() => setMobileOpen((prev) => !prev)}
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <nav className="md:hidden bg-gray-800 border-t border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === item.href
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        )}
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
