import { NextRequest, NextResponse } from "next/server";
import { getHistoricalYields } from "@/lib/repositories";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const district = searchParams.get("district") || undefined;
    const crop = searchParams.get("crop") || undefined;
    const season = searchParams.get("season") || undefined;

    const yields = await getHistoricalYields(district, crop, season);

    // Compute statistical summary
    let avgYieldKgHa = 0;
    let minYieldKgHa = 0;
    let maxYieldKgHa = 0;

    if (yields.length > 0) {
      const yieldValues = yields.map((y) => y.yieldKgPerHa);
      avgYieldKgHa = Math.round(yieldValues.reduce((a, b) => a + b, 0) / yieldValues.length);
      minYieldKgHa = Math.min(...yieldValues);
      maxYieldKgHa = Math.max(...yieldValues);
    }

    return NextResponse.json({
      success: true,
      count: yields.length,
      summary: {
        avgYieldKgHa,
        minYieldKgHa,
        maxYieldKgHa,
      },
      data: yields,
      source: "ICRISAT District Level Database (1966-2017) & DES MoAFW Agricultural Statistics",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch historical yields" },
      { status: 500 }
    );
  }
}
