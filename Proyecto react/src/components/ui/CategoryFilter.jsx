import { memo } from "react";
import { Button, Wrap, WrapItem } from "@chakra-ui/react";
import { ALL_CATEGORIES } from "../../constants/categories";

export function CategoryFilterBase({ categories, activeCategory, onSelect }) {
  const options = [ALL_CATEGORIES, ...categories];

  return (
    <Wrap spacing={2} mb={6} role="group" aria-label="Filtrar por categoría">
      {options.map((category) => (
        <WrapItem key={category}>
          <Button
            size="sm"
            variant={activeCategory === category ? "solid" : "outline"}
            colorScheme="brand"
            aria-pressed={activeCategory === category}
            onClick={() => onSelect(category)}
          >
            {category}
          </Button>
        </WrapItem>
      ))}
    </Wrap>
  );
}

export const CategoryFilter = memo(CategoryFilterBase);
