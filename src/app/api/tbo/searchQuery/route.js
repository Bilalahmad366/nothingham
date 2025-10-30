import { tboFetch } from "@/app/utils/tboClient";

export async function POST(req) {
    try {
        const body = await req.json();
        const searchResponse = await tboFetch("search", body, "POST");
        if (!searchResponse || searchResponse?.Status?.Code !== 200) {
            return Response.json(
                {
                    success: false,
                    message: searchResponse?.Status?.Description || "TBO Search API Error",
                },
                { status: 500 }
            );
        }
        const hotels = searchResponse?.HotelResult || [];
        if (!hotels.length) {
            return Response.json({ success: true, data: [], message: "No hotels found" });
        }
        const hotelCodes = hotels.map(h => h.HotelCode).join(",");
        let payLoad = {
            Hotelcodes: hotelCodes,
            Language: "EN",
        }
        const hotelDetailsResponse = await tboFetch("Hoteldetails", payLoad);
        if (!hotelDetailsResponse?.HotelDetails) {
            return Response.json({
                success: false,
                message: "Failed to fetch hotel details",
            });
        }
        const detailsMap = new Map(
            hotelDetailsResponse.HotelDetails.map(h => [h.HotelCode, h])
        );

        const mergedHotels = hotels.map(hotel => ({
            ...detailsMap.get(hotel.HotelCode),
            Rooms: hotel.Rooms || [],
            Currency: hotel.Currency || "USD",
        }));

        return Response.json(
            {
                success: true,
                message: "Hotels fetched successfully",
                data: mergedHotels,
            },
            { status: 200 }
        );

    } catch (err) {
        return Response.json(
            {
                success: false,
                message: err.message || "Something went wrong while fetching hotels",
            },
            { status: 500 }
        );
    }
}
