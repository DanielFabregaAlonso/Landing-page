import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { ContactForm } from "./ContactForm";

function renderForm(props = {}) {
  return render(
    <ChakraProvider>
      <ContactForm simulatedDelayMs={0} {...props} />
    </ChakraProvider>
  );
}

describe("ContactForm", () => {
  it("shows validation errors when required fields are missing", async () => {
    renderForm();
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(await screen.findByText("El nombre es obligatorio")).toBeInTheDocument();
    expect(screen.getByText("El email es obligatorio")).toBeInTheDocument();
    expect(screen.getByText("Selecciona un servicio")).toBeInTheDocument();
    expect(screen.getByText("Cuéntanos qué necesitas")).toBeInTheDocument();
  });

  it("rejects an invalid email format", async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "no-es-un-email" } });
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(await screen.findByText("Introduce un email válido")).toBeInTheDocument();
  });

  it("submits successfully with valid data, resets, and calls onSubmitSuccess", async () => {
    const onSubmitSuccess = vi.fn();
    renderForm({ onSubmitSuccess });

    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Daniel" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "daniel@example.com" } });
    fireEvent.change(screen.getByLabelText("Tipo de servicio"), {
      target: { value: "Serigrafía" },
    });
    fireEvent.change(screen.getByLabelText("Mensaje"), {
      target: { value: "Necesito 50 camisetas serigrafiadas." },
    });

    fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    await waitFor(() => expect(onSubmitSuccess).toHaveBeenCalledTimes(1));
    expect(
      screen.getByText("¡Gracias! Hemos recibido tu mensaje y te contactaremos pronto.")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre")).toHaveValue("");
  });
});
