import { Box, Heading, Text } from "@chakra-ui/react";

export function SectionTitle({ title, subtitle }) {
  return (
    <Box textAlign="center" mb={8}>
      <Heading as="h2" size="xl" mb={2}>
        {title}
      </Heading>
      {subtitle && (
        <Text color="gray.600" fontSize={{ base: "md", md: "lg" }}>
          {subtitle}
        </Text>
      )}
    </Box>
  );
}
