import { describe, expect, it } from "vitest";
import { API_BASE_URL, endpoints } from "./client";

describe("api client", () => {
  it("builds services and gallery endpoints from the base URL", () => {
    expect(endpoints.services).toBe(`${API_BASE_URL}/services`);
    expect(endpoints.gallery).toBe(`${API_BASE_URL}/gallery`);
  });
});
