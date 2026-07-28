# Imprimelo Publicidad — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-responsive React website for Imprimelo Publicidad (serigrafía, rotulación, DTF, bordados) with 5 routes, a real "own API" served via json-server, a custom data-fetching hook, a company-wide context, a validated react-hook-form contact form, and memoized reusable components — satisfying every requirement in the design spec.

**Architecture:** Vite + React 18 (JavaScript) SPA. Chakra UI for responsive layout/styling. `react-router-dom` for routing. A `json-server` process serves `db.json` (services + gallery collections) as the "propia API"; a generic `useFetch` custom hook (fetch + `useEffect` + `AbortController`) is reused by the pages that need data. `CompanyContext` holds static real business data (name, phone, WhatsApp, Instagram, location) consumed by `Navbar`, `Footer`, and `Contact` without prop drilling. Vitest + React Testing Library drive TDD for every hook/component/page.

**Tech Stack:** Vite, React 18, JavaScript, react-router-dom, Chakra UI (`@chakra-ui/react`, `@chakra-ui/icons`, `@emotion/react`, `@emotion/styled`, `framer-motion`), react-hook-form, json-server, concurrently, Vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, jsdom.

## Global Constraints

- Full responsive: every layout uses Chakra responsive props (`base/sm/md/lg` breakpoints) — no fixed pixel-only layouts.
- Minimum 3 pages navigable via `react-router-dom` — this plan builds 5 routes (`/`, `/servicios`, `/galeria`, `/contacto`, `*`).
- Minimum 3 states used with purpose — this plan implements 4 (mobile menu open/closed, gallery category filter, gallery lightbox selection, contact form submission status).
- Minimum 1 `useEffect` for data fetching — implemented once, inside the `useFetch` custom hook, reused by `Services`, `Gallery`, and `Home`.
- Must use an API (public or own) — own minimal API via `json-server` reading `db.json`.
- Must include a useful form built with `react-hook-form` or `useRef` — the contact form uses `react-hook-form`.
- Must include reusable components — `ServiceCard`, `GalleryItem`, `CategoryFilter`, `SectionTitle`, `Navbar`, `Footer` are all shared across pages.
- No unnecessary re-renders — `React.memo` on list-item components, `useCallback` on handlers passed to them, `useMemo` for filtered lists and context value.
- Minimum 1 custom hook — `useFetch`.
- Minimum 1 `useContext` — `CompanyContext` / `useCompany()`.
- Use JavaScript, not TypeScript.
- Use real content only: real logo at `public/images/logo.jpg`, real gallery photos at `public/images/gallery/post01.jpg`–`post12.jpg` (already committed to the repo), real phone `+34 661 22 69 12`, real location "Albox, Almería (España)". The contact form is simulated — no real email delivery, no third-party credentials.
- Full design rationale lives in `docs/superpowers/specs/2026-07-28-imprimelo-publicidad-design.md` — consult it for content/category details not repeated here.

---

### Task 1: Scaffold the Vite project, install dependencies, configure Vitest

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/setupTests.js`, `src/theme/theme.js`, `src/theme/theme.test.js`
- Modify: none (fresh scaffold)
- Delete after scaffold: `src/App.css` (unused Vite starter styling; `App.jsx` is fully replaced in Task 16)

**Interfaces:**
- Produces: `theme` (named export from `src/theme/theme.js`) — a Chakra `extendTheme()` result with `colors.brand.500 === "#2e7d4f"` and `colors.accent.500 === "#e8590c"`. Later tasks (`App.jsx` in Task 16) import `{ theme }` from `"./theme/theme"`.
- Produces: Vitest is runnable via `npm test` (globals enabled, jsdom environment, `@testing-library/jest-dom` matchers available in every test file without importing them manually).

- [ ] **Step 1: Scaffold the Vite React template into the current directory**

Run (from `Proyecto react/`, which already contains a `docs/` and `public/images/` folder, so the directory is not empty):

```bash
npm create vite@latest . -- --template react --force
```

- [ ] **Step 2: Install runtime dependencies**

```bash
npm install react-router-dom @chakra-ui/react @chakra-ui/icons @emotion/react @emotion/styled framer-motion react-hook-form
```

- [ ] **Step 3: Install dev dependencies**

```bash
npm install -D json-server concurrently vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 4: Configure Vitest inside `vite.config.js`**

Replace the file's contents with:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    globals: true,
  },
});
```

- [ ] **Step 5: Create the test setup file**

Create `src/setupTests.js`:

```js
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 6: Add the `test` script to `package.json`**

In the `"scripts"` section, add:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 7: Remove the unused default stylesheet**

```bash
rm -f src/App.css
```

(`src/App.jsx` still contains the Vite starter counter for now — it is fully replaced in Task 16. Leave it as-is.)

- [ ] **Step 8: Write the failing test for the brand theme**

Create `src/theme/theme.test.js`:

```js
import { describe, expect, it } from "vitest";
import { theme } from "./theme";

describe("theme", () => {
  it("defines the brand and accent color palettes from the real logo colors", () => {
    expect(theme.colors.brand[500]).toBe("#2e7d4f");
    expect(theme.colors.accent[500]).toBe("#e8590c");
  });
});
```

- [ ] **Step 9: Run the test and verify it fails**

Run: `npm test -- theme.test.js`
Expected: FAIL — `src/theme/theme.js` does not exist yet.

- [ ] **Step 10: Implement the theme**

Create `src/theme/theme.js`:

```js
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
```

- [ ] **Step 11: Run the test and verify it passes**

Run: `npm test -- theme.test.js`
Expected: PASS

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "Scaffold Vite React project with Vitest and brand theme"
```

---

### Task 2: Real company data, `CompanyContext`, and `useCompany` hook

**Files:**
- Create: `src/constants/company.js`, `src/context/CompanyContext.jsx`, `src/context/CompanyContext.test.jsx`

**Interfaces:**
- Produces: `COMPANY` object (named export from `src/constants/company.js`) with shape `{ name, tagline, description, phone, phoneHref, whatsappUrl, instagramUrl, instagramHandle, location, scheduleNote, logoSrc }`.
- Produces: `CompanyProvider` (named export, React component taking `{ children }`) and `useCompany()` (named export, hook returning the `COMPANY` object) from `src/context/CompanyContext.jsx`. Throws `Error("useCompany must be used within a CompanyProvider")` when called outside the provider. Later tasks (`Navbar`, `Footer`, `Contact`, `Home`) import `{ useCompany }` from `"../context/CompanyContext"` (relative path varies by file depth) and `App.jsx` (Task 16) imports `{ CompanyProvider }`.

- [ ] **Step 1: Create the real company data constant**

Create `src/constants/company.js`:

```js
export const COMPANY = {
  name: "Imprimelo Publicidad",
  tagline: "Calidad, Creatividad y Confianza Profesional",
  description:
    "Especialistas en rotulación, serigrafía, DTF, bordados y diseño gráfico en Albox (Almería).",
  phone: "+34 661 22 69 12",
  phoneHref: "tel:+34661226912",
  whatsappUrl: "https://wa.me/34661226912",
  instagramUrl: "https://www.instagram.com/imprimeloalbox/",
  instagramHandle: "@imprimeloalbox",
  location: "Albox, Almería (España)",
  scheduleNote:
    "Horario orientativo: L-V 9:30–13:30 y 16:30–20:00 (confirma disponibilidad por WhatsApp)",
  logoSrc: "/images/logo.jpg",
};
```

- [ ] **Step 2: Write the failing test for `CompanyContext`**

Create `src/context/CompanyContext.test.jsx`:

```jsx
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CompanyProvider, useCompany } from "./CompanyContext";

function Consumer() {
  const company = useCompany();
  return <span>{company.name}</span>;
}

describe("CompanyContext", () => {
  it("provides company data to consumers wrapped in CompanyProvider", () => {
    render(
      <CompanyProvider>
        <Consumer />
      </CompanyProvider>
    );
    expect(screen.getByText("Imprimelo Publicidad")).toBeInTheDocument();
  });

  it("throws a descriptive error when used outside CompanyProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Consumer />)).toThrow(
      "useCompany must be used within a CompanyProvider"
    );
    spy.mockRestore();
  });
});
```

- [ ] **Step 3: Run the test and verify it fails**

Run: `npm test -- CompanyContext.test.jsx`
Expected: FAIL — `src/context/CompanyContext.jsx` does not exist yet.

- [ ] **Step 4: Implement `CompanyContext`**

Create `src/context/CompanyContext.jsx`:

```jsx
import { createContext, useContext, useMemo } from "react";
import { COMPANY } from "../constants/company";

