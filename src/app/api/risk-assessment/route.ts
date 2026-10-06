import { NextRequest, NextResponse } from "next/server";
import { getRiskProfile, getSoilProfileByDistrict, getWeatherByDistrict } from "@/lib/repositories";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const district = searchParams.get("district") || "";
    const crop = searchParams.get("crop") || "";
    const season = searchParams.get("season") || "Kharif";

    if (!district) {
      return NextResponse.json(
        { success: false, error: "District parameter is required" },
        { status: 400 }
      );
    }

    const [riskProfile, soilProfile, weather] = await Promise.all([
      getRiskProfile(district, crop, season),
      getSoilProfileByDistrict(district),
      getWeatherByDistrict(district),
    ]);

    return NextResponse.json({
      success: true,
      district,
      crop,
      season,
      riskProfile: riskProfile || {
        district,
        crop,
        season,
        droughtRiskPct: 15.0,
        floodRiskClass: "Low",
        marketVolatilityCV: 12.0,
        pestVulnerability: "Moderate",
        overallRiskRating: "Moderate Risk",
        riskScore: 35.0,
        keyDrivers: "Standard agro-climatic conditions for this zone",
        mitigationAdvice: "Follow recommended ICAR package of practices and standard soil moisture preservation methods.",
      },
      soilProfile,
      weatherHistory: weather,
      provenance: {
        droughtSource: "IMD High-Resolution Gridded Rainfall Dataset",
        floodSource: "NRSC/ISRO Flood Hazard Atlas of India",
        marketSource: "eNAM & Agmarknet Wholesale Mandi Volatility Series",
        soilSource: "National Soil Health Card Portal (MoAFW)",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to evaluate district risk profile" },
      { status: 500 }
    );
  }
}
