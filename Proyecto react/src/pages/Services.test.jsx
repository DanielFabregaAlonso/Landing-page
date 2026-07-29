import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import Services from "./Services";

const sampleServices = [
  { id: 1, title: "Serigrafía textil", category: "Serigrafía", description: "d1", icon: "🖨️" },
  { id: 2, title: "Bordado industrial", category: "Bordados", description: "d2", icon: "🧵" },
];

function renderPage() {
  return render(
    <ChakraProvider>
      <Services />
    </ChakraProvider>
  );
}

describe("Services page", () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => sampleServices,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("has the page heading and loads services from the API", async () => {
    renderPage();
    expect(screen.getByRole("heading", { name: "Nuestros servicios" })).toBeInTheDocument();
    expect(await screen.findByText("Serigrafía textil")).toBeInTheDocument();
    expect(screen.getByText("Bordado industrial")).toBeInTheDocument();
  });

  it("filters services by category", async () => {
    renderPage();
    await screen.findByText("Serigrafía textil");

    fireEvent.click(screen.getByRole("button", { name: "Bordados" }));

    expect(screen.queryByText("Serigrafía textil")).not.toBeInTheDocument();
    expect(screen.getByText("Bordado industrial")).toBeInTheDocument();
  });

  it("shows an error message when the request fails", async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 500 });
    renderPage();
    expect(await screen.findByText(/no se pudieron cargar los servicios/i)).toBeInTheDocument();
  });
});
