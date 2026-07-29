import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { MemoryRouter } from "react-router-dom";
import NotFound from "./NotFound";

describe("NotFound page", () => {
  it("shows a 404 message and a link back home", () => {
    render(
      <ChakraProvider>
        <MemoryRouter>
          <NotFound />
        </MemoryRouter>
      </ChakraProvider>
    );

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Volver al inicio" })).toHaveAttribute("href", "/");
  });
});
