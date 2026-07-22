# Walkthrough — TUPA UNSAAC Prototype Refactoring

## What Was Built

A fully navigable, Figma-aligned static HTML prototype of the **TUPA UNSAAC** institutional portal, replacing the Stitch-generated originals with a cohesive design system.

---

## Verification Results

All screens tested at **http://127.0.0.1:5500** — zero console errors (only the expected `favicon.ico` 404).

| Screen | Rating | Notes |
|--------|--------|-------|
| Landing page | 5/5 | Hero, cards, public topbar |
| Login | 5/5 | Split layout, role selector, SSO option |
| Student Dashboard | 5/5 | Navy sidebar, topbar, stats, wizard shortcut |
| Admin Dashboard | 5/5 | 5 KPI cards, queue table, quick actions |
| Reports & Stats | 5/5 | Bar chart, donut, top procedures table |
| Expediente Detail Timeline | 5/5 | Progress bar, 6-step timeline, sidebar |

---

## Screenshots

````carousel
![Landing page](C:/Users/diego/.gemini/antigravity-ide/brain/9b57fd42-bbff-4c36-aebd-c2c49921eeba/tupa_home_1780639018733.png)
<!-- slide -->
![Login page](C:/Users/diego/.gemini/antigravity-ide/brain/9b57fd42-bbff-4c36-aebd-c2c49921eeba/tupa_login_1780639028204.png)
<!-- slide -->
![Student Dashboard](C:/Users/diego/.gemini/antigravity-ide/brain/9b57fd42-bbff-4c36-aebd-c2c49921eeba/tupa_student_dash_1780639036459.png)
<!-- slide -->
![Admin Dashboard](C:/Users/diego/.gemini/antigravity-ide/brain/9b57fd42-bbff-4c36-aebd-c2c49921eeba/tupa_admin_dash_1780639045473.png)
<!-- slide -->
![Reports & Statistics](C:/Users/diego/.gemini/antigravity-ide/brain/9b57fd42-bbff-4c36-aebd-c2c49921eeba/tupa_reports_1780639054172.png)
<!-- slide -->
![Expediente Timeline](C:/Users/diego/.gemini/antigravity-ide/brain/9b57fd42-bbff-4c36-aebd-c2c49921eeba/tupa_timeline_1780639063788.png)
````

---

## Shared Infrastructure

| File | Purpose |
|------|---------|
| [design-system.css](file:///d:/Ing%20de%20sistemas/Acad%C3%A9mico/INGENIERIA%20DE%20SISTEMAS%202023-1%20UNSAAC/CICLO%207/DESARROLLO%20DE%20SOFTWARE%20I/Proyecto-Semestral-TUPA-UNSAAC/stitch_institutional_tupa_portal/shared/design-system.css) | Design tokens, typography, layout, all component classes |
| [navigation.js](file:///d:/Ing%20de%20sistemas/Acad%C3%A9mico/INGENIERIA%20DE%20SISTEMAS%202023-1%20UNSAAC/CICLO%207/DESARROLLO%20DE%20SOFTWARE%20I/Proyecto-Semestral-TUPA-UNSAAC/stitch_institutional_tupa_portal/shared/navigation.js) | Route table, breadcrumbs, wizard stepper, tabs, modals, search, toasts |
| [components.js](file:///d:/Ing%20de%20sistemas/Acad%C3%A9mico/INGENIERIA%20DE%20SISTEMAS%202023-1%20UNSAAC/CICLO%207/DESARROLLO%20DE%20SOFTWARE%20I/Proyecto-Semestral-TUPA-UNSAAC/stitch_institutional_tupa_portal/shared/components.js) | StudentSidebar, AdminSidebar, PublicTopbar, StudentTopbar, AdminTopbar, StatCard, TimelineItem, DocumentItem, NotificationItem, Toast |

---

## Screen Count: 41 Total

### Public Portal (4 canonical)
- Landing · Login · Registration · Help

### Catalog (6 canonical)
- Catalog hub · List view · Accordion view · Grid view · Institutional Framework · Procedure Detail (Diploma)

### Wizard — Spanish (6 canonical) + 7 redirects
- Paso 1–6 (Spanish canonical) · Paso 1 v2 (redirect) · Steps 1–6 EN (redirects to ES)

### Student Portal (9 canonical)
- Dashboard · Mis Trámites · Mis Solicitudes · Notificaciones · Mi Perfil · Nueva Solicitud · Observación · Rastrear Trámite · Resultados · Detalle/Timeline

### Admin Portal (8 canonical)
- Dashboard · Cola de Pendientes · Validación de Documentos · Gestión de Procedimientos · Gestión de Usuarios · Reportes · Detalle Administrativo · Overview (redirect)

---

## Navigation Graph

```mermaid
graph TD
    HOME[Landing] --> LOGIN[Login]
    HOME --> CAT[Catálogo]
    HOME --> TRACK[Rastrear]
    LOGIN --> STUD[Student Dashboard]
    LOGIN --> ADMIN[Admin Dashboard]
    CAT --> DETAIL[Procedure Detail]
    DETAIL --> W1[Paso 1: Seleccionar]
    W1 --> W2[Paso 2: Requisitos]
    W2 --> W3[Paso 3: Pago]
    W3 --> W4[Paso 4: Documentos]
    W4 --> W5[Paso 5: Revisar]
    W5 --> W6[Paso 6: Enviado]
    W6 --> TRACK
    STUD --> TRAMITES[Mis Trámites]
    STUD --> SOLICITUDES[Mis Solicitudes]
    STUD --> NOTIFS[Notificaciones]
    STUD --> PERFIL[Mi Perfil]
    STUD --> OBS[Observación]
    TRACK --> RES[Resultados] --> TIMELINE[Detalle/Timeline]
    ADMIN --> COLA[Cola Pendientes]
    ADMIN --> VALID[Validación Docs]
    ADMIN --> PROCS[Gestión Trámites]
    ADMIN --> USERS[Gestión Usuarios]
    ADMIN --> REPORTS[Reportes]
    COLA --> ADETALLE[Detalle Admin]
    ADETALLE --> VALID
```

---

## How to Run

```bash
# In the stitch_institutional_tupa_portal folder:
python -m http.server 5500
# Then open: http://127.0.0.1:5500/tupa_central_home/code.html
```

Or open any `code.html` file directly in a browser — navigation uses relative paths so it works without a server too.

---

> **Figma source of truth:** [Sistema TUPA](https://www.figma.com/design/PsfoxVoyh6v3UdapMo3aw8/Sistema-TUPA)  
> **All content is static/front-end only — no backend, no database, no authentication implemented.**
