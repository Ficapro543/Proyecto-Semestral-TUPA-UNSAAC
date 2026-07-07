import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import Card, { CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { FileText, Search, Filter, Eye } from 'lucide-react';

export default function MyProcedures() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const res = await api.get('/procedures/my-requests');
      setRequests(res.data.requests);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar type="student" />
      <div className="flex-1 ml-64">
        <Topbar title="Mis Tramites" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-primary">Mis Tramites</h1>
              <p className="text-gray-500">Seguimiento de tus solicitudes</p>
            </div>
            <Button onClick={() => navigate('/catalog')}>
              <FileText className="w-4 h-4" />
              Nuevo Tramite
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {[
              { key: 'all', label: 'Todos' },
              { key: 'pending', label: 'Pendientes' },
              { key: 'in_review', label: 'En Revision' },
              { key: 'completed', label: 'Completados' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === f.key
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-primary'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-500">Cargando...</div>
          ) : filtered.length === 0 ? (
            <Card>
              <CardBody className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No hay tramites para mostrar</p>
                <Button onClick={() => navigate('/catalog')}>Explorar Catalogo</Button>
              </CardBody>
            </Card>
          ) : (
            <div className="space-y-3">
              {filtered.map((req) => (
                <Card key={req.id} hover>
                  <CardBody className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{req.procedure}</div>
                        <div className="text-sm text-gray-500">
                          Solicitado: {new Date(req.createdAt).toLocaleDateString('es-PE')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge status={req.status} />
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
