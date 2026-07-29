import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { theme } from "./theme/theme";
import { CompanyProvider } from "./context/CompanyContext";
import { AppRoutes } from "./AppRoutes";

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <CompanyProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </CompanyProvider>
    </ChakraProvider>
  );
}
