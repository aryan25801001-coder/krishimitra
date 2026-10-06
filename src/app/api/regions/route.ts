import { NextRequest, NextResponse } from "next/server";
import { getRegions, getStates, getDistrictsByState } from "@/lib/repositories";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get("state");
    const listOnly = searchParams.get("list");

    if (listOnly === "states") {
      const states = await getStates();
      return NextResponse.json({ success: true, count: states.length, data: states });
    }

    if (state && listOnly === "districts") {
      const districts = await getDistrictsByState(state);
      return NextResponse.json({ success: true, state, count: districts.length, data: districts });
    }

    const regions = await getRegions(state || undefined);
    return NextResponse.json({
      success: true,
      count: regions.length,
      data: regions,
      source: "ICRISAT DLD & Survey of India Administrative Boundaries",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to load region data" },
      { status: 500 }
    );
  }
}
