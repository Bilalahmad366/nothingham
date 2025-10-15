"use client";

import Header from "../../components/layouts/header";
import Footer from "../../components/layouts/footer";
import ScrollToTop from "../../components/layouts/scroll-to-top";
import TopBar from "../../components/layouts/TopBar";

export default function AppLayout({ children }) {
  return (
    <div className="relative flex flex-col min-h-screen">
      <ScrollToTop />

      {/* TopBar */}
      <TopBar />

      {/* Header sticky */}
      <Header topOffset="36px" />

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
