import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import Contact from "./Contact";
import { CompanyProvider } from "../context/CompanyContext";

describe("Contact page", () => {
  it("shows the real contact details and the contact form", () => {
    render(
      <ChakraProvider>
        <CompanyProvider>
          <Contact />
        </CompanyProvider>
      </ChakraProvider>
    );

    expect(screen.getByRole("heading", { name: "Hablemos de tu proyecto" })).toBeInTheDocument();
    expect(screen.getByText("Albox, Almería (España)")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "+34 661 22 69 12" })).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enviar mensaje" })).toBeInTheDocument();
  });
});
