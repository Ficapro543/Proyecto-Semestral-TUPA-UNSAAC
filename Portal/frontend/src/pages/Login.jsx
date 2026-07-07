import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Mail, Lock, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Bienvenido, ${user.firstName}!`);
      navigate(user.role === 'admin' ? '/admin' : '/student');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al iniciar sesion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-primary mb-2">Iniciar Sesion</h1>
            <p className="text-gray-500">Accede al portal de tramites TUPA UNSAAC</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              icon={Mail}
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Contrasena"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" loading={loading} className="w-full">
              <LogIn className="w-5 h-5" />
              Iniciar Sesion
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            No tienes cuenta?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Registrate aqui
            </Link>
          </div>

          {/* Demo credentials */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Credenciales de prueba</p>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Admin:</strong> admin@tupa-unsaac.edu.pe / admin123</p>
              <p><strong>Estudiante:</strong> elena@unsaac.edu.pe / student123</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Image/Pattern */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-primary-700 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-tertiary/10 rounded-full blur-3xl" />
        <div className="relative z-10 text-center text-white">
          <div className="w-24 h-24 bg-white/10 border-2 border-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
            <span className="material-symbols-outlined text-tertiary text-5xl">account_balance</span>
          </div>
          <h2 className="text-3xl font-bold font-display mb-4">TUPA UNSAAC</h2>
          <p className="text-white/70 max-w-sm">
            Portal de Tramites Unicos de Procedimientos Administrativos
          </p>
        </div>
      </div>
    </div>
  );
}
