import { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import Card, { CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { FileText, Search, CheckCircle, XCircle, Eye, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminProcedures() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const res = await api.get('/procedures/requests');
      setRequests(res.data.requests);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/procedures/request/${id}/status`, { status, adminNotes });
      toast.success(`Solicitud ${status === 'approved' ? 'aprobada' : 'rechazada'}`);
      setModalOpen(false);
      setSelectedRequest(null);
      setAdminNotes('');
      loadRequests();
    } catch (error) {
      toast.error('Error al actualizar');
    }
  };

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar type="admin" />
      <div className="flex-1 ml-64">
        <Topbar title="Gestion de Tramites" />
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-primary">Gestion de Tramites</h1>
            <p className="text-gray-500">Administra las solicitudes de tramites</p>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {[
              { key: 'all', label: 'Todos' },
              { key: 'pending', label: 'Pendientes' },
              { key: 'in_review', label: 'En Revision' },
              { key: 'approved', label: 'Aprobados' },
              { key: 'rejected', label: 'Rechazados' },
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
                <p className="text-gray-500">No hay solicitudes para mostrar</p>
              </CardBody>
            </Card>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                      <th className="px-6 py-3">Usuario</th>
                      <th className="px-6 py-3">Procedimiento</th>
                      <th className="px-6 py-3">Notas</th>
                      <th className="px-6 py-3">Estado</th>
                      <th className="px-6 py-3">Fecha</th>
                      <th className="px-6 py-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">{req.userName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{req.procedure}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{req.notes || '-'}</td>
                        <td className="px-6 py-4"><Badge status={req.status} /></td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(req.createdAt).toLocaleDateString('es-PE')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {(req.status === 'pending' || req.status === 'in_review') && (
                              <>
                                <button
                                  onClick={() => { setSelectedRequest(req); setModalOpen(true); }}
                                  className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                                  title="Aprobar"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => { setSelectedRequest({ ...req, reject: true }); setModalOpen(true); }}
                                  className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                  title="Rechazar"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Action Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedRequest(null); setAdminNotes(''); }}
        title={selectedRequest?.reject ? 'Rechazar Solicitud' : 'Aprobar Solicitud'}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            {selectedRequest?.reject
              ? `Rechazar la solicitud de "${selectedRequest?.procedure}"?`
              : `Aprobar la solicitud de "${selectedRequest?.procedure}"?`}
          </p>
          <div>
            <label className="text-sm font-medium text-gray-700">Notas del administrador</label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="input mt-1 h-24 resize-none"
              placeholder="Agregar notas..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setModalOpen(false); setSelectedRequest(null); }}>
              Cancelar
            </Button>
            <Button
              variant={selectedRequest?.reject ? 'danger' : 'primary'}
              onClick={() => handleStatusUpdate(selectedRequest?.id, selectedRequest?.reject ? 'rejected' : 'approved')}
            >
              {selectedRequest?.reject ? 'Rechazar' : 'Aprobar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
