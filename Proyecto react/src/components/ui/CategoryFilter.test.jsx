import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { CategoryFilter } from "./CategoryFilter";

function renderWithChakra(ui) {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
}

describe("CategoryFilter", () => {
  it("renders 'Todos' plus each category and marks the active one as pressed", () => {
    renderWithChakra(
      <CategoryFilter
        categories={["Serigrafía", "Bordados"]}
        activeCategory="Todos"
        onSelect={() => {}}
      />
    );

    expect(screen.getByRole("button", { name: "Todos" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Serigrafía" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
    expect(screen.getByRole("button", { name: "Bordados" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("calls onSelect with the clicked category", () => {
    const onSelect = vi.fn();
    renderWithChakra(
      <CategoryFilter categories={["Serigrafía", "Bordados"]} activeCategory="Todos" onSelect={onSelect} />
    );

    fireEvent.click(screen.getByRole("button", { name: "Bordados" }));
    expect(onSelect).toHaveBeenCalledWith("Bordados");
  });
});
