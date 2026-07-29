import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { Footer } from "./Footer";
import { CompanyProvider } from "../../context/CompanyContext";

describe("Footer", () => {
  it("shows the real contact details", () => {
    render(
      <ChakraProvider>
        <CompanyProvider>
          <Footer />
        </CompanyProvider>
      </ChakraProvider>
    );

    expect(screen.getByText("Albox, Almería (España)")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "+34 661 22 69 12" })).toHaveAttribute(
      "href",
      "tel:+34661226912"
    );
    expect(screen.getByText(/@imprimeloalbox/)).toBeInTheDocument();
  });
});
