import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { SectionTitle } from "./SectionTitle";

function renderWithChakra(ui) {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
}

describe("SectionTitle", () => {
  it("renders the title and optional subtitle", () => {
    renderWithChakra(<SectionTitle title="Servicios" subtitle="Lo que hacemos" />);
    expect(screen.getByRole("heading", { name: "Servicios" })).toBeInTheDocument();
    expect(screen.getByText("Lo que hacemos")).toBeInTheDocument();
  });

  it("renders without a subtitle when none is provided", () => {
    renderWithChakra(<SectionTitle title="Servicios" />);
    expect(screen.getByRole("heading", { name: "Servicios" })).toBeInTheDocument();
  });
});
