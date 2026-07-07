import { useNavigate } from 'react-router-dom';
import Badge from '../ui/Badge';
import { Clock, DollarSign, ArrowRight } from 'lucide-react';

export default function ProcedureCard({ procedure }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/catalog/${procedure.id}`)}
      className="card card-hover cursor-pointer p-5 flex flex-col"
    >
      <div className="flex items-start justify-between mb-3">
        <Badge variant="primary">{procedure.category || 'General'}</Badge>
        {procedure.status && <Badge status={procedure.status} />}
      </div>
      <h3 className="text-base font-semibold text-primary mb-2">{procedure.title}</h3>
      <p className="text-sm text-gray-500 flex-1 mb-4 line-clamp-2">{procedure.description}</p>
      <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            <span>{procedure.cost > 0 ? `S/. ${procedure.cost}` : 'Gratuito'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{procedure.estimatedDays} dias</span>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-primary" />
      </div>
    </div>
  );
}
