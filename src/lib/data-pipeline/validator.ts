/**
 * Authentic Agricultural Dataset Validation and Normalization Pipeline
 * Handles range checks, unit normalization, outlier detection, and data cleansing.
 */

export interface ValidationResult<T> {
  isValid: boolean;
  data: T | null;
  errors: string[];
  warnings: string[];
}

export class AgriculturalDataValidator {
  /**
   * Validates and normalizes crop agronomic parameters.
   */
  static validateCrop(crop: any): ValidationResult<any> {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!crop.name || typeof crop.name !== "string" || crop.name.trim().length === 0) {
      errors.push("Invalid or missing crop name");
    }

    if (!crop.botanicalName || typeof crop.botanicalName !== "string") {
      errors.push("Missing botanical name");
    }

    const growthMin = Number(crop.growthDaysMin);
    const growthMax = Number(crop.growthDaysMax);
    if (isNaN(growthMin) || isNaN(growthMax) || growthMin <= 0 || growthMax < growthMin || growthMax > 500) {
      errors.push(`Invalid growth duration range: [${crop.growthDaysMin}, ${crop.growthDaysMax}]`);
    }

    const tempMin = Number(crop.optimalTempMinC);
    const tempMax = Number(crop.optimalTempMaxC);
    if (isNaN(tempMin) || isNaN(tempMax) || tempMin < 0 || tempMax > 55 || tempMin >= tempMax) {
      errors.push(`Invalid temperature threshold: [${crop.optimalTempMinC}, ${crop.optimalTempMaxC}]`);
    }

    const rainMin = Number(crop.optimalRainfallMin);
    const rainMax = Number(crop.optimalRainfallMax);
    if (isNaN(rainMin) || isNaN(rainMax) || rainMin < 0 || rainMax > 6000 || rainMin >= rainMax) {
      errors.push(`Invalid rainfall requirement: [${crop.optimalRainfallMin}, ${crop.optimalRainfallMax}]`);
    }

    const phMin = Number(crop.optimalPhMin);
    const phMax = Number(crop.optimalPhMax);
    if (isNaN(phMin) || isNaN(phMax) || phMin < 3.5 || phMax > 10.0 || phMin >= phMax) {
      errors.push(`Invalid pH range: [${crop.optimalPhMin}, ${crop.optimalPhMax}]`);
    }

    if (errors.length > 0) {
      return { isValid: false, data: null, errors, warnings };
    }

