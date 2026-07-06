---
name: Institutional Administrative Framework
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#43474e'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#455f88'
  primary: '#002045'
  on-primary: '#ffffff'
  primary-container: '#1a365d'
  on-primary-container: '#86a0cd'
  inverse-primary: '#adc7f7'
  secondary: '#5c5f61'
  on-secondary: '#ffffff'
  secondary-container: '#e0e3e5'
  on-secondary-container: '#626567'
  tertiary: '#002522'
  on-tertiary: '#ffffff'
  tertiary-container: '#003d37'
  on-tertiary-container: '#3cafa2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#adc7f7'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#2d476f'
  secondary-fixed: '#e0e3e5'
  secondary-fixed-dim: '#c4c7c9'
  on-secondary-fixed: '#191c1e'
  on-secondary-fixed-variant: '#444749'
  tertiary-fixed: '#89f5e7'
  tertiary-fixed-dim: '#6bd8cb'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#005049'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding-desktop: 32px
  container-padding-mobile: 16px
  gutter: 24px
  sidebar-width: 280px
  stack-sm: 4px
  stack-md: 12px
  stack-lg: 24px
---

## Brand & Style

This design system is engineered for high-stakes administrative environments where clarity, legal compliance, and user efficiency are paramount. The brand personality is **authoritative yet accessible**, moving away from archaic bureaucratic aesthetics toward a **modern SaaS-inspired interface**. 

The design style follows a **Corporate / Modern** approach with a focus on:
- **Functional Professionalism:** Every element serves a purpose in the TUPA lifecycle, prioritizing data density without sacrificing legibility.
- **Trustworthy Transparency:** High-contrast layouts and clear hierarchies ensure that administrative procedures are easy to audit and follow.
- **Efficient Workflows:** A systematic interface that reduces cognitive load for university staff managing complex procedural texts.

## Colors

The palette is anchored by **Deep Institutional Blue**, evoking stability and the formal nature of university regulations.

- **Primary (#1A365D):** Used for navigation sidebars, primary action buttons, and active state indicators. It provides the "institutional weight" of the platform.
- **Surface/Secondary (#F8FAFC):** A cool-toned light gray used for the main application background to separate the canvas from white content cards.
- **Accent/Success (#0D9488):** A professional Teal used specifically for "Approved" statuses, completed wizard steps, and positive reinforcement.
- **Neutral (#64748B):** A balanced Slate used for secondary text, icons, and inactive states.

High contrast is maintained by ensuring all text on white backgrounds meets WCAG AA standards, using the primary blue for critical information.

## Typography

The typography system utilizes **Hanken Grotesk** for headings to provide a sharp, contemporary "tech" feel to the institutional brand. **Inter** is used for all functional body and UI text due to its exceptional legibility in data-heavy SaaS environments.

- **Headlines:** Use Hanken Grotesk with tight letter-spacing for a modern, structured look.
- **Body:** Inter is the workhorse for procedure descriptions and requirements lists.
- **Labels:** Used for table headers, status badges, and button text, prioritizing uppercase or medium weights for distinction.
- **Monospace:** JetBrains Mono is introduced sparingly for procedural codes (e.g., TUPA ID numbers) to denote technical or systemic references.

## Layout & Spacing

The design system employs a **Fixed Grid** philosophy for the main content area to ensure readability of long-form legal text, while the interface wrappers (sidebars/topbars) remain fluid.

- **Grid:** A 12-column grid is used for the main dashboard content.
- **Sidebar:** A fixed 280px left-hand navigation allows for deep nesting of administrative categories.
- **Content Max-Width:** Data tables and procedural documents are capped at 1280px to prevent excessive line lengths on ultra-wide monitors.
- **Rhythm:** An 8px linear scale drives all padding and margins. Vertical rhythm in wizards and forms should favor "generous" spacing (24px+) to prevent the interface from feeling cluttered or overwhelming.

## Elevation & Depth

This design system uses **Tonal Layers** combined with **Ambient Shadows** to create a clean, organized hierarchy.

- **Level 0 (Background):** The Secondary Color (#F8FAFC) acts as the canvas.
- **Level 1 (Cards):** Pure white surfaces (#FFFFFF) with a soft, 10% opacity shadow (0px 4px 12px) and a subtle 1px border (#E2E8F0).
- **Level 2 (Modals/Dropdowns):** Deeper shadows (0px 12px 24px) to indicate high-priority interaction.
- **Interaction:** Hover states on interactive cards should see a subtle increase in shadow spread and a primary-colored border-left (4px) to indicate focus.

## Shapes

The shape language is **Rounded (0.5rem)**, striking a balance between the friendliness of modern SaaS and the structural integrity required for an institutional platform.

- **Components:** Standard buttons and input fields use 8px (0.5rem) corners.
- **Containers:** Large content cards and modals use 16px (1rem) for a distinct "app-like" feel.
- **Status Badges:** Use a full-pill radius (9999px) to differentiate them from interactive buttons.

## Components

### Navigation & Layout
- **Sidebar:** Dark theme (Primary Blue) with light text. Active items use a high-contrast teal indicator.
- **Top Navigation:** Breadcrumbs are essential here to show the hierarchy of the TUPA (e.g., Faculty > Administrative Unit > Procedure).

### Data & Status
- **Data Tables:** Minimalist style. No vertical borders; only 1px horizontal dividers. Header row uses a subtle gray background with Bold Inter labels.
- **Status Badges:** Use soft background tints with high-contrast text. 
    - *Draft:* Gray background / Dark Gray text.
    - *Under Review:* Blue background / Primary Blue text.
    - *Approved:* Teal background / Dark Teal text.
- **Timelines:** Vertical tracks showing the history of procedure updates. Nodes should be icon-based to distinguish between "Edit," "Approval," and "Publication."

### Inputs & Actions
- **Wizards:** For creating or editing procedures. Use a horizontal stepper at the top with a "stick-to-bottom" action bar containing "Save Draft," "Back," and "Continue."
- **Buttons:** Primary buttons are solid Primary Blue. Secondary buttons are outlined with a 1px slate border.
- **Input Fields:** Large, 44px height fields with clear placeholder text. Focus states use a 2px Primary Blue glow.