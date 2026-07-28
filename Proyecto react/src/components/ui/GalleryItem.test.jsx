import { memo, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { GalleryItem, GalleryItemBase } from "./GalleryItem";

const sampleItem = {
  id: 1,
  src: "/images/gallery/post01.jpg",
  alt: "Fachada del local de Imprimelo Publicidad",
  category: "Rotulación",
};

function renderWithChakra(ui) {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
}

describe("GalleryItem", () => {
  it("renders the image with its alt text and calls onSelect when clicked", () => {
    const onSelect = vi.fn();
    renderWithChakra(<GalleryItem item={sampleItem} onSelect={onSelect} />);

    const button = screen.getByLabelText(sampleItem.alt);
    expect(screen.getByAltText(sampleItem.alt)).toBeInTheDocument();

    fireEvent.click(button);
    expect(onSelect).toHaveBeenCalledWith(sampleItem);
  });

  it("does not re-render when its props are referentially unchanged", () => {
    const renderSpy = vi.fn(GalleryItemBase);
    const MemoItem = memo(renderSpy);
    const onSelect = vi.fn();

    function Wrapper() {
      const [tick, setTick] = useState(0);
      return (
        <div>
          <button onClick={() => setTick((t) => t + 1)}>tick</button>
          <MemoItem item={sampleItem} onSelect={onSelect} />
        </div>
      );
    }

    renderWithChakra(<Wrapper />);
    expect(renderSpy).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText("tick"));
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });
});
