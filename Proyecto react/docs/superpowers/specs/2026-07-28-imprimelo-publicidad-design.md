# Imprimelo Publicidad — sitio web en React (diseño)

## Contexto y objetivo

Proyecto de práctica para consolidar conocimientos de React. Se construye una web para "Imprimelo Publicidad", empresa real de serigrafía, rotulación, DTF, bordados y merchandising personalizado ubicada en Albox (Almería, España), inspirada estructuralmente en https://manuserigrafia.es/ y con contenido/branding real extraído de su Instagram (https://www.instagram.com/imprimeloalbox/).

Debe cumplir estos requisitos académicos:
- Web full responsive.
- Arquitectura útil y fácil de comprender.
- Mínimo 3 páginas navegables con `react-router-dom`.
- Mínimo 3 estados usados con sentido.
- Mínimo 1 `useEffect` para peticiones de datos.
- Uso de una API (pública o propia).
- Un formulario útil (con `react-hook-form` o `useRef`).
- Componentes reutilizables.
- Sin re-renderizaciones innecesarias.
- Mínimo 1 custom hook.
- Mínimo 1 `useContext`.

## Contenido real recopilado

De Instagram (@imprimeloalbox):
- **Logo**: foto de perfil real — fondo negro, texto "imprímelo publicidad" (blanco/verde). Descargado a `ig_images/profile.jpg`.
- **Bio**: "Calidad, Creatividad y Confianza Profesional. Especialistas en Rotulación, Serigrafía, Diseño Gráfico, Bordados".
- **Categorías destacadas (highlights)**: DTF, Serigrafía, Bordados, Rotulación, Cartelería.
- **Teléfono / WhatsApp real**: +34 661 22 69 12 (visible en varias publicaciones promocionales).
- **Ubicación**: Albox, Almería, España ("Empresa de publicidad en Albox").
- **12 imágenes descargadas a `ig_images/`** (`post01.jpg`–`post12.jpg`, más `profile.jpg` que es el logo). `post01.jpg` es la foto real de la fachada del local (sin marca de agua). Las otras 11 son plantillas promocionales de campaña de Navidad con marca de agua de "INVERSA publicidad" (proveedor de plantillas) en la esquina — se usan igualmente, etiquetadas como "campañas destacadas", ya que es un proyecto de práctica sin publicación real.

Datos no disponibles (dirección exacta, horario exacto): se usan como marcador editable, sin inventar una dirección de calle ficticia — se indica la localidad real (Albox) y un horario comercial habitual de ejemplo, dejando claro en el propio contenido que son orientativos.

## Stack técnico

- **Vite + React 18 (JavaScript)**
- **react-router-dom** (enrutado)
- **Chakra UI** (`@chakra-ui/react`, `@emotion/react`, `@emotion/styled`, `framer-motion`) para maquetación responsive
- **react-hook-form** para el formulario de contacto
- **json-server** como API propia (lee `db.json`), lanzado junto a Vite mediante `concurrently`

## Arquitectura de carpetas

```
Proyecto react/
├── db.json                      # API propia (json-server): services, gallery
├── package.json
├── vite.config.js
├── index.html
├── public/
├── src/
│   ├── main.jsx
│   ├── App.jsx                  # ChakraProvider + CompanyProvider + Router
│   ├── theme/
│   │   └── theme.js             # colores/tipografía de marca (negro, verde, blanco, acento naranja)
│   ├── context/
│   │   └── CompanyContext.jsx   # datos fijos de empresa + hook useCompany()
│   ├── hooks/
│   │   └── useFetch.js          # custom hook genérico: fetch + loading/error, useEffect + AbortController
│   ├── api/
│   │   └── client.js            # BASE_URL + helper de fetch
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx       # menú responsive, estado isOpen (móvil)
│   │   │   ├── Footer.jsx
│   │   │   └── Layout.jsx       # Navbar + <Outlet/> + Footer
│   │   ├── ui/
│   │   │   ├── SectionTitle.jsx
│   │   │   ├── ServiceCard.jsx  # React.memo
│   │   │   ├── GalleryItem.jsx  # React.memo
│   │   │   ├── GalleryLightbox.jsx
│   │   │   └── CategoryFilter.jsx
│   │   └── forms/
│   │       └── ContactForm.jsx  # react-hook-form
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Services.jsx
│   │   ├── Gallery.jsx
│   │   ├── Contact.jsx
│   │   └── NotFound.jsx
│   └── assets/
│       ├── logo.jpg
│       └── gallery/ (12 imágenes)
```

