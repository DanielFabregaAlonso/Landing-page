import { memo } from "react";
import { Box, Image } from "@chakra-ui/react";

export function GalleryItemBase({ item, onSelect }) {
  return (
    <Box
      as="button"
      type="button"
      onClick={() => onSelect(item)}
      aria-label={item.alt}
      borderRadius="md"
      overflow="hidden"
      cursor="pointer"
      transition="transform 0.15s ease"
      _hover={{ transform: "scale(1.03)" }}
    >
      <Image src={item.src} alt={item.alt} objectFit="cover" w="100%" h="100%" loading="lazy" />
    </Box>
  );
}

export const GalleryItem = memo(GalleryItemBase);
