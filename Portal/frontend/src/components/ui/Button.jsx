import { Loader2 } from 'lucide-react';

export default function Button({ children, variant = 'primary', size = 'md', loading, disabled, className = '', ...props }) {
  const baseClasses = 'btn';
  const variants = {
    primary: 'btn-primary',
    teal: 'btn-teal',
    outline: 'btn-outline',
    danger: 'btn-danger',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
  };
  const sizes = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
