import { useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useFetch } from "../hooks/useFetch";
import { endpoints } from "../api/client";
import { useCompany } from "../context/CompanyContext";
import { ServiceCard } from "../components/ui/ServiceCard";
import { SectionTitle } from "../components/ui/SectionTitle";

export default function Home() {
  const company = useCompany();
  const { data: services } = useFetch(endpoints.services);

  const featuredServices = useMemo(() => (services ? services.slice(0, 3) : []), [services]);

  return (
    <Box>
      <Box bg="black" color="white" py={{ base: 16, md: 24 }}>
        <Container maxW="6xl">
          <Stack spacing={5} maxW="2xl">
            <Heading as="h1" size="2xl">
              {company.name}
            </Heading>
            <Text fontSize={{ base: "lg", md: "xl" }} color="gray.300">
              {company.tagline}
            </Text>
            <Text color="gray.400">{company.description}</Text>
            <HStack spacing={4} pt={2}>
              <Button as={RouterLink} to="/contacto" colorScheme="brand">
                Pide presupuesto
              </Button>
              <Button
                as="a"
                href={company.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                variant="outline"
                colorScheme="whiteAlpha"
              >
                WhatsApp
              </Button>
            </HStack>
          </Stack>
        </Container>
      </Box>

      <Container maxW="6xl" py={{ base: 12, md: 16 }}>
        <SectionTitle title="Qué hacemos" subtitle="Una muestra de nuestros servicios más pedidos" />
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={6} mb={6}>
          {featuredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </SimpleGrid>
        <Box textAlign="center">
          <Button as={RouterLink} to="/servicios" variant="link" colorScheme="brand">
            Ver todos los servicios →
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
