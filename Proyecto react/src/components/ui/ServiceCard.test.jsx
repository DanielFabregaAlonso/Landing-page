import { memo, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { ServiceCard, ServiceCardBase } from "./ServiceCard";

const sampleService = {
  id: 1,
  title: "Serigrafía textil",
  category: "Serigrafía",
  description: "Impresión textil de alta calidad.",
  icon: "🖨️",
};

function renderWithChakra(ui) {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
}

describe("ServiceCard", () => {
  it("renders the service title, category and description", () => {
    renderWithChakra(<ServiceCard service={sampleService} />);
    expect(screen.getByRole("heading", { name: "Serigrafía textil" })).toBeInTheDocument();
    expect(screen.getByText("Serigrafía")).toBeInTheDocument();
    expect(screen.getByText("Impresión textil de alta calidad.")).toBeInTheDocument();
  });

  it("does not re-render when the service prop is referentially unchanged", () => {
    const renderSpy = vi.fn(ServiceCardBase);
    const MemoCard = memo(renderSpy);

    function Wrapper() {
      const [tick, setTick] = useState(0);
      return (
        <div>
          <button onClick={() => setTick((t) => t + 1)}>tick</button>
          <MemoCard service={sampleService} />
        </div>
      );
    }

    renderWithChakra(<Wrapper />);
    expect(renderSpy).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText("tick"));
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });
});
