import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { CATEGORIES } from "../../constants/categories";

export function ContactForm({ onSubmitSuccess, simulatedDelayMs = 800 }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [status, setStatus] = useState("idle");

  const onSubmit = async (values) => {
    setStatus("sending");
    try {
      await new Promise((resolve) => setTimeout(resolve, simulatedDelayMs));
      setStatus("success");
      reset();
      onSubmitSuccess?.(values);
    } catch {
      setStatus("error");
    }
  };

  return (
    <Stack as="form" spacing={4} onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormControl isInvalid={Boolean(errors.name)}>
        <FormLabel htmlFor="name">Nombre</FormLabel>
        <Input id="name" {...register("name", { required: "El nombre es obligatorio" })} />
        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={Boolean(errors.email)}>
        <FormLabel htmlFor="email">Email</FormLabel>
        <Input
          id="email"
          type="email"
          {...register("email", {
            required: "El email es obligatorio",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Introduce un email válido",
            },
          })}
        />
        <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="phone">Teléfono (opcional)</FormLabel>
        <Input id="phone" type="tel" {...register("phone")} />
      </FormControl>

      <FormControl isInvalid={Boolean(errors.service)}>
        <FormLabel htmlFor="service">Tipo de servicio</FormLabel>
        <Select
          id="service"
          placeholder="Elige un servicio"
          {...register("service", { required: "Selecciona un servicio" })}
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{errors.service?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={Boolean(errors.message)}>
        <FormLabel htmlFor="message">Mensaje</FormLabel>
        <Textarea
          id="message"
          rows={4}
          {...register("message", { required: "Cuéntanos qué necesitas" })}
        />
        <FormErrorMessage>{errors.message?.message}</FormErrorMessage>
      </FormControl>

      <Button type="submit" colorScheme="brand" isLoading={status === "sending"}>
        Enviar mensaje
      </Button>

      {status === "success" && (
        <Text color="green.600" role="status">
          ¡Gracias! Hemos recibido tu mensaje y te contactaremos pronto.
        </Text>
      )}
      {status === "error" && (
        <Text color="red.600" role="alert">
          Ha ocurrido un error al enviar el formulario. Inténtalo de nuevo.
        </Text>
      )}
    </Stack>
  );
}
