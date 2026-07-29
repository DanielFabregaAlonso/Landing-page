import { Button, Container, Heading, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export default function NotFound() {
  return (
    <Container maxW="xl" py={20} textAlign="center">
      <Heading size="2xl" mb={4}>
        404
      </Heading>
      <Text mb={6}>La página que buscas no existe.</Text>
      <Button as={RouterLink} to="/" colorScheme="green">
        Volver al inicio
      </Button>
    </Container>
  );
}
