"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // next/navigation me useParams hai
import LeazyLoading from "@/components/common/lazyLoading";
import Stack from "./common/stackImages";
import SpotlightCard from "./common/spootLightCard";
import { CalendarDays, Globe2, Bookmark } from "lucide-react";
const OfferDetail = () => {
  const params = useParams();
  const slug = params.slug; // /offer-details/[slug] route me slug
  const [offer, setOffer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/offers?slug=${slug}`);
        const data = await res.json();

        if (data.success) {
          // Parse category in case backend returns stringified array
          let categories = data.offer.category || [];
          if (
            categories.length === 1 &&
            typeof categories[0] === "string" &&
            categories[0].startsWith("[")
          ) {
            try {
              const parsed = JSON.parse(categories[0]);
              if (Array.isArray(parsed)) categories = parsed;
            } catch (err) {
              categories = [];
            }
          }

          setOffer({ ...data.offer, category: categories });
        } else {
          setError(data.error || "Offer not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch offer details");
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchOffer();
  }, [slug]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <LeazyLoading />
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 py-10">
        <p>{error}</p>
      </div>
    );

  return (
    <section className="bg-white text-gray-800 py-4 px-6 md:px-20">
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start">
        <div className="w-full flex justify-center">
          {offer.images && offer.images.length > 0 && (
            <Stack
              randomRotation={true}
              sensitivity={180}
              sendToBackOnClick={false}
              cardsData={offer.images.map((url, index) => ({
                id: index + 1,
                img: url,
              }))}
            />
          )}
        </div>

        <div className="w-full lg:w-[60%]">
          <SpotlightCard
            className="custom-spotlight-card  bg-white/80"
            spotlightColor="rgba(0, 229, 255, 0.2)"
          >
            <div>
              {/* Header */}
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-3 border-b">
                <Bookmark className="text-blue-600" size={20} />
                <h2 className="font-semibold text-gray-800 text-lg">SUMMARY</h2>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                {/* Title */}
                <h3 className="text-center text-lg font-semibold text-gray-900">
                  {offer.title}
                </h3>

                {/* Dates */}
                <div className="flex items-start gap-3 text-gray-700">
                  <CalendarDays size={20} className="mt-1 text-black" />
                  <p className="text-sm">
                    {new Date(offer.dateFrom).toLocaleDateString()} -{" "}
                    {new Date(offer.dateTo).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-start gap-3 text-gray-700">
                  <Globe2 size={20} className="mt-1 text-black" />

                  <div>
                    <p className="font-medium text-sm">Details</p>

                    {/* If flight */}
                    {offer.type === "Flight" ? (
                      <div className="text-sm text-gray-600 space-y-1">
                        {offer.airline && (
                          <p>
                            <strong>Airline:</strong> {offer.airline}
                          </p>
                        )}
                        {offer.journeyType && (
                          <p>
                            <strong>Journey:</strong> {offer.journeyType}
                          </p>
                        )}
                        {offer.cabinClass && (
                          <p>
                            <strong>Cabin:</strong> {offer.cabinClass}
                          </p>
                        )}
                      </div>
                    ) : (
                      /* Default (hotel/package details) */
                      <p className="text-sm text-gray-600">
                        {offer.cabinClass ? `${offer.cabinClass}, ` : ""}
                        {offer.hotelName || ""}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Price + Button */}
              <div className="flex">
                {/* Price Section */}
                <div className="w-1/2 bg-gray-100 p-4 flex flex-col justify-center">
                  <p className="text-xs text-gray-500">Starting From</p>
                  <p className="text-2xl font-bold text-black">
                    {offer.currency} {offer.amount}
                  </p>
                  <p className="text-xs text-gray-500">/ {offer.fareType}</p>
                </div>

                {/* Button Section */}
                <div className="w-1/2 bg-green-500 flex items-center justify-center">
                  <button className="border border-white text-white px-5 py-2 rounded-md font-semibold hover:bg-white hover:text-green-600 transition">
                    BOOK NOW
                  </button>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>

      <div className="my-6">
        {/* Description */}
        {offer.description && (
          <div
            className="prose max-w-full"
            dangerouslySetInnerHTML={{ __html: offer.description }}
          />
        )}
      </div>
    </section>
  );
};

export default OfferDetail;