const CompanyContext = createContext(null);

export function CompanyProvider({ children }) {
  const value = useMemo(() => COMPANY, []);
  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
}
```

- [ ] **Step 5: Run the test and verify it passes**

Run: `npm test -- CompanyContext.test.jsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/constants/company.js src/context/CompanyContext.jsx src/context/CompanyContext.test.jsx
git commit -m "Add CompanyContext with real Imprimelo Publicidad business data"
```

---

### Task 3: Service categories, API client, and `useFetch` custom hook

**Files:**
- Create: `src/constants/categories.js`, `src/api/client.js`, `src/api/client.test.js`, `src/hooks/useFetch.js`, `src/hooks/useFetch.test.js`

**Interfaces:**
- Produces: `CATEGORIES` (array of 9 category strings) and `ALL_CATEGORIES` (string `"Todos"`), named exports from `src/constants/categories.js`.
- Produces: `API_BASE_URL` (string) and `endpoints` (object `{ services: string, gallery: string }`), named exports from `src/api/client.js`.
- Produces: `useFetch(url)` (named export from `src/hooks/useFetch.js`) — returns `{ data, loading, error }` where `data` starts `null`, `loading` starts `true`, `error` starts `null`. On success, `data` is the parsed JSON and `loading` becomes `false`. On a non-ok response or thrown error, `error` is a string message and `loading` becomes `false`. Re-fetches whenever `url` changes; aborts the in-flight request on unmount. Later tasks (`Services`, `Gallery`, `Home` pages) import `{ useFetch }` from `"../hooks/useFetch"`.

- [ ] **Step 1: Create the shared category list**

Create `src/constants/categories.js`:

```js
export const CATEGORIES = [
  "Serigrafía",
  "Rotulación",
  "DTF",
  "Bordados",
  "Sublimación",
  "Cartelería",
  "Merchandising",
  "Papelería",
  "Trofeos y Placas",
];

export const ALL_CATEGORIES = "Todos";
```

- [ ] **Step 2: Write the failing test for the API client**

Create `src/api/client.test.js`:

```js
import { describe, expect, it } from "vitest";
import { API_BASE_URL, endpoints } from "./client";

describe("api client", () => {
  it("builds services and gallery endpoints from the base URL", () => {
    expect(endpoints.services).toBe(`${API_BASE_URL}/services`);
    expect(endpoints.gallery).toBe(`${API_BASE_URL}/gallery`);
  });
});
```

- [ ] **Step 3: Run the test and verify it fails**

Run: `npm test -- client.test.js`
Expected: FAIL — `src/api/client.js` does not exist yet.

- [ ] **Step 4: Implement the API client**

Create `src/api/client.js`:

```js
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const endpoints = {
  services: `${API_BASE_URL}/services`,
  gallery: `${API_BASE_URL}/gallery`,
};
```

- [ ] **Step 5: Run the test and verify it passes**

Run: `npm test -- client.test.js`
Expected: PASS

- [ ] **Step 6: Write the failing tests for `useFetch`**

Create `src/hooks/useFetch.test.js`:

```jsx
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useFetch } from "./useFetch";

describe("useFetch", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns loading true, then the parsed data on success", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, title: "Serigrafía" }],
    });

    const { result } = renderHook(() => useFetch("http://localhost:4000/services"));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual([{ id: 1, title: "Serigrafía" }]);
    expect(result.current.error).toBeNull();
  });

  it("sets an error message when the response is not ok", async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 500 });

    const { result } = renderHook(() => useFetch("http://localhost:4000/services"));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toContain("500");
    expect(result.current.data).toBeNull();
  });
});
```

- [ ] **Step 7: Run the tests and verify they fail**

Run: `npm test -- useFetch.test.js`
Expected: FAIL — `src/hooks/useFetch.js` does not exist yet.

- [ ] **Step 8: Implement `useFetch`**

Create `src/hooks/useFetch.js`:

```js
import { useEffect, useState } from "react";

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Error ${response.status} al obtener ${url}`);
        }
        const json = await response.json();
        setData(json);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    load();

    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}
```

- [ ] **Step 9: Run the tests and verify they pass**

Run: `npm test -- useFetch.test.js`
Expected: PASS

- [ ] **Step 10: Commit**

```bash
git add src/constants/categories.js src/api/client.js src/api/client.test.js src/hooks/useFetch.js src/hooks/useFetch.test.js
git commit -m "Add category constants, API client, and useFetch custom hook"
```

---

### Task 4: `db.json` — the own API's data (services + gallery)

**Files:**
- Create: `db.json` (project root)

**Interfaces:**
- Produces: a running `json-server --watch db.json --port 4000` exposes `GET /services` (9 items, shape `{ id, title, category, description, icon }`, `category` values drawn from `CATEGORIES` in Task 3) and `GET /gallery` (12 items, shape `{ id, src, alt, category }`, `src` values pointing at the already-committed files under `public/images/gallery/`). Later tasks (`Services`, `Gallery`, `Home` pages) consume these via `endpoints.services` / `endpoints.gallery` from Task 3.

- [ ] **Step 1: Write `db.json`**

Create `db.json` at the project root:

```json
{
  "services": [
    {
      "id": 1,
      "title": "Serigrafía textil",
      "category": "Serigrafía",
      "description": "Impresión textil de alta calidad para grandes tiradas: camisetas, sudaderas, uniformes y textil publicitario.",
      "icon": "🖨️"
    },
    {
      "id": 2,
      "title": "Rotulación y vinilo",
      "category": "Rotulación",
      "description": "Rótulos, vinilos decorativos y señalética para escaparates, vehículos y fachadas.",
      "icon": "🪧"
    },
    {
      "id": 3,
      "title": "Estampación DTF",
      "category": "DTF",
      "description": "Estampación DTF para prendas personalizadas, ideal para tiradas cortas y diseños a todo color.",
      "icon": "👕"
    },
    {
      "id": 4,
      "title": "Bordado industrial",
      "category": "Bordados",
      "description": "Bordado industrial en polos, sudaderas y uniformes con logotipos e iniciales.",
      "icon": "🧵"
    },
    {
      "id": 5,
      "title": "Sublimación",
      "category": "Sublimación",
      "description": "Tazas, botellas, textil y regalos personalizados a todo color mediante sublimación.",
      "icon": "☕"
    },
    {
      "id": 6,
      "title": "Cartelería y diseño",
      "category": "Cartelería",
      "description": "Diseño e impresión de carteles, programas de fiestas y material publicitario para eventos.",
      "icon": "📰"
    },
    {
      "id": 7,
      "title": "Merchandising corporativo",
      "category": "Merchandising",
      "description": "Artículos publicitarios personalizados: bolígrafos, libretas, kits corporativos y regalos de empresa.",
      "icon": "🎁"
    },
    {
      "id": 8,
      "title": "Papelería personalizada",
      "category": "Papelería",
      "description": "Calendarios, agendas y papelería personalizada para particulares y empresas.",
      "icon": "📅"
    },
    {
      "id": 9,
      "title": "Trofeos y placas",
      "category": "Trofeos y Placas",
      "description": "Placas de reconocimiento y trofeos personalizados en cristal y metacrilato.",
      "icon": "🏆"
    }
  ],
  "gallery": [
    {
      "id": 1,
      "src": "/images/gallery/post01.jpg",
      "alt": "Fachada y rótulo del local de Imprimelo Publicidad en Albox",
      "category": "Rotulación"
    },
    {
      "id": 2,
      "src": "/images/gallery/post02.jpg",
      "alt": "Bordados navideños personalizados en sudaderas",
      "category": "Bordados"
    },
    {
      "id": 3,
      "src": "/images/gallery/post03.jpg",
      "alt": "Kit de oficina navideño personalizado",
      "category": "Merchandising"
    },
    {
      "id": 4,
      "src": "/images/gallery/post04.jpg",
      "alt": "Vinilos navideños personalizados en escaparate",
      "category": "Rotulación"
    },
    {
      "id": 5,
      "src": "/images/gallery/post05.jpg",
      "alt": "Tazas y termos personalizados por sublimación",
      "category": "Sublimación"
    },
    {
      "id": 6,
      "src": "/images/gallery/post06.jpg",
      "alt": "Camisetas familiares estampadas con nombres personalizados",
      "category": "DTF"
    },
    {
      "id": 7,
      "src": "/images/gallery/post07.jpg",
      "alt": "Pieza gráfica de campaña de Navidad",
      "category": "Cartelería"
    },
    {
      "id": 8,
      "src": "/images/gallery/post08.jpg",
      "alt": "Merchandising institucional personalizado",
      "category": "Merchandising"
    },
    {
      "id": 9,
      "src": "/images/gallery/post09.jpg",
      "alt": "Placas de reconocimiento en cristal",
      "category": "Trofeos y Placas"
    },
    {
      "id": 10,
      "src": "/images/gallery/post10.jpg",
      "alt": "Cartel de la Feria de Albox",
      "category": "Cartelería"
    },
    {
      "id": 11,
      "src": "/images/gallery/post11.jpg",
      "alt": "Calendarios imantados personalizados",
      "category": "Papelería"
    },
    {
      "id": 12,
      "src": "/images/gallery/post12.jpg",
      "alt": "Polo bordado para Clínica Fisioalbox",
      "category": "Bordados"
    }
  ]
}
```

