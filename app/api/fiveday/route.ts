import { NextRequest, NextResponse } from "next/server";
import axios from "axios";


export async function GET(req: NextRequest){
    try {
        const apiKey = process.env.OPENWEATHERMAP_API_KEY;
        const lat = 14.5995;
        const lon = 120.9842;

        const dailyUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        const dailyRes = await fetch(dailyUrl, {
            next: {revalidate: 3600},
        });

        const dailyData = await dailyRes.json();

        return NextResponse.json(dailyData);
    } catch (error) {
        console.log("Error in getting daily data");
        return new Response("Error in getting daily data", { status: 500 });
    } 
}