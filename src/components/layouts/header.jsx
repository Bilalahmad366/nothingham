"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaHome, FaTag, FaPlane, FaRegClipboard } from "react-icons/fa";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";

const Header = ({ stickyOffset = "0px" }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home", icon: <FaHome /> },
    { href: "/special-offers", label: "Special Offers", icon: <FaTag /> },
    { href: "/hajj-umrah", label: "Hajj & Umrah", icon: <FaPlane /> },
    { href: "/tailor-made-query", label: "Tailor Made Query", icon: <FaRegClipboard /> },
  ];

  return (
    <header
      className="z-50 bg-white dark:bg-black shadow-sm sticky"
      style={{ top: stickyOffset }}
    >
      <div className="relative flex w-full items-center px-5 py-3">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center">
          <img
            className="inline w-24 ltr:-ml-1 rtl:-mr-1 mb-1"
            src="https://nottinghamtravel.co.uk/App_Themes/Theme1/nt15032021/nt150321/images/ManageHome/Logo/logo.png"
            alt="logo"
          />
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden ml-10 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <HiOutlineMenuAlt3 className="h-6 w-6 text-gray-700 dark:text-gray-200" />
        </button>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex ml-auto font-semibold lg:pr-10 text-black dark:text-white-dark">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`group relative flex items-center px-4 py-2 transition-all duration-300 ${
                    active
                      ? "text-primary font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary"
                  }`}
                >
                  <span
                    className={`mr-2 text-lg transition-colors duration-300 ${
                      active ? "text-primary" : "group-hover:text-primary"
                    }`}
                  >
                    {link.icon}
                  </span>
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-primary/80 to-blue-400 rounded-full transition-all duration-300 group-hover:w-full ${
                      active ? "w-full" : ""
                    }`}
                  ></span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-gray-900 shadow-xl py-2 px-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <img
                  className="w-24"
                  src="https://nottinghamtravel.co.uk/App_Themes/Theme1/nt15032021/nt150321/images/ManageHome/Logo/logo.png"
                  alt="logo"
                />
                <button onClick={() => setIsOpen(false)}>
                  <HiOutlineX className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                </button>
              </div>
              <nav className="flex flex-col gap-3 font-medium text-gray-800 dark:text-gray-200">
                {navLinks.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-300 ${
                        active
                          ? "bg-primary/10 text-primary font-semibold border-l-4 border-primary"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary"
                      }`}
                    >
                      {link.icon} {link.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
