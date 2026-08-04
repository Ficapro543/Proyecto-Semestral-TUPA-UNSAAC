import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from './components/layout/PublicLayout'
import StudentLayout from './components/layout/StudentLayout'
import AdminLayout from './components/layout/AdminLayout'

import LandingPage from './pages/public/LandingPage'
import Login from './pages/auth/Login'
import Catalog from './pages/public/Catalog'
import StudentDashboard from './pages/student/Dashboard'
import MyProfile from './pages/student/MyProfile'
import Notifications from './pages/student/Notifications'
import MyProcedures from './pages/student/MyProcedures'
import MyRequests from './pages/student/MyRequests'
import AdminDashboard from './pages/admin/AdminDashboard';
import PendingQueue from './pages/admin/PendingQueue';

import WizardLayout from './components/layout/WizardLayout';
import Step1 from './pages/student/wizard/Step1';
import Step2 from './pages/student/wizard/Step2';
import Step3 from './pages/student/wizard/Step3';
import Step4 from './pages/student/wizard/Step4';
import Step5 from './pages/student/wizard/Step5';
import Step6 from './pages/student/wizard/Step6';

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/catalogo" element={<Catalog />} />
      </Route>

      {/* Student Portal */}
      <Route path="/estudiante" element={<StudentLayout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="perfil" element={<MyProfile />} />
        <Route path="notificaciones" element={<Notifications />} />
        <Route path="tramites" element={<MyProcedures />} />
        <Route path="solicitudes" element={<MyRequests />} />
      </Route>

      {/* Wizard */}
      <Route path="/tramite" element={<WizardLayout />}>
        <Route path="nuevo" element={<Step1 />} />
        <Route path="paso1" element={<Step1 />} />
        <Route path="paso2" element={<Step2 />} />
        <Route path="paso3" element={<Step3 />} />
        <Route path="paso4" element={<Step4 />} />
        <Route path="paso5" element={<Step5 />} />
        <Route path="paso6" element={<Step6 />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="cola" element={<PendingQueue />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

