import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CompanyProvider, useCompany } from "./CompanyContext";

function Consumer() {
  const company = useCompany();
  return <span>{company.name}</span>;
}

describe("CompanyContext", () => {
  it("provides company data to consumers wrapped in CompanyProvider", () => {
    render(
      <CompanyProvider>
        <Consumer />
      </CompanyProvider>
    );
    expect(screen.getByText("Imprimelo Publicidad")).toBeInTheDocument();
  });

  it("throws a descriptive error when used outside CompanyProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Consumer />)).toThrow(
      "useCompany must be used within a CompanyProvider"
    );
    spy.mockRestore();
  });
});
