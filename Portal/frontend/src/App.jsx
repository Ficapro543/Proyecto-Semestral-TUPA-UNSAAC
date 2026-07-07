import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalog from './pages/Catalog';
import ProcedureDetail from './pages/ProcedureDetail';
import StudentDashboard from './pages/StudentDashboard';
import MyProcedures from './pages/MyProcedures';
import Notifications from './pages/Notifications';
import AdminDashboard from './pages/AdminDashboard';
import AdminProcedures from './pages/AdminProcedures';
import AdminUsers from './pages/AdminUsers';

function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/catalog" element={<Catalog />} />
      <Route path="/catalog/:id" element={<ProcedureDetail />} />
      <Route path="/track" element={<div className="min-h-screen flex items-center justify-center text-gray-500">Pagina de rastreo (proximamente)</div>} />
      <Route path="/help" element={<div className="min-h-screen flex items-center justify-center text-gray-500">Centro de ayuda (proximamente)</div>} />

      {/* Auth Routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* Student Routes */}
      <Route path="/student" element={<PrivateRoute roles={['student']}><StudentDashboard /></PrivateRoute>} />
      <Route path="/student/procedures" element={<PrivateRoute roles={['student']}><MyProcedures /></PrivateRoute>} />
      <Route path="/student/notifications" element={<PrivateRoute roles={['student']}><Notifications /></PrivateRoute>} />
      <Route path="/student/profile" element={<PrivateRoute roles={['student']}><div className="flex min-h-screen bg-gray-50"><div className="flex-1 ml-64 p-6"><h1 className="text-2xl font-bold text-primary">Mi Perfil</h1><p className="text-gray-500 mt-2">Pagina de perfil (proximamente)</p></div></div></PrivateRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
      <Route path="/admin/procedures" element={<PrivateRoute roles={['admin']}><AdminProcedures /></PrivateRoute>} />
      <Route path="/admin/users" element={<PrivateRoute roles={['admin']}><AdminUsers /></PrivateRoute>} />
      <Route path="/admin/profile" element={<PrivateRoute roles={['admin']}><div className="flex min-h-screen bg-gray-50"><div className="flex-1 ml-64 p-6"><h1 className="text-2xl font-bold text-primary">Perfil Admin</h1><p className="text-gray-500 mt-2">Pagina de perfil (proximamente)</p></div></div></PrivateRoute>} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}
