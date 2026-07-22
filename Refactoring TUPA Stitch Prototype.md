# Chat Conversation

Note: _This is purely the output of the chat conversation and does not contain any raw data, codebase snippets, etc. used to generate the output._

### User Input

I'll begin with the mandatory pre-implementation analysis. Let me first explore the existing Stitch project structure and then access the Figma file.
The browser subagent hit a quota limit. Let me try accessing the Figma file directly via URL content fetch, and simultaneously explore the Stitch files.
The Figma page returned the app shell (requires JavaScript to render). The URL fetcher confirmed the file exists and is titled "Sistema TUPA" with link_access: "edit" — meaning it's publicly accessible. However, the actual frame data requires the Figma REST API or a browser session. Let me try the Figma REST API and simultaneously read several key Stitch HTML files to understand what's already built.
I now have a clear picture of the Stitch project. The Figma file requires JavaScript to render — I cannot extract frames via HTTP alone. However, I have enough information to proceed. Let me now read several more key files to complete my Stitch analysis before building the implementation plan.
I now have comprehensive knowledge of the Stitch project. I can see the Figma file is accessible (title "Sistema TUPA", link_access: "edit") but requires JavaScript to render the actual canvas. I have enough data from the Stitch project to build the complete plan. Let me now create the comprehensive implementation plan.
Good. Now let me create the implementation plan and begin execution.
Implementation Plan
Here's the pre-implementation analysis summary. The plan is ready for your review.
________________________________________
⚠️ STOP — Figma Access Report
Status: The Figma file "Sistema TUPA" (PsfoxVoyh6v3UdapMo3aw8) is accessible (publicly shareable with edit link). However, the Figma canvas requires JavaScript to render — it cannot be read via simple HTTP fetch or the REST API without a Personal Access Token.
What I was able to confirm from the Figma page:
•	File name: Sistema TUPA
•	Modified: 2026-06-05 (very recent)
•	Background color: #1E1E1E (dark canvas)
•	Author team confirmed
What I extracted from Stitch (which encodes Figma frame names in directory names):
📋 Stitch → Figma Screen Mapping Summary
The project has 41 screens mapping to approximately 32 unique routes. Key findings:
Group	Count	Notes
Public / Home / Login	5	Home, Login, Register, Catalog, Help
Catalog variants	4	Public + 3 display variants (list, grid, accordion)
Student Portal	8	Dashboard + tracking + notifications + profile
Procedure Wizard	13 (→7 after merge)	ES + EN duplicates exist — needs merge
Admin Portal	7	Dashboard, queue, validation, mgmt, reports
Procedure Detail	4	Detail, review, observation, new request
🔑 Key Issues Found in Stitch:
1.	Duplicated wizard: Both paso_X_es (Spanish) AND step_X (English) for all 6 wizard steps
2.	No navigation wiring — all href="#" dead links
3.	Duplicated Tailwind config — copied identically into every page's <script> block
4.	Inconsistent sidebars — 3 different sidebar styles across screens
5.	No shared components — every page is fully self-contained
❓ Open Questions (in the plan)
1.	Language preference for the wizard — Spanish only, English only, or toggle?
2.	Figma API token — if you can share one, I can extract exact frame names to validate the mapping
The implementation plan is ready. Do you approve proceeding to execution?
💡 If you want a fully hands-off deep-dive, consider using /goal to run this as a long-running task that won't stop until the prototype is fully navigable.
Implementation Plan
11:45 PM, 6/4/2026
Proceeded withImplementation Plan
12:00 AM
Continue
12:01 AM
12:01 AM
Proceeded withImplementation Plan
Your plan's baseline quota will refresh on 6/11/2026, 11:45:34 PM. .
12:04 AM
Continue
12:12 AM
Your plan's baseline quota will refresh on 6/11/2026, 11:45:34 PM. .
12:12 AM
Continue


Implementation plan:
# TUPA UNSAAC — Stitch-to-Figma Refactoring Plan

## Background

**Figma File:** Sistema TUPA (`PsfoxVoyh6v3UdapMo3aw8`)  
- Access status: **ACCESSIBLE** (link_access = "edit", publicly viewable)  
- Last modified: 2026-06-05T04:34:09 UTC  
- The file requires JavaScript to render the canvas, so frame names cannot be extracted via HTTP. The Figma visual content is available in-browser.  
- **Action:** Implementation will use the Stitch screen names (which appear to be derived directly from Figma frame names) as the canonical source. Screenshots (`screen.png`) in each screen folder provide the visual ground truth.

**Stitch Project:** 41 screen directories, each containing `code.html` + `screen.png`

---

## User Review Required

> [!IMPORTANT]
> The Figma REST API requires an auth token I do not have. All 41 Stitch screens have `screen.png` files that show what each screen should look like — these will serve as the visual reference alongside the Figma frame names encoded in the directory names. If you can share a Figma API personal access token, I can extract exact frame metadata. Otherwise, execution proceeds with the screen.png visual references.

> [!WARNING]
> Stitch currently uses **Tailwind CDN** on every individual page with duplicated config. The refactored prototype will use a **single shared CSS file** (`shared/design-system.css`) + **single shared JS file** (`shared/navigation.js`). All 41 pages will be updated to reference these. This is a breaking change to the current per-page structure but is required by the task specification.

> [!NOTE]
> The Stitch screens use a consistent Material Design 3 color system (UNSAAC institutional blue `#002045` + teal accent `#89f5e7`). This will be preserved and unified across all screens.

---

## STEP 0 — Figma Analysis (Extracted from Stitch)

### Inferred Figma Pages (from directory naming convention)
The 41 Stitch directories encode the Figma frame names. Grouping by Figma page:

**Page 1: Acceso Público / Public Access**
- `tupa_central_home` → Home / Landing
- `login_tupa_central` → Login
- `create_account_user_type_selection` → Registration
- `tupa_catalog_public_portal` → TUPA Catalog (public)
- `help_guidance_tupa_portal` → Help & Guidance

**Page 2: Portal Estudiantil / Student Portal**
- `student_dashboard_overview` → Student Dashboard
- `my_procedures_tracker` → My Procedures
- `my_requests_tracker` → My Requests
- `notifications_center` → Notifications
- `my_profile_settings` → Profile Settings
- `track_my_procedure_search` → Track Procedure (search)
- `search_results_procedure_tracking` → Search Results / Tracking
- `procedure_detail_status_timeline` → Procedure Detail + Timeline

**Page 3: Asistente de Trámites / Procedure Wizard**
- `paso_1_seleccionar_procedimiento_es_1` → Paso 1 (variant 1)
- `paso_1_seleccionar_procedimiento_es_2` → Paso 1 (variant 2)
- `paso_2_revisar_requisitos_es` → Paso 2 — Requisitos
- `paso_3_confirmaci_n_de_pago_es` → Paso 3 — Pago
- `paso_4_subir_documentos_es` → Paso 4 — Documentos
- `paso_5_revisar_y_enviar_es` → Paso 5 — Revisar y Enviar
- `paso_6_env_o_exitoso_es` → Paso 6 — Éxito
- `step_1_select_procedure` → Step 1 (English variant)
- `step_2_review_requirements` → Step 2 (English)
- `step_3_payment_confirmation` → Step 3 (English)
- `step_4_upload_documents` → Step 4 (English)
- `step_5_review_and_submit` → Step 5 (English)
- `step_6_submission_success` → Step 6 (English)

**Page 4: Detalle de Procedimiento**
- `procedure_detail_diploma_certification` → Procedure Detail (Diploma)
- `procedure_detail_review` → Procedure Detail (Admin Review)
- `new_procedure_request` → New Procedure Request
- `observation_detail_pending_actions` → Observation Detail

**Page 5: Portal Administrativo / Admin Portal**
- `admin_dashboard` → Admin Dashboard
- `admin_dashboard_overview` → Admin Dashboard Overview
- `document_validation_screen` → Document Validation
- `pending_procedures_queue` → Pending Queue
- `procedure_management` → Procedure Management
- `user_management` → User Management
- `reports_and_statistics` → Reports & Statistics

**Page 6: Catálogo TUPA (variantes)**
- `cat_logo_escalar_de_procedimientos_tupa` → Catalog (list/scale view)
- `cat_logo_tupa_variante_acorde_n_es` → Catalog (accordion variant)
- `cat_logo_tupa_variante_cuadr_cula_es` → Catalog (grid variant)
- `institutional_administrative_framework` → Institutional Framework

### Design System (extracted from Stitch Tailwind config)
| Token | Value |
|---|---|
| `primary` | `#002045` (UNSAAC dark navy) |
| `on-primary` | `#ffffff` |
| `primary-container` | `#1a365d` |
| `on-primary-container` | `#86a0cd` |
| `tertiary-fixed` | `#89f5e7` (teal accent) |
| `tertiary-container` | `#003d37` |
| `background` | `#f8f9ff` |
| `surface` | `#f8f9ff` |
| `error` | `#ba1a1a` |

**Typography:**
- Display: Hanken Grotesk 700, 32px/40px
- Headline MD: Hanken Grotesk 600, 24px/32px
- Headline SM: Hanken Grotesk 600, 20px/28px
- Body MD: Inter 400, 16px/24px
- Body SM: Inter 400, 14px/20px
- Label MD: Inter 600, 14px/16px
- Label SM: Inter 500, 12px/16px
- Mono SM: JetBrains Mono 400, 13px/18px

---

