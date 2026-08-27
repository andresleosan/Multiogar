# Graph Report - F:\Proyectos\Multiogar  (2026-08-25)

## Corpus Check
- 83 files · ~78,425 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 485 nodes · 717 edges · 51 communities (38 shown, 13 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Aplicación y panel web
- Modelo de dominio
- Navegación y páginas públicas
- Dependencias de ejecución
- Lint y tipos
- Configuración TypeScript
- Experiencia de tienda
- Arquitectura administrativa
- Diseño y flujo DDD
- Seguridad y QA avanzada
- Backend y datos
- Autocrítica y capacidades
- Plantilla inicial Next.js
- Despliegue y migraciones
- Autenticación Firebase
- Pruebas E2E
- Gobierno de Cronos
- Arquitectura por nivel
- Estrategia de producto
- Imagen social Multiogar
- Rendimiento y escalabilidad
- Patrones de escalabilidad
- Icono de aplicación
- Marca Next.js
- Icono de ventana
- Compilación pnpm
- Icono Multiogar grande
- Logo principal Multiogar
- Procesamiento de imágenes
- Inteligencia de costos
- Gobierno técnico
- Identidad visual Multiogar
- Icono Apple Multiogar
- Icono de documento
- Icono de globo
- Marca Multiogar pública
- Origen de marca
- Configuración ESLint
- Configuración Next.js
- Configuración PostCSS
- Marca Vercel
- Gate de producción
- Almacenamiento Firebase
- Animación Framer Motion
- Iconografía Lucide
- Gestión pnpm
- Gráficas Recharts
- Componentes Shadcn
- Estilos Tailwind

## God Nodes (most connected - your core abstractions)
1. `DataService` - 25 edges
2. `formatCurrency()` - 19 edges
3. `Product` - 17 edges
4. `compilerOptions` - 16 edges
5. `OFFICIAL_STORE_PHONE` - 13 edges
6. `useCartStore` - 11 edges
7. `Security Baseline` - 11 edges
8. `Browser QA E2E` - 9 edges
9. `Category` - 8 edges
10. `Order` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Firebase Client SDK Setup` --implements--> `Cloud Firestore`  [INFERRED]
  tasks.md → STACK.md
- `Critical Security Gate` --conceptually_related_to--> `Security Baseline`  [INFERRED]
  AGENTS.md → STACK.md
- `Implemented WhatsApp Order Flow` --implements--> `WhatsApp Checkout`  [INFERRED]
  tasks.md → BRIEF.md
- `Implemented Live Chat Widget` --implements--> `Real Time Live Chat`  [INFERRED]
  tasks.md → BRIEF.md
- `Implemented Product Management` --implements--> `Catalog Management`  [INFERRED]
  tasks.md → BRIEF.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Cadena documental DDD** — _agents_rules_03_ddd_workflow_brief_md, _agents_rules_03_ddd_workflow_stack_md, _agents_rules_03_ddd_workflow_checkpoint_del_operador, _agents_rules_03_ddd_workflow_tasks_md [EXTRACTED 1.00]
- **Gate de despliegue a producción** — _agents_skills_security_baseline_skill_hallazgo_critico, _agents_skills_self_critique_loop_skill_evidencia_de_pruebas, _agents_skills_database_design_skill_backup_verificado, _agents_rules_01_cronos_core_aprobacion_humana_critica, _agents_skills_browser_qa_e2e_skill_browser_qa_e2e [EXTRACTED 1.00]
- **Fases del ciclo de autocrítica** — _agents_skills_self_critique_loop_skill_sombrero_de_seguridad, _agents_skills_self_critique_loop_skill_sombrero_de_qa, _agents_skills_self_critique_loop_skill_sombrero_de_rendimiento, _agents_skills_self_critique_loop_skill_chequeo_de_gap [EXTRACTED 1.00]
- **Multiogar System Roles** — brief_customer, brief_seller, brief_superadmin [EXTRACTED 1.00]
- **Real Time Commerce Flow** — stack_cart, stack_nextjs_route_handlers, stack_cloud_firestore, stack_whatsapp_router [EXTRACTED 1.00]
- **Completed Delivery Phases** — tasks_phase_1_setup, tasks_phase_2_storefront, tasks_phase_3_checkout, tasks_phase_4_live_chat, tasks_phase_5_admin_cms, tasks_phase_6_quality_cycle [EXTRACTED 1.00]
- **Composicion del logotipo Multiogar** — logomultiogar_multiogar, logomultiogar_monograma_m, logomultiogar_marco_circular, logomultiogar_paleta_azul_naranja [INFERRED 0.85]
- **Composicion del logotipo Multiogar** — public_logomultiogar_multiogar, public_logomultiogar_monograma_m, public_logomultiogar_marco_circular, public_logomultiogar_paleta_azul_naranja [INFERRED 0.85]
- **Icono de globo terrestre** — public_globe_contorno_circular, public_globe_meridianos, public_globe_paralelos [EXTRACTED 1.00]
- **Icon Visual Composition** — public_icon_512_blue_circular_frame, public_icon_512_orange_upper_facets, public_icon_512_blue_lower_facets [EXTRACTED 1.00]

## Communities (51 total, 13 thin omitted)

### Community 0 - "Aplicación y panel web"
Cohesion: 0.08
Nodes (49): AdminCategoriesPage(), iconOptions, AdminChatsPage(), QUICK_REPLIES, AdminDashboardPage(), COLORS, AdminOrdersPage(), AdminProductsPage() (+41 more)

### Community 1 - "Modelo de dominio"
Cohesion: 0.07
Nodes (36): Critical Security Gate, Cronos, DDD Documentation Workflow, Operator Confirmation, Reversible Migration, Spanish Communication Rule, Verifiable Test Evidence, AGENTS.md Instructions (+28 more)

### Community 2 - "Navegación y páginas públicas"
Cohesion: 0.11
Nodes (19): AdminLayout(), AdminLayoutProps, BrandLogo(), BrandLogoProps, FacebookIcon(), InstagramIcon(), TikTokIcon(), WhatsAppIcon() (+11 more)

### Community 3 - "Dependencias de ejecución"
Cohesion: 0.07
Nodes (29): canvas-confetti, class-variance-authority, clsx, firebase, framer-motion, lucide-react, next, dependencies (+21 more)

### Community 4 - "Lint y tipos"
Cohesion: 0.07
Nodes (28): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/canvas-confetti (+20 more)

### Community 5 - "Configuración TypeScript"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 6 - "Experiencia de tienda"
Cohesion: 0.11
Nodes (24): Assisted Sales, Catalog and Predictive Search, Customer or Visitor, High Performance Digital Catalog, Dynamic Product SEO, Cloud Firestore, Home Page, Real Time Live Chat (+16 more)

### Community 7 - "Arquitectura administrativa"
Cohesion: 0.15
Nodes (19): Administrative Dashboard and CMS, Analytics Dashboard, Catalog Management, Cloudflare R2, Firebase Auth, Firebase Storage, Order Inbox, Role Based Access Control (+11 more)

### Community 8 - "Diseño y flujo DDD"
Cohesion: 0.16
Nodes (15): BRIEF.md, Checkpoint del operador, Flujo Document-Driven Development, STACK.md, tasks.md, Design Benchmark, Design DNA, Identidad visual (+7 more)

### Community 9 - "Seguridad y QA avanzada"
Cohesion: 0.18
Nodes (11): Nivel 3 empresarial, Advanced QA Strategy, Casos límite de seguridad, Pruebas de carga, Pruebas de contrato, Auditoría de dependencias, Autenticación y autorización verificadas, Protección contra abuso (+3 more)

### Community 10 - "Backend y datos"
Cohesion: 0.22
Nodes (11): Backend Patterns, Contrato de API, Manejo explícito de errores, Validación de entradas, Database Design, Permisos de acceso a datos, Degradación controlada, External Integrations (+3 more)

### Community 11 - "Autocrítica y capacidades"
Cohesion: 0.18
Nodes (11): Integrar antes que construir, Capability Gap Analysis, Gap recurrente, LECCIONES.md, Skill local de proyecto, Chequeo de gap, Criterio de corte, Self-Critique Loop (+3 more)

### Community 12 - "Plantilla inicial Next.js"
Cohesion: 0.20
Nodes (10): app/page.tsx, create-next-app, Development Server, Geist, Learn Next.js, next/font, Next.js Documentation, Next.js GitHub Repository (+2 more)

### Community 13 - "Despliegue y migraciones"
Cohesion: 0.25
Nodes (9): Aprobación humana en acciones críticas, Promoción a skill global, Backup verificado, Plan de rollback de migración, Condición de despliegue, Deploy Checklist, Notas de release, Pipeline CI/CD (+1 more)

### Community 14 - "Autenticación Firebase"
Cohesion: 0.31
Nodes (5): AdminLoginPage(), AuthState, determineUserRole(), loginWithFirebase(), firebaseConfig

### Community 15 - "Pruebas E2E"
Cohesion: 0.25
Nodes (8): Browser QA E2E, Evidencia de fallos E2E, Login con credenciales de prueba, Playwright MCP, Pruebas CRUD, Validaciones de formularios, Credenciales de terceros, Gestión de secretos

### Community 16 - "Gobierno de Cronos"
Cohesion: 0.33
Nodes (7): Ciclo de autocrítica, Cronos, Document-Driven Development, Evidencia verificable, Delegación controlada, Guardrails de subagentes, Re-verificación por Cronos

### Community 17 - "Arquitectura por nivel"
Cohesion: 0.29
Nodes (7): Clasificación de proyectos por nivel, Advanced Architecture, Arquitectura event-driven, Comunicación asíncrona, Monolito modular, Monorepo modular, Separación de servicios

### Community 18 - "Estrategia de producto"
Cohesion: 0.33
Nodes (7): Alcance del MVP, MVP and Roadmap Planning, Roadmap v2 y v3, Backlog priorizado, Features diferidas, Product Strategy, RICE simplificado

### Community 19 - "Imagen social Multiogar"
Cohesion: 0.29
Nodes (7): Blue Circular Frame, Centered Multiogar Brand Logo, Dark Navy Side Bands, Multiogar Open Graph Image, Orange and Blue Brand Palette, Stylized M Monogram, Wide Social Preview Layout

### Community 20 - "Rendimiento y escalabilidad"
Cohesion: 0.40
Nodes (6): Normalización por defecto, Escalera de optimización, Medición antes de optimizar, Patrones de cuello de botella, Performance Baseline, Scalability Patterns

### Community 21 - "Patrones de escalabilidad"
Cohesion: 0.33
Nodes (6): Caché de lecturas, Colas de procesamiento, Escalera de escalabilidad, Optimización de query e índice, Separación de lecturas y escrituras, Sharding de datos

### Community 22 - "Icono de aplicación"
Cohesion: 0.40
Nodes (6): Angular Geometric Style, App Icon, Blue Circular Frame, Blue Lower Facets, Orange Upper Facets, Stylized M Monogram

### Community 23 - "Marca Next.js"
Cohesion: 0.40
Nodes (6): Horizontal Vector Layout, .JS Suffix, Monochrome Black Palette, Next.js Wordmark, NEXT Letterforms, Outlined Path Typography

### Community 24 - "Icono de ventana"
Cohesion: 0.40
Nodes (6): Browser Window Icon, Compact 16px Glyph, Monochrome Gray Palette, Rounded Window Frame, Three Window Controls, Top Control Strip

### Community 25 - "Compilación pnpm"
Cohesion: 0.40
Nodes (5): pnpm allowBuilds Configuration, @firebase/util, protobufjs, sharp, unrs-resolver

### Community 26 - "Icono Multiogar grande"
Cohesion: 0.50
Nodes (5): Angular Geometric Style, App Icon, Double Blue Circular Frame, Orange and Blue Palette, Stylized M Monogram

### Community 27 - "Logo principal Multiogar"
Cohesion: 0.50
Nodes (5): Angular Geometric Logo Design, Blue Circular Frame, Multiogar Brand Logo, Orange and Blue Brand Palette, Stylized M Monogram

### Community 28 - "Procesamiento de imágenes"
Cohesion: 0.50
Nodes (4): run(), fs, path, sharp

### Community 29 - "Inteligencia de costos"
Cohesion: 0.50
Nodes (4): Cost Intelligence, Estimación mensual de costos, Límites y alertas de facturación, Hallazgo de costo

### Community 30 - "Gobierno técnico"
Cohesion: 0.50
Nodes (4): Architecture Decision Record, docs/adr Directory, Technical Governance, Technology Adoption Checklist

### Community 31 - "Identidad visual Multiogar"
Cohesion: 0.50
Nodes (4): Marco circular azul, Monograma M, Multiogar, Paleta azul y naranja

### Community 32 - "Icono Apple Multiogar"
Cohesion: 0.67
Nodes (4): Blue Circular Frame, Multiogar Apple Touch Icon, Orange and Blue Brand Palette, Stylized M Monogram

### Community 33 - "Icono de documento"
Cohesion: 0.50
Nodes (4): Document File Icon, Document Outline, Folded Page Corner, Document Text Lines

### Community 34 - "Icono de globo"
Cohesion: 0.50
Nodes (4): Contorno circular, Globo terrestre, Meridianos, Paralelos

### Community 35 - "Marca Multiogar pública"
Cohesion: 0.50
Nodes (4): Marco circular azul, Monograma M, Multiogar, Paleta azul y naranja

## Knowledge Gaps
- **134 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+129 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Atomic Execution Plan` connect `Experiencia de tienda` to `Modelo de dominio`, `Arquitectura administrativa`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `Condición de despliegue` connect `Despliegue y migraciones` to `Diseño y flujo DDD`, `Inteligencia de costos`, `Pruebas E2E`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `Browser QA E2E` connect `Pruebas E2E` to `Gobierno de Cronos`, `Seguridad y QA avanzada`, `Autocrítica y capacidades`, `Despliegue y migraciones`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _134 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Aplicación y panel web` be split into smaller, more focused modules?**
  _Cohesion score 0.07902973395931143 - nodes in this community are weakly interconnected._
- **Should `Modelo de dominio` be split into smaller, more focused modules?**
  _Cohesion score 0.07301587301587302 - nodes in this community are weakly interconnected._
- **Should `Navegación y páginas públicas` be split into smaller, more focused modules?**
  _Cohesion score 0.10756302521008404 - nodes in this community are weakly interconnected._