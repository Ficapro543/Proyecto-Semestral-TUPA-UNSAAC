import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import Card, { CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { Users, FileText, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, requestsRes] = await Promise.all([
        api.get('/procedures/stats'),
        api.get('/procedures/requests'),
      ]);
      setStats(statsRes.data.stats);
      setRecentRequests(requestsRes.data.requests.slice(0, 5));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { icon: FileText, label: 'Total Procedimientos', value: stats?.totalProcedures || 0, color: 'bg-primary/10 text-primary' },
    { icon: Users, label: 'Total Usuarios', value: stats?.totalUsers || 0, color: 'bg-tertiary/20 text-primary-700' },
    { icon: Clock, label: 'Pendientes', value: stats?.pendingRequests || 0, color: 'bg-yellow-100 text-yellow-700' },
    { icon: CheckCircle, label: 'Completados', value: stats?.completedRequests || 0, color: 'bg-green-100 text-green-700' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar type="admin" />
      <div className="flex-1 ml-64">
        <Topbar title="Panel Administrativo" />
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-primary">Dashboard Admin</h1>
            <p className="text-gray-500">Resumen del sistema TUPA</p>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
              <h2 className="font-semibold text-primary">Solicitudes Recientes</h2>
              <button
                onClick={() => navigate('/admin/procedures')}
                className="text-sm text-primary font-medium hover:underline"
              >
                Ver todas
              </button>
            </div>
            <CardBody>
              {recentRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No hay solicitudes</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-semibold text-gray-500 uppercase">
                        <th className="pb-3">Usuario</th>
                        <th className="pb-3">Procedimiento</th>
                        <th className="pb-3">Estado</th>
                        <th className="pb-3">Fecha</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {recentRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-gray-50">
                          <td className="py-3 text-sm font-medium text-gray-800">{req.userName}</td>
                          <td className="py-3 text-sm text-gray-600">{req.procedure}</td>
                          <td className="py-3"><Badge status={req.status} /></td>
                          <td className="py-3 text-sm text-gray-500">
                            {new Date(req.createdAt).toLocaleDateString('es-PE')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
