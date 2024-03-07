import { NextResponse } from "next/server";

export async function GET(req: NextResponse){
    try {
        const lat = 14.5995;
        const lon = 120.9842;

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=uv_index_max,uv_index_clear_sky_max&timezone=auto&forecast_days=1`;
        
        const res = await fetch(url, {
            next: {revalidate: 900},
        });

        const uvData = await res.json();

        return NextResponse.json(uvData);
    } catch (error) {
        console.log("Error getting uv data");
        return new Response("Error getting Uv Data", { status: 500});
    }
}