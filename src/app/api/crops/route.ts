import { NextRequest, NextResponse } from "next/server";
import { getCrops, getCropByName } from "@/lib/repositories";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const season = searchParams.get("season");
    const name = searchParams.get("name");

    if (name) {
      const crop = await getCropByName(name);
      if (!crop) {
        return NextResponse.json({ success: false, error: "Crop not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: crop, source: "ICAR Agronomic Package of Practices" });
    }

    const crops = await getCrops(season || undefined);
    return NextResponse.json({
      success: true,
      count: crops.length,
      data: crops,
      source: "ICAR Crop Sciences Division & Central Institute Guidelines",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to load crop benchmarks" },
      { status: 500 }
    );
  }
}
