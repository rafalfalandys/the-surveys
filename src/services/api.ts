import { API_BASE_URL } from "../config";
import type { CreateSurveyPayload, SurveyResponse, SurveysListResponse } from "../types/apiTypes";

const fetchSurveys = async (
  path: string,
  method: "GET" | "POST" | "PATCH" | "DELETE",
  config: {
    error: string;
    payload?: string;
  },
) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: config.payload,
  });

  if (!response.ok) {
    const errorMsg = await response.json();
    throw new Error(errorMsg.message || config.error);
  }

  return method === "DELETE" ? null : response.json();
};

export const createSurvey = async (payload: CreateSurveyPayload) => {
  return (await fetchSurveys("/surveys", "POST", {
    error: "Failed to create survey",
    payload: JSON.stringify(payload),
  })) as Promise<SurveyResponse>;
};

export const getSurveys = async () => {
  return (await fetchSurveys("/surveys", "GET", {
    error: "Failed to fetch surveys",
  })) as Promise<SurveysListResponse>;
};

export const getSurvey = async (id: string) => {
  return (await fetchSurveys(`/surveys/${id}`, "GET", {
    error: "Failed to fetch survey",
  })) as Promise<SurveyResponse>;
};

export const updateSurvey = async (id: string, payload: Partial<CreateSurveyPayload>) => {
  return (await fetchSurveys(`/surveys/${id}`, "PATCH", {
    error: "Failed to update survey",
    payload: JSON.stringify(payload),
  })) as Promise<SurveyResponse>;
};

export const deleteSurvey = async (id: string) => {
  return await fetchSurveys(`/surveys/${id}`, "DELETE", {
    error: "Failed to delete survey",
  });
};
