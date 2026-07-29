import { Link as RouterLink, NavLink } from "react-router-dom";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Image,
  Link,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useCompany } from "../../context/CompanyContext";

const LINKS = [
  { to: "/", label: "Inicio" },
  { to: "/servicios", label: "Servicios" },
  { to: "/galeria", label: "Galería" },
  { to: "/contacto", label: "Contacto" },
];

export function Navbar() {
  const { isOpen, onToggle } = useDisclosure();
  const company = useCompany();

  return (
    <Box as="header" bg="black" color="white" position="sticky" top={0} zIndex={10}>
      <Flex maxW="6xl" mx="auto" px={4} h={16} align="center" justify="space-between">
        <Link as={RouterLink} to="/" display="flex" alignItems="center" gap={2}>
          <Image
            src={company.logoSrc}
            alt={`Logo de ${company.name}`}
            boxSize="40px"
            borderRadius="full"
          />
          <Text fontWeight="bold" display={{ base: "none", sm: "block" }}>
            {company.name}
          </Text>
        </Link>

        <HStack as="nav" aria-label="Principal" spacing={6} display={{ base: "none", md: "flex" }}>
          {LINKS.map((link) => (
            <Link
              key={link.to}
              as={NavLink}
              to={link.to}
              _activeLink={{ color: "green.300", fontWeight: "bold" }}
            >
              {link.label}
            </Link>
          ))}
        </HStack>

        <IconButton
          display={{ base: "inline-flex", md: "none" }}
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          onClick={onToggle}
          variant="ghost"
          color="white"
        />
      </Flex>

      {isOpen && (
        <Stack as="nav" aria-label="Menú móvil" px={4} pb={4} spacing={3} display={{ base: "flex", md: "none" }}>
          {LINKS.map((link) => (
            <Link key={link.to} as={NavLink} to={link.to} onClick={onToggle}>
              {link.label}
            </Link>
          ))}
        </Stack>
      )}
    </Box>
  );
}
