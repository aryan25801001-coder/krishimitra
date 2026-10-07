"""
Documented Agricultural Risk Classification & Vulnerability Engine
Calculates explainable, multi-factor compound risk scores using documented
scientific criteria (IMD precipitation deficits, ICAR thermal stress limits,
Soil Health Card fertility indices, and eNAM market volatility).
"""

from typing import Dict, Any, List

class AgriculturalRiskEngine:
    @staticmethod
    def calculate_risk(
        crop: str,
        district: str,
        season: str,
        rainfall_mm: float,
        optimal_rainfall_min: float,
        optimal_rainfall_max: float,
        temp_c: float,
        optimal_temp_min: float,
        optimal_temp_max: float,
        soil_ph: float,
        n_status: str,
        p_status: str,
        k_status: str,
        irrigation_type: str,
        market_volatility_cv: float = 14.0,
    ) -> Dict[str, Any]:
        """
        Documented Multi-Factor Risk Calculation Methodology:
        R_composite = 0.35 * R_climate + 0.25 * R_thermal + 0.20 * R_soil + 0.20 * R_market
        """
        reasons: List[str] = []
        mitigations: List[str] = []

        # 1. Climate & Drought Risk (Weight: 35%)
        optimal_rain_mid = (optimal_rainfall_min + optimal_rainfall_max) / 2.0
        rain_deficit_pct = max(0.0, (optimal_rain_mid - rainfall_mm) / optimal_rain_mid * 100.0)

        if irrigation_type == "Rainfed":
            if rain_deficit_pct > 30.0:
                climate_risk = min(100.0, 50.0 + rain_deficit_pct * 1.2)
                reasons.append(f"High monsoon rainfall deficit ({rain_deficit_pct:.1f}% below optimal) without irrigation support.")
                mitigations.append("Adopt broad bed and furrow (BBF) in situ moisture conservation and prepare farm pond for protective irrigation.")
            elif rain_deficit_pct > 15.0:
                climate_risk = 45.0
                reasons.append(f"Moderate rainfall deficit ({rain_deficit_pct:.1f}% below optimal) under rainfed conditions.")
                mitigations.append("Apply organic mulch (straw/crop residue @ 5 t/ha) to reduce soil moisture evaporation.")
            else:
                climate_risk = 20.0
        else:
            # Assured irrigation buffers climate stress
            climate_risk = min(40.0, rain_deficit_pct * 0.3 + 10.0)
            if irrigation_type == "Drip / Sprinkler":
                climate_risk = max(5.0, climate_risk - 8.0)

        # 2. Thermal Stress Risk (Weight: 25%)
        thermal_risk = 10.0
        if temp_c > optimal_temp_max:
            excess = temp_c - optimal_temp_max
            thermal_risk = min(100.0, 25.0 + excess * 18.0)
            reasons.append(f"High temperature stress: {temp_c:.1f}°C exceeds ICAR optimal ceiling ({optimal_temp_max:.1f}°C).")
            mitigations.append("Sow terminal heat stress tolerant varieties (e.g. HD 3086, DBW 187) and apply light frequent irrigations.")
        elif temp_c < optimal_temp_min:
            deficit = optimal_temp_min - temp_c
            thermal_risk = min(100.0, 20.0 + deficit * 14.0)
            reasons.append(f"Cold/frost stress risk: {temp_c:.1f}°C is below optimal growth threshold ({optimal_temp_min:.1f}°C).")
            mitigations.append("Provide light evening irrigation on forecasted frost nights to regulate soil temperature.")

        # 3. Soil Fertility & Reaction Risk (Weight: 20%)
        soil_risk = 15.0
        if soil_ph < 5.5:
            soil_risk += 35.0
            reasons.append(f"Acidic soil condition (pH {soil_ph:.1f}) restricts phosphorus and micronutrient availability.")
            mitigations.append("Apply agricultural lime or dolomite @ 2-4 t/ha based on soil test recommendations.")
        elif soil_ph > 8.5:
            soil_risk += 30.0
            reasons.append(f"Alkaline soil condition (pH {soil_ph:.1f}) causes micronutrient (Zinc/Iron) fixation.")
            mitigations.append("Apply agricultural gypsum and incorporate farm yard manure (FYM) to improve soil structure.")

        nutrient_low_count = sum(1 for s in [n_status, p_status, k_status] if s.lower() == "low")
        if nutrient_low_count >= 2:
            soil_risk += 25.0
            reasons.append("Multiple macronutrient deficiencies (Low N/P/K) identified in district soil profile.")
            mitigations.append("Apply balanced basal N-P-K fertilizer dose with biofertilizer seed inoculation (Rhizobium / PSB).")

        soil_risk = min(100.0, soil_risk)

        # 4. Market Price Volatility Risk (Weight: 20%)
        market_risk = min(100.0, market_volatility_cv * 2.5)
        if market_volatility_cv > 20.0:
            reasons.append(f"High mandi price volatility (Coefficient of Variation {market_volatility_cv:.1f}% on eNAM records).")
            mitigations.append("Utilize eNAM electronic warehouse receipt (e-NWR) pledge financing to avoid distress sales at harvest peak.")

        # Composite Score Calculation
        composite_score = (
            0.35 * climate_risk +
            0.25 * thermal_risk +
            0.20 * soil_risk +
            0.20 * market_risk
        )
        composite_score = round(min(100.0, max(5.0, composite_score)), 1)

        # Documented Risk Categorization
        if composite_score >= 60.0:
            rating = "High Risk"
        elif composite_score >= 35.0:
            rating = "Moderate Risk"
        else:
            rating = "Low Risk"

        if not reasons:
            reasons.append("Agro-climatic and soil parameters are within normal physiological bounds for this crop.")
        if not mitigations:
            mitigations.append("Follow standard ICAR package of practices and periodic field monitoring for pest emergence.")

        return {
            "overallRiskRating": rating,
            "compositeRiskScore": composite_score,
            "dimensions": {
                "climateRisk": round(climate_risk, 1),
                "thermalRisk": round(thermal_risk, 1),
                "soilRisk": round(soil_risk, 1),
                "marketRisk": round(market_risk, 1),
            },
            "primaryRiskDrivers": reasons,
            "mitigationActions": mitigations,
            "methodology": "Composite Weighted Risk Formula: 0.35*Climate + 0.25*Thermal + 0.20*Soil + 0.20*Market based on IMD, NRSC, and eNAM benchmarks.",
        }
