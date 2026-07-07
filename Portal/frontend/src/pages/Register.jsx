import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Las contrasenas no coinciden');
      return;
    }
    setLoading(true);
    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });
      toast.success('Registro exitoso!');
      navigate('/student');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Image/Pattern */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-primary-700 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-tertiary/10 rounded-full blur-3xl" />
        <div className="relative z-10 text-center text-white">
          <div className="w-24 h-24 bg-white/10 border-2 border-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
            <span className="material-symbols-outlined text-tertiary text-5xl">school</span>
          </div>
          <h2 className="text-3xl font-bold font-display mb-4">Portal Estudiantil</h2>
          <p className="text-white/70 max-w-sm">
            Accede a todos los servicios administrativos de la universidad
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-primary mb-2">Crear Cuenta</h1>
            <p className="text-gray-500">Registrate para acceder al portal TUPA</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nombre"
                name="firstName"
                icon={User}
                placeholder="Tu nombre"
                value={form.firstName}
                onChange={handleChange}
                required
              />
              <Input
                label="Apellido"
                name="lastName"
                icon={User}
                placeholder="Tu apellido"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <Input
              label="Email"
              type="email"
              name="email"
              icon={Mail}
              placeholder="tu@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Contrasena"
              type="password"
              name="password"
              icon={Lock}
              placeholder="Minimo 6 caracteres"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              required
            />
            <Input
              label="Confirmar Contrasena"
              type="password"
              name="confirmPassword"
              icon={Lock}
              placeholder="Repite tu contrasena"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <Button type="submit" loading={loading} className="w-full">
              <UserPlus className="w-5 h-5" />
              Crear Cuenta
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Inicia sesion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
