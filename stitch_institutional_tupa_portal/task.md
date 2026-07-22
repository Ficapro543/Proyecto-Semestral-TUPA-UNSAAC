# TUPA Refactoring — Task Tracker

## Phase 1: Shared Infrastructure
- [/] Create `shared/design-system.css`
- [ ] Create `shared/navigation.js`
- [ ] Create `shared/components.js`
- [ ] Create `index.html` (master entry point / dev panel)

## Phase 2: Group 1 — Public Access & Login
- [ ] Refactor `tupa_central_home/code.html`
- [ ] Refactor `login_tupa_central/code.html`
- [ ] Refactor `create_account_user_type_selection/code.html`
- [ ] Refactor `help_guidance_tupa_portal/code.html`

## Phase 3: Group 2 — TUPA Catalog
- [ ] Refactor `tupa_catalog_public_portal/code.html`
- [ ] Refactor `cat_logo_escalar_de_procedimientos_tupa/code.html`
- [ ] Refactor `cat_logo_tupa_variante_acorde_n_es/code.html`
- [ ] Refactor `cat_logo_tupa_variante_cuadr_cula_es/code.html`
- [ ] Refactor `institutional_administrative_framework/code.html`
- [ ] Refactor `procedure_detail_diploma_certification/code.html`

## Phase 4: Group 3 — Procedure Wizard (Spanish primary)
- [ ] Refactor `paso_1_seleccionar_procedimiento_es_1/code.html` (canonical)
- [ ] Redirect `paso_1_seleccionar_procedimiento_es_2` → canonical
- [ ] Redirect EN `step_1_select_procedure` → canonical
- [ ] Refactor `paso_2_revisar_requisitos_es/code.html`
- [ ] Redirect EN `step_2_review_requirements` → paso_2
- [ ] Refactor `paso_3_confirmaci_n_de_pago_es/code.html`
- [ ] Redirect EN `step_3_payment_confirmation` → paso_3
- [ ] Refactor `paso_4_subir_documentos_es/code.html`
- [ ] Redirect EN `step_4_upload_documents` → paso_4
- [ ] Refactor `paso_5_revisar_y_enviar_es/code.html`
- [ ] Redirect EN `step_5_review_and_submit` → paso_5
- [ ] Refactor `paso_6_env_o_exitoso_es/code.html`
- [ ] Redirect EN `step_6_submission_success` → paso_6

## Phase 5: Group 4 — Procedure Detail & Documents
- [ ] Refactor `new_procedure_request/code.html`
- [ ] Refactor `observation_detail_pending_actions/code.html`
- [ ] Refactor `procedure_detail_review/code.html`

## Phase 6: Group 5 — Student Dashboard
- [ ] Refactor `student_dashboard_overview/code.html`
- [ ] Refactor `my_procedures_tracker/code.html`
- [ ] Refactor `my_requests_tracker/code.html`
- [ ] Refactor `notifications_center/code.html`
- [ ] Refactor `my_profile_settings/code.html`

## Phase 7: Group 6 — Tracking & Expediente
- [ ] Refactor `track_my_procedure_search/code.html`
- [ ] Refactor `search_results_procedure_tracking/code.html`
- [ ] Refactor `procedure_detail_status_timeline/code.html`

## Phase 8: Group 7 — Admin Dashboard
- [ ] Refactor `admin_dashboard/code.html` (merge overview)
- [ ] Redirect `admin_dashboard_overview` → admin_dashboard
- [ ] Refactor `pending_procedures_queue/code.html`
- [ ] Refactor `document_validation_screen/code.html`
- [ ] Refactor `procedure_management/code.html`
- [ ] Refactor `user_management/code.html`
- [ ] Refactor `reports_and_statistics/code.html`

## Phase 9: Verification
- [ ] Open `index.html` — verify dev panel
- [ ] Test full student flow: Login → Dashboard → Catalog → Wizard → Success → Tracking
- [ ] Test full admin flow: Login → Admin Dashboard → all sections
- [ ] Verify no dead-end screens
- [ ] Verify sidebar active states
- [ ] Generate final implementation report