- [ ] **Step 2: Verify the API serves the expected data**

Run (starts json-server in the background, queries it, then stops it):

```bash
npx json-server --watch db.json --port 4000 &
SERVER_PID=$!
sleep 2
curl -s http://localhost:4000/services | node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8')); if(d.length!==9) throw new Error('expected 9 services, got '+d.length); console.log('services OK')"
curl -s http://localhost:4000/gallery | node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8')); if(d.length!==12) throw new Error('expected 12 gallery items, got '+d.length); console.log('gallery OK')"
kill $SERVER_PID
```

Expected output: `services OK` then `gallery OK`, no thrown errors.

- [ ] **Step 3: Commit**

```bash
git add db.json
git commit -m "Add db.json own API data: 9 services and 12 real gallery items"
```

---

### Task 5: Reusable UI atoms — `SectionTitle`, `ServiceCard`, `GalleryItem`

**Files:**
- Create: `src/components/ui/SectionTitle.jsx`, `src/components/ui/SectionTitle.test.jsx`
- Create: `src/components/ui/ServiceCard.jsx`, `src/components/ui/ServiceCard.test.jsx`
- Create: `src/components/ui/GalleryItem.jsx`, `src/components/ui/GalleryItem.test.jsx`

**Interfaces:**
- Produces: `SectionTitle({ title, subtitle })` (named export, default renders an `h2` with the title and, if `subtitle` is provided, a paragraph under it).
- Produces: `ServiceCard` (default named export, `React.memo`-wrapped) and `ServiceCardBase` (named export, the un-memoized function) from `src/components/ui/ServiceCard.jsx`. Props: `{ service: { id, title, category, description, icon } }`. Later: `Services.jsx` and `Home.jsx` import `{ ServiceCard }`.
- Produces: `GalleryItem` (`React.memo`-wrapped) and `GalleryItemBase` from `src/components/ui/GalleryItem.jsx`. Props: `{ item: { id, src, alt, category }, onSelect: (item) => void }`. Clicking the item calls `onSelect(item)`. Later: `Gallery.jsx` imports `{ GalleryItem }`.

- [ ] **Step 1: Write the failing test for `SectionTitle`**

Create `src/components/ui/SectionTitle.test.jsx`:

```jsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { SectionTitle } from "./SectionTitle";

function renderWithChakra(ui) {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
}

describe("SectionTitle", () => {
  it("renders the title and optional subtitle", () => {
    renderWithChakra(<SectionTitle title="Servicios" subtitle="Lo que hacemos" />);
    expect(screen.getByRole("heading", { name: "Servicios" })).toBeInTheDocument();
    expect(screen.getByText("Lo que hacemos")).toBeInTheDocument();
  });

  it("renders without a subtitle when none is provided", () => {
    renderWithChakra(<SectionTitle title="Servicios" />);
    expect(screen.getByRole("heading", { name: "Servicios" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test -- SectionTitle.test.jsx`
Expected: FAIL — `SectionTitle.jsx` does not exist yet.

- [ ] **Step 3: Implement `SectionTitle`**

Create `src/components/ui/SectionTitle.jsx`:

```jsx
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
```

- [ ] **Step 4: Run the test and verify it passes**

Run: `npm test -- SectionTitle.test.jsx`
Expected: PASS

- [ ] **Step 5: Write the failing tests for `ServiceCard`**

Create `src/components/ui/ServiceCard.test.jsx`:

```jsx
import { memo, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { ServiceCard, ServiceCardBase } from "./ServiceCard";

const sampleService = {
  id: 1,
  title: "Serigrafía textil",
  category: "Serigrafía",
  description: "Impresión textil de alta calidad.",
  icon: "🖨️",
};

function renderWithChakra(ui) {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
}

describe("ServiceCard", () => {
  it("renders the service title, category and description", () => {
    renderWithChakra(<ServiceCard service={sampleService} />);
    expect(screen.getByRole("heading", { name: "Serigrafía textil" })).toBeInTheDocument();
    expect(screen.getByText("Serigrafía")).toBeInTheDocument();
    expect(screen.getByText("Impresión textil de alta calidad.")).toBeInTheDocument();
  });

  it("does not re-render when the service prop is referentially unchanged", () => {
    const renderSpy = vi.fn(ServiceCardBase);
    const MemoCard = memo(renderSpy);

    function Wrapper() {
      const [tick, setTick] = useState(0);
      return (
        <div>
          <button onClick={() => setTick((t) => t + 1)}>tick</button>
          <MemoCard service={sampleService} />
        </div>
      );
    }

    renderWithChakra(<Wrapper />);
    expect(renderSpy).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText("tick"));
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 6: Run the tests and verify they fail**

Run: `npm test -- ServiceCard.test.jsx`
Expected: FAIL — `ServiceCard.jsx` does not exist yet.

- [ ] **Step 7: Implement `ServiceCard`**

Create `src/components/ui/ServiceCard.jsx`:

```jsx
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
      <Tag colorScheme="green" mb={3}>
        {service.category}
      </Tag>
      <Text fontSize="sm" color="gray.600">
        {service.description}
      </Text>
    </Box>
  );
}

