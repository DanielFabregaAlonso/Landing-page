import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="servicios" element={<Services />} />
        <Route path="galeria" element={<Gallery />} />
        <Route path="contacto" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
