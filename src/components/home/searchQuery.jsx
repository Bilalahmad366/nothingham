"use client";
import { useState } from "react";
import {
  HotelSearch,
  FlightSearch,
  HotelFlightSearch,
  PackagesSearch,
} from "./index";
import { FaHotel, FaPlane, FaSuitcase, FaClipboardList } from "react-icons/fa";

const SearchQueries = () => {
  const [activeTab, setActiveTab] = useState("flights");

  const tabs = [
    {
      key: "flights",
      label: "Flights",
      icon: <FaPlane className="inline-block mr-2" />,
    },
    {
      key: "hotels",
      label: "Hotels",
      icon: <FaHotel className="inline-block mr-2" />,
    },
    {
      key: "hotelFlight",
      label: "Hotel + Flight",
      icon: <FaSuitcase className="inline-block mr-2" />,
    },
    {
      key: "packages",
      label: "Packages",
      icon: <FaClipboardList className="inline-block mr-2" />,
    },
  ];

  const renderTabComponent = () => {
    switch (activeTab) {
      case "flights":
        return <FlightSearch />;
      case "hotels":
        return <HotelSearch />;
      case "hotelFlight":
        return <HotelFlightSearch />;
      case "packages":
        return <PackagesSearch />;
      default:
        return null;
    }
  };

  return (
    <section className="px-2 lg:px-6 py-16">
      {/* Tabs with Icons */}
      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-2 rounded-full font-semibold flex items-center transition-all duration-300
              ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6 min-h-[200px]">{renderTabComponent()}</div>
    </section>
  );
};

export default SearchQueries;
