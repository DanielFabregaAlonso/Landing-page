import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";
import { CompanyProvider } from "../context/CompanyContext";

const sampleServices = [
  { id: 1, title: "Serigrafía textil", category: "Serigrafía", description: "d1", icon: "🖨️" },
  { id: 2, title: "Rotulación y vinilo", category: "Rotulación", description: "d2", icon: "🪧" },
  { id: 3, title: "Estampación DTF", category: "DTF", description: "d3", icon: "👕" },
  { id: 4, title: "Bordado industrial", category: "Bordados", description: "d4", icon: "🧵" },
];

function renderPage() {
  return render(
    <ChakraProvider>
      <CompanyProvider>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </CompanyProvider>
    </ChakraProvider>
  );
}

describe("Home page", () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => sampleServices,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows the hero with the real company name and tagline", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: "Imprimelo Publicidad" })).toBeInTheDocument();
    expect(screen.getByText("Calidad, Creatividad y Confianza Profesional")).toBeInTheDocument();
  });

  it("shows a WhatsApp CTA linking to the real number", () => {
    renderPage();
    expect(screen.getByRole("link", { name: "WhatsApp" })).toHaveAttribute(
      "href",
      "https://wa.me/34661226912"
    );
  });

  it("shows at most 3 featured services from the API", async () => {
    renderPage();
    expect(await screen.findByText("Serigrafía textil")).toBeInTheDocument();
    expect(screen.getByText("Rotulación y vinilo")).toBeInTheDocument();
    expect(screen.getByText("Estampación DTF")).toBeInTheDocument();
    expect(screen.queryByText("Bordado industrial")).not.toBeInTheDocument();
  });
});
