"use client";
import { useState } from "react";
import { FaPlane, FaHotel, FaSuitcase, FaClipboardList } from "react-icons/fa";
import TabPills from "../common/tabPill";
import {
  HotelSearch,
  FlightSearch,
  HotelFlightSearch,
  PackagesSearch,
} from "./index";

export default function SearchQueries() {
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

  const renderTabContent = () => {
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
    <section className="px-4 py-16">
      <TabPills
        logo="/assets/globe.png"
        logoAlt="Company Logo"
        tabs={tabs.map((tab) => ({
          ...tab,
          label: (
            <span className="flex items-center">
              {tab.icon} {tab.label}
            </span>
          ),
        }))}
        activeKey={activeTab}
        onTabChange={setActiveTab}
        baseColor="#49BAE9"
        pillColor="#fff"
        hoveredTextColor="#fff"
      />
      <div className="mt-6 min-h-[200px]">{renderTabContent()}</div>
    </section>
  );
}
