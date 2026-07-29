import { Container, Heading, Link, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { useCompany } from "../context/CompanyContext";
import { ContactForm } from "../components/forms/ContactForm";
import { SectionTitle } from "../components/ui/SectionTitle";

export default function Contact() {
  const company = useCompany();

  return (
    <Container maxW="6xl" py={{ base: 8, md: 12 }}>
      <SectionTitle
        title="Hablemos de tu proyecto"
        subtitle="Pide presupuesto sin compromiso, te respondemos lo antes posible."
      />
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        <Stack spacing={3}>
          <Heading as="h3" size="md">
            Datos de contacto
          </Heading>
          <Text>{company.location}</Text>
          <Text>{company.scheduleNote}</Text>
          <Link href={company.phoneHref} fontWeight="bold">
            {company.phone}
          </Link>
          <Link href={company.whatsappUrl} isExternal color="green.600" fontWeight="bold">
            Escríbenos por WhatsApp
          </Link>
          <Link href={company.instagramUrl} isExternal>
            Síguenos en Instagram {company.instagramHandle}
          </Link>
        </Stack>
        <ContactForm />
      </SimpleGrid>
    </Container>
  );
}
