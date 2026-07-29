import { Box, Container, Link, Stack, Text } from "@chakra-ui/react";
import { useCompany } from "../../context/CompanyContext";

export function Footer() {
  const company = useCompany();
  const year = new Date().getFullYear();

  return (
    <Box as="footer" bg="gray.900" color="gray.200" mt={16}>
      <Container maxW="6xl" py={10}>
        <Stack direction={{ base: "column", md: "row" }} justify="space-between" spacing={6}>
          <Box>
            <Text fontWeight="bold" fontSize="lg">
              {company.name}
            </Text>
            <Text fontSize="sm" color="gray.400">
              {company.tagline}
            </Text>
          </Box>
          <Stack spacing={1} fontSize="sm">
            <Text>{company.location}</Text>
            <Link href={company.phoneHref}>{company.phone}</Link>
            <Link href={company.instagramUrl} isExternal>
              Instagram {company.instagramHandle}
            </Link>
          </Stack>
        </Stack>
        <Text mt={8} fontSize="xs" color="gray.500" textAlign="center">
          © {year} {company.name}. Sitio de práctica no oficial.
        </Text>
      </Container>
    </Box>
  );
}
