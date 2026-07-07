import { CheckCircle, XCircle, AlertTriangle, Clock, Info, FileText } from 'lucide-react';

const variants = {
  primary: 'badge-primary',
  teal: 'badge-teal',
  success: 'badge-success',
  warning: 'badge-warning',
  error: 'badge-error',
  neutral: 'badge-neutral',
};

const statusConfig = {
  pending: { variant: 'warning', label: 'Pendiente', icon: Clock },
  in_review: { variant: 'primary', label: 'En Revision', icon: AlertTriangle },
  approved: { variant: 'success', label: 'Aprobado', icon: CheckCircle },
  rejected: { variant: 'error', label: 'Rechazado', icon: XCircle },
  observed: { variant: 'warning', label: 'Observado', icon: AlertTriangle },
  completed: { variant: 'success', label: 'Completado', icon: CheckCircle },
  active: { variant: 'success', label: 'Activo', icon: CheckCircle },
  inactive: { variant: 'neutral', label: 'Inactivo', icon: XCircle },
};

export default function Badge({ children, variant = 'primary', status, className = '' }) {
  if (status) {
    const config = statusConfig[status] || { variant: 'neutral', label: status, icon: FileText };
    const Icon = config.icon;
    return (
      <span className={`badge ${variants[config.variant]} ${className}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  }

  return (
    <span className={`badge ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