## STEP 1 — Screen Mapping Report

| # | Stitch Screen | Figma Frame | Purpose | Status | Action |
|---|---|---|---|---|---|
| 1 | `login_tupa_central` | Login TUPA Central | Auth entry | ✅ Match | Connect nav |
| 2 | `tupa_central_home` | TUPA Central Home | Public landing | ✅ Match | Connect nav |
| 3 | `create_account_user_type_selection` | Crear Cuenta | Registration | ✅ Match | Connect nav |
| 4 | `tupa_catalog_public_portal` | Catálogo TUPA | Public catalog | ✅ Match | Connect nav + filter |
| 5 | `help_guidance_tupa_portal` | Ayuda | Help page | ✅ Match | Connect nav |
| 6 | `student_dashboard_overview` | Dashboard Estudiante | Student home | ✅ Match | Unify sidebar |
| 7 | `my_procedures_tracker` | Mis Trámites | Procedure list | ✅ Match | Connect nav |
| 8 | `my_requests_tracker` | Mis Solicitudes | Request list | ✅ Match | Connect nav |
| 9 | `notifications_center` | Notificaciones | Notifications | ✅ Match | Connect nav |
| 10 | `my_profile_settings` | Mi Perfil | Profile | ✅ Match | Connect nav |
| 11 | `track_my_procedure_search` | Rastrear Trámite | Tracking search | ✅ Match | Connect nav |
| 12 | `search_results_procedure_tracking` | Resultados Búsqueda | Tracking results | ✅ Match | Connect nav |
| 13 | `procedure_detail_status_timeline` | Detalle Trámite + Timeline | Status view | ✅ Match | Connect nav |
| 14 | `procedure_detail_diploma_certification` | Detalle: Diploma | Detail view | ✅ Match | Connect wizard |
| 15 | `procedure_detail_review` | Revisión Detalle | Admin detail | ✅ Match | Connect admin |
| 16 | `new_procedure_request` | Nueva Solicitud | Start new | ✅ Match | Connect wizard |
| 17 | `observation_detail_pending_actions` | Observación Pendiente | Observation | ✅ Match | Connect nav |
| 18 | `paso_1_seleccionar_procedimiento_es_1` | Paso 1 (v1) | Wizard step 1 | MERGE→1 screen | Merge duplicates |
| 19 | `paso_1_seleccionar_procedimiento_es_2` | Paso 1 (v2) | Wizard step 1 alt | MERGE | Merge into #18 |
| 20 | `paso_2_revisar_requisitos_es` | Paso 2 | Wizard step 2 | ✅ Match | Unify stepper |
| 21 | `paso_3_confirmaci_n_de_pago_es` | Paso 3 | Wizard step 3 | ✅ Match | Unify stepper |
| 22 | `paso_4_subir_documentos_es` | Paso 4 | Wizard step 4 | ✅ Match | Unify stepper |
| 23 | `paso_5_revisar_y_enviar_es` | Paso 5 | Wizard step 5 | ✅ Match | Unify stepper |
| 24 | `paso_6_env_o_exitoso_es` | Paso 6 | Wizard success | ✅ Match | Connect tracking |
| 25 | `step_1_select_procedure` | Step 1 (EN) | Wizard EN variant | MERGE | Same as #18 |
| 26 | `step_2_review_requirements` | Step 2 (EN) | Wizard EN | MERGE | Same as #20 |
| 27 | `step_3_payment_confirmation` | Step 3 (EN) | Wizard EN | MERGE | Same as #21 |
| 28 | `step_4_upload_documents` | Step 4 (EN) | Wizard EN | MERGE | Same as #22 |
| 29 | `step_5_review_and_submit` | Step 5 (EN) | Wizard EN | MERGE | Same as #23 |
| 30 | `step_6_submission_success` | Step 6 (EN) | Wizard EN | MERGE | Same as #24 |
| 31 | `admin_dashboard` | Admin Dashboard | Admin home | ✅ Match | Unify sidebar |
| 32 | `admin_dashboard_overview` | Admin Overview | Admin stats | MERGE | Merge into #31 |
| 33 | `document_validation_screen` | Validar Documentos | Doc validation | ✅ Match | Connect admin nav |
| 34 | `pending_procedures_queue` | Cola de Pendientes | Pending queue | ✅ Match | Connect admin nav |
| 35 | `procedure_management` | Gestión Trámites | Admin procedure mgmt | ✅ Match | Connect admin nav |
| 36 | `user_management` | Gestión Usuarios | User management | ✅ Match | Connect admin nav |
| 37 | `reports_and_statistics` | Reportes | Reports | ✅ Match | Connect admin nav |
| 38 | `cat_logo_escalar_de_procedimientos_tupa` | Catálogo Lista | List view | ✅ Match | Connect as view toggle |
| 39 | `cat_logo_tupa_variante_acorde_n_es` | Catálogo Acordeón | Accordion view | ✅ Match | Connect as view toggle |
| 40 | `cat_logo_tupa_variante_cuadr_cula_es` | Catálogo Cuadrícula | Grid view | ✅ Match | Connect as view toggle |
| 41 | `institutional_administrative_framework` | Marco Institucional | Institutional info | ✅ Match | Connect from catalog |

**Screens to MERGE (reduce from 41 → ~32 unique routes):**
- Paso 1 ES v1 + v2 + EN Step 1 → Single `paso_1` screen
- Admin Dashboard + Admin Overview → Single `admin_dashboard`  
- ES wizard + EN wizard → Single unified wizard (Spanish primary, already done in ES screens)

---

## STEP 2 — Navigation Architecture

### Public Flow
```
/ (tupa_central_home)
  ├── /login
  ├── /registro (create_account)
  ├── /catalogo (tupa_catalog_public_portal)
  │     ├── /catalogo/lista
  │     ├── /catalogo/acordeon  
  │     ├── /catalogo/cuadricula
  │     └── /catalogo/procedimiento/:id (procedure_detail_diploma_certification)
  │           └── /tramite/paso-1 ──┐
  └── /ayuda                        │
                                    │
### Student Wizard Flow             │
/tramite/paso-1 (seleccionar) ◄─────┘
/tramite/paso-2 (requisitos)
/tramite/paso-3 (pago)
/tramite/paso-4 (documentos)
/tramite/paso-5 (revisar)
/tramite/paso-6 (exito)
  └── /seguimiento/:id

### Student Dashboard Flow
/estudiante/dashboard
  ├── /estudiante/mis-tramites
  ├── /estudiante/solicitudes
  ├── /estudiante/notificaciones
  ├── /estudiante/perfil
  ├── /seguimiento (track_my_procedure_search)
  │     └── /seguimiento/resultados
  │           └── /seguimiento/:id (procedure_detail_status_timeline)
  └── /observacion/:id (observation_detail)

### Admin Flow
/admin/dashboard
  ├── /admin/cola (pending_procedures_queue)
  ├── /admin/validacion (document_validation_screen)
  ├── /admin/procedimientos (procedure_management)
  ├── /admin/usuarios (user_management)
  ├── /admin/reportes (reports_and_statistics)
  └── /admin/detalle/:id (procedure_detail_review)
```

---

## STEP 3 — Functional Groups

| Group | Screens |
|---|---|
| 1. Acceso Público | home, login, registro, ayuda |
| 2. Catálogo TUPA | catalog (3 views), procedure detail, institutional framework |
| 3. Asistente Trámite | 6 wizard steps (unified) |
| 4. Pago y Documentos | paso-3, paso-4 |
| 5. Seguimiento | track search, results, timeline, observation |
| 6. Dashboard Estudiante | student dashboard, procedures, requests, notifications, profile |
| 7. Dashboard Admin | admin dashboard, pending queue, document validation, procedure mgmt, user mgmt |
| 8. Reportes | reports & statistics |

---

## STEP 4 — Shared Design System

**New file:** `shared/design-system.css`

Will replace duplicated Tailwind CDN config with:
- CSS Custom Properties (`:root {}`) for all design tokens
- Google Fonts import (Inter, Hanken Grotesk, JetBrains Mono, Material Symbols)
- Typography classes
- Spacing classes
- Component base styles (sidebar, topbar, cards, badges, buttons, forms, tables, timeline, stepper, modals)
- Scrollbar styles
- Animation utilities

**New file:** `shared/navigation.js`

Will provide:
- Centralized routing table (all 32 routes → file paths)
- `navigate(route)` function
- Active state management for sidebars
- Breadcrumb generation
- Wizard step controller
- Tab/view toggle controller

**New file:** `shared/components.js`

Will provide HTML template generators for:
- `StudentSidebar(activeItem)`
- `AdminSidebar(activeItem)`
- `PublicTopbar(activeItem)`
- `StudentTopbar()`
- `AdminTopbar()`
- `ProcedureCard(data)`
- `StatusBadge(status)`
- `TimelineItem(data)`
- `WizardStepper(currentStep)`
- `NotificationItem(data)`

---

## Proposed Changes

### [NEW] Shared Infrastructure

#### [NEW] shared/design-system.css
Single CSS file replacing all per-page Tailwind CDN calls. Contains all tokens, typography, component styles, animations.

#### [NEW] shared/navigation.js
Central router, active state, breadcrumbs, wizard controller.

