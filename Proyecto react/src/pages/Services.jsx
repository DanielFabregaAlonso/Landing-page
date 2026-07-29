import { useCallback, useMemo, useState } from "react";
import { Alert, AlertIcon, Box, Container, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import { useFetch } from "../hooks/useFetch";
import { endpoints } from "../api/client";
import { ALL_CATEGORIES, CATEGORIES } from "../constants/categories";
import { CategoryFilter } from "../components/ui/CategoryFilter";
import { ServiceCard } from "../components/ui/ServiceCard";
import { SectionTitle } from "../components/ui/SectionTitle";

export default function Services() {
  const { data, loading, error } = useFetch(endpoints.services);
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);

  const handleSelectCategory = useCallback((category) => {
    setActiveCategory(category);
  }, []);

  const filteredServices = useMemo(() => {
    if (!data) return [];
    if (activeCategory === ALL_CATEGORIES) return data;
    return data.filter((service) => service.category === activeCategory);
  }, [data, activeCategory]);

  return (
    <Container maxW="6xl" py={{ base: 8, md: 12 }}>
      <SectionTitle
        title="Nuestros servicios"
        subtitle="Serigrafía, rotulación, DTF, bordados y mucho más, hecho a medida en Albox."
      />
      <CategoryFilter
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onSelect={handleSelectCategory}
      />
      {loading && (
        <Box textAlign="center" py={10}>
          <Spinner size="lg" color="green.500" />
        </Box>
      )}
      {error && (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          No se pudieron cargar los servicios: {error}
        </Alert>
      )}
      {!loading && !error && filteredServices.length === 0 && (
        <Text>No hay servicios en esta categoría todavía.</Text>
      )}
      {!loading && !error && filteredServices.length > 0 && (
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={6}>
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}
