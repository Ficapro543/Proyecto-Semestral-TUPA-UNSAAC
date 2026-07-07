import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import Card, { CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { FileText, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ pending: 0, inReview: 0, completed: 0 });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await api.get('/procedures/my-requests');
      const requests = res.data.requests;
      setRecentRequests(requests.slice(0, 5));
      setStats({
        pending: requests.filter(r => r.status === 'pending').length,
        inReview: requests.filter(r => r.status === 'in_review').length,
        completed: requests.filter(r => r.status === 'completed').length,
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { icon: Clock, label: 'Pendientes', value: stats.pending, color: 'bg-yellow-100 text-yellow-700' },
    { icon: AlertCircle, label: 'En Revision', value: stats.inReview, color: 'bg-blue-100 text-blue-700' },
    { icon: CheckCircle, label: 'Completados', value: stats.completed, color: 'bg-green-100 text-green-700' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar type="student" />
      <div className="flex-1 ml-64">
        <Topbar title="Dashboard" />
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-primary">Bienvenido, {user?.firstName}</h1>
            <p className="text-gray-500">Gestiona tus tramites administrativos</p>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {statCards.map((stat, i) => (
              <Card key={i}>
                <CardBody className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Recent Requests */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold text-primary">Mis Solicitudes Recientes</h2>
              <button
                onClick={() => navigate('/student/procedures')}
                className="text-sm text-primary font-medium hover:underline"
              >
                Ver todas
              </button>
            </div>
            <CardBody>
              {recentRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  <p>No tienes solicitudes aun</p>
                  <button
                    onClick={() => navigate('/catalog')}
                    className="mt-2 text-primary font-medium hover:underline text-sm"
                  >
                    Explorar catalogo
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentRequests.map((req) => (
                    <div
                      key={req.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium text-gray-800">{req.procedure}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(req.createdAt).toLocaleDateString('es-PE')}
                          </div>
                        </div>
                      </div>
                      <Badge status={req.status} />
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