    return {
      isValid: true,
      data: {
        ...crop,
        name: crop.name.trim(),
        growthDaysMin: Math.round(growthMin),
        growthDaysMax: Math.round(growthMax),
        optimalTempMinC: Number(tempMin.toFixed(1)),
        optimalTempMaxC: Number(tempMax.toFixed(1)),
        optimalRainfallMin: Number(rainMin.toFixed(1)),
        optimalRainfallMax: Number(rainMax.toFixed(1)),
        optimalPhMin: Number(phMin.toFixed(1)),
        optimalPhMax: Number(phMax.toFixed(1)),
      },
      errors: [],
      warnings,
    };
  }

  /**
   * Validates and normalizes soil parameters from Soil Health Card records.
   */
  static validateSoilProfile(soil: any): ValidationResult<any> {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!soil.district || typeof soil.district !== "string") {
      errors.push("Missing district identifier in soil profile");
    }

    const phMin = Number(soil.phMin);
    const phMax = Number(soil.phMax);
    if (isNaN(phMin) || isNaN(phMax) || phMin < 3.5 || phMax > 10.5 || phMin > phMax) {
      errors.push(`Soil pH out of realistic agronomic bounds [3.5-10.5]: ${phMin}-${phMax}`);
    }

    const validStatus = ["Low", "Medium", "High", "Very High"];
    if (!validStatus.includes(soil.nStatus)) errors.push(`Invalid Nitrogen status: ${soil.nStatus}`);
    if (!validStatus.includes(soil.pStatus)) errors.push(`Invalid Phosphorus status: ${soil.pStatus}`);
    if (!validStatus.includes(soil.kStatus)) errors.push(`Invalid Potassium status: ${soil.kStatus}`);

    const oc = Number(soil.organicCarbon);
    if (isNaN(oc) || oc < 0 || oc > 5.0) {
      errors.push(`Organic carbon out of typical range (0-5%): ${soil.organicCarbon}`);
    } else if (oc > 2.0) {
      warnings.push(`High organic carbon content detected (${oc}%). Verify wetland/hilly soil sample.`);
    }

    if (errors.length > 0) {
      return { isValid: false, data: null, errors, warnings };
    }

    return {
      isValid: true,
      data: {
        ...soil,
        phMin: Number(phMin.toFixed(2)),
        phMax: Number(phMax.toFixed(2)),
        organicCarbon: Number(oc.toFixed(2)),
      },
      errors: [],
      warnings,
    };
  }

  /**
   * Validates historical yield records and checks for statistical outliers.
   */
  static validateYieldRecord(record: any): ValidationResult<any> {
    const errors: string[] = [];
    const warnings: string[] = [];

    const year = Number(record.year);
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < 1960 || year > currentYear) {
      errors.push(`Invalid harvest year: ${record.year}`);
    }

    const area = Number(record.areaHa);
    const prod = Number(record.prodTonnes);
    const yieldKg = Number(record.yieldKgPerHa);

    if (isNaN(area) || area <= 0) errors.push(`Invalid cropped area: ${record.areaHa} ha`);
    if (isNaN(prod) || prod <= 0) errors.push(`Invalid crop production: ${record.prodTonnes} tonnes`);
    if (isNaN(yieldKg) || yieldKg <= 0) errors.push(`Invalid yield figure: ${record.yieldKgPerHa} kg/ha`);

    // Verify consistency: prod (tonnes) * 1000 / area (ha) ~ yield (kg/ha)
    if (area > 0 && prod > 0 && yieldKg > 0) {
      const calculatedYield = (prod * 1000) / area;
      const discrepancyPct = Math.abs(calculatedYield - yieldKg) / yieldKg;
      if (discrepancyPct > 0.15) {
        warnings.push(`Yield discrepancy >15% between stated yield (${yieldKg}) and prod/area (${calculatedYield.toFixed(0)} kg/ha)`);
      }
    }

    // Outlier checking
    const isSugarcane = typeof record.crop === "string" && record.crop.toLowerCase().includes("sugarcane");
    if (!isSugarcane && yieldKg > 15000) {
      warnings.push(`Yield of ${yieldKg} kg/ha is an extreme statistical outlier for non-sugarcane crops.`);
    }

    if (errors.length > 0) {
      return { isValid: false, data: null, errors, warnings };
    }

    return {
      isValid: true,
      data: {
        ...record,
        year: Math.round(year),
        areaHa: Number(area.toFixed(1)),
        prodTonnes: Number(prod.toFixed(1)),
        yieldKgPerHa: Number(yieldKg.toFixed(1)),
      },
      errors: [],
      warnings,
    };
  }

  /**
   * Validates meteorological observations.
   */
  static validateWeather(obs: any): ValidationResult<any> {
    const errors: string[] = [];
    const warnings: string[] = [];

    const rain = Number(obs.rainfallMm);
    const tMin = Number(obs.tempMinC);
    const tMax = Number(obs.tempMaxC);
    const hum = Number(obs.humidityPct);

    if (isNaN(rain) || rain < 0 || rain > 7000) {
      errors.push(`Rainfall out of bounds [0-7000 mm]: ${obs.rainfallMm}`);
    }
    if (isNaN(tMin) || isNaN(tMax) || tMin < -10 || tMax > 55 || tMin > tMax) {
      errors.push(`Temperature observation invalid: min ${obs.tempMinC}°C, max ${obs.tempMaxC}°C`);
    }
    if (isNaN(hum) || hum < 0 || hum > 100) {
      errors.push(`Humidity percentage invalid [0-100%]: ${obs.humidityPct}`);
    }

    if (errors.length > 0) {
      return { isValid: false, data: null, errors, warnings };
    }

    return {
      isValid: true,
      data: {
        ...obs,
        rainfallMm: Number(rain.toFixed(1)),
        tempMinC: Number(tMin.toFixed(1)),
        tempMaxC: Number(tMax.toFixed(1)),
        humidityPct: Number(hum.toFixed(1)),
      },
      errors: [],
      warnings,
    };
  }
}