export const ServiceCard = memo(ServiceCardBase);
```

- [ ] **Step 8: Run the tests and verify they pass**

Run: `npm test -- ServiceCard.test.jsx`
Expected: PASS

- [ ] **Step 9: Write the failing tests for `GalleryItem`**

Create `src/components/ui/GalleryItem.test.jsx`:

```jsx
import { memo, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { GalleryItem, GalleryItemBase } from "./GalleryItem";

const sampleItem = {
  id: 1,
  src: "/images/gallery/post01.jpg",
  alt: "Fachada del local de Imprimelo Publicidad",
  category: "Rotulación",
};

function renderWithChakra(ui) {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
}

describe("GalleryItem", () => {
  it("renders the image with its alt text and calls onSelect when clicked", () => {
    const onSelect = vi.fn();
    renderWithChakra(<GalleryItem item={sampleItem} onSelect={onSelect} />);

    const button = screen.getByLabelText(sampleItem.alt);
    expect(screen.getByAltText(sampleItem.alt)).toBeInTheDocument();

    fireEvent.click(button);
    expect(onSelect).toHaveBeenCalledWith(sampleItem);
  });

  it("does not re-render when its props are referentially unchanged", () => {
    const renderSpy = vi.fn(GalleryItemBase);
    const MemoItem = memo(renderSpy);
    const onSelect = vi.fn();

    function Wrapper() {
      const [tick, setTick] = useState(0);
      return (
        <div>
          <button onClick={() => setTick((t) => t + 1)}>tick</button>
          <MemoItem item={sampleItem} onSelect={onSelect} />
        </div>
      );
    }

    renderWithChakra(<Wrapper />);
    expect(renderSpy).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText("tick"));
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 10: Run the tests and verify they fail**

Run: `npm test -- GalleryItem.test.jsx`
Expected: FAIL — `GalleryItem.jsx` does not exist yet.

- [ ] **Step 11: Implement `GalleryItem`**

Create `src/components/ui/GalleryItem.jsx`:

```jsx
import { memo } from "react";
import { Box, Image } from "@chakra-ui/react";

export function GalleryItemBase({ item, onSelect }) {
  return (
    <Box
      as="button"
      type="button"
      onClick={() => onSelect(item)}
      aria-label={item.alt}
      borderRadius="md"
      overflow="hidden"
      cursor="pointer"
      transition="transform 0.15s ease"
      _hover={{ transform: "scale(1.03)" }}
    >
      <Image src={item.src} alt={item.alt} objectFit="cover" w="100%" h="100%" loading="lazy" />
    </Box>
  );
}

export const GalleryItem = memo(GalleryItemBase);
```

- [ ] **Step 12: Run the tests and verify they pass**

Run: `npm test -- GalleryItem.test.jsx`
Expected: PASS

- [ ] **Step 13: Commit**

```bash
git add src/components/ui/SectionTitle.jsx src/components/ui/SectionTitle.test.jsx \
  src/components/ui/ServiceCard.jsx src/components/ui/ServiceCard.test.jsx \
  src/components/ui/GalleryItem.jsx src/components/ui/GalleryItem.test.jsx
git commit -m "Add SectionTitle, memoized ServiceCard and GalleryItem components"
```

---

### Task 6: `CategoryFilter` reusable component

**Files:**
- Create: `src/components/ui/CategoryFilter.jsx`, `src/components/ui/CategoryFilter.test.jsx`

**Interfaces:**
- Produces: `CategoryFilter` (`React.memo`-wrapped) and `CategoryFilterBase` from `src/components/ui/CategoryFilter.jsx`. Props: `{ categories: string[], activeCategory: string, onSelect: (category) => void }`. Renders one button per category plus `ALL_CATEGORIES` ("Todos") first; each button has `aria-pressed={activeCategory === category}`. Later: `Services.jsx` and `Gallery.jsx` import `{ CategoryFilter }` and pass `CATEGORIES` from Task 3.

- [ ] **Step 1: Write the failing test**

Create `src/components/ui/CategoryFilter.test.jsx`:

```jsx
import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { CategoryFilter } from "./CategoryFilter";

function renderWithChakra(ui) {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
}

describe("CategoryFilter", () => {
  it("renders 'Todos' plus each category and marks the active one as pressed", () => {
    renderWithChakra(
      <CategoryFilter
        categories={["Serigrafía", "Bordados"]}
        activeCategory="Todos"
        onSelect={() => {}}
      />
    );

    expect(screen.getByRole("button", { name: "Todos" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Serigrafía" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
    expect(screen.getByRole("button", { name: "Bordados" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("calls onSelect with the clicked category", () => {
    const onSelect = vi.fn();
    renderWithChakra(
      <CategoryFilter categories={["Serigrafía", "Bordados"]} activeCategory="Todos" onSelect={onSelect} />
    );

    fireEvent.click(screen.getByRole("button", { name: "Bordados" }));
    expect(onSelect).toHaveBeenCalledWith("Bordados");
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test -- CategoryFilter.test.jsx`
Expected: FAIL — `CategoryFilter.jsx` does not exist yet.

- [ ] **Step 3: Implement `CategoryFilter`**

Create `src/components/ui/CategoryFilter.jsx`:

```jsx
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
            colorScheme="green"
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
```

- [ ] **Step 4: Run the test and verify it passes**

Run: `npm test -- CategoryFilter.test.jsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/CategoryFilter.jsx src/components/ui/CategoryFilter.test.jsx
git commit -m "Add memoized CategoryFilter component"
```

---

### Task 7: `GalleryLightbox` component

**Files:**
- Create: `src/components/ui/GalleryLightbox.jsx`, `src/components/ui/GalleryLightbox.test.jsx`

**Interfaces:**
- Produces: `GalleryLightbox({ item, onClose })` (named export) from `src/components/ui/GalleryLightbox.jsx`. When `item` is `null`, renders no dialog. When `item` is set, renders a Chakra `Modal` (`role="dialog"`) showing the image and its `alt` text, with a close button (`aria-label="Cerrar"`) that calls `onClose`. Later: `Gallery.jsx` imports `{ GalleryLightbox }`.

- [ ] **Step 1: Write the failing tests**

Create `src/components/ui/GalleryLightbox.test.jsx`:

```jsx
import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { GalleryLightbox } from "./GalleryLightbox";

const sampleItem = {
  id: 1,
  src: "/images/gallery/post01.jpg",
  alt: "Fachada del local de Imprimelo Publicidad",
  category: "Rotulación",
};

function renderWithChakra(ui) {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
}

describe("GalleryLightbox", () => {
  it("renders no dialog when item is null", () => {
    renderWithChakra(<GalleryLightbox item={null} onClose={() => {}} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows the selected image and calls onClose when the close button is clicked", () => {
    const onClose = vi.fn();
    renderWithChakra(<GalleryLightbox item={sampleItem} onClose={onClose} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByAltText(sampleItem.alt)).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Cerrar"));
    expect(onClose).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run the tests and verify they fail**

Run: `npm test -- GalleryLightbox.test.jsx`
Expected: FAIL — `GalleryLightbox.jsx` does not exist yet.

- [ ] **Step 3: Implement `GalleryLightbox`**

Create `src/components/ui/GalleryLightbox.jsx`:

```jsx
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

export function GalleryLightbox({ item, onClose }) {
  return (
    <Modal isOpen={Boolean(item)} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent bg="black">
        <ModalCloseButton color="white" aria-label="Cerrar" />
        <ModalBody p={0}>
          {item && (
            <>
              <img src={item.src} alt={item.alt} style={{ width: "100%", display: "block" }} />
              <Text color="white" p={3} fontSize="sm">
                {item.alt}
              </Text>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
```

- [ ] **Step 4: Run the tests and verify they pass**

Run: `npm test -- GalleryLightbox.test.jsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/GalleryLightbox.jsx src/components/ui/GalleryLightbox.test.jsx
git commit -m "Add GalleryLightbox modal component"
```

---

### Task 8: `Navbar` layout component

**Files:**
- Create: `src/components/layout/Navbar.jsx`, `src/components/layout/Navbar.test.jsx`

**Interfaces:**
- Consumes: `useCompany()` from Task 2 (`company.name`, `company.logoSrc`).
- Produces: `Navbar` (named export) from `src/components/layout/Navbar.jsx`. Renders the real logo/name, 4 nav links (Inicio `/`, Servicios `/servicios`, Galería `/galeria`, Contacto `/contacto`), and a mobile hamburger toggle (`aria-label` alternates between `"Abrir menú"` and `"Cerrar menú"`) that shows/hides a second copy of the links. Must be rendered inside both a Chakra `ChakraProvider`, a router, and `CompanyProvider`. Later: `Layout.jsx` (Task 10) imports `{ Navbar }`.

- [ ] **Step 1: Write the failing tests**

Create `src/components/layout/Navbar.test.jsx`:

```jsx
import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { MemoryRouter } from "react-router-dom";
import { Navbar } from "./Navbar";
import { CompanyProvider } from "../../context/CompanyContext";

function renderNavbar() {
  return render(
    <ChakraProvider>
      <CompanyProvider>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </CompanyProvider>
    </ChakraProvider>
  );
}

describe("Navbar", () => {
  it("shows the real company name and the nav links", () => {
    renderNavbar();
    expect(screen.getByText("Imprimelo Publicidad")).toBeInTheDocument();
    expect(screen.getAllByText("Servicios").length).toBeGreaterThan(0);
  });

  it("toggles the mobile menu open and closed", () => {
    renderNavbar();

    expect(screen.getAllByText("Inicio")).toHaveLength(1);

    fireEvent.click(screen.getByLabelText("Abrir menú"));
    expect(screen.getByLabelText("Cerrar menú")).toBeInTheDocument();
    expect(screen.getAllByText("Inicio")).toHaveLength(2);

    fireEvent.click(screen.getByLabelText("Cerrar menú"));
    expect(screen.getAllByText("Inicio")).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run the tests and verify they fail**

Run: `npm test -- Navbar.test.jsx`
Expected: FAIL — `Navbar.jsx` does not exist yet.

- [ ] **Step 3: Implement `Navbar`**

Create `src/components/layout/Navbar.jsx`:

```jsx
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

        <HStack as="nav" spacing={6} display={{ base: "none", md: "flex" }}>
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
        <Stack as="nav" px={4} pb={4} spacing={3} display={{ md: "none" }}>
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
```

- [ ] **Step 4: Run the tests and verify they pass**

Run: `npm test -- Navbar.test.jsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Navbar.jsx src/components/layout/Navbar.test.jsx
git commit -m "Add responsive Navbar with mobile menu state"
```

---

### Task 9: `Footer` layout component

**Files:**
- Create: `src/components/layout/Footer.jsx`, `src/components/layout/Footer.test.jsx`

**Interfaces:**
- Consumes: `useCompany()` from Task 2.
- Produces: `Footer` (named export) from `src/components/layout/Footer.jsx`. Renders company name, tagline, location, phone link, and Instagram link. Later: `Layout.jsx` (Task 10) imports `{ Footer }`.

- [ ] **Step 1: Write the failing test**

Create `src/components/layout/Footer.test.jsx`:

```jsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { Footer } from "./Footer";
import { CompanyProvider } from "../../context/CompanyContext";

describe("Footer", () => {
  it("shows the real contact details", () => {
    render(
      <ChakraProvider>
        <CompanyProvider>
          <Footer />
        </CompanyProvider>
      </ChakraProvider>
    );

    expect(screen.getByText("Albox, Almería (España)")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "+34 661 22 69 12" })).toHaveAttribute(
      "href",
      "tel:+34661226912"
    );
    expect(screen.getByText(/@imprimeloalbox/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test -- Footer.test.jsx`
Expected: FAIL — `Footer.jsx` does not exist yet.

- [ ] **Step 3: Implement `Footer`**

Create `src/components/layout/Footer.jsx`:

```jsx
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
```

- [ ] **Step 4: Run the test and verify it passes**

Run: `npm test -- Footer.test.jsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Footer.jsx src/components/layout/Footer.test.jsx
git commit -m "Add Footer with real company contact details"
```

---

### Task 10: `Layout` component

**Files:**
- Create: `src/components/layout/Layout.jsx`, `src/components/layout/Layout.test.jsx`

**Interfaces:**
- Consumes: `Navbar` (Task 8), `Footer` (Task 9).
- Produces: `Layout` (named export) from `src/components/layout/Layout.jsx`. Renders `Navbar`, then `<Outlet />` (from `react-router-dom`) wrapped in a `<main>`, then `Footer`. Later: `AppRoutes.jsx` (Task 16) imports `{ Layout }` and uses it as the parent route element.

- [ ] **Step 1: Write the failing test**

Create `src/components/layout/Layout.test.jsx`:

```jsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./Layout";
import { CompanyProvider } from "../../context/CompanyContext";

describe("Layout", () => {
  it("renders the navbar, the nested route content, and the footer", () => {
    render(
      <ChakraProvider>
        <CompanyProvider>
          <MemoryRouter initialEntries={["/pagina-de-prueba"]}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="pagina-de-prueba" element={<div>Contenido de prueba</div>} />
              </Route>
            </Routes>
          </MemoryRouter>
        </CompanyProvider>
      </ChakraProvider>
    );

    expect(screen.getByText("Contenido de prueba")).toBeInTheDocument();
    expect(screen.getByText("Imprimelo Publicidad")).toBeInTheDocument();
    expect(screen.getByText(/Instagram/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test -- Layout.test.jsx`
Expected: FAIL — `Layout.jsx` does not exist yet.

- [ ] **Step 3: Implement `Layout`**

Create `src/components/layout/Layout.jsx`:

```jsx
import { Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function Layout() {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Box as="main" flex="1">
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
```

- [ ] **Step 4: Run the test and verify it passes**

Run: `npm test -- Layout.test.jsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Layout.jsx src/components/layout/Layout.test.jsx
git commit -m "Add Layout wiring Navbar, routed content, and Footer"
```

---

### Task 11: `ContactForm` with react-hook-form

**Files:**
- Create: `src/components/forms/ContactForm.jsx`, `src/components/forms/ContactForm.test.jsx`

**Interfaces:**
- Consumes: `CATEGORIES` from Task 3.
- Produces: `ContactForm({ onSubmitSuccess, simulatedDelayMs = 800 })` (named export) from `src/components/forms/ContactForm.jsx`. Fields: `name` (required), `email` (required, email pattern), `phone` (optional), `service` (required select from `CATEGORIES`), `message` (required). On submit with valid data: sets an internal `status` state to `"sending"`, waits `simulatedDelayMs` ms, sets `status` to `"success"`, resets the form, and calls `onSubmitSuccess(values)` if provided. `simulatedDelayMs` exists so tests can pass `0` and avoid real waiting. Later: `Contact.jsx` (Task 14) imports `{ ContactForm }`.

- [ ] **Step 1: Write the failing tests**

Create `src/components/forms/ContactForm.test.jsx`:

```jsx
import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { ContactForm } from "./ContactForm";

function renderForm(props = {}) {
  return render(
    <ChakraProvider>
      <ContactForm simulatedDelayMs={0} {...props} />
    </ChakraProvider>
  );
}

describe("ContactForm", () => {
  it("shows validation errors when required fields are missing", async () => {
    renderForm();
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(await screen.findByText("El nombre es obligatorio")).toBeInTheDocument();
    expect(screen.getByText("El email es obligatorio")).toBeInTheDocument();
    expect(screen.getByText("Selecciona un servicio")).toBeInTheDocument();
    expect(screen.getByText("Cuéntanos qué necesitas")).toBeInTheDocument();
  });

  it("rejects an invalid email format", async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "no-es-un-email" } });
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(await screen.findByText("Introduce un email válido")).toBeInTheDocument();
  });

  it("submits successfully with valid data, resets, and calls onSubmitSuccess", async () => {
    const onSubmitSuccess = vi.fn();
    renderForm({ onSubmitSuccess });

    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Daniel" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "daniel@example.com" } });
    fireEvent.change(screen.getByLabelText("Tipo de servicio"), {
      target: { value: "Serigrafía" },
    });
    fireEvent.change(screen.getByLabelText("Mensaje"), {
      target: { value: "Necesito 50 camisetas serigrafiadas." },
    });

    fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    await waitFor(() => expect(onSubmitSuccess).toHaveBeenCalledTimes(1));
    expect(
      screen.getByText("¡Gracias! Hemos recibido tu mensaje y te contactaremos pronto.")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre")).toHaveValue("");
  });
});
```

- [ ] **Step 2: Run the tests and verify they fail**

Run: `npm test -- ContactForm.test.jsx`
Expected: FAIL — `ContactForm.jsx` does not exist yet.

- [ ] **Step 3: Implement `ContactForm`**

Create `src/components/forms/ContactForm.jsx`:

```jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { CATEGORIES } from "../../constants/categories";

export function ContactForm({ onSubmitSuccess, simulatedDelayMs = 800 }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [status, setStatus] = useState("idle");

  const onSubmit = async (values) => {
    setStatus("sending");
    try {
      await new Promise((resolve) => setTimeout(resolve, simulatedDelayMs));
      setStatus("success");
      reset();
      onSubmitSuccess?.(values);
    } catch {
      setStatus("error");
    }
  };

  return (
    <Stack as="form" spacing={4} onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormControl isInvalid={Boolean(errors.name)}>
        <FormLabel htmlFor="name">Nombre</FormLabel>
        <Input id="name" {...register("name", { required: "El nombre es obligatorio" })} />
        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={Boolean(errors.email)}>
        <FormLabel htmlFor="email">Email</FormLabel>
        <Input
          id="email"
          type="email"
          {...register("email", {
            required: "El email es obligatorio",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Introduce un email válido",
            },
          })}
        />
        <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="phone">Teléfono (opcional)</FormLabel>
        <Input id="phone" type="tel" {...register("phone")} />
      </FormControl>

      <FormControl isInvalid={Boolean(errors.service)}>
        <FormLabel htmlFor="service">Tipo de servicio</FormLabel>
        <Select
          id="service"
          placeholder="Selecciona un servicio"
          {...register("service", { required: "Selecciona un servicio" })}
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{errors.service?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={Boolean(errors.message)}>
        <FormLabel htmlFor="message">Mensaje</FormLabel>
        <Textarea
          id="message"
          rows={4}
          {...register("message", { required: "Cuéntanos qué necesitas" })}
        />
        <FormErrorMessage>{errors.message?.message}</FormErrorMessage>
      </FormControl>

      <Button type="submit" colorScheme="green" isLoading={status === "sending"}>
        Enviar mensaje
      </Button>

      {status === "success" && (
        <Text color="green.600" role="status">
          ¡Gracias! Hemos recibido tu mensaje y te contactaremos pronto.
        </Text>
      )}
      {status === "error" && (
        <Text color="red.600" role="alert">
          Ha ocurrido un error al enviar el formulario. Inténtalo de nuevo.
        </Text>
      )}
    </Stack>
  );
}
```

- [ ] **Step 4: Run the tests and verify they pass**

Run: `npm test -- ContactForm.test.jsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/forms/ContactForm.jsx src/components/forms/ContactForm.test.jsx
git commit -m "Add ContactForm with react-hook-form validation and simulated submit"
```

---

### Task 12: `Services` page

**Files:**
- Create: `src/pages/Services.jsx`, `src/pages/Services.test.jsx`

**Interfaces:**
- Consumes: `useFetch` (Task 3), `endpoints.services` (Task 3), `CATEGORIES`/`ALL_CATEGORIES` (Task 3), `CategoryFilter` (Task 6), `ServiceCard` (Task 5), `SectionTitle` (Task 5).
- Produces: default export `Services` (page component, no props) from `src/pages/Services.jsx`. Renders a `SectionTitle` with heading name `"Nuestros servicios"`, a `CategoryFilter`, a loading spinner while fetching, an error alert on failure, and a responsive grid of `ServiceCard`s filtered by the selected category (state managed with `useState` + `useMemo`, handler memoized with `useCallback`). Later: `AppRoutes.jsx` (Task 16) imports `Services` as the `/servicios` route element.

- [ ] **Step 1: Write the failing tests**

Create `src/pages/Services.test.jsx`:

```jsx
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import Services from "./Services";

const sampleServices = [
  { id: 1, title: "Serigrafía textil", category: "Serigrafía", description: "d1", icon: "🖨️" },
  { id: 2, title: "Bordado industrial", category: "Bordados", description: "d2", icon: "🧵" },
];

function renderPage() {
  return render(
    <ChakraProvider>
      <Services />
    </ChakraProvider>
  );
}

describe("Services page", () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => sampleServices,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("has the page heading and loads services from the API", async () => {
    renderPage();
    expect(screen.getByRole("heading", { name: "Nuestros servicios" })).toBeInTheDocument();
    expect(await screen.findByText("Serigrafía textil")).toBeInTheDocument();
    expect(screen.getByText("Bordado industrial")).toBeInTheDocument();
  });

  it("filters services by category", async () => {
    renderPage();
    await screen.findByText("Serigrafía textil");

    fireEvent.click(screen.getByRole("button", { name: "Bordados" }));

    expect(screen.queryByText("Serigrafía textil")).not.toBeInTheDocument();
    expect(screen.getByText("Bordado industrial")).toBeInTheDocument();
  });

  it("shows an error message when the request fails", async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 500 });
    renderPage();
    expect(await screen.findByText(/no se pudieron cargar los servicios/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the tests and verify they fail**

Run: `npm test -- Services.test.jsx`
Expected: FAIL — `Services.jsx` does not exist yet.

- [ ] **Step 3: Implement `Services`**

Create `src/pages/Services.jsx`:

```jsx
import { useCallback, useMemo, useState } from "react";
import { Alert, AlertIcon, Box, Container, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import { useFetch } from "../hooks/useFetch";
import { endpoints } from "../api/client";
import { ALL_CATEGORIES, CATEGORIES } from "../constants/categories";
import { CategoryFilter } from "../components/ui/CategoryFilter";
import { ServiceCard } from "../components/ui/ServiceCard";
import { SectionTitle } from "../components/ui/SectionTitle";

export default function Services() {
  const { data, loading, error } = useFetch(endpoints.services);
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);

  const handleSelectCategory = useCallback((category) => {
    setActiveCategory(category);
  }, []);

  const filteredServices = useMemo(() => {
    if (!data) return [];
    if (activeCategory === ALL_CATEGORIES) return data;
    return data.filter((service) => service.category === activeCategory);
  }, [data, activeCategory]);

  return (
    <Container maxW="6xl" py={{ base: 8, md: 12 }}>
      <SectionTitle
        title="Nuestros servicios"
        subtitle="Serigrafía, rotulación, DTF, bordados y mucho más, hecho a medida en Albox."
      />
      <CategoryFilter
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onSelect={handleSelectCategory}
      />
      {loading && (
        <Box textAlign="center" py={10}>
          <Spinner size="lg" color="green.500" />
        </Box>
      )}
      {error && (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          No se pudieron cargar los servicios: {error}
        </Alert>
      )}
      {!loading && !error && filteredServices.length === 0 && (
        <Text>No hay servicios en esta categoría todavía.</Text>
      )}
      {!loading && !error && filteredServices.length > 0 && (
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={6}>
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}
```

- [ ] **Step 4: Run the tests and verify they pass**

Run: `npm test -- Services.test.jsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/Services.jsx src/pages/Services.test.jsx
git commit -m "Add Services page with category filtering over the own API"
```

---

### Task 13: `Gallery` page

**Files:**
- Create: `src/pages/Gallery.jsx`, `src/pages/Gallery.test.jsx`

**Interfaces:**
- Consumes: `useFetch`/`endpoints.gallery` (Task 3), `CATEGORIES`/`ALL_CATEGORIES` (Task 3), `CategoryFilter` (Task 6), `GalleryItem` (Task 5), `GalleryLightbox` (Task 7), `SectionTitle` (Task 5).
- Produces: default export `Gallery` from `src/pages/Gallery.jsx`. Renders heading `"Galería de trabajos"`, category filter, a grid of `GalleryItem`s, and opens `GalleryLightbox` when an item is clicked (state: `activeCategory`, `selectedItem`). Later: `AppRoutes.jsx` (Task 16) imports `Gallery` as the `/galeria` route element.

- [ ] **Step 1: Write the failing tests**

Create `src/pages/Gallery.test.jsx`:

```jsx
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import Gallery from "./Gallery";

const sampleGallery = [
  {
    id: 1,
    src: "/images/gallery/post01.jpg",
    alt: "Fachada del local de Imprimelo Publicidad",
    category: "Rotulación",
  },
  {
    id: 2,
    src: "/images/gallery/post02.jpg",
    alt: "Bordados navideños personalizados",
    category: "Bordados",
  },
];

function renderPage() {
  return render(
    <ChakraProvider>
      <Gallery />
    </ChakraProvider>
  );
}

describe("Gallery page", () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => sampleGallery,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("has the page heading and loads gallery items from the API", async () => {
    renderPage();
    expect(screen.getByRole("heading", { name: "Galería de trabajos" })).toBeInTheDocument();
    expect(await screen.findByLabelText("Fachada del local de Imprimelo Publicidad")).toBeInTheDocument();
  });

  it("filters gallery items by category", async () => {
    renderPage();
    await screen.findByLabelText("Fachada del local de Imprimelo Publicidad");

    fireEvent.click(screen.getByRole("button", { name: "Bordados" }));

    expect(
      screen.queryByLabelText("Fachada del local de Imprimelo Publicidad")
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText("Bordados navideños personalizados")).toBeInTheDocument();
  });

  it("opens the lightbox when an item is clicked and closes it again", async () => {
    renderPage();
    const item = await screen.findByLabelText("Fachada del local de Imprimelo Publicidad");

    fireEvent.click(item);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Cerrar"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the tests and verify they fail**

Run: `npm test -- Gallery.test.jsx`
Expected: FAIL — `Gallery.jsx` does not exist yet.

- [ ] **Step 3: Implement `Gallery`**

Create `src/pages/Gallery.jsx`:

```jsx
import { useCallback, useMemo, useState } from "react";
import { Alert, AlertIcon, Box, Container, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import { useFetch } from "../hooks/useFetch";
import { endpoints } from "../api/client";
import { ALL_CATEGORIES, CATEGORIES } from "../constants/categories";
import { CategoryFilter } from "../components/ui/CategoryFilter";
import { GalleryItem } from "../components/ui/GalleryItem";
import { GalleryLightbox } from "../components/ui/GalleryLightbox";
import { SectionTitle } from "../components/ui/SectionTitle";

export default function Gallery() {
  const { data, loading, error } = useFetch(endpoints.gallery);
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSelectCategory = useCallback((category) => {
    setActiveCategory(category);
  }, []);

  const handleSelectItem = useCallback((item) => {
    setSelectedItem(item);
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const filteredItems = useMemo(() => {
    if (!data) return [];
    if (activeCategory === ALL_CATEGORIES) return data;
    return data.filter((item) => item.category === activeCategory);
  }, [data, activeCategory]);

  return (
    <Container maxW="6xl" py={{ base: 8, md: 12 }}>
      <SectionTitle
        title="Galería de trabajos"
        subtitle="Una muestra real de nuestras campañas y trabajos en Albox."
      />
      <CategoryFilter
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onSelect={handleSelectCategory}
      />
      {loading && (
        <Box textAlign="center" py={10}>
          <Spinner size="lg" color="green.500" />
        </Box>
      )}
      {error && (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          No se pudo cargar la galería: {error}
        </Alert>
      )}
      {!loading && !error && filteredItems.length === 0 && (
        <Text>No hay fotos en esta categoría todavía.</Text>
      )}
      {!loading && !error && filteredItems.length > 0 && (
        <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
          {filteredItems.map((item) => (
            <GalleryItem key={item.id} item={item} onSelect={handleSelectItem} />
          ))}
        </SimpleGrid>
      )}
      <GalleryLightbox item={selectedItem} onClose={handleCloseLightbox} />
    </Container>
  );
}
```

- [ ] **Step 4: Run the tests and verify they pass**

Run: `npm test -- Gallery.test.jsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/Gallery.jsx src/pages/Gallery.test.jsx
git commit -m "Add Gallery page with filtering and lightbox over the own API"
```

---

### Task 14: `Contact` page

**Files:**
- Create: `src/pages/Contact.jsx`, `src/pages/Contact.test.jsx`

**Interfaces:**
- Consumes: `useCompany()` (Task 2), `ContactForm` (Task 11), `SectionTitle` (Task 5).
- Produces: default export `Contact` from `src/pages/Contact.jsx`. Renders heading `"Hablemos de tu proyecto"`, the real contact details from `CompanyContext`, and the `ContactForm`. Later: `AppRoutes.jsx` (Task 16) imports `Contact` as the `/contacto` route element.

- [ ] **Step 1: Write the failing test**

Create `src/pages/Contact.test.jsx`:

```jsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import Contact from "./Contact";
import { CompanyProvider } from "../context/CompanyContext";

describe("Contact page", () => {
  it("shows the real contact details and the contact form", () => {
    render(
      <ChakraProvider>
        <CompanyProvider>
          <Contact />
        </CompanyProvider>
      </ChakraProvider>
    );

    expect(screen.getByRole("heading", { name: "Hablemos de tu proyecto" })).toBeInTheDocument();
    expect(screen.getByText("Albox, Almería (España)")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "+34 661 22 69 12" })).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enviar mensaje" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test -- Contact.test.jsx`
Expected: FAIL — `Contact.jsx` does not exist yet.

- [ ] **Step 3: Implement `Contact`**

Create `src/pages/Contact.jsx`:

```jsx
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
```

- [ ] **Step 4: Run the test and verify it passes**

Run: `npm test -- Contact.test.jsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/Contact.jsx src/pages/Contact.test.jsx
git commit -m "Add Contact page with real business info and the contact form"
```

---

### Task 15: `Home` page

**Files:**
- Create: `src/pages/Home.jsx`, `src/pages/Home.test.jsx`

**Interfaces:**
- Consumes: `useCompany()` (Task 2), `useFetch`/`endpoints.services` (Task 3), `ServiceCard` (Task 5), `SectionTitle` (Task 5).
- Produces: default export `Home` from `src/pages/Home.jsx`. Renders an `h1` with the company name, the tagline, a CTA linking to `/contacto`, a WhatsApp CTA linking to `company.whatsappUrl`, and up to 3 featured `ServiceCard`s (fetched via `useFetch`, sliced with `useMemo`). Later: `AppRoutes.jsx` (Task 16) imports `Home` as the index (`/`) route element.

- [ ] **Step 1: Write the failing tests**

Create `src/pages/Home.test.jsx`:

```jsx
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";
import { CompanyProvider } from "../context/CompanyContext";

const sampleServices = [
  { id: 1, title: "Serigrafía textil", category: "Serigrafía", description: "d1", icon: "🖨️" },
  { id: 2, title: "Rotulación y vinilo", category: "Rotulación", description: "d2", icon: "🪧" },
  { id: 3, title: "Estampación DTF", category: "DTF", description: "d3", icon: "👕" },
  { id: 4, title: "Bordado industrial", category: "Bordados", description: "d4", icon: "🧵" },
];

function renderPage() {
  return render(
    <ChakraProvider>
      <CompanyProvider>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </CompanyProvider>
    </ChakraProvider>
  );
}

describe("Home page", () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => sampleServices,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows the hero with the real company name and tagline", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: "Imprimelo Publicidad" })).toBeInTheDocument();
    expect(screen.getByText("Calidad, Creatividad y Confianza Profesional")).toBeInTheDocument();
  });

  it("shows a WhatsApp CTA linking to the real number", () => {
    renderPage();
    expect(screen.getByRole("link", { name: "WhatsApp" })).toHaveAttribute(
      "href",
      "https://wa.me/34661226912"
    );
  });

  it("shows at most 3 featured services from the API", async () => {
    renderPage();
    expect(await screen.findByText("Serigrafía textil")).toBeInTheDocument();
    expect(screen.getByText("Rotulación y vinilo")).toBeInTheDocument();
    expect(screen.getByText("Estampación DTF")).toBeInTheDocument();
    expect(screen.queryByText("Bordado industrial")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the tests and verify they fail**

Run: `npm test -- Home.test.jsx`
Expected: FAIL — `Home.jsx` does not exist yet.

- [ ] **Step 3: Implement `Home`**

Create `src/pages/Home.jsx`:

```jsx
import { useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useFetch } from "../hooks/useFetch";
import { endpoints } from "../api/client";
import { useCompany } from "../context/CompanyContext";
import { ServiceCard } from "../components/ui/ServiceCard";
import { SectionTitle } from "../components/ui/SectionTitle";

export default function Home() {
  const company = useCompany();
  const { data: services } = useFetch(endpoints.services);

  const featuredServices = useMemo(() => (services ? services.slice(0, 3) : []), [services]);

  return (
    <Box>
      <Box bg="black" color="white" py={{ base: 16, md: 24 }}>
        <Container maxW="6xl">
          <Stack spacing={5} maxW="2xl">
            <Heading as="h1" size="2xl">
              {company.name}
            </Heading>
            <Text fontSize={{ base: "lg", md: "xl" }} color="gray.300">
              {company.tagline}
            </Text>
            <Text color="gray.400">{company.description}</Text>
            <HStack spacing={4} pt={2}>
              <Button as={RouterLink} to="/contacto" colorScheme="green">
                Pide presupuesto
              </Button>
              <Button
                as="a"
                href={company.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                variant="outline"
                colorScheme="whiteAlpha"
              >
                WhatsApp
              </Button>
            </HStack>
          </Stack>
        </Container>
      </Box>

      <Container maxW="6xl" py={{ base: 12, md: 16 }}>
        <SectionTitle title="Qué hacemos" subtitle="Una muestra de nuestros servicios más pedidos" />
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={6} mb={6}>
          {featuredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </SimpleGrid>
        <Box textAlign="center">
          <Button as={RouterLink} to="/servicios" variant="link" colorScheme="green">
            Ver todos los servicios →
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
```

- [ ] **Step 4: Run the tests and verify they pass**

Run: `npm test -- Home.test.jsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/Home.jsx src/pages/Home.test.jsx
git commit -m "Add Home page with hero and featured services"
```

---

### Task 16: `NotFound` page, `AppRoutes`, and final `App` wiring

**Files:**
- Create: `src/pages/NotFound.jsx`, `src/AppRoutes.jsx`, `src/AppRoutes.test.jsx`
- Modify: `src/App.jsx` (replace the Vite starter counter entirely), `index.html` (page title)

**Interfaces:**
- Consumes: `Layout` (Task 10), `Home` (Task 15), `Services` (Task 12), `Gallery` (Task 13), `Contact` (Task 14), `theme` (Task 1), `CompanyProvider` (Task 2).
- Produces: `NotFound` default export (page component). `AppRoutes` named export from `src/AppRoutes.jsx` — the `<Routes>` tree, router-agnostic so it can be tested with `MemoryRouter`. `App` default export from `src/App.jsx` — wraps `ChakraProvider` + `CompanyProvider` + `BrowserRouter` + `AppRoutes` for real browser use. This is the final wiring task; nothing downstream depends on it.

- [ ] **Step 1: Write the failing test for `NotFound`**

Create `src/pages/NotFound.test.jsx`:

```jsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { MemoryRouter } from "react-router-dom";
import NotFound from "./NotFound";

describe("NotFound page", () => {
  it("shows a 404 message and a link back home", () => {
    render(
      <ChakraProvider>
        <MemoryRouter>
          <NotFound />
        </MemoryRouter>
      </ChakraProvider>
    );

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Volver al inicio" })).toHaveAttribute("href", "/");
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test -- NotFound.test.jsx`
Expected: FAIL — `NotFound.jsx` does not exist yet.

- [ ] **Step 3: Implement `NotFound`**

Create `src/pages/NotFound.jsx`:

```jsx
import { Button, Container, Heading, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export default function NotFound() {
  return (
    <Container maxW="xl" py={20} textAlign="center">
      <Heading size="2xl" mb={4}>
        404
      </Heading>
      <Text mb={6}>La página que buscas no existe.</Text>
      <Button as={RouterLink} to="/" colorScheme="green">
        Volver al inicio
      </Button>
    </Container>
  );
}
```

- [ ] **Step 4: Run the test and verify it passes**

Run: `npm test -- NotFound.test.jsx`
Expected: PASS

- [ ] **Step 5: Write the failing tests for `AppRoutes`**

Create `src/AppRoutes.test.jsx`:

```jsx
import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { MemoryRouter } from "react-router-dom";
import { CompanyProvider } from "./context/CompanyContext";
import { AppRoutes } from "./AppRoutes";

function renderAt(path) {
  global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
  return render(
    <ChakraProvider>
      <CompanyProvider>
        <MemoryRouter initialEntries={[path]}>
          <AppRoutes />
        </MemoryRouter>
      </CompanyProvider>
    </ChakraProvider>
  );
}

describe("AppRoutes", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders Home at /", async () => {
    renderAt("/");
    expect(
      await screen.findByRole("heading", { name: "Imprimelo Publicidad" })
    ).toBeInTheDocument();
  });

  it("renders Services at /servicios", async () => {
    renderAt("/servicios");
    expect(
      await screen.findByRole("heading", { name: "Nuestros servicios" })
    ).toBeInTheDocument();
  });

  it("renders Gallery at /galeria", async () => {
    renderAt("/galeria");
    expect(
      await screen.findByRole("heading", { name: "Galería de trabajos" })
    ).toBeInTheDocument();
  });

  it("renders Contact at /contacto", async () => {
    renderAt("/contacto");
    expect(
      await screen.findByRole("heading", { name: "Hablemos de tu proyecto" })
    ).toBeInTheDocument();
  });

  it("renders NotFound for an unknown route", () => {
    renderAt("/ruta-inexistente");
    expect(screen.getByText("404")).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run the tests and verify they fail**

Run: `npm test -- AppRoutes.test.jsx`
Expected: FAIL — `AppRoutes.jsx` does not exist yet.

- [ ] **Step 7: Implement `AppRoutes`**

Create `src/AppRoutes.jsx`:

```jsx
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
```

- [ ] **Step 8: Run the tests and verify they pass**

Run: `npm test -- AppRoutes.test.jsx`
Expected: PASS

- [ ] **Step 9: Replace `src/App.jsx` with the final app shell**

Replace the entire contents of `src/App.jsx`:

```jsx
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
```

- [ ] **Step 10: Update the page title in `index.html`**

In `index.html`, change the `<title>` element to:

```html
<title>Imprimelo Publicidad — Serigrafía, rotulación y DTF en Albox</title>
```

- [ ] **Step 11: Run the full test suite and verify everything passes**

Run: `npm test`
Expected: all test files PASS.

- [ ] **Step 12: Commit**

```bash
git add src/pages/NotFound.jsx src/pages/NotFound.test.jsx src/AppRoutes.jsx src/AppRoutes.test.jsx src/App.jsx index.html
git commit -m "Wire final App shell, AppRoutes, and NotFound page"
```

---

### Task 17: Dev scripts, production build check, and manual verification

**Files:**
- Modify: `package.json` (`scripts` section)
- Create: `README.md` (project root, run instructions)

**Interfaces:**
- Produces: `npm run dev` starts both the Vite dev server and `json-server` concurrently. `npm run build` produces a production bundle with no errors. Nothing downstream depends on this task — it is the final integration/verification step.

- [ ] **Step 1: Add the combined dev script**

In `package.json`, update the `"scripts"` section (keep the existing `build`, `preview`, `lint`, `test`, `test:watch` entries; only replace `"dev"`):

```json
"dev": "concurrently -k -n vite,api -c blue,green \"vite\" \"json-server --watch db.json --port 4000\"",
"api": "json-server --watch db.json --port 4000"
```

- [ ] **Step 2: Write `README.md`**

Create `README.md`:

```markdown
# Imprimelo Publicidad

Web de práctica en React para Imprimelo Publicidad (serigrafía, rotulación, DTF, bordados y merchandising en Albox, Almería).

## Requisitos

- Node.js 18+

## Instalación

\`\`\`bash
npm install
\`\`\`

## Desarrollo

\`\`\`bash
npm run dev
\`\`\`

Esto levanta a la vez el frontend (Vite, http://localhost:5173) y la API propia (json-server sobre \`db.json\`, http://localhost:4000). Si prefieres arrancarlos por separado: \`npx vite\` en una terminal y \`npm run api\` en otra.

## Tests

\`\`\`bash
npm test
\`\`\`

## Build de producción

\`\`\`bash
npm run build
\`\`\`

## Estructura

Ver \`docs/superpowers/specs/2026-07-28-imprimelo-publicidad-design.md\` para el diseño completo (arquitectura, datos, decisiones de contenido real tomado de Instagram).
```

- [ ] **Step 3: Run the full test suite**

Run: `npm test`
Expected: all test files PASS.

- [ ] **Step 4: Verify the production build succeeds**

Run: `npm run build`
Expected: build completes with no errors, `dist/` is created.

- [ ] **Step 5: Manual verification checklist**

Run `npm run dev`, open `http://localhost:5173` in a browser, and confirm:

1. **Navigation:** clicking Inicio/Servicios/Galería/Contacto in the navbar changes the page and URL; the logo click returns to `/`.
2. **Responsive nav:** resize the browser below 768px width — the desktop nav links disappear, the hamburger button appears, and clicking it shows/hides the mobile menu.
3. **Home:** hero shows "Imprimelo Publicidad" and the real tagline; the WhatsApp button opens `https://wa.me/34661226912`; up to 3 featured services render.
4. **Servicios:** all 9 services load from `http://localhost:4000/services`; clicking a category button filters the grid; clicking "Todos" restores the full list.
5. **Galería:** the 12 real photos load from `http://localhost:4000/gallery` and display correctly (not broken images); category filtering works; clicking a photo opens the lightbox with a larger image and a close button; closing it returns to the grid.
6. **Contacto:** submitting the empty form shows validation messages under each required field; filling all fields and submitting shows a loading state on the button, then the success message, and clears the form.
7. **Responsive layout:** at a mobile width (375px), a tablet width (768px), and a desktop width (1280px), no horizontal scrollbar appears and text/images remain readable on any of the 4 pages.
8. **404:** navigating to a nonexistent path (e.g. `http://localhost:5173/no-existe`) shows the 404 page with a working "Volver al inicio" link.

Stop the dev server (`Ctrl+C`) once verified.

- [ ] **Step 6: Commit**

```bash
git add package.json README.md
git commit -m "Add combined dev script, README, and finish manual verification"
```
