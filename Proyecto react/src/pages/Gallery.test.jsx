import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitForElementToBeRemoved } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import Gallery from "./Gallery";

const sampleGallery = [
  {
    id: 1,
    src: "/images/gallery/post01.jpg",
    alt: "Fachada del local de Imprimelo Publicidad",
    category: "Rotulación",
  },
  {
    id: 2,
    src: "/images/gallery/post02.jpg",
    alt: "Bordados navideños personalizados",
    category: "Bordados",
  },
];

function renderPage() {
  return render(
    <ChakraProvider>
      <Gallery />
    </ChakraProvider>
  );
}

describe("Gallery page", () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => sampleGallery,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("has the page heading and loads gallery items from the API", async () => {
    renderPage();
    expect(screen.getByRole("heading", { name: "Galería de trabajos" })).toBeInTheDocument();
    expect(await screen.findByLabelText("Fachada del local de Imprimelo Publicidad")).toBeInTheDocument();
  });

  it("filters gallery items by category", async () => {
    renderPage();
    await screen.findByLabelText("Fachada del local de Imprimelo Publicidad");

    fireEvent.click(screen.getByRole("button", { name: "Bordados" }));

    expect(
      screen.queryByLabelText("Fachada del local de Imprimelo Publicidad")
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText("Bordados navideños personalizados")).toBeInTheDocument();
  });

  it("opens the lightbox when an item is clicked and closes it again", async () => {
    renderPage();
    const item = await screen.findByLabelText("Fachada del local de Imprimelo Publicidad");

    fireEvent.click(item);
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Cerrar"));
    // Chakra's Modal exit transition (framer-motion) unmounts asynchronously,
    // so the removal must be awaited rather than asserted synchronously.
    await waitForElementToBeRemoved(dialog);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
