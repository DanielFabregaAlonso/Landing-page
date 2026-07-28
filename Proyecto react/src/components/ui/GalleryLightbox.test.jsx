import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { GalleryLightbox } from "./GalleryLightbox";

const sampleItem = {
  id: 1,
  src: "/images/gallery/post01.jpg",
  alt: "Fachada del local de Imprimelo Publicidad",
  category: "Rotulación",
};

function renderWithChakra(ui) {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
}

describe("GalleryLightbox", () => {
  it("renders no dialog when item is null", () => {
    renderWithChakra(<GalleryLightbox item={null} onClose={() => {}} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows the selected image and calls onClose when the close button is clicked", () => {
    const onClose = vi.fn();
    renderWithChakra(<GalleryLightbox item={sampleItem} onClose={onClose} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByAltText(sampleItem.alt)).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Cerrar"));
    expect(onClose).toHaveBeenCalled();
  });
});
