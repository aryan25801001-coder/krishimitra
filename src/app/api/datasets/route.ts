import { NextResponse } from "next/server";
import { getDatasetSources } from "@/lib/repositories";

export async function GET() {
  try {
    const sources = await getDatasetSources();
    return NextResponse.json({
      success: true,
      count: sources.length,
      data: sources,
      provenance: "Official Government & Research Agricultural Datasets",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to load dataset sources" },
      { status: 500 }
    );
  }
}