## Datos y API propia

`db.json` con dos colecciones servidas por json-server en `http://localhost:4000`:

- **`services`**: `{ id, title, category, description, icon }`. Categorías: Serigrafía, Rotulación, DTF, Bordados, Sublimación, Cartelería, Merchandising, Calendarios/Papelería, Placas y Trofeos.
- **`gallery`**: `{ id, src, alt, category }`. Las 12 imágenes reales, categorizadas según el trabajo mostrado (bordados, rotulación/vinilo, sublimación, estampados/DTF, merchandising, placas, cartelería, calendarios, local).

`useFetch(url)` es el custom hook que centraliza el `useEffect` de fetching (con `AbortController` para cancelar peticiones al desmontar) y se reutiliza en `Services.jsx` y `Gallery.jsx`.

## Páginas y rutas

| Ruta | Página | Contenido |
|---|---|---|
| `/` | Home | Hero con logo/tagline reales, CTA a Contacto/WhatsApp, foto real del local, preview de servicios y galería |
| `/servicios` | Services | Catálogo completo desde la API propia, filtrable por categoría |
| `/galeria` | Gallery | Grid de las 12 imágenes reales, filtro por categoría + lightbox |
| `/contacto` | Contact | Datos reales de contacto (teléfono, WhatsApp, Instagram, Albox) + formulario |
| `*` | NotFound | Página 404 simple |

## Estados (mínimo 3, con sentido)

1. **Navbar**: menú móvil abierto/cerrado (`useDisclosure`/`useState`).
2. **Gallery**: categoría de filtro activa (`useState`).
3. **Gallery**: imagen seleccionada en el lightbox (`useState`, `null` = cerrado).
4. **Contact**: estado de envío del formulario `idle | sending | success | error` (`useState`), independiente del estado interno de los campos que gestiona `react-hook-form`.

## Formulario de contacto

`react-hook-form` con campos: nombre, email, teléfono (opcional), tipo de servicio (select con las categorías reales), mensaje. Validación de campos obligatorios y formato de email. Al enviar: simulación de envío asíncrono (sin backend de email real ni credenciales de terceros), actualiza el estado de envío y muestra confirmación o error. Justificación: evita depender de un servicio externo de pago/credenciales solo para cumplir el requisito académico.

## Prevención de re-renders innecesarios

- `React.memo` en `ServiceCard` y `GalleryItem` (ítems de listas).
- `useCallback` en los manejadores de eventos pasados a componentes memoizados (ej. seleccionar imagen, cambiar filtro).
- `useMemo` para la lista filtrada de servicios/galería y para el `value` de `CompanyContext` (evita recrear el objeto en cada render del provider).

## Contexto (`useContext`)

`CompanyContext` expone datos fijos de la empresa (nombre, tagline, teléfono, enlace WhatsApp, Instagram, ubicación) vía un hook `useCompany()`. Consumido por `Navbar`, `Footer` y `Contact` sin prop-drilling. El valor del contexto es estático y se memoiza para no provocar renders en cascada.

## Identidad visual

Paleta basada en el logo real: negro/carbón + verde + blanco, con acento naranja cálido para CTAs (botones "Pide presupuesto", WhatsApp). Tipografía manuscrita/informal para titulares (coherente con el logo) combinada con una sans-serif legible para el cuerpo de texto.

## Fuera de alcance

- Backend de email real (EmailJS u otro) — formulario simulado.
- Autenticación/paneles de administración.
- Página "Quiénes somos" separada (contenido de marca integrado en Home/Contact).
- Edición/optimización avanzada de las imágenes descargadas de Instagram (se usan tal cual).
