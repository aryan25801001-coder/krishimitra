/**
 * Client-Side Farmer Assessment Persistence & History Manager
 * Stores completed assessments securely in localStorage for the Dashboard.
 */

import { AssessmentResult } from "./advisory-engine";

const STORAGE_KEY = "krishimitra_farmer_assessments_v1";

export function getStoredAssessments(): AssessmentResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to load assessments from storage", e);
    return [];
  }
}

export function saveAssessment(assessment: AssessmentResult): void {
  if (typeof window === "undefined") return;
  try {
    const current = getStoredAssessments();
    // Prepend new assessment, prevent duplicate IDs
    const updated = [assessment, ...current.filter((a) => a.id !== assessment.id)].slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save assessment to storage", e);
  }
}

export function deleteAssessment(id: string): AssessmentResult[] {
  if (typeof window === "undefined") return [];
  try {
    const current = getStoredAssessments();
    const updated = current.filter((a) => a.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to delete assessment", e);
    return [];
  }
}

export function clearAllAssessments(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear assessments", e);
  }
}
