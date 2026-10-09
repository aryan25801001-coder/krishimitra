/**
 * Automated Verification & Regression Suite for India Geographic Coverage
 * Phase F & Section 9 Test Implementation
 */

import regionsData from "../prisma/data/regions.json";
import { getStates, getDistrictsByState, getRegions } from "../src/lib/repositories";
import { computeFarmerAssessment } from "../src/lib/advisory-engine";

async function runGeographicCoverageTestSuite() {
  console.log("🧪 Starting India Geographic Coverage Automated Test Suite...\n");

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, description: string) {
    totalTests++;
    if (condition) {
      console.log(`  ✅ [PASS] ${description}`);
      passedTests++;
    } else {
      console.error(`  ❌ [FAIL] ${description}`);
    }
  }

  // Check 1: 36 Total States & Union Territories (28 States + 8 UTs)
  const states = Array.from(new Set(regionsData.map((r) => r.state))).sort();
  assert(states.length === 36, `All 36 States & Union Territories imported (Found: ${states.length})`);

  // Verify list of Union Territories
  const expectedUTs = [
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry"
  ];
  const missingUTs = expectedUTs.filter((ut) => !states.includes(ut));
  assert(missingUTs.length === 0, `All 8 Union Territories present (Missing: ${missingUTs.join(", ") || "None"})`);

  // Check 2: Total Districts count
  assert(regionsData.length >= 780, `Total imported districts count >= 780 (Found: ${regionsData.length})`);

  // Check 3: State-to-District mapping integrity & duplicate check
  const stateDistrictPairs = new Set<string>();
  let duplicateCount = 0;
  let missingStateCode = 0;

  for (const r of regionsData) {
    const key = `${r.state}::${r.district}`.toLowerCase();
    if (stateDistrictPairs.has(key)) {
      duplicateCount++;
    }
    stateDistrictPairs.add(key);

    if (!r.stateCode || r.stateCode.trim().length === 0) {
      missingStateCode++;
    }
  }

  assert(duplicateCount === 0, `Zero duplicate (state, district) pairs found (Duplicates: ${duplicateCount})`);
  assert(missingStateCode === 0, `All district records contain valid stateCode (Missing: ${missingStateCode})`);

  // Check 4: State filter API simulation
  const upDistricts = regionsData.filter((r) => r.state.toLowerCase() === "uttar pradesh");
  assert(upDistricts.length === 75, `Uttar Pradesh contains all 75 official districts (Found: ${upDistricts.length})`);

  const mpDistricts = regionsData.filter((r) => r.state.toLowerCase() === "madhya pradesh");
  assert(mpDistricts.length === 55, `Madhya Pradesh contains all 55 official districts (Found: ${mpDistricts.length})`);

  const rjDistricts = regionsData.filter((r) => r.state.toLowerCase() === "rajasthan");
  assert(rjDistricts.length === 50, `Rajasthan contains all 50 official districts (Found: ${rjDistricts.length})`);

  // Check 5: Test data availability status for district missing historical ML records
  try {
    const assessmentResult = await computeFarmerAssessment({
      state: "Ladakh",
      district: "Leh",
      crop: "Wheat",
      season: "Rabi",
      farmAreaAcres: 2.0,
      soilType: "High Altitude Cold Desert Soil",
      irrigationType: "Rainfed",
    });

    assert(
      assessmentResult.dataAvailability !== undefined,
      "Assessment result attaches dataAvailability metadata object"
    );
    assert(
      typeof assessmentResult.dataAvailability?.notice === "string",
      "Missing district dataset gracefully generates Data Availability Notice without crashing"
    );
  } catch (err: any) {
    assert(false, `Farmer assessment calculation failed for Leh, Ladakh: ${err.message}`);
  }

  console.log(`\n📊 Test Summary: ${passedTests} / ${totalTests} checks passed.`);

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runGeographicCoverageTestSuite().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
