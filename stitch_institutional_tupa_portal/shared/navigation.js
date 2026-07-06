/* ============================================================
   TUPA UNSAAC — CENTRAL NAVIGATION ROUTER
   shared/navigation.js
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     ROUTE TABLE
     Maps logical route keys → relative file paths
     (paths are relative to the stitch_institutional_tupa_portal root)
  ---------------------------------------------------------- */
  const ROUTES = {
    // ── Public / Acceso ──────────────────────────────────────
    'home':                   '../tupa_central_home/code.html',
    'login':                  '../login_tupa_central/code.html',
    'registro':               '../create_account_user_type_selection/code.html',
    'ayuda':                  '../help_guidance_tupa_portal/code.html',

    // ── Catálogo Público ─────────────────────────────────────
    'catalogo':               '../tupa_catalog_public_portal/code.html',
    'catalogo.lista':         '../cat_logo_escalar_de_procedimientos_tupa/code.html',
    'catalogo.acordeon':      '../cat_logo_tupa_variante_acorde_n_es/code.html',
    'catalogo.cuadricula':    '../cat_logo_tupa_variante_cuadr_cula_es/code.html',
    'catalogo.marco':         '../institutional_administrative_framework/code.html',
    'catalogo.detalle':       '../procedure_detail_diploma_certification/code.html',

    // ── Asistente de Trámite (wizard) ─────────────────────────
    'tramite.paso1':          '../paso_1_seleccionar_procedimiento_es_1/code.html',
    'tramite.paso2':          '../paso_2_revisar_requisitos_es/code.html',
    'tramite.paso3':          '../paso_3_confirmaci_n_de_pago_es/code.html',
    'tramite.paso4':          '../paso_4_subir_documentos_es/code.html',
    'tramite.paso5':          '../paso_5_revisar_y_enviar_es/code.html',
    'tramite.paso6':          '../paso_6_env_o_exitoso_es/code.html',

    // ── Portal Estudiantil ───────────────────────────────────
    'estudiante.dashboard':   '../student_dashboard_overview/code.html',
    'estudiante.tramites':    '../my_procedures_tracker/code.html',
    'estudiante.solicitudes': '../my_requests_tracker/code.html',
    'estudiante.notificaciones': '../notifications_center/code.html',
    'estudiante.perfil':      '../my_profile_settings/code.html',
    'estudiante.nueva':       '../new_procedure_request/code.html',
    'tramite.nuevo':          '../new_procedure_request/code.html',
    'estudiante.observacion': '../observation_detail_pending_actions/code.html',

    // ── Seguimiento ──────────────────────────────────────────
    'seguimiento':            '../track_my_procedure_search/code.html',
    'seguimiento.resultados': '../search_results_procedure_tracking/code.html',
    'seguimiento.detalle':    '../procedure_detail_status_timeline/code.html',

    // ── Portal Administrativo ────────────────────────────────
    'admin.dashboard':        '../admin_dashboard/code.html',
    'admin.cola':             '../pending_procedures_queue/code.html',
    'admin.validacion':       '../document_validation_screen/code.html',
    'admin.procedimientos':   '../procedure_management/code.html',
    'admin.usuarios':         '../user_management/code.html',
    'admin.reportes':         '../reports_and_statistics/code.html',
    'admin.detalle':          '../procedure_detail_review/code.html',
  };

  /* ----------------------------------------------------------
     ROUTE METADATA
     Labels, icons, and parent for each route
  ---------------------------------------------------------- */
  const ROUTE_META = {
    'home':                   { label: 'Inicio',               icon: 'home',              parent: null },
    'login':                  { label: 'Iniciar Sesión',        icon: 'login',             parent: 'home' },
    'registro':               { label: 'Crear Cuenta',          icon: 'person_add',        parent: 'login' },
    'ayuda':                  { label: 'Ayuda',                 icon: 'help',              parent: 'home' },
    'catalogo':               { label: 'Catálogo TUPA',         icon: 'menu_book',         parent: 'home' },
    'catalogo.detalle':       { label: 'Detalle Procedimiento', icon: 'description',       parent: 'catalogo' },
    'tramite.paso1':          { label: 'Seleccionar Trámite',   icon: 'fact_check',        parent: 'catalogo.detalle' },
    'tramite.paso2':          { label: 'Revisar Requisitos',    icon: 'checklist',         parent: 'tramite.paso1' },
    'tramite.paso3':          { label: 'Confirmación de Pago',  icon: 'payments',          parent: 'tramite.paso2' },
    'tramite.paso4':          { label: 'Subir Documentos',      icon: 'upload_file',       parent: 'tramite.paso3' },
    'tramite.paso5':          { label: 'Revisar y Enviar',      icon: 'rate_review',       parent: 'tramite.paso4' },
    'tramite.paso6':          { label: 'Trámite Enviado',       icon: 'check_circle',      parent: null },
    'estudiante.dashboard':   { label: 'Dashboard',             icon: 'dashboard',         parent: null },
    'estudiante.tramites':    { label: 'Mis Trámites',          icon: 'description',       parent: 'estudiante.dashboard' },
    'estudiante.solicitudes': { label: 'Mis Solicitudes',       icon: 'assignment',        parent: 'estudiante.dashboard' },
    'estudiante.notificaciones':{ label: 'Notificaciones',      icon: 'notifications',     parent: 'estudiante.dashboard' },
    'estudiante.perfil':      { label: 'Mi Perfil',             icon: 'person',            parent: 'estudiante.dashboard' },
    'estudiante.nueva':       { label: 'Nueva Solicitud',       icon: 'add_circle',        parent: 'catalogo' },
    'tramite.nuevo':          { label: 'Nueva Solicitud',        icon: 'add_circle',        parent: 'estudiante.dashboard' },
    'estudiante.observacion': { label: 'Observación',           icon: 'rule',              parent: 'estudiante.tramites' },
    'seguimiento':            { label: 'Rastrear Trámite',      icon: 'location_searching',parent: 'home' },
    'seguimiento.resultados': { label: 'Resultados',            icon: 'search',            parent: 'seguimiento' },
    'seguimiento.detalle':    { label: 'Estado del Expediente', icon: 'timeline',          parent: 'seguimiento.resultados' },
    'admin.dashboard':        { label: 'Dashboard Admin',       icon: 'dashboard',         parent: null },
    'admin.cola':             { label: 'Cola de Pendientes',    icon: 'pending_actions',   parent: 'admin.dashboard' },
    'admin.validacion':       { label: 'Validar Documentos',    icon: 'fact_check',        parent: 'admin.dashboard' },
    'admin.procedimientos':   { label: 'Gestión de Trámites',   icon: 'manage_search',     parent: 'admin.dashboard' },
    'admin.usuarios':         { label: 'Usuarios',              icon: 'group',             parent: 'admin.dashboard' },
    'admin.reportes':         { label: 'Reportes',              icon: 'bar_chart',         parent: 'admin.dashboard' },
    'admin.detalle':          { label: 'Detalle Trámite',       icon: 'description',       parent: 'admin.cola' },
  };

  /* ----------------------------------------------------------
     CORE: navigate(routeKey)
  ---------------------------------------------------------- */
  window.navigate = function (routeKey) {
    const path = ROUTES[routeKey];
    if (!path) {
      console.warn('[TUPA Router] Unknown route:', routeKey);
      return;
    }
    window.location.href = path;
  };

  /* ----------------------------------------------------------
     CORE: navigateTo(absoluteOrRelativePath)
  ---------------------------------------------------------- */
  window.navigateTo = function (path) {
    window.location.href = path;
  };

  /* ----------------------------------------------------------
     ACTIVE SIDEBAR DETECTION
     Call this in each page's <script> with the current route key.
     It marks the matching sidebar link as active.
  ---------------------------------------------------------- */
  window.setActiveSidebarItem = function (routeKey) {
    document.querySelectorAll('.sidebar-link[data-route]').forEach(link => {
      const isActive = link.dataset.route === routeKey;
      link.classList.toggle('active', isActive);
    });
  };

  /* ----------------------------------------------------------
     BREADCRUMB BUILDER
     Generates breadcrumb HTML from a route key chain.
  ---------------------------------------------------------- */
  window.buildBreadcrumb = function (routeKey) {
    const crumbs = [];
    let key = routeKey;
    while (key) {
      const meta = ROUTE_META[key];
      if (!meta) break;
      crumbs.unshift({ key, label: meta.label, path: ROUTES[key] });
      key = meta.parent;
    }
    const el = document.getElementById('breadcrumb');
    if (!el) return;
    el.innerHTML = crumbs.map((c, i) => {
      const isLast = i === crumbs.length - 1;
      return isLast
        ? `<span class="current">${c.label}</span>`
        : `<a href="${c.path}">${c.label}</a>
           <span class="material-symbols-outlined">chevron_right</span>`;
    }).join('');
  };

  /* ----------------------------------------------------------
     WIZARD STEPPER CONTROLLER
  ---------------------------------------------------------- */
  const WIZARD_STEPS = [
    { step: 1, label: 'Seleccionar',  route: 'tramite.paso1', icon: 'fact_check' },
    { step: 2, label: 'Requisitos',   route: 'tramite.paso2', icon: 'checklist' },
    { step: 3, label: 'Pago',         route: 'tramite.paso3', icon: 'payments' },
    { step: 4, label: 'Documentos',   route: 'tramite.paso4', icon: 'upload_file' },
    { step: 5, label: 'Revisar',      route: 'tramite.paso5', icon: 'rate_review' },
    { step: 6, label: 'Confirmación', route: 'tramite.paso6', icon: 'check_circle' },
  ];

  window.renderWizardStepper = function (currentStep) {
    const container = document.getElementById('wizard-stepper');
    if (!container) return;
    let html = '<div class="stepper">';
    WIZARD_STEPS.forEach((s, i) => {
      const isDone    = s.step < currentStep;
      const isActive  = s.step === currentStep;
      const isPending = s.step > currentStep;
      const stateClass = isDone ? 'done' : isActive ? 'active' : 'pending';
      const dotContent = isDone
        ? `<span class="material-symbols-outlined icon-sm icon-filled">check</span>`
        : s.step.toString();
      const clickable = isDone ? `onclick="navigate('${s.route}')" style="cursor:pointer"` : '';
      html += `
        <div class="step-item" ${clickable}>
          <div class="step-circle ${stateClass}">${dotContent}</div>
          <span class="step-label ${stateClass} hide-mobile">${s.label}</span>
        </div>`;
      if (i < WIZARD_STEPS.length - 1) {
        html += `<div class="step-connector ${isDone ? 'done' : ''}"></div>`;
      }
    });
    html += '</div>';
    container.innerHTML = html;
  };

  window.wizardNext = function (currentStep) {
    const next = WIZARD_STEPS.find(s => s.step === currentStep + 1);
    if (next) navigate(next.route);
  };
  window.wizardBack = function (currentStep) {
    const prev = WIZARD_STEPS.find(s => s.step === currentStep - 1);
    if (prev) navigate(prev.route);
  };

  /* ----------------------------------------------------------
     SEARCH / FILTER UTILITY
  ---------------------------------------------------------- */
  window.initSearch = function (inputSelector, cardSelector) {
    const input = document.querySelector(inputSelector);
    if (!input) return;
    input.addEventListener('input', e => {
      const term = e.target.value.toLowerCase().trim();
      document.querySelectorAll(cardSelector).forEach(card => {
        const text = card.textContent.toLowerCase();
        const visible = !term || text.includes(term);
        card.style.display = visible ? '' : 'none';
        if (visible) card.classList.add('animate-fade-in');
      });
    });
  };

  /* ----------------------------------------------------------
     TABS CONTROLLER
  ---------------------------------------------------------- */
  window.initTabs = function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const tabs    = container.querySelectorAll('.tab-item');
    const panels  = container.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const target = document.getElementById(tab.dataset.tab);
        if (target) { target.classList.add('active'); target.classList.add('animate-fade-in'); }
      });
    });
    // Activate first tab by default
    if (tabs[0] && panels[0]) { tabs[0].classList.add('active'); panels[0].classList.add('active'); }
  };

  /* ----------------------------------------------------------
     MODAL CONTROLLER
  ---------------------------------------------------------- */
  window.openModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) { modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
  };
  // Alias so pages can use either showModal or openModal
  window.showModal = window.openModal;

  window.closeModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) { modal.classList.remove('open'); document.body.style.overflow = ''; }
  };
  // Close on overlay click
  document.addEventListener('click', e => {
    if (e.target.classList.contains('modal-overlay')) {
      e.target.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => {
        m.classList.remove('open'); document.body.style.overflow = '';
      });
    }
  });

  /* ----------------------------------------------------------
     DROPDOWN CONTROLLER
  ---------------------------------------------------------- */
  window.toggleDropdown = function (dropId) {
    const drop = document.getElementById(dropId);
    if (!drop) return;
    const isOpen = drop.style.display === 'block';
    // close all
    document.querySelectorAll('.dropdown-menu').forEach(d => d.style.display = 'none');
    if (!isOpen) drop.style.display = 'block';
  };
  document.addEventListener('click', e => {
    if (!e.target.closest('[data-dropdown]')) {
      document.querySelectorAll('.dropdown-menu').forEach(d => d.style.display = 'none');
    }
  });

  /* ----------------------------------------------------------
     FAB SPEED-DIAL
  ---------------------------------------------------------- */
  window.initFAB = function (fabId) {
    const fab = document.getElementById(fabId);
    if (!fab) return;
    const btn   = fab.querySelector('.fab-btn');
    const items = fab.querySelector('.fab-items');
    if (!btn || !items) return;
    let open = false;
    btn.addEventListener('click', () => {
      open = !open;
      items.style.display = open ? 'flex' : 'none';
      btn.style.transform = open ? 'rotate(45deg)' : '';
    });
  };

  /* ----------------------------------------------------------
     TOPBAR SEARCH — trigger via Enter
  ---------------------------------------------------------- */
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const active = document.activeElement;
      if (active && active.dataset && active.dataset.searchRoute) {
        navigate(active.dataset.searchRoute);
      }
    }
  });

  /* ----------------------------------------------------------
     PAGE INIT
     Each page calls window.initPage({ route, pageTitle })
  ---------------------------------------------------------- */
  window.initPage = function ({ route, pageTitle } = {}) {
    // Set document title
    if (pageTitle) document.title = `${pageTitle} | TUPA UNSAAC`;

    // Mark active sidebar item
    if (route) setActiveSidebarItem(route);

    // Build breadcrumb
    if (route) buildBreadcrumb(route);

    // Animate page content in
    document.querySelectorAll('.animate-on-load').forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      setTimeout(() => {
        el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 80 + i * 60);
    });

    // Wire sidebar logout
    document.querySelectorAll('[data-action="logout"]').forEach(el => {
      el.addEventListener('click', () => navigate('login'));
    });
    // Wire sidebar help
    document.querySelectorAll('[data-action="ayuda"]').forEach(el => {
      el.addEventListener('click', () => navigate('ayuda'));
    });
  };

  /* ----------------------------------------------------------
     CARD MICRO-INTERACTIONS
  ---------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.card-hover, .procedure-card, .stat-card').forEach(card => {
      card.addEventListener('mousedown', () => { card.style.transform = 'scale(0.98) translateY(-1px)'; });
      card.addEventListener('mouseup',   () => { card.style.transform = ''; });
      card.addEventListener('mouseleave',() => { card.style.transform = ''; });
    });
  });

  /* ----------------------------------------------------------
     NOTIFICATION COUNTER (demo)
  ---------------------------------------------------------- */
  window.setNotificationCount = function (count) {
    document.querySelectorAll('.notif-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? '' : 'none';
    });
  };

})();