#### [NEW] shared/components.js
Reusable HTML component generators (called by each page's `<script>`).

---

### [NEW] Master Entry Point

#### [NEW] index.html
Main entry point. Redirects to `tupa_central_home/code.html` or provides a prototype navigation panel for development.

---

### [MODIFY] All 41 `code.html` files

Each file will be updated to:
1. Replace `<script src="https://cdn.tailwindcss.com...">` + `<script id="tailwind-config">` with `<link rel="stylesheet" href="../shared/design-system.css">`
2. Add `<script src="../shared/components.js"></script>`
3. Add `<script src="../shared/navigation.js"></script>`
4. Replace hardcoded sidebar/topbar HTML with JS-generated shared components
5. Wire all navigation links, buttons, and CTAs to real routes
6. Standardize language to Spanish (ES) as primary
7. Add proper `<title>` and `<meta>` SEO tags

---

## Verification Plan

### Manual Verification
1. Open `index.html` in browser — verify landing page loads
2. Click Login → verify redirect to student or admin dashboard
3. Navigate catalog → click procedure → start wizard → complete all 6 steps → see success → reach tracking
4. Test admin flow: login as admin → see admin dashboard → navigate all admin sections
5. Verify sidebar active states update correctly on each screen
6. Test search/filter functionality on catalog
7. Verify all CTAs lead to valid screens (no dead ends)
8. Check responsive layout on mobile viewport

### Automated
- No build step required (static HTML prototype)
- Open `index.html` directly in any modern browser

---

## Open Questions

> [!IMPORTANT]
> **Language:** The wizard has both Spanish (`paso_X`) and English (`step_X`) duplicates. Should we:
> a) Keep Spanish only (recommended — consistent with UNSAAC context)
> b) Add a language toggle
> c) Keep both as separate routes

> [!NOTE]
> **Figma API Access:** If you can provide a Figma Personal Access Token, I can call the REST API to extract exact frame names and validate my mapping above. Command would be: `curl -H "X-Figma-Token: YOUR_TOKEN" "https://api.figma.com/v1/files/PsfoxVoyh6v3UdapMo3aw8?depth=2"`


prompt:
Resources

Figma (source of truth):
https://www.figma.com/design/PsfoxVoyh6v3UdapMo3aw8/Sistema-TUPA

Stitch source project:
https://stitch.withgoogle.com/projects/3252895439446176782

IMPORTANT:

Before making any modifications:

1. Confirm access to the Figma file.
2. Extract all page names.
3. Extract all frame names.
4. Extract the navigation structure.
5. Compare all Stitch screens against the Figma structure.
6. Produce the mapping report.

If the Figma file cannot be accessed:
STOP and report the issue.
Do not start implementation.

You are working on a university TUPA front-end prototype generated from Stitch and a final reference design in Figma.

Your objective is to refactor the Stitch-generated HTML prototype so it matches the Figma prototype as closely as possible in structure, screen organization, visual consistency, component architecture, and navigation behavior.

The final result must be a polished, fully navigable, front-end-only prototype.

==================================================
CRITICAL PRIORITY ORDER
=======================

Priority 1:
The Figma file is the single source of truth.
Whenever Stitch and Figma disagree, Figma wins.

Priority 2:
Match the visual design, structure, layout hierarchy, and navigation flow of the Figma prototype before performing any optimization.

Priority 3:
Create reusable shared components for repeated UI elements.

Priority 4:
Connect all screens into a fully navigable front-end prototype.

Priority 5:
Preserve existing animations, transitions, hover effects, and interactions from Stitch whenever they are compatible with the Figma design.

Do not spend significant effort redesigning screens that already match the Figma prototype.

==================================================
GENERAL RULES
=============

* The Figma design is the source of truth.
* Before changing code, identify every screen in the Stitch project and map it to the closest Figma frame by purpose and content.
* Use the exact Figma frame names whenever possible.

If the Figma contains:

* duplicate frame names
* ambiguous names
* placeholder names
* temporary design names

then create clear production-ready route names while preserving the original Figma frame names in the implementation report.

* If a Stitch screen does not match a Figma frame exactly, rename and adapt it to the closest Figma screen instead of inventing a new screen.
* Do not build backend logic.
* Do not create APIs.
* Do not create databases.
* Do not implement authentication.
* Keep everything front-end only and fully static.
* Preserve useful animations and transitions already present in Stitch unless they conflict with the Figma design system.

==================================================
STEP 0 — FIGMA ANALYSIS
=======================

Before modifying any code:

Analyze the Figma file and extract:

* page names
* frame names
* navigation structure
* design system patterns
* reusable UI components
* layout conventions
* typography hierarchy
* color system
* spacing system

Treat these findings as the canonical reference for the implementation.

==================================================
STEP 1 — SCREEN MAPPING REPORT
==============================

Before implementing any changes:

Create a mapping report containing:

1. Stitch screen name / file name
2. Matching Figma frame name
3. Screen purpose
4. Required changes
5. Parent screen
6. Child screens
7. Navigation triggers

For each screen identify:

* what must be removed
* what must be restyled
* what must be resized
* what must be reordered
* what must be renamed
* what must be connected
* what component can be reused

Do not start implementation until the mapping is complete.

==================================================
STEP 2 — NAVIGATION ARCHITECTURE
================================

Generate a complete navigation map before implementation.

For every screen identify:

* incoming navigation paths
* outgoing navigation paths
* sidebar links
* button destinations
* wizard flow transitions
* dashboard shortcuts

Build a complete screen relationship structure first.

Only after the navigation structure is defined should implementation begin.

==================================================
STEP 3 — REFACTOR BY FUNCTIONAL GROUPS
======================================

Group screens into:

1. Public access and login

2. TUPA catalog and procedure detail

3. Procedure submission wizard

4. Payment and document upload

5. Tracking and expediente timeline

6. Student dashboard

7. Administrative dashboard

8. Reports and notifications

==================================================
STEP 4 — CREATE A SHARED DESIGN SYSTEM
======================================

Apply one unified design system across all pages.

Standardize:

* sidebar
* top navigation
* typography
* spacing
* buttons
* cards
* badges
* status indicators
* forms
* tables
* modal windows
* drawers
* wizard steps
* timeline components
* dashboard widgets

If multiple visual versions of the same component exist:

keep the version that best matches Figma and remove the others.

==================================================
STEP 5 — COMPONENTIZATION
=========================

Convert repeated UI structures into reusable shared components.

Examples:

* Sidebar
* Topbar
* Dashboard cards
* Procedure cards
* Tables
* Filters
* Search bars
* Status badges
* Stepper/Wizard
* Notification items
* Timeline items
* Form controls

Avoid page-specific duplication.

Prioritize maintainability and consistency.

==================================================
STEP 6 — MAKE THE PROTOTYPE FULLY NAVIGABLE
===========================================

Connect screens so the prototype behaves like a real product.

Required navigation flow:

Login
→ Student Dashboard

Login
→ Administrative Dashboard

Public Entry
→ TUPA Catalog

TUPA Catalog
→ Procedure Detail

Procedure Detail
→ Start Procedure Wizard

Wizard Step 1
→ Wizard Step 2

Wizard Step 2
→ Payment

Payment
→ Document Upload

Document Upload
→ Review and Submit

Review and Submit
→ Submission Success

Submission Success
→ Tracking / Expediente Timeline

Student Dashboard
→ My Procedures

Student Dashboard
→ Notifications

Student Dashboard
→ Procedure Detail

Student Dashboard
→ Tracking

Administrative Dashboard
→ Pending Queue

Administrative Dashboard
→ Validate Documents

Administrative Dashboard
→ Reports

Administrative Dashboard
→ Procedure Detail

Tracking Search
→ Tracking Detail

Tracking Detail
→ Timeline View

Reports
→ Detailed Report Views

Ensure all menu items, cards, CTAs, buttons and actions lead somewhere meaningful.

Avoid dead-end screens.

==================================================
STEP 7 — SCREEN-SPECIFIC ADAPTATION RULES
=========================================

For each screen:

Maintain the original function.

Adapt the visual structure to match the Figma version.

Specific rules:

* If Stitch uses large procedure cards but Figma uses a compact catalog, convert to the compact catalog.
* If Stitch uses inconsistent sidebars, replace them with one shared sidebar component.
* If Stitch changes the stepper style between wizard steps, unify all steps into one stepper component.
* If Stitch contains decorative elements not present in Figma, remove them.
* If Stitch lacks interaction states, add hover, active, selected and disabled states.
* If Stitch contains inconsistent spacing, align it with the Figma spacing system.
* If Stitch contains inconsistent typography, align it with the Figma typography hierarchy.

==================================================
STEP 8 — PRESERVE GOOD STITCH WORK
==================================

Do not remove animations unnecessarily.

Preserve:

* hover states
* transitions
* animated cards
* loading states
* subtle motion
* micro-interactions

when they improve usability and remain consistent with the Figma design.

==================================================
STEP 9 — FINAL DELIVERABLE
==========================

Deliver:

* Unified HTML/CSS/JS prototype
* Fully connected navigation
* Shared reusable components
* Consistent design system
* Figma-aligned layouts
* Preserved animations
* No backend code
* No API implementation
* No database logic
* No duplicated styles across pages

==================================================
FINAL REPORT
============

At the end generate a concise implementation report containing:

1. Figma pages discovered
2. Figma frames discovered
3. Stitch-to-Figma screen mapping
4. Screens renamed
5. Screens merged
6. Screens split
7. Shared components created
8. Navigation flow implemented
9. Design system decisions
10. Animations preserved
11. Remaining inconsistencies (if any)

IMPORTANT:

