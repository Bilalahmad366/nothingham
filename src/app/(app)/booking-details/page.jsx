"use client";

import { useEffect, useState } from "react";
import {
  Coffee,
  Wind,
  AlertTriangle,
  BedDouble,
  CheckCircle,
  XCircle,
} from "lucide-react";
import LazyGlobeLoader from "@/components/common/lazyLoading";

export default function BookingDetails() {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("bookingDetails");
    if (stored) setBooking(JSON.parse(stored));
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <LazyGlobeLoader size={240} speed={10} planeColor="#0d47a1" />
      </div>
    );

  if (!booking)
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-gray-500">
        <p className="text-lg font-medium">No booking details found </p>
        <p className="text-sm mt-2">Please go back and select a room again.</p>
      </div>
    );

  const hotel = booking?.HotelResult?.[0];
  const rateConditions = hotel?.RateConditions || [];
  const rooms = hotel?.Rooms || [];

  return (
    <div className="flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl overflow-hidden">
        

        {/* 🔁 Loop All Rooms */}
        {rooms.map((room, i) => (
          <div
            key={i}
            className="mb-8 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md"
          >
            {/* 🏠 Room Info */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-200">
                Rooms Details
              </h3>

              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-sm space-y-1">
                {room?.Name?.map((n, idx) => (
                  <li key={idx}>{n}</li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-6 mt-4 text-sm text-gray-600 dark:text-gray-400">
                <p>🍽 Meal: <strong>{room?.MealType}</strong></p>
                <p>🛏 Inclusion: <strong>{room?.Inclusion}</strong></p>
                <p>
                  {room?.IsRefundable ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle size={14} /> Refundable
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center gap-1">
                      <XCircle size={14} /> Non-Refundable
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* 💰 Price Section */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h4 className="font-semibold text-base mb-2 text-gray-800 dark:text-gray-200">
                💰 Price Breakdown
              </h4>
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                {room.DayRates?.map((d, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md"
                  >
                    <span>Day {idx + 1}</span>
                    <span>
                      {d?.[0]?.BasePrice} {hotel?.Currency}
                    </span>
                  </div>
                ))}

                {room.Supplements?.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium text-yellow-800 dark:text-yellow-300">
                      💊 Supplements:
                    </p>
                    {room.Supplements.map((group, gidx) => (
                      <div
                        key={gidx}
                        className="ml-3 mt-1 bg-yellow-50 dark:bg-yellow-900/30 p-2 rounded-md"
                      >
                        {group.map((s, sidx) => (
                          <p
                            key={sidx}
                            className="text-xs text-yellow-700 dark:text-yellow-200"
                          >
                            • {s.Description} — {s.Price} {s.Currency}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                <hr className="my-2 border-gray-300 dark:border-gray-700" />
                <div className="flex justify-between font-semibold">
                  <span>Total Fare:</span>
                  <span>
                    {room.TotalFare} {hotel?.Currency}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Tax:</span>
                  <span>
                    {room.TotalTax || 0} {hotel?.Currency}
                  </span>
                </div>
              </div>
            </div>

            {/* 🚫 Cancel Policies */}
            {room.CancelPolicies?.length > 0 && (
              <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <h4 className="font-semibold text-base mb-2 text-gray-800 dark:text-gray-200">
                  ⚠️ Cancellation Policy
                </h4>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  {room.CancelPolicies.map((c, idx) => (
                    <li
                      key={idx}
                      className="bg-red-50 dark:bg-red-900/20 rounded-md p-2"
                    >
                      From {c.FromDate} — {c.CancellationCharge}% (
                      {c.ChargeType})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 🧩 Amenities */}
            {room.Amenities?.length > 0 && (
              <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <h4 className="font-semibold text-base mb-3 text-gray-800 dark:text-gray-200">
                  🧩 Amenities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {room.Amenities.map((a, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-800/30 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* 📜 Rate Conditions */}
        {rateConditions.length > 0 && (
          <div className="p-6 border border-blue-200 dark:border-blue-800 rounded-xl bg-blue-50 dark:bg-blue-900/20">
            <details className="group">
              <summary className="cursor-pointer text-blue-800 dark:text-blue-200 font-semibold flex justify-between items-center">
                <span>📜 Full Rate Conditions</span>
                <svg
                  className="w-5 h-5 text-blue-600 transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div
                className="mt-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-3 prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html: rateConditions
                    .map((c) =>
                      c
                        .replace(/&lt;/g, "<")
                        .replace(/&gt;/g, ">")
                        .replace(/&amp;/g, "&")
                        .replace(/<\/ul>/g, "</ul><br>")
                    )
                    .join(
                      "<hr class='my-4 border-gray-200 dark:border-gray-700' />"
                    ),
                }}
              />
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
