import { useCallback, useMemo, useState } from "react";
import { Alert, AlertIcon, Box, Container, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import { useFetch } from "../hooks/useFetch";
import { endpoints } from "../api/client";
import { ALL_CATEGORIES, CATEGORIES } from "../constants/categories";
import { CategoryFilter } from "../components/ui/CategoryFilter";
import { GalleryItem } from "../components/ui/GalleryItem";
import { GalleryLightbox } from "../components/ui/GalleryLightbox";
import { SectionTitle } from "../components/ui/SectionTitle";

export default function Gallery() {
  const { data, loading, error } = useFetch(endpoints.gallery);
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSelectCategory = useCallback((category) => {
    setActiveCategory(category);
  }, []);

  const handleSelectItem = useCallback((item) => {
    setSelectedItem(item);
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const filteredItems = useMemo(() => {
    if (!data) return [];
    if (activeCategory === ALL_CATEGORIES) return data;
    return data.filter((item) => item.category === activeCategory);
  }, [data, activeCategory]);

  return (
    <Container maxW="6xl" py={{ base: 8, md: 12 }}>
      <SectionTitle
        title="Galería de trabajos"
        subtitle="Una muestra real de nuestras campañas y trabajos en Albox."
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
          No se pudo cargar la galería: {error}
        </Alert>
      )}
      {!loading && !error && filteredItems.length === 0 && (
        <Text>No hay fotos en esta categoría todavía.</Text>
      )}
      {!loading && !error && filteredItems.length > 0 && (
        <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
          {filteredItems.map((item) => (
            <GalleryItem key={item.id} item={item} onSelect={handleSelectItem} />
          ))}
        </SimpleGrid>
      )}
      <GalleryLightbox item={selectedItem} onClose={handleCloseLightbox} />
    </Container>
  );
}
