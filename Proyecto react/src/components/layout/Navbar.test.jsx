import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { MemoryRouter } from "react-router-dom";
import { Navbar } from "./Navbar";
import { CompanyProvider } from "../../context/CompanyContext";

function renderNavbar() {
  return render(
    <ChakraProvider>
      <CompanyProvider>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </CompanyProvider>
    </ChakraProvider>
  );
}

describe("Navbar", () => {
  it("shows the real company name and the nav links", () => {
    renderNavbar();
    expect(screen.getByText("Imprimelo Publicidad")).toBeInTheDocument();
    expect(screen.getAllByText("Servicios").length).toBeGreaterThan(0);
  });

  it("toggles the mobile menu open and closed", () => {
    renderNavbar();

    expect(screen.getAllByText("Inicio")).toHaveLength(1);

    fireEvent.click(screen.getByLabelText("Abrir menú"));
    expect(screen.getByLabelText("Cerrar menú")).toBeInTheDocument();
    expect(screen.getAllByText("Inicio")).toHaveLength(2);

    fireEvent.click(screen.getByLabelText("Cerrar menú"));
    expect(screen.getAllByText("Inicio")).toHaveLength(1);
  });
});