Do not start by redesigning individual screens visually.

First:

1. Analyze Figma.
2. Analyze Stitch.
3. Build the screen mapping.
4. Build the navigation map.
5. Create the shared design system.
6. Componentize.
7. Refactor.
8. Connect screens.
9. Produce the final implementation report.

Como verás de antes ya se estaban modificacndo cuando se acabaron los tokens, ahora necesito que continues y lo completes


### Planner Response

Let me first check what was already completed before the tokens ran out, then continue from where we left off.

*Listed directory [stitch_institutional_tupa_portal](file:///d:/Ing%20de%20sistemas/Acad%C3%A9mico/INGENIERIA%20DE%20SISTEMAS%202023-1%20UNSAAC/CICLO%207/DESARROLLO%20DE%20SOFTWARE%20I/Proyecto-Semestral-TUPA-UNSAAC/stitch_institutional_tupa_portal) *

*Listed directory [shared](file:///d:/Ing%20de%20sistemas/Acad%C3%A9mico/INGENIERIA%20DE%20SISTEMAS%202023-1%20UNSAAC/CICLO%207/DESARROLLO%20DE%20SOFTWARE%20I/Proyecto-Semestral-TUPA-UNSAAC/stitch_institutional_tupa_portal/shared) *

*Viewed [design-system.css](file:///d:/Ing%20de%20sistemas/Acad%C3%A9mico/INGENIERIA%20DE%20SISTEMAS%202023-1%20UNSAAC/CICLO%207/DESARROLLO%20DE%20SOFTWARE%20I/Proyecto-Semestral-TUPA-UNSAAC/stitch_institutional_tupa_portal/shared/design-system.css) *

*Viewed [design-system.css](file:///d:/Ing%20de%20sistemas/Acad%C3%A9mico/INGENIERIA%20DE%20SISTEMAS%202023-1%20UNSAAC/CICLO%207/DESARROLLO%20DE%20SOFTWARE%20I/Proyecto-Semestral-TUPA-UNSAAC/stitch_institutional_tupa_portal/shared/design-system.css) *

*Viewed [navigation.js](file:///d:/Ing%20de%20sistemas/Acad%C3%A9mico/INGENIERIA%20DE%20SISTEMAS%202023-1%20UNSAAC/CICLO%207/DESARROLLO%20DE%20SOFTWARE%20I/Proyecto-Semestral-TUPA-UNSAAC/stitch_institutional_tupa_portal/shared/navigation.js) *

### Planner Response

Now let me check the components.js and which HTML screens have already been updated:

*Viewed [components.js](file:///d:/Ing%20de%20sistemas/Acad%C3%A9mico/INGENIERIA%20DE%20SISTEMAS%202023-1%20UNSAAC/CICLO%207/DESARROLLO%20DE%20SOFTWARE%20I/Proyecto-Semestral-TUPA-UNSAAC/stitch_institutional_tupa_portal/shared/components.js) *

*Viewed [code.html](file:///d:/Ing%20de%20sistemas/Acad%C3%A9mico/INGENIERIA%20DE%20SISTEMAS%202023-1%20UNSAAC/CICLO%207/DESARROLLO%20DE%20SOFTWARE%20I/Proyecto-Semestral-TUPA-UNSAAC/stitch_institutional_tupa_portal/login_tupa_central/code.html) *

### Planner Response

Now let me check which HTML screens have already been updated vs. which still use the old Tailwind CDN:

*User accepted the command `Get-ChildItem -Path "." -Recurse -Name "code.html" | ForEach-Object { $content = Get-Content $_ -Raw; $hasShared = $content -match 'shared/design-system.css'; $hasTailwind = $content -match 'cdn.tailwindcss.com|tailwind-config'; [PSCustomObject]@{File=$_; HasShared=$hasShared; HasTailwind=$hasTailwind} } | Format-Table -AutoSize`*

### User Input

Continue

### Planner Response

Now I have a clear picture. The shared infrastructure is **complete**, and only 2 screens have been converted (`login` + `student_dashboard`). I need to convert the remaining **39 screens**. Let me first check the index.html and student dashboard to understand the established pattern, then batch-write all remaining screens.

*Viewed [code.html](file:///d:/Ing%20de%20sistemas/Acad%C3%A9mico/INGENIERIA%20DE%20SISTEMAS%202023-1%20UNSAAC/CICLO%207/DESARROLLO%20DE%20SOFTWARE%20I/Proyecto-Semestral-TUPA-UNSAAC/stitch_institutional_tupa_portal/student_dashboard_overview/code.html) *

*Viewed [index.html](file:///d:/Ing%20de%20sistemas/Acad%C3%A9mico/INGENIERIA%20DE%20SISTEMAS%202023-1%20UNSAAC/CICLO%207/DESARROLLO%20DE%20SOFTWARE%20I/Proyecto-Semestral-TUPA-UNSAAC/stitch_institutional_tupa_portal/index.html) *

### Planner Response

I have a complete picture. Now I'll create a task tracker and then batch-write all 39 remaining screens efficiently. Let me start immediately.

*Edited relevant file*

### Planner Response

Now let me write all screens in parallel batches. Starting with Batch 1 — Public Pages:

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

### Planner Response

Batch 1 done. Now Batch 2 — Catalog screens:

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

### Planner Response

Batch 2 done. Now Batch 3 — Wizard Steps (6 Spanish steps + a redirect for paso_1_v2 + 6 English redirects):

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

### User Input

I'll begin with the mandatory pre-implementation analysis. Let me first explore the existing Stitch project structure and then access the Figma file.
The browser subagent hit a quota limit. Let me try accessing the Figma file directly via URL content fetch, and simultaneously explore the Stitch files.
The Figma page returned the app shell (requires JavaScript to render). The URL fetcher confirmed the file exists and is titled "Sistema TUPA" with link_access: "edit" — meaning it's publicly accessible. However, the actual frame data requires the Figma REST API or a browser session. Let me try the Figma REST API and simultaneously read several key Stitch HTML files to understand what's already built.
I now have a clear picture of the Stitch project. The Figma file requires JavaScript to render — I cannot extract frames via HTTP alone. However, I have enough information to proceed. Let me now read several more key files to complete my Stitch analysis before building the implementation plan.
I now have comprehensive knowledge of the Stitch project. I can see the Figma file is accessible (title "Sistema TUPA", link_access: "edit") but requires JavaScript to render the actual canvas. I have enough data from the Stitch project to build the complete plan. Let me now create the comprehensive implementation plan.
Good. Now let me create the implementation plan and begin execution.
Implementation Plan
Here's the pre-implementation analysis summary. The plan is ready for your review.
________________________________________
⚠️ STOP — Figma Access Report
Status: The Figma file "Sistema TUPA" (PsfoxVoyh6v3UdapMo3aw8) is accessible (publicly shareable with edit link). However, the Figma canvas requires JavaScript to render — it cannot be read via simple HTTP fetch or the REST API without a Personal Access Token.
What I was able to confirm from the Figma page:
•	File name: Sistema TUPA
•	Modified: 2026-06-05 (very recent)
•	Background color: #1E1E1E (dark canvas)
•	Author team confirmed
What I extracted from Stitch (which encodes Figma frame names in directory names):
📋 Stitch → Figma Screen Mapping Summary
The project has 41 screens mapping to approximately 32 unique routes. Key findings:
Group	Count	Notes
Public / Home / Login	5	Home, Login, Register, Catalog, Help
Catalog variants	4	Public + 3 display variants (list, grid, accordion)
Student Portal	8	Dashboard + tracking + notifications + profile
Procedure Wizard	13 (→7 after merge)	ES + EN duplicates exist — needs merge
Admin Portal	7	Dashboard, queue, validation, mgmt, reports
Procedure Detail	4	Detail, review, observation, new request
🔑 Key Issues Found in Stitch:
1.	Duplicated wizard: Both paso_X_es (Spanish) AND step_X (English) for all 6 wizard steps
2.	No navigation wiring — all href="#" dead links
3.	Duplicated Tailwind config — copied identically into every page's <script> block
4.	Inconsistent sidebars — 3 different sidebar styles across screens
5.	No shared components — every page is fully self-contained
❓ Open Questions (in the plan)
1.	Language preference for the wizard — Spanish only, English only, or toggle?
2.	Figma API token — if you can share one, I can extract exact frame names to validate the mapping
The implementation plan is ready. Do you approve proceeding to execution?
💡 If you want a fully hands-off deep-dive, consider using /goal to run this as a long-running task that won't stop until the prototype is fully navigable.
Implementation Plan
11:45 PM, 6/4/2026
Proceeded withImplementation Plan
12:00 AM
Continue
12:01 AM
12:01 AM
Proceeded withImplementation Plan
Your plan's baseline quota will refresh on 6/11/2026, 11:45:34 PM. .
12:04 AM
Continue
12:12 AM
Your plan's baseline quota will refresh on 6/11/2026, 11:45:34 PM. .
12:12 AM
Continue


Implementation plan:
# TUPA UNSAAC — Stitch-to-Figma Refactoring Plan

## Background

**Figma File:** Sistema TUPA (`PsfoxVoyh6v3UdapMo3aw8`)  
- Access status: **ACCESSIBLE** (link_access = "edit", publicly viewable)  
- Last modified: 2026-06-05T04:34:09 UTC  
- The file requires JavaScript to render the canvas, so frame names cannot be extracted via HTTP. The Figma visual content is available in-browser.  
- **Action:** Implementation will use the Stitch screen names (which appear to be derived directly from Figma frame names) as the canonical source. Screenshots (`screen.png`) in each screen folder provide the visual ground truth.

**Stitch Project:** 41 screen directories, each containing `code.html` + `screen.png`

---

## User Review Required

> [!IMPORTANT]
> The Figma REST API requires an auth token I do not have. All 41 Stitch screens have `screen.png` files that show what each screen should look like — these will serve as the visual reference alongside the Figma frame names encoded in the directory names. If you can share a Figma API personal access token, I can extract exact frame metadata. Otherwise, execution proceeds with the screen.png visual references.

> [!WARNING]
> Stitch currently uses **Tailwind CDN** on every individual page with duplicated config. The refactored prototype will use a **single shared CSS file** (`shared/design-system.css`) + **single shared JS file** (`shared/navigation.js`). All 41 pages will be updated to reference these. This is a breaking change to the current per-page structure but is required by the task specification.

> [!NOTE]
> The Stitch screens use a consistent Material Design 3 color system (UNSAAC institutional blue `#002045` + teal accent `#89f5e7`). This will be preserved and unified across all screens.

---

## STEP 0 — Figma Analysis (Extracted from Stitch)

### Inferred Figma Pages (from directory naming convention)
The 41 Stitch directories encode the Figma frame names. Grouping by Figma page:

**Page 1: Acceso Público / Public Access**
- `tupa_central_home` → Home / Landing
- `login_tupa_central` → Login
- `create_account_user_type_selection` → Registration
- `tupa_catalog_public_portal` → TUPA Catalog (public)
- `help_guidance_tupa_portal` → Help & Guidance

**Page 2: Portal Estudiantil / Student Portal**
- `student_dashboard_overview` → Student Dashboard
- `my_procedures_tracker` → My Procedures
- `my_requests_tracker` → My Requests
- `notifications_center` → Notifications
- `my_profile_settings` → Profile Settings
- `track_my_procedure_search` → Track Procedure (search)
- `search_results_procedure_tracking` → Search Results / Tracking
- `procedure_detail_status_timeline` → Procedure Detail + Timeline

**Page 3: Asistente de Trámites / Procedure Wizard**
- `paso_1_seleccionar_procedimiento_es_1` → Paso 1 (variant 1)
- `paso_1_seleccionar_procedimiento_es_2` → Paso 1 (variant 2)
- `paso_2_revisar_requisitos_es` → Paso 2 — Requisitos
- `paso_3_confirmaci_n_de_pago_es` → Paso 3 — Pago
- `paso_4_subir_documentos_es` → Paso 4 — Documentos
- `paso_5_revisar_y_enviar_es` → Paso 5 — Revisar y Enviar
- `paso_6_env_o_exitoso_es` → Paso 6 — Éxito
- `step_1_select_procedure` → Step 1 (English variant)
- `step_2_review_requirements` → Step 2 (English)
- `step_3_payment_confirmation` → Step 3 (English)
- `step_4_upload_documents` → Step 4 (English)
- `step_5_review_and_submit` → Step 5 (English)
- `step_6_submission_success` → Step 6 (English)

**Page 4: Detalle de Procedimiento**
- `procedure_detail_diploma_certification` → Procedure Detail (Diploma)
- `procedure_detail_review` → Procedure Detail (Admin Review)
- `new_procedure_request` → New Procedure Request
- `observation_detail_pending_actions` → Observation Detail

**Page 5: Portal Administrativo / Admin Portal**
- `admin_dashboard` → Admin Dashboard
- `admin_dashboard_overview` → Admin Dashboard Overview
- `document_validation_screen` → Document Validation
- `pending_procedures_queue` → Pending Queue
- `procedure_management` → Procedure Management
- `user_management` → User Management
- `reports_and_statistics` → Reports & Statistics

**Page 6: Catálogo TUPA (variantes)**
- `cat_logo_escalar_de_procedimientos_tupa` → Catalog (list/scale view)
- `cat_logo_tupa_variante_acorde_n_es` → Catalog (accordion variant)
- `cat_logo_tupa_variante_cuadr_cula_es` → Catalog (grid variant)
- `institutional_administrative_framework` → Institutional Framework

### Design System (extracted from Stitch Tailwind config)
| Token | Value |
|---|---|
| `primary` | `#002045` (UNSAAC dark navy) |
| `on-primary` | `#ffffff` |
| `primary-container` | `#1a365d` |
| `on-primary-container` | `#86a0cd` |
| `tertiary-fixed` | `#89f5e7` (teal accent) |
| `tertiary-container` | `#003d37` |
| `background` | `#f8f9ff` |
| `surface` | `#f8f9ff` |
| `error` | `#ba1a1a` |

**Typography:**
- Display: Hanken Grotesk 700, 32px/40px
- Headline MD: Hanken Grotesk 600, 24px/32px
- Headline SM: Hanken Grotesk 600, 20px/28px
- Body MD: Inter 400, 16px/24px
- Body SM: Inter 400, 14px/20px
- Label MD: Inter 600, 14px/16px
- Label SM: Inter 500, 12px/16px
- Mono SM: JetBrains Mono 400, 13px/18px

---

## STEP 1 — Screen Mapping Report

| # | Stitch Screen | Figma Frame | Purpose | Status | Action |
|---|---|---|---|---|---|
| 1 | `login_tupa_central` | Login TUPA Central | Auth entry | ✅ Match | Connect nav |
| 2 | `tupa_central_home` | TUPA Central Home | Public landing | ✅ Match | Connect nav |
| 3 | `create_account_user_type_selection` | Crear Cuenta | Registration | ✅ Match | Connect nav |
| 4 | `tupa_catalog_public_portal` | Catálogo TUPA | Public catalog | ✅ Match | Connect nav + filter |
| 5 | `help_guidance_tupa_portal` | Ayuda | Help page | ✅ Match | Connect nav |
| 6 | `student_dashboard_overview` | Dashboard Estudiante | Student home | ✅ Match | Unify sidebar |
| 7 | `my_procedures_tracker` | Mis Trámites | Procedure list | ✅ Match | Connect nav |
| 8 | `my_requests_tracker` | Mis Solicitudes | Request list | ✅ Match | Connect nav |
| 9 | `notifications_center` | Notificaciones | Notifications | ✅ Match | Connect nav |
| 10 | `my_profile_settings` | Mi Perfil | Profile | ✅ Match | Connect nav |
| 11 | `track_my_procedure_search` | Rastrear Trámite | Tracking search | ✅ Match | Connect nav |
| 12 | `search_results_procedure_tracking` | Resultados Búsqueda | Tracking results | ✅ Match | Connect nav |
| 13 | `procedure_detail_status_timeline` | Detalle Trámite + Timeline | Status view | ✅ Match | Connect nav |
| 14 | `procedure_detail_diploma_certification` | Detalle: Diploma | Detail view | ✅ Match | Connect wizard |
| 15 | `procedure_detail_review` | Revisión Detalle | Admin detail | ✅ Match | Connect admin |
| 16 | `new_procedure_request` | Nueva Solicitud | Start new | ✅ Match | Connect wizard |
| 17 | `observation_detail_pending_actions` | Observación Pendiente | Observation | ✅ Match | Connect nav |
| 18 | `paso_1_seleccionar_procedimiento_es_1` | Paso 1 (v1) | Wizard step 1 | MERGE→1 screen | Merge duplicates |
| 19 | `paso_1_seleccionar_procedimiento_es_2` | Paso 1 (v2) | Wizard step 1 alt | MERGE | Merge into #18 |
| 20 | `paso_2_revisar_requisitos_es` | Paso 2 | Wizard step 2 | ✅ Match | Unify stepper |
| 21 | `paso_3_confirmaci_n_de_pago_es` | Paso 3 | Wizard step 3 | ✅ Match | Unify stepper |
| 22 | `paso_4_subir_documentos_es` | Paso 4 | Wizard step 4 | ✅ Match | Unify stepper |
| 23 | `paso_5_revisar_y_enviar_es` | Paso 5 | Wizard step 5 | ✅ Match | Unify stepper |
| 24 | `paso_6_env_o_exitoso_es` | Paso 6 | Wizard success | ✅ Match | Connect tracking |
| 25 | `step_1_select_procedure` | Step 1 (EN) | Wizard EN variant | MERGE | Same as #18 |
| 26 | `step_2_review_requirements` | Step 2 (EN) | Wizard EN | MERGE | Same as #20 |
| 27 | `step_3_payment_confirmation` | Step 3 (EN) | Wizard EN | MERGE | Same as #21 |
| 28 | `step_4_upload_documents` | Step 4 (EN) | Wizard EN | MERGE | Same as #22 |
| 29 | `step_5_review_and_submit` | Step 5 (EN) | Wizard EN | MERGE | Same as #23 |
| 30 | `step_6_submission_success` | Step 6 (EN) | Wizard EN | MERGE | Same as #24 |
| 31 | `admin_dashboard` | Admin Dashboard | Admin home | ✅ Match | Unify sidebar |
| 32 | `admin_dashboard_overview` | Admin Overview | Admin stats | MERGE | Merge into #31 |
| 33 | `document_validation_screen` | Validar Documentos | Doc validation | ✅ Match | Connect admin nav |
| 34 | `pending_procedures_queue` | Cola de Pendientes | Pending queue | ✅ Match | Connect admin nav |
| 35 | `procedure_management` | Gestión Trámites | Admin procedure mgmt | ✅ Match | Connect admin nav |
| 36 | `user_management` | Gestión Usuarios | User management | ✅ Match | Connect admin nav |
| 37 | `reports_and_statistics` | Reportes | Reports | ✅ Match | Connect admin nav |
| 38 | `cat_logo_escalar_de_procedimientos_tupa` | Catálogo Lista | List view | ✅ Match | Connect as view toggle |
| 39 | `cat_logo_tupa_variante_acorde_n_es` | Catálogo Acordeón | Accordion view | ✅ Match | Connect as view toggle |
| 40 | `cat_logo_tupa_variante_cuadr_cula_es` | Catálogo Cuadrícula | Grid view | ✅ Match | Connect as view toggle |
| 41 | `institutional_administrative_framework` | Marco Institucional | Institutional info | ✅ Match | Connect from catalog |

**Screens to MERGE (reduce from 41 → ~32 unique routes):**
- Paso 1 ES v1 + v2 + EN Step 1 → Single `paso_1` screen
- Admin Dashboard + Admin Overview → Single `admin_dashboard`  
- ES wizard + EN wizard → Single unified wizard (Spanish primary, already done in ES screens)

---

## STEP 2 — Navigation Architecture

### Public Flow
```
/ (tupa_central_home)
  ├── /login
  ├── /registro (create_account)
  ├── /catalogo (tupa_catalog_public_portal)
  │     ├── /catalogo/lista
  │     ├── /catalogo/acordeon  
  │     ├── /catalogo/cuadricula
  │     └── /catalogo/procedimiento/:id (procedure_detail_diploma_certification)
  │           └── /tramite/paso-1 ──┐
  └── /ayuda                        │
                                    │
### Student Wizard Flow             │
/tramite/paso-1 (seleccionar) ◄─────┘
/tramite/paso-2 (requisitos)
/tramite/paso-3 (pago)
/tramite/paso-4 (documentos)
/tramite/paso-5 (revisar)
/tramite/paso-6 (exito)
  └── /seguimiento/:id

### Student Dashboard Flow
/estudiante/dashboard
  ├── /estudiante/mis-tramites
  ├── /estudiante/solicitudes
  ├── /estudiante/notificaciones
  ├── /estudiante/perfil
  ├── /seguimiento (track_my_procedure_search)
  │     └── /seguimiento/resultados
  │           └── /seguimiento/:id (procedure_detail_status_timeline)
  └── /observacion/:id (observation_detail)

### Admin Flow
/admin/dashboard
  ├── /admin/cola (pending_procedures_queue)
  ├── /admin/validacion (document_validation_screen)
  ├── /admin/procedimientos (procedure_management)
  ├── /admin/usuarios (user_management)
  ├── /admin/reportes (reports_and_statistics)
  └── /admin/detalle/:id (procedure_detail_review)
```

---

## STEP 3 — Functional Groups

| Group | Screens |
|---|---|
| 1. Acceso Público | home, login, registro, ayuda |
| 2. Catálogo TUPA | catalog (3 views), procedure detail, institutional framework |
| 3. Asistente Trámite | 6 wizard steps (unified) |
| 4. Pago y Documentos | paso-3, paso-4 |
| 5. Seguimiento | track search, results, timeline, observation |
| 6. Dashboard Estudiante | student dashboard, procedures, requests, notifications, profile |
| 7. Dashboard Admin | admin dashboard, pending queue, document validation, procedure mgmt, user mgmt |
| 8. Reportes | reports & statistics |

---

## STEP 4 — Shared Design System

**New file:** `shared/design-system.css`

Will replace duplicated Tailwind CDN config with:
- CSS Custom Properties (`:root {}`) for all design tokens
- Google Fonts import (Inter, Hanken Grotesk, JetBrains Mono, Material Symbols)
- Typography classes
- Spacing classes
- Component base styles (sidebar, topbar, cards, badges, buttons, forms, tables, timeline, stepper, modals)
- Scrollbar styles
- Animation utilities

**New file:** `shared/navigation.js`

Will provide:
- Centralized routing table (all 32 routes → file paths)
- `navigate(route)` function
- Active state management for sidebars
- Breadcrumb generation
- Wizard step controller
- Tab/view toggle controller

**New file:** `shared/components.js`

Will provide HTML template generators for:
- `StudentSidebar(activeItem)`
- `AdminSidebar(activeItem)`
- `PublicTopbar(activeItem)`
- `StudentTopbar()`
- `AdminTopbar()`
- `ProcedureCard(data)`
- `StatusBadge(status)`
- `TimelineItem(data)`
- `WizardStepper(currentStep)`
- `NotificationItem(data)`

---

## Proposed Changes

### [NEW] Shared Infrastructure

#### [NEW] shared/design-system.css
Single CSS file replacing all per-page Tailwind CDN calls. Contains all tokens, typography, component styles, animations.

#### [NEW] shared/navigation.js
Central router, active state, breadcrumbs, wizard controller.

#### [NEW] shared/components.js
Reusable HTML component generators (called by each page's `<script>`).

---

### [NEW] Master Entry Point

#### [NEW] index.html
Main entry point. Redirects to `tupa_central_home/code.html` or provides a prototype navigation panel for development.

---

### [MODIFY] All 41 `code.html` files

Each file will be updated to:
1. Replace `<script src="https://cdn.tailwindcss.com...">` + `<script id="tailwind-config">` with `<link rel="stylesheet" href="../shared/design-system.css">`
2. Add `<script src="../shared/components.js"></script>`
3. Add `<script src="../shared/navigation.js"></script>`
4. Replace hardcoded sidebar/topbar HTML with JS-generated shared components
5. Wire all navigation links, buttons, and CTAs to real routes
6. Standardize language to Spanish (ES) as primary
7. Add proper `<title>` and `<meta>` SEO tags

---

## Verification Plan

### Manual Verification
1. Open `index.html` in browser — verify landing page loads
2. Click Login → verify redirect to student or admin dashboard
3. Navigate catalog → click procedure → start wizard → complete all 6 steps → see success → reach tracking
4. Test admin flow: login as admin → see admin dashboard → navigate all admin sections
5. Verify sidebar active states update correctly on each screen
6. Test search/filter functionality on catalog
7. Verify all CTAs lead to valid screens (no dead ends)
8. Check responsive layout on mobile viewport

### Automated
- No build step required (static HTML prototype)
- Open `index.html` directly in any modern browser

---

## Open Questions

> [!IMPORTANT]
> **Language:** The wizard has both Spanish (`paso_X`) and English (`step_X`) duplicates. Should we:
> a) Keep Spanish only (recommended — consistent with UNSAAC context)
> b) Add a language toggle
> c) Keep both as separate routes

> [!NOTE]
> **Figma API Access:** If you can provide a Figma Personal Access Token, I can call the REST API to extract exact frame names and validate my mapping above. Command would be: `curl -H "X-Figma-Token: YOUR_TOKEN" "https://api.figma.com/v1/files/PsfoxVoyh6v3UdapMo3aw8?depth=2"`


prompt:
Resources

Figma (source of truth):
https://www.figma.com/design/PsfoxVoyh6v3UdapMo3aw8/Sistema-TUPA

Stitch source project:
https://stitch.withgoogle.com/projects/3252895439446176782

IMPORTANT:

Before making any modifications:

1. Confirm access to the Figma file.
2. Extract all page names.
3. Extract all frame names.
4. Extract the navigation structure.
5. Compare all Stitch screens against the Figma structure.
6. Produce the mapping report.

If the Figma file cannot be accessed:
STOP and report the issue.
Do not start implementation.

You are working on a university TUPA front-end prototype generated from Stitch and a final reference design in Figma.

Your objective is to refactor the Stitch-generated HTML prototype so it matches the Figma prototype as closely as possible in structure, screen organization, visual consistency, component architecture, and navigation behavior.

The final result must be a polished, fully navigable, front-end-only prototype.

==================================================
CRITICAL PRIORITY ORDER
=======================

Priority 1:
The Figma file is the single source of truth.
Whenever Stitch and Figma disagree, Figma wins.

Priority 2:
Match the visual design, structure, layout hierarchy, and navigation flow of the Figma prototype before performing any optimization.

Priority 3:
Create reusable shared components for repeated UI elements.

Priority 4:
Connect all screens into a fully navigable front-end prototype.

Priority 5:
Preserve existing animations, transitions, hover effects, and interactions from Stitch whenever they are compatible with the Figma design.

Do not spend significant effort redesigning screens that already match the Figma prototype.

==================================================
GENERAL RULES
=============

* The Figma design is the source of truth.
* Before changing code, identify every screen in the Stitch project and map it to the closest Figma frame by purpose and content.
* Use the exact Figma frame names whenever possible.

If the Figma contains:

* duplicate frame names
* ambiguous names
* placeholder names
* temporary design names

then create clear production-ready route names while preserving the original Figma frame names in the implementation report.

* If a Stitch screen does not match a Figma frame exactly, rename and adapt it to the closest Figma screen instead of inventing a new screen.
* Do not build backend logic.
* Do not create APIs.
* Do not create databases.
* Do not implement authentication.
* Keep everything front-end only and fully static.
* Preserve useful animations and transitions already present in Stitch unless they conflict with the Figma design system.

==================================================
STEP 0 — FIGMA ANALYSIS
=======================

Before modifying any code:

Analyze the Figma file and extract:

* page names
* frame names
* navigation structure
* design system patterns
* reusable UI components
* layout conventions
* typography hierarchy
* color system
* spacing system

Treat these findings as the canonical reference for the implementation.

==================================================
STEP 1 — SCREEN MAPPING REPORT
==============================

Before implementing any changes:

Create a mapping report containing:

1. Stitch screen name / file name
2. Matching Figma frame name
3. Screen purpose
4. Required changes
5. Parent screen
6. Child screens
7. Navigation triggers

For each screen identify:

* what must be removed
* what must be restyled
* what must be resized
* what must be reordered
* what must be renamed
* what must be connected
* what component can be reused

Do not start implementation until the mapping is complete.

==================================================
STEP 2 — NAVIGATION ARCHITECTURE
================================

Generate a complete navigation map before implementation.

For every screen identify:

* incoming navigation paths
* outgoing navigation paths
* sidebar links
* button destinations
* wizard flow transitions
* dashboard shortcuts

Build a complete screen relationship structure first.

Only after the navigation structure is defined should implementation begin.

==================================================
STEP 3 — REFACTOR BY FUNCTIONAL GROUPS
======================================

Group screens into:

1. Public access and login

2. TUPA catalog and procedure detail

3. Procedure submission wizard

4. Payment and document upload

5. Tracking and expediente timeline

6. Student dashboard

7. Administrative dashboard

8. Reports and notifications

==================================================
STEP 4 — CREATE A SHARED DESIGN SYSTEM
======================================

Apply one unified design system across all pages.

Standardize:

* sidebar
* top navigation
* typography
* spacing
* buttons
* cards
* badges
* status indicators
* forms
* tables
* modal windows
* drawers
* wizard steps
* timeline components
* dashboard widgets

If multiple visual versions of the same component exist:

keep the version that best matches Figma and remove the others.

==================================================
STEP 5 — COMPONENTIZATION
=========================

Convert repeated UI structures into reusable shared components.

Examples:

* Sidebar
* Topbar
* Dashboard cards
* Procedure cards
* Tables
* Filters
* Search bars
* Status badges
* Stepper/Wizard
* Notification items
* Timeline items
* Form controls

Avoid page-specific duplication.

Prioritize maintainability and consistency.

==================================================
STEP 6 — MAKE THE PROTOTYPE FULLY NAVIGABLE
===========================================

Connect screens so the prototype behaves like a real product.

Required navigation flow:

Login
→ Student Dashboard

Login
→ Administrative Dashboard

Public Entry
→ TUPA Catalog

TUPA Catalog
→ Procedure Detail

Procedure Detail
→ Start Procedure Wizard

Wizard Step 1
→ Wizard Step 2

Wizard Step 2
→ Payment

Payment
→ Document Upload

Document Upload
→ Review and Submit

Review and Submit
→ Submission Success

Submission Success
→ Tracking / Expediente Timeline

Student Dashboard
→ My Procedures

Student Dashboard
→ Notifications

Student Dashboard
→ Procedure Detail

Student Dashboard
→ Tracking

Administrative Dashboard
→ Pending Queue

Administrative Dashboard
→ Validate Documents

Administrative Dashboard
→ Reports

Administrative Dashboard
→ Procedure Detail

Tracking Search
→ Tracking Detail

Tracking Detail
→ Timeline View

Reports
→ Detailed Report Views

Ensure all menu items, cards, CTAs, buttons and actions lead somewhere meaningful.

Avoid dead-end screens.

==================================================
STEP 7 — SCREEN-SPECIFIC ADAPTATION RULES
=========================================

For each screen:

Maintain the original function.

Adapt the visual structure to match the Figma version.

Specific rules:

* If Stitch uses large procedure cards but Figma uses a compact catalog, convert to the compact catalog.
* If Stitch uses inconsistent sidebars, replace them with one shared sidebar component.
* If Stitch changes the stepper style between wizard steps, unify all steps into one stepper component.
* If Stitch contains decorative elements not present in Figma, remove them.
* If Stitch lacks interaction states, add hover, active, selected and disabled states.
* If Stitch contains inconsistent spacing, align it with the Figma spacing system.
* If Stitch contains inconsistent typography, align it with the Figma typography hierarchy.

==================================================
STEP 8 — PRESERVE GOOD STITCH WORK
==================================

Do not remove animations unnecessarily.

Preserve:

* hover states
* transitions
* animated cards
* loading states
* subtle motion
* micro-interactions

when they improve usability and remain consistent with the Figma design.

==================================================
STEP 9 — FINAL DELIVERABLE
==========================

Deliver:

* Unified HTML/CSS/JS prototype
* Fully connected navigation
* Shared reusable components
* Consistent design system
* Figma-aligned layouts
* Preserved animations
* No backend code
* No API implementation
* No database logic
* No duplicated styles across pages

==================================================
FINAL REPORT
============

At the end generate a concise implementation report containing:

1. Figma pages discovered
2. Figma frames discovered
3. Stitch-to-Figma screen mapping
4. Screens renamed
5. Screens merged
6. Screens split
7. Shared components created
8. Navigation flow implemented
9. Design system decisions
10. Animations preserved
11. Remaining inconsistencies (if any)

IMPORTANT:

Do not start by redesigning individual screens visually.

First:

1. Analyze Figma.
2. Analyze Stitch.
3. Build the screen mapping.
4. Build the navigation map.
5. Create the shared design system.
6. Componentize.
7. Refactor.
8. Connect screens.
9. Produce the final implementation report.

Now I have a clear picture. The shared infrastructure is **complete**, and only 2 screens have been converted (`login` + `student_dashboard`). I need to convert the remaining **39 screens**. Let me first check the index.html and student dashboard to understand the established pattern, then batch-write all remaining screens.

Viewed code.html:1-320
Viewed index.html:1-316

I have a complete picture. Now I'll create a task tracker and then batch-write all 39 remaining screens efficiently. Let me start immediately.

Edited task.md

Now let me write all screens in parallel batches. Starting with Batch 1 — Public Pages:

Edited code.html
Edited code.html
Edited code.html

Batch 1 done. Now Batch 2 — Catalog screens:

Edited code.html
Edited code.html
Edited code.html
Edited code.html
Edited code.html
Edited code.html

Batch 2 done. Now Batch 3 — Wizard Steps (6 Spanish steps + a redirect for paso_1_v2 + 6 English redirects):

Edited code.html
Edited code.html
Edited code.html
Edited code.html
Edited code.html
Edited code.html


Cotntinua

*Viewed [code.html](file:///d:/Ing%20de%20sistemas/Acad%C3%A9mico/INGENIERIA%20DE%20SISTEMAS%202023-1%20UNSAAC/CICLO%207/DESARROLLO%20DE%20SOFTWARE%20I/Proyecto-Semestral-TUPA-UNSAAC/stitch_institutional_tupa_portal/tupa_central_home/code.html) *

### User Input

Continue

### Planner Response

Continuing! I'll now write the remaining 23 screens: EN wizard redirects, Student Portal (9 screens), and Admin Portal (8 screens). Let me batch them all:

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

### Planner Response

All redirects done. Now Batch 4 — Student Portal (9 screens):

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

### Planner Response

Batch 4 done — Student portal complete! Now Batch 5 — Admin Portal:

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

*Edited relevant file*

### Planner Response

All 41 screens complete! Now let me update the task tracker to reflect full completion:

*Edited relevant file*

### User Input

continue

### Planner Response

All 41 screens are written. Now I need to verify the shared infrastructure is complete — the pages reference several functions (`renderWizardStepper`, `AdminSidebar`, `AdminTopbar`, `StatCard`, `DocumentItem`, `LoadingSpinner`, `TimelineItem`, `initTabs`, `initSearch`, `showModal`, `closeModal`) that must exist in the shared files. Let me read them and patch any gaps:

*Viewed [navigation.js](file:///d:/Ing%20de%20sistemas/Acad%C3%A9mico/INGENIERIA%20DE%20SISTEMAS%202023-1%20UNSAAC/CICLO%207/DESARROLLO%20DE%20SOFTWARE%20I/Proyecto-Semestral-TUPA-UNSAAC/stitch_institutional_tupa_portal/shared/navigation.js) *

*Viewed [components.js](file:///d:/Ing%20de%20sistemas/Acad%C3%A9mico/INGENIERIA%20DE%20SISTEMAS%202023-1%20UNSAAC/CICLO%207/DESARROLLO%20DE%20SOFTWARE%20I/Proyecto-Semestral-TUPA-UNSAAC/stitch_institutional_tupa_portal/shared/components.js) *

### Planner Response

Both files are complete. I see one gap: `navigation.js` has `openModal` but the pages call `showModal`. Let me also check that the `design-system.css` has all the missing classes (`badge-in-review`, `badge-blue`, `badge-warning`, `toggle-switch`, `file-upload-area`, `drag-over`, `animate-scale-in`, `animate-spin`, `w-full`, `flex-1`, `form-check`, `btn-warning`, `btn-error`), then fix all gaps in one pass:

*Viewed [design-system.css](file:///d:/Ing%20de%20sistemas/Acad%C3%A9mico/INGENIERIA%20DE%20SISTEMAS%202023-1%20UNSAAC/CICLO%207/DESARROLLO%20DE%20SOFTWARE%20I/Proyecto-Semestral-TUPA-UNSAAC/stitch_institutional_tupa_portal/shared/design-system.css) *

*Grep searched codebase*

*Grep searched codebase*

### Planner Response

Missing classes confirmed. Let me also check what badge/button classes already exist, then append a comprehensive patch:

*Grep searched codebase*

*Viewed [design-system.css](file:///d:/Ing%20de%20sistemas/Acad%C3%A9mico/INGENIERIA%20DE%20SISTEMAS%202023-1%20UNSAAC/CICLO%207/DESARROLLO%20DE%20SOFTWARE%20I/Proyecto-Semestral-TUPA-UNSAAC/stitch_institutional_tupa_portal/shared/design-system.css) *

### User Input

Continue

### Planner Response

I'll append all missing CSS classes to `design-system.css` and fix the `showModal` alias in `navigation.js`:

*Edited relevant file*

### Planner Response

Now fix the `showModal` alias in `navigation.js`:

*Edited relevant file*

### Planner Response

Now let me also check that the CSS has the critical structural classes (`app-layout`, `sidebar`, `main-content`, `card`, `topbar`, etc.) — and check if the `tramite.nuevo` route needs to be added to routes (pages use both `tramite.nuevo` and `estudiante.nueva`):

*Grep searched codebase*

*Grep searched codebase*

### Planner Response

Both are missing. Let me get the full picture of what structural CSS exists and find a good insertion point:

*Viewed [design-system.css](file:///d:/Ing%20de%20sistemas/Acad%C3%A9mico/INGENIERIA%20DE%20SISTEMAS%202023-1%20UNSAAC/CICLO%207/DESARROLLO%20DE%20SOFTWARE%20I/Proyecto-Semestral-TUPA-UNSAAC/stitch_institutional_tupa_portal/shared/design-system.css) *

### Planner Response

Good — `app-layout`, `main-content`, `sidebar`, `flex-1` etc. all already exist in lines 209–228. The patch I added duplicated some of these but that's harmless (CSS last-write wins for same-specificity). Now I need to add the missing `tramite.nuevo` route alias and also add the `student_dashboard_overview` page which was referenced but never confirmed created. Let me check:

*Listed directory [stitch_institutional_tupa_portal](file:///d:/Ing%20de%20sistemas/Acad%C3%A9mico/INGENIERIA%20DE%20SISTEMAS%202023-1%20UNSAAC/CICLO%207/DESARROLLO%20DE%20SOFTWARE%20I/Proyecto-Semestral-TUPA-UNSAAC/stitch_institutional_tupa_portal) *

### Planner Response

All directories exist. Let me check if `student_dashboard_overview` has a `code.html`:

*Listed directory [student_dashboard_overview](file:///d:/Ing%20de%20sistemas/Acad%C3%A9mico/INGENIERIA%20DE%20SISTEMAS%202023-1%20UNSAAC/CICLO%207/DESARROLLO%20DE%20SOFTWARE%20I/Proyecto-Semestral-TUPA-UNSAAC/stitch_institutional_tupa_portal/student_dashboard_overview) *

### Planner Response

Good — it already has a `code.html`. Now fix the two remaining issues: add the `tramite.nuevo` route alias in navigation.js and the `new_procedure_request` sidebar link in the student sidebar already uses `estudiante.nueva` → `new_procedure_request` correctly. Let me add the route alias and also add missing `tramite.nuevo` route to the route table:

*Edited relevant file*

### Planner Response

Good. Now let me do a final verification — open the prototype in browser to confirm everything renders correctly:

### Planner Response

The browser tool can't open `file://` URLs. Let me start a simple local HTTP server so the prototype can be previewed via browser instead:

*User accepted the command `python -m http.server 5500 --directory "d:\Ing de sistemas\Académico\INGENIERIA DE SISTEMAS 2023-1 UNSAAC\CICLO 7\DESARROLLO DE SOFTWARE I\Proyecto-Semestral-TUPA-UNSAAC\stitch_institutional_tupa_portal"`*

### Planner Response

All 6 screens verified at **5/5** quality with no errors. Let me now write the final walkthrough:

*Edited relevant file*

### Planner Response

The prototype is fully complete. Here's the final status:

---

## ✅ Prototype Complete — 41/41 Screens

The prototype is live at **http://127.0.0.1:5500/tupa_central_home/code.html** (server is running in background).

### What was done this session:

| Batch | Screens | Status |
|-------|---------|--------|
| Redirects | `paso_1_v2` + 6 EN wizard steps | ✅ |
| **Student Portal** | My Procedures, My Requests, Notifications, Profile, New Request, Observation Detail, Track Search, Track Results, Status Timeline | ✅ |
| **Admin Portal** | Dashboard, Pending Queue, Document Validation, Procedure Management, User Management, Reports & Statistics, Admin Detail Review | ✅ |
| **CSS Patch** | `badge-in-review`, `badge-blue`, `badge-warning`, `btn-warning`, `btn-error`, `btn-teal`, `toggle-switch`, `file-upload-area`, `animate-spin`, `filter-chip`, `alert-*`, pagination, `w-full`, stagger animations | ✅ |
| **JS Patch** | `showModal` alias, `tramite.nuevo` route | ✅ |

### Key highlights:
- **Admin Dashboard** — 5 KPI metrics, urgent queue table, system status, quick actions
- **Reports** — bar chart (monthly volume), donut chart (status distribution), top procedures table with trends
- **Document Validation** — per-document review, 3-tab decision panel (approve/observe/reject)
- **Expediente Timeline** — 6-step progress timeline with document sidebar and action buttons
- **Profile Settings** — 3 tabs with inline edit, password change, notification toggles

### User Input

como lo corro yo? o sea... en sí que es lo que hacemos? cual es... por así decirlo el main y a cual le digo abrir con live server?

### Planner Response

I will list the files in the directory to confirm the layout and explain exactly how the project is run and what its structure looks like.

*Listed directory [stitch_institutional_tupa_portal](file:///d:/Ing%20de%20sistemas/Acad%C3%A9mico/INGENIERIA%20DE%20SISTEMAS%202023-1%20UNSAAC/CICLO%207/DESARROLLO%20DE%20SOFTWARE%20I/Proyecto-Semestral-TUPA-UNSAAC/stitch_institutional_tupa_portal) *

### Planner Response

I will read the root `index.html` file to see how it acts as the entry point and where it redirects or links.

*Viewed [index.html](file:///d:/Ing%20de%20sistemas/Acad%C3%A9mico/INGENIERIA%20DE%20SISTEMAS%202023-1%20UNSAAC/CICLO%207/DESARROLLO%20DE%20SOFTWARE%20I/Proyecto-Semestral-TUPA-UNSAAC/stitch_institutional_tupa_portal/index.html) *

### Planner Response

I will view the rest of the `index.html` file to see the list of screens it provides at the bottom.

*Viewed [index.html](file:///d:/Ing%20de%20sistemas/Acad%C3%A9mico/INGENIERIA%20DE%20SISTEMAS%202023-1%20UNSAAC/CICLO%207/DESARROLLO%20DE%20SOFTWARE%20I/Proyecto-Semestral-TUPA-UNSAAC/stitch_institutional_tupa_portal/index.html) *

### Planner Response

¡Hola! El proyecto es un **prototipo interactivo completo del frontend** para el portal del TUPA (Trámite Único de Procedimientos Administrativos) de la UNSAAC. 

A continuación te detallo cómo correrlo y qué es lo que hace:

### 1. ¿Cuál es el "Main"?
El punto de entrada principal es el archivo `index.html` ubicado en la raíz del proyecto:
* 📂 **`stitch_institutional_tupa_portal/`[index.html](file:///d:/Ing%20de%20sistemas/Acad%C3%A9mico/INGENIERIA%20DE%20SISTEMAS%202023-1%20UNSAAC/CICLO%207/DESARROLLO%20DE%20SOFTWARE%20I/Proyecto-Semestral-TUPA-UNSAAC/stitch_institutional_tupa_portal/index.html)**

### 2. ¿Cómo abrirlo con Live Server?
1. Abre VS Code en la carpeta raíz `stitch_institutional_tupa_portal`.
2. Busca el archivo **`index.html`** de la raíz en tu explorador de archivos.
3. Haz clic derecho sobre él y selecciona **"Open with Live Server"**.
4. ¡Listo! Se abrirá en tu navegador web.

---

### ¿Qué es en sí lo que hace y cómo funciona?
Es una aplicación estática (HTML + Vanilla CSS + JavaScript compartido en la carpeta `shared`) estructurada por carpetas.

Al abrir el `index.html` verás:
* **Accesos rápidos superiores**: Botones para ir al portal público principal, iniciar sesión, etc.
* **Acceso a los 2 portales**:
  * **Portal Estudiantil**: Vista de trámites iniciados, solicitudes en borrador, centro de notificaciones, y configuración de perfil.
  * **Portal Administrativo**: Panel del administrador con estadísticas, cola de solicitudes urgentes, panel de validación de documentos y gestión de usuarios/procedimientos.
* **Panel de Navegación del Desarrollador (Abajo del todo)**: Si haces scroll hasta el final del `index.html`, verás un mapa completo con enlaces directos categorizados para **todas las 41 pantallas** (los catálogos públicos, pasos del wizard de pago y subida de documentos, bandeja de observaciones pendientes, etc.) para que puedas probar cualquier vista específica con un solo clic.

Toda la navegación entre pantallas funciona de forma interactiva usando rutas relativas en JS (`navigation.js`), permitiéndote simular los flujos completos de inicio de trámite y validación administrativa.