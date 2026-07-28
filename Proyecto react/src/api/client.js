export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const endpoints = {
  services: `${API_BASE_URL}/services`,
  gallery: `${API_BASE_URL}/gallery`,
};
