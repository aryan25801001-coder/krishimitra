import { NextRequest, NextResponse } from "next/server";
import { computeFarmerAssessment, FarmerAssessmentInput } from "@/lib/advisory-engine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Server-side validation
    const errors: Record<string, string> = {};

    if (!body.state || typeof body.state !== "string" || body.state.trim().length === 0) {
      errors.state = "Please select a valid State.";
    }

    if (!body.district || typeof body.district !== "string" || body.district.trim().length === 0) {
      errors.district = "Please select a valid District.";
    }

    if (!body.crop || typeof body.crop !== "string" || body.crop.trim().length === 0) {
      errors.crop = "Please select a Crop for assessment.";
    }

    if (!body.season || typeof body.season !== "string" || body.season.trim().length === 0) {
      errors.season = "Please specify a Season (Kharif, Rabi, Zaid, Annual).";
    }

    if (!body.irrigationType || !["Rainfed", "Canal", "Tubewell / Borewell", "Drip / Sprinkler"].includes(body.irrigationType)) {
      errors.irrigationType = "Please select a valid irrigation availability option.";
    }

    if (body.farmAreaAcres !== undefined && (isNaN(Number(body.farmAreaAcres)) || Number(body.farmAreaAcres) <= 0 || Number(body.farmAreaAcres) > 5000)) {
      errors.farmAreaAcres = "Farm land area must be a positive number between 0.1 and 5,000 acres.";
    }

    if (body.soilPh !== undefined && body.soilPh !== null && body.soilPh !== "") {
      const ph = Number(body.soilPh);
      if (isNaN(ph) || ph < 3.5 || ph > 10.5) {
        errors.soilPh = "Soil pH must be between 3.5 and 10.5.";
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed. Please correct the highlighted fields.",
          validationErrors: errors,
        },
        { status: 400 }
      );
    }

    const input: FarmerAssessmentInput = {
      state: body.state.trim(),
      district: body.district.trim(),
      crop: body.crop.trim(),
      season: body.season.trim(),
      farmAreaAcres: body.farmAreaAcres ? Number(body.farmAreaAcres) : 1.0,
      soilType: body.soilType || undefined,
      soilPh: body.soilPh ? Number(body.soilPh) : undefined,
      nitrogenStatus: body.nitrogenStatus || undefined,
      phosphorusStatus: body.phosphorusStatus || undefined,
      potassiumStatus: body.potassiumStatus || undefined,
      irrigationType: body.irrigationType,
      organicManureApplied: Boolean(body.organicManureApplied),
      fertilizerApplication: body.fertilizerApplication || "Standard ICAR Dose",
    };

    const assessmentResult = await computeFarmerAssessment(input);

    return NextResponse.json({
      success: true,
      data: assessmentResult,
    });
  } catch (error: any) {
    console.error(`Assessment Error: ${error?.message || "Unknown error occurred"}`);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An error occurred while computing the agricultural assessment.",
      },
      { status: 500 }
    );
  }
}
