/* ============================================================
   TUPA UNSAAC — SHARED HTML COMPONENTS
   shared/components.js
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     STUDENT SIDEBAR
  ---------------------------------------------------------- */
  window.StudentSidebar = function ({ activeRoute = '', userName = 'Estudiante', userRole = 'Pregrado', notifCount = 2 } = {}) {
    return `
<aside class="sidebar" id="student-sidebar" aria-label="Menú de navegación estudiantil">
  <div class="sidebar-brand">
    <div class="sidebar-brand-icon">
      <span class="material-symbols-outlined icon-filled">account_balance</span>
    </div>
    <div>
      <div class="sidebar-brand-title">TUPA Student</div>
      <div class="sidebar-brand-subtitle">Portal Estudiantil · UNSAAC</div>
    </div>
  </div>

  <button class="sidebar-new-btn" onclick="navigate('tramite.paso1')" aria-label="Iniciar nuevo trámite">
    <span class="material-symbols-outlined icon-sm">add</span>
    Nuevo Trámite
  </button>

  <span class="sidebar-section-label">Principal</span>
  <nav class="sidebar-nav">
    <a class="sidebar-link ${activeRoute === 'estudiante.dashboard' ? 'active' : ''}"
       data-route="estudiante.dashboard"
       onclick="navigate('estudiante.dashboard')" href="#" aria-current="${activeRoute === 'estudiante.dashboard' ? 'page' : 'false'}">
      <span class="material-symbols-outlined">dashboard</span>
      <span>Dashboard</span>
    </a>
    <a class="sidebar-link ${activeRoute === 'catalogo' ? 'active' : ''}"
       data-route="catalogo"
       onclick="navigate('catalogo')" href="#" aria-current="${activeRoute === 'catalogo' ? 'page' : 'false'}">
      <span class="material-symbols-outlined">menu_book</span>
      <span>Catálogo TUPA</span>
    </a>
    <a class="sidebar-link ${activeRoute === 'estudiante.tramites' ? 'active' : ''}"
       data-route="estudiante.tramites"
       onclick="navigate('estudiante.tramites')" href="#" aria-current="${activeRoute === 'estudiante.tramites' ? 'page' : 'false'}">
      <span class="material-symbols-outlined">description</span>
      <span>Mis Trámites</span>
    </a>
    <a class="sidebar-link ${activeRoute === 'estudiante.solicitudes' ? 'active' : ''}"
       data-route="estudiante.solicitudes"
       onclick="navigate('estudiante.solicitudes')" href="#" aria-current="${activeRoute === 'estudiante.solicitudes' ? 'page' : 'false'}">
      <span class="material-symbols-outlined">assignment</span>
      <span>Mis Solicitudes</span>
    </a>
    <a class="sidebar-link ${activeRoute === 'seguimiento' ? 'active' : ''}"
       data-route="seguimiento"
       onclick="navigate('seguimiento')" href="#" aria-current="${activeRoute === 'seguimiento' ? 'page' : 'false'}">
      <span class="material-symbols-outlined">location_searching</span>
      <span>Rastrear Trámite</span>
    </a>
    <a class="sidebar-link ${activeRoute === 'estudiante.notificaciones' ? 'active' : ''}"
       data-route="estudiante.notificaciones"
       onclick="navigate('estudiante.notificaciones')" href="#" aria-current="${activeRoute === 'estudiante.notificaciones' ? 'page' : 'false'}">
      <span class="material-symbols-outlined">notifications</span>
      <span>Notificaciones</span>
      ${notifCount > 0 ? `<span class="badge" aria-label="${notifCount} notificaciones">${notifCount}</span>` : ''}
    </a>
  </nav>

  <span class="sidebar-section-label">Cuenta</span>
  <div class="sidebar-footer">
    <a class="sidebar-link ${activeRoute === 'estudiante.perfil' ? 'active' : ''}"
       data-route="estudiante.perfil"
       onclick="navigate('estudiante.perfil')" href="#">
      <span class="material-symbols-outlined">person</span>
      <span>Mi Perfil</span>
    </a>
    <a class="sidebar-link" data-action="ayuda" href="#">
      <span class="material-symbols-outlined">help</span>
      <span>Centro de Ayuda</span>
    </a>
    <a class="sidebar-link" data-action="logout" href="#" style="color:rgba(255,255,255,0.45)">
      <span class="material-symbols-outlined">logout</span>
      <span>Cerrar Sesión</span>
    </a>
  </div>
</aside>`;
  };

  /* ----------------------------------------------------------
     ADMIN SIDEBAR
  ---------------------------------------------------------- */
  window.AdminSidebar = function ({ activeRoute = '', pendingCount = 12 } = {}) {
    return `
<aside class="sidebar" id="admin-sidebar" aria-label="Menú de administración">
  <div class="sidebar-brand">
    <div class="sidebar-brand-icon">
      <span class="material-symbols-outlined icon-filled">admin_panel_settings</span>
    </div>
    <div>
      <div class="sidebar-brand-title">TUPA Admin</div>
      <div class="sidebar-brand-subtitle">Portal Administrativo · UNSAAC</div>
    </div>
  </div>

  <span class="sidebar-section-label">Gestión</span>
  <nav class="sidebar-nav">
    <a class="sidebar-link ${activeRoute === 'admin.dashboard' ? 'active' : ''}"
       data-route="admin.dashboard"
       onclick="navigate('admin.dashboard')" href="#" aria-current="${activeRoute === 'admin.dashboard' ? 'page' : 'false'}">
      <span class="material-symbols-outlined">dashboard</span>
      <span>Dashboard</span>
    </a>
    <a class="sidebar-link ${activeRoute === 'admin.cola' ? 'active' : ''}"
       data-route="admin.cola"
       onclick="navigate('admin.cola')" href="#" aria-current="${activeRoute === 'admin.cola' ? 'page' : 'false'}">
      <span class="material-symbols-outlined">pending_actions</span>
      <span>Cola de Pendientes</span>
      ${pendingCount > 0 ? `<span class="badge" aria-label="${pendingCount} pendientes">${pendingCount}</span>` : ''}
    </a>
    <a class="sidebar-link ${activeRoute === 'admin.validacion' ? 'active' : ''}"
       data-route="admin.validacion"
       onclick="navigate('admin.validacion')" href="#" aria-current="${activeRoute === 'admin.validacion' ? 'page' : 'false'}">
      <span class="material-symbols-outlined">fact_check</span>
      <span>Validar Documentos</span>
    </a>
    <a class="sidebar-link ${activeRoute === 'admin.procedimientos' ? 'active' : ''}"
       data-route="admin.procedimientos"
       onclick="navigate('admin.procedimientos')" href="#" aria-current="${activeRoute === 'admin.procedimientos' ? 'page' : 'false'}">
      <span class="material-symbols-outlined">manage_search</span>
      <span>Gestión de Trámites</span>
    </a>
    <a class="sidebar-link ${activeRoute === 'admin.usuarios' ? 'active' : ''}"
       data-route="admin.usuarios"
       onclick="navigate('admin.usuarios')" href="#" aria-current="${activeRoute === 'admin.usuarios' ? 'page' : 'false'}">
      <span class="material-symbols-outlined">group</span>
      <span>Usuarios</span>
    </a>
    <a class="sidebar-link ${activeRoute === 'admin.reportes' ? 'active' : ''}"
       data-route="admin.reportes"
       onclick="navigate('admin.reportes')" href="#" aria-current="${activeRoute === 'admin.reportes' ? 'page' : 'false'}">
      <span class="material-symbols-outlined">bar_chart</span>
      <span>Reportes y Estadísticas</span>
    </a>
    <a class="sidebar-link ${activeRoute === 'catalogo' ? 'active' : ''}"
       data-route="catalogo"
       onclick="navigate('catalogo')" href="#" aria-current="${activeRoute === 'catalogo' ? 'page' : 'false'}">
      <span class="material-symbols-outlined">menu_book</span>
      <span>Catálogo TUPA</span>
    </a>
  </nav>

  <span class="sidebar-section-label">Sistema</span>
  <div class="sidebar-footer">
    <a class="sidebar-link" data-action="ayuda" href="#">
      <span class="material-symbols-outlined">help</span>
      <span>Soporte Técnico</span>
    </a>
    <a class="sidebar-link" data-action="logout" href="#" style="color:rgba(255,255,255,0.45)">
      <span class="material-symbols-outlined">logout</span>
      <span>Cerrar Sesión</span>
    </a>
  </div>
</aside>`;
  };

  /* ----------------------------------------------------------
     STUDENT TOPBAR
  ---------------------------------------------------------- */
  window.StudentTopbar = function ({ title = '', userName = 'Elena Rodríguez', userRole = 'Ingeniería', searchRoute = 'seguimiento', notifCount = 2 } = {}) {
    return `
<header class="topbar" role="banner">
  <div class="topbar-left">
    ${title ? `<span class="topbar-title">${title}</span><div class="topbar-divider"></div>` : ''}
    <div class="topbar-search">
      <span class="material-symbols-outlined">search</span>
      <input type="text" placeholder="Buscar trámites, expedientes..." data-search-route="${searchRoute}"
             aria-label="Buscar trámites" autocomplete="off" />
    </div>
  </div>
  <div class="topbar-right">
    <button class="topbar-icon-btn" onclick="navigate('estudiante.notificaciones')" aria-label="Notificaciones" title="Notificaciones">
      <span class="material-symbols-outlined">notifications</span>
      ${notifCount > 0 ? `<span class="dot" aria-hidden="true"></span>` : ''}
    </button>
    <button class="topbar-icon-btn" onclick="navigate('ayuda')" aria-label="Ayuda" title="Ayuda">
      <span class="material-symbols-outlined">help_outline</span>
    </button>
    <div class="topbar-divider"></div>
    <div class="topbar-user" onclick="navigate('estudiante.perfil')" role="button" tabindex="0" aria-label="Perfil de usuario">
      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdNZNqAGjEbbysJ3e6HQEaBbCWNr3cllurvNCfzTbxvmULXt7YBDEyj4adVi7enfpjQk_ovZgmIe4MdhfGH4KI8keorAumFafeMuQjGph706x3H_cowOaC6gcNFGh5AK4LQJwm2iWLosh09vqmJjx3PlhDOMiUm1CRSjpNLmptH_DO6H4NVjT5GvaAzii5phVRCdb4PPd5QCurWbRvWwnYd1f5JqdDeYwwRA2rgSxliqrQB12hFQ2V5OD-C1Zr-YXFPk093ib_vV0"
           alt="Foto de perfil de ${userName}" />
      <div class="topbar-user-info hide-mobile">
        <div class="topbar-user-name">${userName}</div>
        <div class="topbar-user-role">${userRole}</div>
      </div>
    </div>
  </div>
</header>`;
  };

  /* ----------------------------------------------------------
     ADMIN TOPBAR
  ---------------------------------------------------------- */
  window.AdminTopbar = function ({ title = 'Panel Administrativo', userName = 'Alex Rivera', userRole = 'Administrador', notifCount = 3 } = {}) {
    return `
<header class="topbar" role="banner">
  <div class="topbar-left">
    <span class="topbar-title">${title}</span>
    <div class="topbar-divider"></div>
    <div class="topbar-search">
      <span class="material-symbols-outlined">search</span>
      <input type="text" placeholder="Buscar trámites, usuarios, reportes..." aria-label="Buscar" autocomplete="off" />
    </div>
  </div>
  <div class="topbar-right">
    <button class="topbar-icon-btn" aria-label="Notificaciones" title="Notificaciones">
      <span class="material-symbols-outlined">notifications</span>
      ${notifCount > 0 ? `<span class="dot" aria-hidden="true"></span>` : ''}
    </button>
    <button class="topbar-icon-btn" onclick="navigate('ayuda')" aria-label="Ayuda" title="Ayuda">
      <span class="material-symbols-outlined">help_outline</span>
    </button>
    <div class="topbar-divider"></div>
    <div class="topbar-user" role="button" tabindex="0" aria-label="Perfil de administrador">
      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCA0fgWMbN_5A9Pg3l3s3APHcaAF9qZuT5OfYJCmZY7PWzSWDjUQPcpoo6zU18UTP7Zf337-IYff8t6hmm0MTmLPOS0YGTwVsV8FHphPmY2odcC4mU2zCcXJax1IlTsEDDg95WjHkWReQqIjXoTseRGi1L6t6Ag_qm_0vnXppTTDtwSrP08GfqGAcNlRbSGHflMHNYMYCpPhlLVJQa-kxZ0PfrD3Pfqclwz4VShmUZ3q_4iQ4XdZxBgi3nT3mYkJcri-OLwgR4NxQo"
           alt="Foto de perfil de ${userName}" />
      <div class="topbar-user-info hide-mobile">
        <div class="topbar-user-name">${userName}</div>
        <div class="topbar-user-role">${userRole}</div>
      </div>
    </div>
  </div>
</header>`;
  };

  /* ----------------------------------------------------------
     PUBLIC TOPBAR
  ---------------------------------------------------------- */
  window.PublicTopbar = function ({ activeNav = 'catalogo' } = {}) {
    const navItems = [
      { key: 'home',        label: 'Inicio',         route: 'home' },
      { key: 'catalogo',    label: 'Catálogo',       route: 'catalogo' },
      { key: 'seguimiento', label: 'Rastrear',        route: 'seguimiento' },
      { key: 'ayuda',       label: 'Ayuda',           route: 'ayuda' },
    ];
    return `
<header class="public-topbar" role="banner">
  <div class="public-topbar-inner">
    <div class="public-topbar-brand" onclick="navigate('home')" style="cursor:pointer" role="link" tabindex="0">
      <div class="brand-icon">
        <span class="material-symbols-outlined icon-filled" style="color:white">account_balance</span>
      </div>
      <span class="brand-name">TUPA UNSAAC</span>
    </div>
    <nav class="public-topbar-nav hide-mobile" aria-label="Navegación principal">
      ${navItems.map(item => `
        <a class="${activeNav === item.key ? 'active' : ''}"
           onclick="navigate('${item.route}')" href="#"
           aria-current="${activeNav === item.key ? 'page' : 'false'}">${item.label}</a>
      `).join('')}
    </nav>
    <div style="display:flex;align-items:center;gap:8px">
      <button class="btn btn-outline btn-sm" onclick="navigate('login')">
        <span class="material-symbols-outlined">login</span>
        Ingresar
      </button>
      <button class="btn btn-primary btn-sm hide-mobile" onclick="navigate('registro')">
        Registrarse
      </button>
    </div>
  </div>
</header>`;
  };

  /* ----------------------------------------------------------
     SHARED FOOTER
  ---------------------------------------------------------- */
  window.SharedFooter = function () {
    return `
<footer class="footer" role="contentinfo">
  <div>
    <div class="footer-brand">TUPA UNSAAC</div>
    <div class="footer-copy">© 2024 Universidad Nacional de San Antonio Abad del Cusco. Todos los derechos reservados.</div>
  </div>
  <nav class="footer-links" aria-label="Links de pie de página">
    <a onclick="navigate('ayuda')" href="#">Centro de Ayuda</a>
    <a href="#">Política de Privacidad</a>
    <a href="#">Términos de Uso</a>
    <a href="#">Portal de Transparencia</a>
    <a onclick="navigate('home')" href="#">Inicio</a>
  </nav>
</footer>`;
  };

  /* ----------------------------------------------------------
     PROCEDURE CARD (catalog view)
  ---------------------------------------------------------- */
  window.ProcedureCard = function ({
    id = '', title = 'Procedimiento', category = 'Académico',
    description = '', cost = 'Gratuito', time = '5 días',
    badge = '', targetRoute = 'catalogo.detalle'
  } = {}) {
    return `
<div class="procedure-card card-hover animate-on-load" role="article" tabindex="0"
     onclick="navigate('${targetRoute}')"
     onkeypress="if(event.key==='Enter') navigate('${targetRoute}')"
     aria-label="Procedimiento: ${title}">
  <div style="display:flex;align-items:start;justify-content:space-between;margin-bottom:var(--sp-md)">
    <span class="badge badge-primary">${category}</span>
    ${badge ? `<span class="badge badge-teal">${badge}</span>` : ''}
  </div>
  <h3 class="text-title-md" style="color:var(--clr-primary);margin-bottom:var(--sp-xs)">${title}</h3>
  <p class="text-body-sm" style="color:var(--clr-on-surface-variant);flex:1;margin-bottom:var(--sp-lg)">${description}</p>
  <div style="border-top:1px solid var(--clr-outline-variant);padding-top:var(--sp-md);display:flex;flex-direction:column;gap:var(--sp-xs)">
    <div style="display:flex;justify-content:space-between">
      <div style="display:flex;align-items:center;gap:6px;color:var(--clr-on-surface-variant)">
        <span class="material-symbols-outlined icon-md">payments</span>
        <span class="text-label-md">${cost}</span>
      </div>
      <div style="display:flex;align-items:center;gap:6px;color:var(--clr-on-surface-variant)">
        <span class="material-symbols-outlined icon-md">schedule</span>
        <span class="text-label-md">${time}</span>
      </div>
    </div>
    <div style="display:flex;align-items:center;gap:6px;color:var(--clr-primary)">
      <span class="material-symbols-outlined icon-md">gavel</span>
      <span class="text-label-sm">Normativa vigente TUPA</span>
    </div>
  </div>
</div>`;
  };

  /* ----------------------------------------------------------
     STAT CARD
  ---------------------------------------------------------- */
  window.StatCard = function ({
    icon = 'description', iconBg = 'var(--clr-primary-fixed)', iconColor = 'var(--clr-primary)',
    value = '0', label = 'Stat', badge = '', badgeClass = 'badge-primary',
    targetRoute = ''
  } = {}) {
    const clickable = targetRoute ? `onclick="navigate('${targetRoute}')" style="cursor:pointer"` : '';
    return `
<div class="stat-card animate-on-load" ${clickable} role="${targetRoute ? 'button' : 'article'}" ${targetRoute ? 'tabindex="0"' : ''}>
  <div style="display:flex;justify-content:space-between;align-items:start">
    <div class="stat-card-icon" style="background:${iconBg};color:${iconColor}">
      <span class="material-symbols-outlined icon-filled">${icon}</span>
    </div>
    ${badge ? `<span class="badge ${badgeClass}">${badge}</span>` : ''}
  </div>
  <div class="stat-card-value">${value}</div>
  <div class="stat-card-label">${label}</div>
</div>`;
  };

  /* ----------------------------------------------------------
     TIMELINE ITEM
  ---------------------------------------------------------- */
  window.TimelineItem = function ({
    state = 'pending', icon = 'radio_button_unchecked',
    title = 'Paso', description = '', date = '', isLast = false
  } = {}) {
    return `
<div class="timeline-item">
  <div class="timeline-dot ${state}">
    <span class="material-symbols-outlined ${state === 'completed' ? 'icon-filled' : ''}">${icon}</span>
  </div>
  <div class="timeline-content">
    <div class="timeline-title">${title}</div>
    ${description ? `<div class="timeline-desc">${description}</div>` : ''}
    ${date ? `<div class="timeline-date">${date}</div>` : ''}
  </div>
</div>`;
  };

  /* ----------------------------------------------------------
     NOTIFICATION ITEM
  ---------------------------------------------------------- */
  window.NotificationItem = function ({
    icon = 'notifications', iconBg = 'var(--clr-surface-container)',
    iconColor = 'var(--clr-primary)',
    title = 'Notificación', description = '', time = 'Ahora',
    unread = false, targetRoute = ''
  } = {}) {
    const click = targetRoute ? `onclick="navigate('${targetRoute}')"` : '';
    return `
<div class="notification-item ${unread ? 'unread' : ''}" ${click} role="${targetRoute ? 'button' : 'listitem'}" ${targetRoute ? 'tabindex="0"' : ''}>
  <div class="notification-icon" style="background:${iconBg};color:${iconColor}">
    <span class="material-symbols-outlined">${icon}</span>
  </div>
  <div style="flex:1;min-width:0">
    <div class="text-label-md" style="color:var(--clr-on-surface)">${title}</div>
    <div class="text-body-sm" style="color:var(--clr-secondary);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${description}</div>
    <div class="text-label-sm" style="color:var(--clr-outline);margin-top:4px">${time}</div>
  </div>
  ${unread ? `<div style="width:8px;height:8px;border-radius:50%;background:var(--clr-primary);flex-shrink:0;margin-top:8px"></div>` : ''}
</div>`;
  };

  /* ----------------------------------------------------------
     STATUS BADGE helper
  ---------------------------------------------------------- */
  window.StatusBadge = function (status) {
    const map = {
      'pendiente':      ['badge-pending',  'hourglass_empty', 'Pendiente'],
      'en_revision':    ['badge-in-review','pending',         'En Revisión'],
      'aprobado':       ['badge-approved', 'check_circle',    'Aprobado'],
      'rechazado':      ['badge-rejected', 'cancel',          'Rechazado'],
      'observado':      ['badge-warning',  'warning',         'Observado'],
      'completado':     ['badge-approved', 'task_alt',        'Completado'],
      'cancelado':      ['badge-neutral',  'block',           'Cancelado'],
    };
    const [cls, icon, label] = map[status] || ['badge-neutral', 'help', status];
    return `<span class="badge ${cls}"><span class="material-symbols-outlined">${icon}</span>${label}</span>`;
  };

  /* ----------------------------------------------------------
     DOCUMENT ITEM (upload / checklist)
  ---------------------------------------------------------- */
  window.DocumentItem = function ({
    name = 'Documento.pdf', size = '', status = 'pending',
    required = true, description = ''
  } = {}) {
    const stateMap = {
      pending:  { icon: 'upload_file',    color: 'var(--clr-outline)',  label: 'Pendiente' },
      uploaded: { icon: 'check_circle',   color: 'var(--clr-primary)',  label: 'Cargado' },
      error:    { icon: 'error',          color: 'var(--clr-error)',    label: 'Error' },
      approved: { icon: 'verified',       color: '#065f46',             label: 'Verificado' },
    };
    const s = stateMap[status] || stateMap.pending;
    return `
<div style="display:flex;align-items:center;gap:var(--sp-md);padding:var(--sp-md);border:1px solid var(--clr-outline-variant);border-radius:var(--radius-lg);background:var(--clr-surface-container-lowest)">
  <span class="material-symbols-outlined" style="color:${s.color};font-size:28px">${s.icon}</span>
  <div style="flex:1;min-width:0">
    <div class="text-label-md" style="color:var(--clr-on-surface)">${name}${required ? ' <span style="color:var(--clr-error)">*</span>' : ''}</div>
    ${description ? `<div class="text-body-sm" style="color:var(--clr-secondary)">${description}</div>` : ''}
    ${size ? `<div class="text-label-sm" style="color:var(--clr-outline)">${size}</div>` : ''}
  </div>
  <span class="badge ${status === 'uploaded' || status === 'approved' ? 'badge-success' : status === 'error' ? 'badge-error' : 'badge-neutral'}">${s.label}</span>
</div>`;
  };

  /* ----------------------------------------------------------
     RENDER COMPONENTS INTO PLACEHOLDERS
     Pages declare: <div data-component="StudentSidebar"></div>
     Call this on DOMContentLoaded with props passed via data attributes.
  ---------------------------------------------------------- */
  window.renderComponents = function (props = {}) {
    document.querySelectorAll('[data-component]').forEach(el => {
      const name = el.dataset.component;
      const fn = window[name];
      if (typeof fn === 'function') {
        el.outerHTML = fn(props[name] || {});
      }
    });
  };

  /* ----------------------------------------------------------
     LOADING SPINNER helper
  ---------------------------------------------------------- */
  window.LoadingSpinner = function (size = 24) {
    return `<svg class="animate-spin" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="31.416" stroke-dashoffset="10" />
    </svg>`;
  };

  /* ----------------------------------------------------------
     TOAST NOTIFICATION
  ---------------------------------------------------------- */
  window.showToast = function ({ message = '', type = 'info', duration = 3000 } = {}) {
    const iconMap = { info: 'info', success: 'check_circle', warning: 'warning', error: 'error' };
    const colorMap = {
      info: 'var(--clr-primary)', success: '#065f46',
      warning: '#92400e', error: 'var(--clr-error)'
    };
    const toast = document.createElement('div');
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    toast.style.cssText = `
      position:fixed;bottom:24px;right:24px;z-index:999;
      display:flex;align-items:center;gap:12px;
      padding:14px 20px;
      background:var(--clr-surface-container-lowest);
      border:1px solid var(--clr-outline-variant);
      border-left:4px solid ${colorMap[type]};
      border-radius:12px;
      box-shadow:var(--shadow-lg);
      max-width:360px;
      font-family:Inter,sans-serif;font-size:14px;
      color:var(--clr-on-surface);
      animation:slideInUp 0.3s ease forwards;
      transition:opacity 0.3s ease,transform 0.3s ease;
    `;
    toast.innerHTML = `
      <span class="material-symbols-outlined" style="color:${colorMap[type]};font-size:20px">${iconMap[type]}</span>
      <span>${message}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };

})();
