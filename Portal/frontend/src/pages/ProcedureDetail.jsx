import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import PublicHeader from '../components/layout/PublicHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { ArrowLeft, Clock, DollarSign, CheckCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProcedureDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [procedure, setProcedure] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProcedure();
  }, [id]);

  const loadProcedure = async () => {
    try {
      const res = await api.get(`/procedures/${id}`);
      setProcedure(res.data.procedure);
    } catch (error) {
      toast.error('Procedimiento no encontrado');
      navigate('/catalog');
    } finally {
      setLoading(false);
    }
  };

  const handleStartRequest = () => {
    if (!user) {
      toast.error('Inicia sesion para solicitar este tramite');
      navigate('/login');
      return;
    }
    navigate(`/wizard/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <div className="flex-1 flex items-center justify-center text-gray-500">Cargando...</div>
      </div>
    );
  }

  if (!procedure) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicHeader />

      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        <button
          onClick={() => navigate('/catalog')}
          className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al catalogo
        </button>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge variant="primary" className="mb-3">{procedure.category || 'General'}</Badge>
                <h1 className="text-2xl font-bold text-primary">{procedure.title}</h1>
              </div>
            </div>
            <p className="text-gray-600 mt-2">{procedure.description}</p>
          </div>

          <div className="p-6 grid sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <DollarSign className="w-5 h-5 text-primary" />
              <div>
                <div className="text-xs text-gray-500">Costo</div>
                <div className="font-semibold text-gray-800">{procedure.cost > 0 ? `S/. ${procedure.cost}` : 'Gratuito'}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <div className="text-xs text-gray-500">Tiempo Estimado</div>
                <div className="font-semibold text-gray-800">{procedure.estimatedDays} dias habiles</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <div className="text-xs text-gray-500">Requisitos</div>
                <div className="font-semibold text-gray-800">{procedure.requirements?.length || 0} documentos</div>
              </div>
            </div>
          </div>

          {procedure.requirements && procedure.requirements.length > 0 && (
            <div className="p-6 border-t border-gray-100">
              <h2 className="text-lg font-semibold text-primary mb-4">Requisitos</h2>
              <div className="space-y-3">
                {procedure.requirements.map((req, index) => (
                  <div key={req.id || index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-800">
                        {req.name}
                        {req.isRequired && <span className="text-red-500 ml-1">*</span>}
                      </div>
                      {req.description && (
                        <div className="text-sm text-gray-500 mt-0.5">{req.description}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <Button onClick={handleStartRequest} className="w-full sm:w-auto">
              Iniciar Solicitud
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
