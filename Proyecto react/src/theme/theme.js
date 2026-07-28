import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  colors: {
    brand: {
      50: "#e8f7ef",
      100: "#c3ecd6",
      200: "#9de0bc",
      300: "#77d4a2",
      400: "#51c889",
      500: "#2e7d4f",
      600: "#24623e",
      700: "#1a482d",
      800: "#102d1c",
      900: "#08130c",
    },
    accent: {
      500: "#e8590c",
    },
  },
  fonts: {
    heading: `'Poppins', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  styles: {
    global: {
      body: {
        bg: "white",
        color: "gray.800",
      },
    },
  },
});
