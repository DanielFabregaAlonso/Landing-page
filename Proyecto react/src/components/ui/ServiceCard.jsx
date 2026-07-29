import { memo } from "react";
import { Box, Heading, Tag, Text } from "@chakra-ui/react";

export function ServiceCardBase({ service }) {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={5}
      bg="white"
      boxShadow="sm"
      transition="transform 0.15s ease"
      _hover={{ transform: "translateY(-4px)", boxShadow: "md" }}
    >
      <Text fontSize="2xl" mb={2} aria-hidden="true">
        {service.icon}
      </Text>
      <Heading as="h3" size="md" mb={2}>
        {service.title}
      </Heading>
      <Tag colorScheme="brand" mb={3}>
        {service.category}
      </Tag>
      <Text fontSize="sm" color="gray.600">
        {service.description}
      </Text>
    </Box>
  );
}

export const ServiceCard = memo(ServiceCardBase);
