"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    // LocalStorage check
    const adminInfo = JSON.parse(localStorage.getItem("admin"));

    if (!adminInfo || adminInfo.role !== "admin") {
      router.push("/admin-login"); // redirect to login
    }
  }, [router]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">🛠 Admin Dashboard</h1>
      <p>Welcome, Super Admin! You have full control over the system.</p>
    </div>
  );
}
