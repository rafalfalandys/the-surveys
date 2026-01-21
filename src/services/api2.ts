import { API_BASE_URL } from "../config";
import type { CreateSurveyPayload, SurveyResponse } from "../types/apiTypes";

export const createSurvey = async (payload: CreateSurveyPayload): Promise<SurveyResponse> => {
  const response = await fetch(`${API_BASE_URL}/surveys`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create survey");
  }

  return response.json();
};

/**
 * Get all surveys
 */
export const getSurveys = async () => {
  const response = await fetch(`${API_BASE_URL}/surveys`);

  if (!response.ok) {
    throw new Error("Failed to fetch surveys");
  }

  return response.json();
};

/**
 * Get single survey by ID
 */
export const getSurvey = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/surveys/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch survey");
  }

  return response.json();
};

/**
 * Update an existing survey
 */
export const updateSurvey = async (id: string, payload: Partial<CreateSurveyPayload>): Promise<SurveyResponse> => {
  const response = await fetch(`${API_BASE_URL}/surveys/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update survey");
  }

  return response.json();
};

/**
 * Delete a survey
 */
export const deleteSurvey = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/surveys/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete survey");
  }
};
