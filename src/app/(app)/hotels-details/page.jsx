"use client";
import { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import { Star, CheckCircle, XCircle, SlidersHorizontal } from "lucide-react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import LazyGlobeLoader from "@/components/common/lazyLoading";
import { showAlert } from "@/components/common/mixin";
export default function HotelsDetails() {
  const router = useRouter();
  const [hotels, setHotels] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loadingRoomIndex, setLoadingRoomIndex] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    refundable: false,
    mealType: "All",
    starRating: 0,
    priceRange: [0, 2000],
  });

  const [selectedHotel, setSelectedHotel] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);

  const BookNow = async (room, index) => {
    try {
      setLoadingRoomIndex(index);
      const res = await fetch("/api/tbo/PreBook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          BookingCode: room.BookingCode,
          PaymentMode: "Limit",
        }),
      });

      const data = await res.json();
      if (res.status !== 200) {
        showAlert(
          "warning",
          data?.Status?.Description || "Something went wrong while pre-booking."
        );
        return;
      }
      setLoadingRoomIndex(null);
      sessionStorage.setItem("bookingDetails", JSON.stringify(data));
      router.push("/booking-details");
    } catch (error) {
      console.warn("error", error);
    } finally {
      setLoadingRoomIndex(null);
    }
  };

  useEffect(() => {
    const saved = sessionStorage.getItem("hotelsData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setHotels(parsed?.data || parsed || []);
    }
  }, []);

  const filteredHotels = hotels.filter((hotel) => {
    const hasRefundable =
      !filters.refundable || hotel.Rooms?.some((r) => r.IsRefundable);
    const matchesMeal =
      filters.mealType === "All" ||
      hotel.Rooms?.some((r) => r.MealType === filters.mealType);
    const matchesStar =
      filters.starRating === 0 ||
      (hotel.HotelRating || 0) >= filters.starRating;
    const matchesPrice = hotel.Rooms?.some(
      (r) =>
        r.TotalFare >= filters.priceRange[0] &&
        r.TotalFare <= filters.priceRange[1]
    );

    return hasRefundable && matchesMeal && matchesStar && matchesPrice;
  });

  if (!hotels.length)
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <LazyGlobeLoader size={240} speed={10} planeColor="#0d47a1" />
      </div>
    );

  return (
    <div className="p-6 bg-gray-50">
      {/* 🧭 Mobile Filters Toggle */}
      <div className="md:hidden mb-4 flex justify-between items-center bg-white p-3 rounded-xl shadow">
        <h2 className="text-lg font-bold text-gray-800">Filters</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-blue-600 font-medium"
        >
          <SlidersHorizontal size={18} />
          {showFilters ? "Hide" : "Show"}
        </button>
      </div>
      {/* 📱 Mobile Filters Dropdown (Top Section) */}
      {showFilters && (
        <div className="bg-white w-full lg:hidden rounded-2xl shadow-md p-4 mb-5 border border-gray-200 animate-fade-in">
          {/* Refundable */}
          <div className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              id="refundable-mobile"
              checked={filters.refundable}
              onChange={(e) =>
                setFilters({ ...filters, refundable: e.target.checked })
              }
              className="accent-blue-600"
            />
            <label htmlFor="refundable-mobile" className="text-gray-700">
              Refundable only
            </label>
          </div>

          {/* Meal Type */}
          <div className="mb-3">
            <label className="block text-gray-700 font-medium mb-1">
              Meal Type
            </label>
            <select
              value={filters.mealType}
              onChange={(e) =>
                setFilters({ ...filters, mealType: e.target.value })
              }
              className="w-full border rounded-lg p-2"
            >
              <option>All</option>
              <option value="Room_Only">Room Only</option>
              <option value="BreakFast">Breakfast</option>
              <option value="Half_Board">Half Board</option>
              <option value="Full_Board">Full Board</option>
            </select>
          </div>

          {/* ⭐ Star Rating */}
          <div className="mb-3">
            <label className="block text-gray-700 font-medium mb-1">
              Minimum Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={22}
                  onClick={() =>
                    setFilters({
                      ...filters,
                      starRating: filters.starRating === s ? 0 : s,
                    })
                  }
                  className={`cursor-pointer transition ${
                    s <= filters.starRating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* 💰 Price Range */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Price Range (${filters.priceRange[0]} - ${filters.priceRange[1]})
            </label>
            <input
              type="range"
              min="0"
              max="5000"
              step="50"
              value={filters.priceRange[1]}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  priceRange: [filters.priceRange[0], parseInt(e.target.value)],
                })
              }
              className="w-full accent-blue-600"
            />
          </div>
        </div>
      )}
      <div className="grid grid-cols-12 gap-5">
        {/* 🧭 Sidebar Filters */}
        <aside
          className={`col-span-3 bg-white shadow rounded-2xl p-5 space-y-5 sticky top-20 h-fit hidden md:block`}
        >
          <h2 className="text-xl font-bold border-b pb-2">Filters</h2>

          {/* Refundable */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="refundable"
              checked={filters.refundable}
              onChange={(e) =>
                setFilters({ ...filters, refundable: e.target.checked })
              }
            />
            <label htmlFor="refundable" className="text-gray-700">
              Refundable only
            </label>
          </div>

          {/* Meal Type */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Meal Type
            </label>
            <select
              value={filters.mealType}
              onChange={(e) =>
                setFilters({ ...filters, mealType: e.target.value })
              }
              className="w-full border rounded-lg p-2"
            >
              <option>All</option>
              <option value="Room_Only">Room Only</option>
              <option value="BreakFast">Breakfast</option>
              <option value="Half_Board">Half Board</option>
              <option value="Full_Board">Full Board</option>
            </select>
          </div>

          {/* ⭐ Star Rating */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Minimum Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={22}
                  onClick={() =>
                    setFilters({
                      ...filters,
                      starRating: filters.starRating === s ? 0 : s,
                    })
                  }
                  className={`cursor-pointer transition ${
                    s <= filters.starRating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* 💰 Price Range */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Price Range (${filters.priceRange[0]} - ${filters.priceRange[1]})
            </label>
            <input
              type="range"
              min="0"
              max="5000"
              step="50"
              value={filters.priceRange[1]}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  priceRange: [filters.priceRange[0], parseInt(e.target.value)],
                })
              }
              className="w-full"
            />
          </div>
        </aside>

        {/* 🏨 Main Hotel List */}
        <section className="col-span-12 md:col-span-9 space-y-6">
          {filteredHotels.map((hotel, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow p-5 hover:shadow-lg transition"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row gap-5 border-b pb-4 mb-4">
                <div className="relative w-full md:w-48 lg:w-56 h-40 rounded-xl overflow-hidden shadow-md">
                  {hotel.Image ? (
                    <img
                      src={hotel.Image}
                      alt={hotel.HotelName}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                  {hotel.HotelRating && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-md">
                      ⭐ {hotel.HotelRating} Star
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 hover:text-blue-700 transition">
                      {hotel.HotelName}
                    </h3>
                    {hotel.Address && (
                      <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                        📍 {hotel.Address}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4">
                    <button
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition"
                      onClick={() => {
                        setSelectedHotel(hotel);
                        setIsOpen(true);
                      }}
                    >
                      Hotel Details
                    </button>
                  </div>
                </div>
              </div>

              {/* 🏨 Rooms */}
              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4">
                {hotel.Rooms?.map((room, j) => {
                  const roomCount = room?.Name?.length || 1;
                  const roomTitle = room?.Name?.[0] || "Room";

                  return (
                    <div
                      key={j}
                      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
                    >
                      {/* 💺 Room Header */}
                      <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-base line-clamp-2">
                          {roomTitle}{" "}
                          <span className="text-sm text-gray-500">
                            (x{roomCount})
                          </span>
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {room.Inclusion || "No inclusions specified"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          🍽 Meal:{" "}
                          <span className="font-medium capitalize">
                            {room.MealType?.replace("_", " ")}
                          </span>
                        </p>
                      </div>

                      {/* 💰 Price + Refund Info */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between">
                            <p className="text-xl font-bold text-blue-700 dark:text-blue-400">
                              💰 {room.TotalFare} {hotel.Currency}
                            </p>
                            <p className="text-xs text-gray-500">
                              + Tax: {room.TotalTax || 0}
                            </p>
                          </div>

                          <p
                            className={`flex items-center gap-1 text-xs mt-2 font-semibold ${
                              room.IsRefundable
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                          >
                            {room.IsRefundable ? (
                              <>
                                <CheckCircle size={14} /> Refundable
                              </>
                            ) : (
                              <>
                                <XCircle size={14} /> Non-Refundable
                              </>
                            )}
                          </p>
                        </div>

                        {/* 🎁 Room Promotions */}
                        {Array.isArray(room.RoomPromotion) &&
                          room.RoomPromotion.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {room.RoomPromotion.map((promo, i) => (
                                <span
                                  key={i}
                                  className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold px-2 py-1 rounded-full"
                                >
                                  🎁 {promo}
                                </span>
                              ))}
                            </div>
                          )}

                        {/* ⚠️ Cancellation Policy */}
                        {Array.isArray(room.CancelPolicies) &&
                          room.CancelPolicies.length > 0 && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border-t border-blue-100 dark:border-blue-800 px-4 py-3 rounded-lg mt-3">
                              <h5 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">
                                ⚠️ Cancellation Policy:
                              </h5>
                              <ul className="space-y-1 text-xs text-blue-700 dark:text-blue-400">
                                {room.CancelPolicies.map((policy, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-2 bg-white/50 dark:bg-blue-950/30 p-2 rounded-md"
                                  >
                                    <span className="text-blue-500 text-lg">
                                      •
                                    </span>
                                    <div>
                                      <p>
                                        <span className="font-medium">
                                          From:
                                        </span>{" "}
                                        {policy.FromDate}
                                      </p>
                                      <p>
                                        <span className="font-medium">
                                          Charge:
                                        </span>{" "}
                                        {policy.CancellationCharge}%
                                      </p>
                                      <p>
                                        <span className="font-medium">
                                          Type:
                                        </span>{" "}
                                        {policy.ChargeType}
                                      </p>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                        {/* 📅 Day Rates */}
                        {room.DayRates?.length > 0 && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 px-4 py-3 rounded-lg">
                            <h5 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">
                              📅 Per Day Rates:
                            </h5>
                            <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                              {room.DayRates.map((day, i) => (
                                <li
                                  key={i}
                                  className="flex items-center justify-between bg-white/50 dark:bg-blue-950/30 p-2 rounded-md"
                                >
                                  <span>Room {i + 1}</span>
                                  <span>
                                    {day?.[0]?.BasePrice} {hotel.Currency}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {/* 💊 Supplements */}
                        {Array.isArray(room.Supplements) &&
                          room.Supplements.length > 0 && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-100 dark:border-yellow-800 px-4 py-3 rounded-lg mt-3">
                              <h5 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
                                💊 Supplements:
                              </h5>
                              <ul className="space-y-1 text-xs text-yellow-700 dark:text-yellow-400">
                                {room.Supplements.flat().map((supp, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-2 bg-white/40 dark:bg-yellow-950/30 p-2 rounded-md"
                                  >
                                    <span className="text-yellow-500 text-lg">
                                      •
                                    </span>
                                    <div>
                                      <p>
                                        <span className="font-medium">
                                          Type:
                                        </span>{" "}
                                        {supp.Type || "N/A"}
                                      </p>
                                      <p>
                                        <span className="font-medium">
                                          Description:
                                        </span>{" "}
                                        {supp.Description || "N/A"}
                                      </p>
                                      <p>
                                        <span className="font-medium">
                                          Price:
                                        </span>{" "}
                                        {supp.Price} {supp.Currency}
                                      </p>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                      </div>

                      {/* 🟦 Book Now Button */}
                      <div className="border-t border-gray-100 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-800/50 flex justify-center">
                        <button
                          onClick={() => BookNow(room, j)}
                          disabled={loadingRoomIndex === j}
                          className={`w-full py-2 font-semibold rounded-xl shadow-md transition-all duration-300 ${
                            loadingRoomIndex === j
                              ? "bg-blue-400 cursor-not-allowed"
                              : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
                          }`}
                        >
                          {loadingRoomIndex === j ? (
                            <div className="flex items-center justify-center gap-2">
                              <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                ></path>
                              </svg>
                              loading ...
                            </div>
                          ) : (
                            "Booking Details"
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* 🪟 Modal for Hotel Details */}
      {selectedHotel && (
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" open={isOpen} onClose={() => setIsOpen(false)}>
            {/* 🔲 Dim Background */}
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]" />
            </TransitionChild>

            {/* 🧱 Modal Container */}
            <div className="fixed inset-0 z-[1000] flex items-start justify-center overflow-y-auto px-4 py-10">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="relative w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                  {/* 🏨 Header with Image */}
                  <div className="relative">
                    {/* Close Button */}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-white rounded-full p-2"
                    >
                      ✕
                    </button>
                  </div>

                  {/* 📋 Content */}
                  <div className="p-6 space-y-8">
                    {/* Title */}
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {selectedHotel.HotelName}
                      </h2>
                      {selectedHotel.HotelRating && (
                        <p className="text-yellow-500 text-sm mt-1">
                          {"⭐".repeat(selectedHotel.HotelRating)}{" "}
                          <span className="text-gray-500 dark:text-gray-400">
                            ({selectedHotel.HotelRating}-Star)
                          </span>
                        </p>
                      )}
                    </div>
                    {/* 🏨 Image + Hotel Info Section */}
                    <div className="grid md:grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden">
                      {/* 🖼️ Left Side - Image Carousel */}
                      <div className="relative h-96">
                        {selectedHotel.Images &&
                        selectedHotel.Images.length > 0 ? (
                          <>
                            <img
                              src={selectedHotel.Images[currentImage]}
                              alt={selectedHotel.HotelName}
                              className="w-full h-full object-cover"
                            />
                            {/* Carousel Controls */}
                            <button
                              onClick={() =>
                                setCurrentImage(
                                  (prev) =>
                                    (prev - 1 + selectedHotel.Images.length) %
                                    selectedHotel.Images.length
                                )
                              }
                              className="absolute cursor-pointer left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow"
                            >
                              ◀
                            </button>
                            <button
                              onClick={() =>
                                setCurrentImage(
                                  (prev) =>
                                    (prev + 1) % selectedHotel.Images.length
                                )
                              }
                              className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow"
                            >
                              ▶
                            </button>

                            {/* Dots Navigation */}
                            <div className="absolute bottom-3 flex justify-center w-full gap-1">
                              {selectedHotel.Images.map((_, idx) => (
                                <div
                                  key={idx}
                                  onClick={() => setCurrentImage(idx)}
                                  className={`w-2.5 h-2.5 rounded-full cursor-pointer ${
                                    idx === currentImage
                                      ? "bg-blue-600"
                                      : "bg-white/70"
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                            No Images Available
                          </div>
                        )}
                      </div>

                      {/* 📍 Right Side - Address + Contact */}
                      <div className="p-6 flex flex-col justify-center">
                        <div className="space-y-6">
                          {/* Location */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                              📍 Location
                            </h3>
                            <p>{selectedHotel.Address}</p>
                            <p>City: {selectedHotel.CityName}</p>
                            <p>Country: {selectedHotel.CountryName}</p>
                            <p>Pin Code: {selectedHotel.PinCode}</p>
                          </div>

                          {/* Contact */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                              ☎️ Contact
                            </h3>
                            <p>Phone: {selectedHotel.PhoneNumber}</p>
                            {selectedHotel.Email && (
                              <p>
                                Email:{" "}
                                <a
                                  href={`mailto:${selectedHotel.Email}`}
                                  className="text-blue-600 hover:underline"
                                >
                                  {selectedHotel.Email}
                                </a>
                              </p>
                            )}
                            {selectedHotel.HotelWebsiteUrl && (
                              <p>
                                Website:{" "}
                                <a
                                  href={selectedHotel.HotelWebsiteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  Visit Site
                                </a>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timings */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl">
                      <h3 className="font-semibold mb-2">🕒 Timings</h3>
                      <p>Check-In: {selectedHotel.CheckInTime}</p>
                      <p>Check-Out: {selectedHotel.CheckOutTime}</p>
                    </div>

                    {/* 🏗️ Facilities */}
                    {selectedHotel.HotelFacilities?.length > 0 && (
                      <div className="mt-10">
                        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          🏗️ Hotel Facilities
                        </h3>
                        <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6 text-sm text-gray-700 dark:text-gray-300">
                          {selectedHotel.HotelFacilities.slice(0, 24).map(
                            (f, i) => (
                              <li
                                key={i}
                                className="flex items-center gap-3 p-2 rounded-lg group hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-950/40 dark:hover:to-blue-900/20 transition-all duration-300"
                              >
                                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:scale-125 transition-transform duration-300 shadow-sm" />
                                <span className="group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                                  {f}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                    {/* 🌆 Nearby Attractions */}
                    {selectedHotel.Attractions && (
                      <div className="mt-10">
                        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          🌆 Nearby Attractions
                        </h3>
                        <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6 text-sm text-gray-700 dark:text-gray-300">
                          {Object.entries(selectedHotel.Attractions).map(
                            ([k, v]) => (
                              <li
                                key={k}
                                className="flex items-center gap-3 p-2 rounded-lg group hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 dark:hover:from-green-950/40 dark:hover:to-green-900/20 transition-all duration-300"
                              >
                                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 group-hover:scale-125 transition-transform duration-300 shadow-sm" />
                                <span className="group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">
                                  {v}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Map */}
                    {selectedHotel.Map &&
                      (() => {
                        const [lat, lon] = selectedHotel.Map.split("|");
                        return (
                          <div>
                            <h3 className="font-semibold mb-3">
                              🗺️ Location Map
                            </h3>
                            <div className="overflow-hidden rounded-xl shadow">
                              <iframe
                                src={`https://www.google.com/maps?q=${lat},${lon}&z=14&output=embed`}
                                className="w-full h-92 border-0 rounded-xl"
                                loading="lazy"
                                allowFullScreen
                              ></iframe>
                            </div>
                          </div>
                        );
                      })()}
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </Dialog>
        </Transition>
      )}
    </div>
  );
}
