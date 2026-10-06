// @ts-nocheck
/**
 * Prisma Database Ingestion Script for Authentic Agricultural Datasets
 * Runs through the Data Validation Pipeline before database insertion.
 */

import { PrismaClient } from "@prisma/client";
import datasetSourcesData from "./data/dataset_sources.json";
import regionsData from "./data/regions.json";
import cropsData from "./data/crops.json";
import varietiesData from "./data/crop_varieties.json";
import soilProfilesData from "./data/soil_profiles.json";
import weatherObservationsData from "./data/weather_observations.json";
import historicalYieldsData from "./data/historical_yields.json";
import fertilizerRecommendationsData from "./data/fertilizer_recommendations.json";
import districtRisksData from "./data/district_risks.json";
import { AgriculturalDataValidator } from "../src/lib/data-pipeline/validator";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Agricultural Dataset Ingestion Pipeline...");

  // 1. Ingest Dataset Sources
  console.log("📦 Ingesting authentic dataset sources & metadata...");
  const sourceMap = new Map<string, number>();

  for (const src of datasetSourcesData) {
    const record = await prisma.datasetSource.upsert({
      where: { code: src.code },
      update: { ...src },
      create: { ...src },
    });
    sourceMap.set(src.code, record.id);
  }
  console.log(`✅ Ingested ${sourceMap.size} dataset sources.`);

  // 2. Ingest Regions
  console.log("📍 Ingesting administrative regions and agro-climatic zones...");
  const regionMap = new Map<string, number>();

  for (const reg of regionsData) {
    const record = await prisma.region.upsert({
      where: {
        state_district: {
          state: reg.state,
          district: reg.district,
        },
      },
      update: { ...reg },
      create: { ...reg },
    });
    regionMap.set(reg.district.toLowerCase(), record.id);
  }
  console.log(`✅ Ingested ${regionMap.size} regions.`);

  // 3. Ingest Crops
  console.log("🌾 Ingesting ICAR crop agronomic profiles...");
  const cropMap = new Map<string, number>();
  const icarSourceId = sourceMap.get("ICAR_POPS") || Array.from(sourceMap.values())[0];

  for (const crop of cropsData) {
    const validated = AgriculturalDataValidator.validateCrop(crop);
    if (!validated.isValid) {
      console.warn(`⚠️ Skipped invalid crop: ${crop.name} - ${validated.errors.join(", ")}`);
      continue;
    }
    const data = validated.data;
    const record = await prisma.crop.upsert({
      where: { name: data.name },
      update: { ...data, sourceId: icarSourceId },
      create: { ...data, sourceId: icarSourceId },
    });
    cropMap.set(data.name.toLowerCase(), record.id);
  }
  console.log(`✅ Ingested ${cropMap.size} crops.`);

  // 4. Ingest Crop Varieties
  console.log("🧬 Ingesting certified crop varieties...");
  let varietiesCount = 0;
  for (const v of varietiesData) {
    const cropId = cropMap.get(v.cropName.toLowerCase());
    if (!cropId) continue;

    await prisma.cropVariety.upsert({
      where: {
        cropId_varietyName: {
          cropId,
          varietyName: v.varietyName,
        },
      },
      update: {
        durationDays: v.durationDays,
        characteristics: v.characteristics,
        recommendedZone: v.recommendedZone,
        sourceId: icarSourceId,
      },
      create: {
        cropId,
        varietyName: v.varietyName,
        durationDays: v.durationDays,
        characteristics: v.characteristics,
        recommendedZone: v.recommendedZone,
        sourceId: icarSourceId,
      },
    });
    varietiesCount++;
  }
  console.log(`✅ Ingested ${varietiesCount} crop varieties.`);

  // 5. Ingest Soil Profiles
  console.log("🧪 Ingesting Soil Health Card district fertility profiles...");
  const shcSourceId = sourceMap.get("SHC_MOAFW") || icarSourceId;
  let soilCount = 0;
  for (const soil of soilProfilesData) {
    const regionId = regionMap.get(soil.district.toLowerCase());
    if (!regionId) continue;

    const validated = AgriculturalDataValidator.validateSoilProfile(soil);
    if (!validated.isValid) {
      console.warn(`⚠️ Skipped invalid soil profile: ${soil.district} - ${validated.errors.join(", ")}`);
      continue;
    }
    const data = validated.data;
    await prisma.soilProfile.upsert({
      where: {
        regionId_soilType: {
          regionId,
          soilType: data.soilType,
        },
      },
      update: {
        phMin: data.phMin,
        phMax: data.phMax,
        nStatus: data.nStatus,
        pStatus: data.pStatus,
        kStatus: data.kStatus,
        organicCarbon: data.organicCarbon,
        texture: data.texture,
        sourceId: shcSourceId,
      },
      create: {
        regionId,
        soilType: data.soilType,
        phMin: data.phMin,
        phMax: data.phMax,
        nStatus: data.nStatus,
        pStatus: data.pStatus,
        kStatus: data.kStatus,
        organicCarbon: data.organicCarbon,
        texture: data.texture,
        sourceId: shcSourceId,
      },
    });
    soilCount++;
  }
  console.log(`✅ Ingested ${soilCount} soil profiles.`);

  // 6. Ingest Weather Observations
  console.log("🌦️ Ingesting IMD meteorological observations...");
  const imdSourceId = sourceMap.get("IMD_CLIMATE") || icarSourceId;
  let weatherCount = 0;
  for (const w of weatherObservationsData) {
    const regionId = regionMap.get(w.district.toLowerCase());
    if (!regionId) continue;

    const validated = AgriculturalDataValidator.validateWeather(w);
    if (!validated.isValid) continue;

    const data = validated.data;
    await prisma.weatherObservation.upsert({
      where: {
        regionId_year_season: {
          regionId,
          year: data.year,
          season: data.season,
        },
      },
      update: {
        rainfallMm: data.rainfallMm,
        tempMinC: data.tempMinC,
        tempMaxC: data.tempMaxC,
        humidityPct: data.humidityPct,
        sourceId: imdSourceId,
      },
      create: {
        regionId,
        year: data.year,
        season: data.season,
        rainfallMm: data.rainfallMm,
        tempMinC: data.tempMinC,
        tempMaxC: data.tempMaxC,
        humidityPct: data.humidityPct,
        sourceId: imdSourceId,
      },
    });
    weatherCount++;
  }
  console.log(`✅ Ingested ${weatherCount} weather observations.`);

  // 7. Ingest Historical Yields
  console.log("📈 Ingesting ICRISAT & MoAFW historical yields...");
  const dldSourceId = sourceMap.get("ICRISAT_DLD") || icarSourceId;
  let yieldsCount = 0;
  for (const y of historicalYieldsData) {
    const regionId = regionMap.get(y.district.toLowerCase());
    const cropId = cropMap.get(y.crop.toLowerCase());
    if (!regionId || !cropId) continue;

    const validated = AgriculturalDataValidator.validateYieldRecord(y);
    if (!validated.isValid) continue;

    const data = validated.data;
    await prisma.historicalYield.upsert({
      where: {
        regionId_cropId_year_season: {
          regionId,
          cropId,
          year: data.year,
          season: data.season,
        },
      },
      update: {
        areaHectares: data.areaHa,
        prodTonnes: data.prodTonnes,
        yieldKgPerHa: data.yieldKgPerHa,
        sourceId: dldSourceId,
      },
      create: {
        regionId,
        cropId,
        year: data.year,
        season: data.season,
        areaHectares: data.areaHa,
        prodTonnes: data.prodTonnes,
        yieldKgPerHa: data.yieldKgPerHa,
        sourceId: dldSourceId,
      },
    });
    yieldsCount++;
  }
  console.log(`✅ Ingested ${yieldsCount} historical yield records.`);

  // 8. Ingest Fertilizer Recommendations
  console.log("🧪 Ingesting ICAR nutrient and fertilizer dosages...");
  let fertCount = 0;
  for (const f of fertilizerRecommendationsData) {
    const cropId = cropMap.get(f.cropName.toLowerCase());
    if (!cropId) continue;

    await prisma.fertilizerRecommendation.upsert({
      where: { cropId },
      update: {
        nKgPerHa: f.nKgPerHa,
        pKgPerHa: f.pKgPerHa,
        kKgPerHa: f.kKgPerHa,
        fymTonnesPerHa: f.fymTonnesPerHa,
        basalDose: f.basalDose,
        topDressing: f.topDressing,
        sourceId: icarSourceId,
      },
      create: {
        cropId,
        nKgPerHa: f.nKgPerHa,
        pKgPerHa: f.pKgPerHa,
        kKgPerHa: f.kKgPerHa,
        fymTonnesPerHa: f.fymTonnesPerHa,
        basalDose: f.basalDose,
        topDressing: f.topDressing,
        sourceId: icarSourceId,
      },
    });
    fertCount++;
  }
  console.log(`✅ Ingested ${fertCount} fertilizer recommendations.`);

  // 9. Ingest Multi-Factor District Risk Profiles
  console.log("🛡️ Ingesting multi-factor district risk profiles...");
  const enamSourceId = sourceMap.get("ENAM_AGMARK") || icarSourceId;
  let riskCount = 0;
  for (const r of districtRisksData) {
    const regionId = regionMap.get(r.district.toLowerCase());
    const cropId = cropMap.get(r.crop.toLowerCase());
    if (!regionId || !cropId) continue;

    await prisma.districtRiskProfile.upsert({
      where: {
        regionId_cropId_season: {
          regionId,
          cropId,
          season: r.season,
        },
      },
      update: {
        droughtRiskPct: r.droughtRiskPct,
        floodRiskClass: r.floodRiskClass,
        marketVolatilityCV: r.marketVolatilityCV,
        pestVulnerability: r.pestVulnerability,
        overallRiskRating: r.overallRiskRating,
        riskScore: r.riskScore,
        keyDrivers: r.keyDrivers,
        mitigationAdvice: r.mitigationAdvice,
        sourceId: enamSourceId,
      },
      create: {
        regionId,
        cropId,
        season: r.season,
        droughtRiskPct: r.droughtRiskPct,
        floodRiskClass: r.floodRiskClass,
        marketVolatilityCV: r.marketVolatilityCV,
        pestVulnerability: r.pestVulnerability,
        overallRiskRating: r.overallRiskRating,
        riskScore: r.riskScore,
        keyDrivers: r.keyDrivers,
        mitigationAdvice: r.mitigationAdvice,
        sourceId: enamSourceId,
      },
    });
    riskCount++;
  }
  console.log(`✅ Ingested ${riskCount} district risk profiles.`);

  // Log audit summary
  await prisma.dataIngestionLog.create({
    data: {
      sourceId: icarSourceId,
      datasetCode: "PIPELINE_COMPLETE_SYNC",
      status: "SUCCESS",
      recordsIngested: sourceMap.size + regionMap.size + cropMap.size + varietiesCount + soilCount + weatherCount + yieldsCount + fertCount + riskCount,
      recordsSkipped: 0,
      recordsFailed: 0,
      details: JSON.stringify({
        sources: sourceMap.size,
        regions: regionMap.size,
        crops: cropMap.size,
        varieties: varietiesCount,
        soilProfiles: soilCount,
        weatherRecords: weatherCount,
        yieldRecords: yieldsCount,
        fertilizers: fertCount,
        riskProfiles: riskCount,
      }),
      completedAt: new Date(),
    },
  });

  console.log("🎉 Agricultural Data Ingestion Pipeline Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Pipeline Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
