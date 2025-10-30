import { tboFetch } from "@/app/utils/tboClient";

export async function POST(req) {
  try {
    const body = await req.json();
    const data = await tboFetch("PreBook", body);
    return Response.json(data);
  } catch (err) {
    console.error("PreBook API error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
