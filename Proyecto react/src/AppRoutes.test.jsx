import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { MemoryRouter } from "react-router-dom";
import { CompanyProvider } from "./context/CompanyContext";
import { AppRoutes } from "./AppRoutes";

function renderAt(path) {
  global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
  return render(
    <ChakraProvider>
      <CompanyProvider>
        <MemoryRouter initialEntries={[path]}>
          <AppRoutes />
        </MemoryRouter>
      </CompanyProvider>
    </ChakraProvider>
  );
}

describe("AppRoutes", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders Home at /", async () => {
    renderAt("/");
    expect(
      await screen.findByRole("heading", { name: "Imprimelo Publicidad" })
    ).toBeInTheDocument();
  });

  it("renders Services at /servicios", async () => {
    renderAt("/servicios");
    expect(
      await screen.findByRole("heading", { name: "Nuestros servicios" })
    ).toBeInTheDocument();
  });

  it("renders Gallery at /galeria", async () => {
    renderAt("/galeria");
    expect(
      await screen.findByRole("heading", { name: "Galería de trabajos" })
    ).toBeInTheDocument();
  });

  it("renders Contact at /contacto", async () => {
    renderAt("/contacto");
    expect(
      await screen.findByRole("heading", { name: "Hablemos de tu proyecto" })
    ).toBeInTheDocument();
  });

  it("renders NotFound for an unknown route", () => {
    renderAt("/ruta-inexistente");
    expect(screen.getByText("404")).toBeInTheDocument();
  });
});
