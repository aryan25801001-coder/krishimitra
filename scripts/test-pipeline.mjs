/**
 * Agricultural Data Pipeline Self-Test & Audit Suite
 * Tests dataset integrity, range bounds, foreign references, and schema validation.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'prisma', 'data');

console.log("🔍 ========================================================");
console.log("🌾 KRISHIMITRA DATA PIPELINE AUDIT & VALIDATION SUITE");
console.log("🔍 ========================================================\n");

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
  }
}

// 1. Verify Dataset Sources
const sources = JSON.parse(fs.readFileSync(path.join(dataDir, 'dataset_sources.json'), 'utf-8'));
console.log(`📌 1. Dataset Sources (${sources.length} sources registered):`);
assert(sources.length >= 6, "At least 6 reputable agricultural data sources registered");
sources.forEach(s => {
  assert(s.code && s.name && s.publisher && s.citation && s.url && s.license && s.geographicScope && s.limitations,
    `Source ${s.code} has complete metadata, citation, URL, and license (${s.license})`);
});

// 2. Verify Regions
const regions = JSON.parse(fs.readFileSync(path.join(dataDir, 'regions.json'), 'utf-8'));
console.log(`\n📌 2. Administrative Regions (${regions.length} districts across major states):`);
assert(regions.length >= 20, "At least 20 key agricultural districts loaded");
const states = new Set(regions.map(r => r.state));
assert(states.size >= 10, `Covering ${states.size} major agricultural states across India`);
regions.forEach(r => {
  assert(r.latitude >= 8 && r.latitude <= 37 && r.longitude >= 68 && r.longitude <= 98,
    `District ${r.district}, ${r.state} within Indian geographic bounds [${r.latitude}, ${r.longitude}]`);
});

// 3. Verify Crops & Agronomic Benchmarks
const crops = JSON.parse(fs.readFileSync(path.join(dataDir, 'crops.json'), 'utf-8'));
console.log(`\n📌 3. ICAR Agronomic Crop Profiles (${crops.length} crops):`);
assert(crops.length >= 10, "At least 10 major cereal, pulse, oilseed, and cash crops defined");
crops.forEach(c => {
  assert(c.growthDaysMin > 0 && c.growthDaysMax >= c.growthDaysMin, `${c.name}: Growth days valid [${c.growthDaysMin}-${c.growthDaysMax}]`);
  assert(c.optimalTempMinC >= 0 && c.optimalTempMaxC <= 50 && c.optimalTempMaxC > c.optimalTempMinC, `${c.name}: Temperature bounds valid [${c.optimalTempMinC}°C - ${c.optimalTempMaxC}°C]`);
  assert(c.optimalRainfallMin >= 0 && c.optimalRainfallMax > c.optimalRainfallMin, `${c.name}: Rainfall range valid [${c.optimalRainfallMin} - ${c.optimalRainfallMax} mm]`);
  assert(c.optimalPhMin >= 4.5 && c.optimalPhMax <= 9.0 && c.optimalPhMax > c.optimalPhMin, `${c.name}: Soil pH range valid [${c.optimalPhMin} - ${c.optimalPhMax}]`);
});

// 4. Verify Crop Varieties
const varieties = JSON.parse(fs.readFileSync(path.join(dataDir, 'crop_varieties.json'), 'utf-8'));
console.log(`\n📌 4. Certified Crop Varieties (${varieties.length} varieties):`);
assert(varieties.length >= 10, "Certified varieties indexed from ICAR/IARI");
const cropNames = new Set(crops.map(c => c.name.toLowerCase()));
varieties.forEach(v => {
  assert(cropNames.has(v.cropName.toLowerCase()), `Variety ${v.varietyName} references valid crop ${v.cropName}`);
});

// 5. Verify Soil Profiles
const soilProfiles = JSON.parse(fs.readFileSync(path.join(dataDir, 'soil_profiles.json'), 'utf-8'));
console.log(`\n📌 5. Soil Health Card Profiles (${soilProfiles.length} district records):`);
const districtNames = new Set(regions.map(r => r.district.toLowerCase()));
soilProfiles.forEach(s => {
  assert(districtNames.has(s.district.toLowerCase()), `Soil profile for ${s.district} maps to known region`);
  assert(s.phMin >= 5.0 && s.phMax <= 9.5, `${s.district} pH range [${s.phMin}-${s.phMax}] is realistic`);
  assert(s.organicCarbon >= 0.1 && s.organicCarbon <= 3.0, `${s.district} Organic Carbon (${s.organicCarbon}%) within natural soil limits`);
});

// 6. Verify Weather Observations
const weather = JSON.parse(fs.readFileSync(path.join(dataDir, 'weather_observations.json'), 'utf-8'));
console.log(`\n📌 6. IMD Weather Observations (${weather.length} seasonal observations):`);
weather.forEach(w => {
  assert(districtNames.has(w.district.toLowerCase()), `Weather for ${w.district} (${w.season} ${w.year}) maps to known region`);
  assert(w.rainfallMm >= 0 && w.rainfallMm <= 3000, `${w.district} rainfall (${w.rainfallMm} mm) within valid meteorological bounds`);
  assert(w.tempMinC < w.tempMaxC, `${w.district} temperature [${w.tempMinC}°C to ${w.tempMaxC}°C] valid`);
});

// 7. Verify Historical Yields
const yields = JSON.parse(fs.readFileSync(path.join(dataDir, 'historical_yields.json'), 'utf-8'));
console.log(`\n📌 7. ICRISAT & MoAFW Historical Yields (${yields.length} crop-district records):`);
yields.forEach(y => {
  assert(districtNames.has(y.district.toLowerCase()), `Yield record for ${y.district} (${y.crop}) maps to known region`);
  assert(y.yieldKgPerHa > 0, `${y.district} - ${y.crop} yield (${y.yieldKgPerHa} kg/ha) > 0`);
  const calculated = (y.prodTonnes * 1000) / y.areaHa;
  const match = Math.abs(calculated - y.yieldKgPerHa) / y.yieldKgPerHa < 0.05;
  assert(match, `${y.district} ${y.crop}: Area (${y.areaHa} ha) & Prod (${y.prodTonnes} t) mathematically consistent with Yield (${y.yieldKgPerHa} kg/ha)`);
});

// 8. Verify Fertilizer Recommendations
const fertilizers = JSON.parse(fs.readFileSync(path.join(dataDir, 'fertilizer_recommendations.json'), 'utf-8'));
console.log(`\n📌 8. ICAR Fertilizer Recommendations (${fertilizers.length} crops):`);
fertilizers.forEach(f => {
  assert(cropNames.has(f.cropName.toLowerCase()), `Fertilizer guide for ${f.cropName} maps to registered crop`);
  assert(f.nKgPerHa >= 0 && f.pKgPerHa >= 0 && f.kKgPerHa >= 0, `${f.cropName} N-P-K [${f.nKgPerHa}-${f.pKgPerHa}-${f.kKgPerHa} kg/ha] non-negative`);
});

// 9. Verify District Risk Profiles
const risks = JSON.parse(fs.readFileSync(path.join(dataDir, 'district_risks.json'), 'utf-8'));
console.log(`\n📌 9. Multi-Factor District Risk Profiles (${risks.length} district-crop evaluations):`);
risks.forEach(r => {
  assert(districtNames.has(r.district.toLowerCase()), `Risk profile for ${r.district} maps to known region`);
  assert(r.riskScore >= 0 && r.riskScore <= 100, `${r.district} ${r.crop} Composite Risk Score (${r.riskScore}) in [0-100]`);
  assert(["Low Risk", "Moderate Risk", "High Risk"].includes(r.overallRiskRating), `${r.district} Overall Risk Rating (${r.overallRiskRating}) valid`);
});

console.log("\n========================================================");
console.log(`📊 AUDIT SUMMARY: ${passedTests} / ${totalTests} CHECKS PASSED`);
if (passedTests === totalTests) {
  console.log("✨ ALL DATA INTEGRITY, STATISTICAL, & PROVENANCE CHECKS PASSED WITH 100% SUCCESS!");
} else {
  console.error(`⚠️ ${totalTests - passedTests} CHECKS FAILED.`);
  process.exit(1);
}
console.log("========================================================\n");
