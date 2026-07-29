import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./Layout";
import { CompanyProvider } from "../../context/CompanyContext";

describe("Layout", () => {
  it("renders the navbar, the nested route content, and the footer", () => {
    render(
      <ChakraProvider>
        <CompanyProvider>
          <MemoryRouter initialEntries={["/pagina-de-prueba"]}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="pagina-de-prueba" element={<div>Contenido de prueba</div>} />
              </Route>
            </Routes>
          </MemoryRouter>
        </CompanyProvider>
      </ChakraProvider>
    );

    expect(screen.getByText("Contenido de prueba")).toBeInTheDocument();
    expect(screen.getAllByText("Imprimelo Publicidad").length).toBeGreaterThan(0);
    expect(screen.getByText(/Instagram/)).toBeInTheDocument();
  });
});
