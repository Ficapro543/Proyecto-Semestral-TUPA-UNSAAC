import { Check } from 'lucide-react';

const steps = [
  { number: 1, label: 'Seleccionar' },
  { number: 2, label: 'Requisitos' },
  { number: 3, label: 'Pago' },
  { number: 4, label: 'Documentos' },
  { number: 5, label: 'Revisar' },
  { number: 6, label: 'Confirmacion' },
];

export default function WizardStepper({ currentStep }) {
  return (
    <div className="flex items-center bg-gray-50 rounded-2xl border border-gray-200 p-4 mb-6 overflow-x-auto">
      {steps.map((step, index) => {
        const isDone = step.number < currentStep;
        const isActive = step.number === currentStep;
        const isPending = step.number > currentStep;

        return (
          <div key={step.number} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  isDone
                    ? 'bg-primary text-white'
                    : isActive
                    ? 'bg-primary text-white ring-4 ring-primary/20'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isDone ? <Check className="w-4 h-4" /> : step.number}
              </div>
              <span
                className={`text-sm font-medium hidden sm:inline ${
                  isActive ? 'text-primary' : isDone ? 'text-primary' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-8 sm:w-12 h-0.5 mx-2 ${
                  isDone ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
