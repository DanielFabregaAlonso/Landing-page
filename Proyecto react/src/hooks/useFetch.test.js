import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useFetch } from "./useFetch";

describe("useFetch", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns loading true, then the parsed data on success", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, title: "Serigrafía" }],
    });

    const { result } = renderHook(() => useFetch("http://localhost:4000/services"));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual([{ id: 1, title: "Serigrafía" }]);
    expect(result.current.error).toBeNull();
  });

  it("sets an error message when the response is not ok", async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 500 });

    const { result } = renderHook(() => useFetch("http://localhost:4000/services"));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toContain("500");
    expect(result.current.data).toBeNull();
  });
});
