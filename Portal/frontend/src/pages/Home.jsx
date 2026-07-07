import { useNavigate } from 'react-router-dom';
import PublicHeader from '../components/layout/PublicHeader';
import Button from '../components/ui/Button';
import { BookOpen, FileText, Search, ArrowRight, School, Shield, Menu } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const portals = [
    {
      icon: School,
      title: 'Portal Estudiantil',
      description: 'Dashboard, tramites, notificaciones y seguimiento de expedientes.',
      path: '/student',
      color: 'bg-tertiary/10 text-tertiary',
    },
    {
      icon: Shield,
      title: 'Portal Administrativo',
      description: 'Gestion de tramites, validacion de documentos y reportes.',
      path: '/admin',
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: Menu,
      title: 'Catalogo Publico',
      description: 'Consulta el catalogo completo de procedimientos sin cuenta.',
      path: '/catalog',
      color: 'bg-blue-50 text-blue-600',
    },
  ];

  const features = [
    { icon: FileText, title: '8+ Procedimientos', desc: 'Tramites administrativos disponibles' },
    { icon: Search, title: 'Seguimiento en Vivo', desc: 'Rastrea el estado de tus solicitudes' },
    { icon: BookOpen, title: 'Wizard de 6 Pasos', desc: 'Proceso guiado para solicitar tramites' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-br from-primary to-primary-700 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-tertiary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-2xl">
          <div className="w-20 h-20 bg-white/10 border-2 border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <span className="material-symbols-outlined text-tertiary text-4xl">account_balance</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-tertiary/15 border border-tertiary/30 rounded-full text-tertiary text-xs font-semibold uppercase tracking-wider mb-6">
            Prototipo Sistema TUPA
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-display mb-4 leading-tight">
            Portal de Tramites<br />Administrativos
          </h1>
          <p className="text-lg text-white/70 mb-8 max-w-lg mx-auto">
            Accede al catalogo completo de procedimientos universitarios. Inicia, rastrea y gestiona tus tramites de forma digital.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/catalog')}>
              <BookOpen className="w-5 h-5" />
              Ver Catalogo
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20" onClick={() => navigate('/login')}>
              Iniciar Sesion
            </Button>
          </div>
        </div>
      </section>

      {/* Portals */}
      <section className="px-6 py-16 max-w-5xl mx-auto w-full -mt-10 relative z-20">
        <div className="grid sm:grid-cols-3 gap-4">
          {portals.map((portal) => (
            <div
              key={portal.path}
              onClick={() => navigate(portal.path)}
              className="bg-white rounded-2xl border border-gray-200 p-6 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className={`w-12 h-12 rounded-xl ${portal.color} flex items-center justify-center mb-4`}>
                <portal.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{portal.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{portal.description}</p>
              <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                Acceder <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-primary text-center mb-10 font-display">
            Todo lo que necesitas en un solo lugar
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <f.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold">TUPA UNSAAC</div>
            <div className="text-sm text-white/60">© 2024 Universidad Nacional de San Antonio Abad del Cusco</div>
          </div>
          <div className="flex gap-6 text-sm text-white/60">
            <a href="#" className="hover:text-white">Ayuda</a>
            <a href="#" className="hover:text-white">Privacidad</a>
            <a href="#" className="hover:text-white">Terminos</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
