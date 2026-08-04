import { createContext, useContext, useState, useCallback, useEffect } from 'react';

/**
 * Estado del asistente de trámites, compartido entre los pasos 1..6.
 *
 * Se persiste en localStorage porque cada paso es una ruta distinta: sin esto,
 * recargar la página (o volver con el botón del navegador) perdía la solicitud
 * ya creada en el backend y dejaba borradores huérfanos.
 */
const STORAGE_KEY = 'tupa_wizard';

const EMPTY = {
  idSolicitud: null,
  codTramite: null,
  tramite: null,
  numeroExpediente: null,
  voucherSubido: false,
  documentosSubidos: {},
};

const WizardContext = createContext(null);

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : { ...EMPTY };
  } catch {
    return { ...EMPTY };
  }
}

export function WizardProvider({ children }) {
  const [state, setState] = useState(readStored);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const update = useCallback((patch) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => {
    setState({ ...EMPTY });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const markDocumento = useCallback((idRequisito, documento) => {
    setState((prev) => ({
      ...prev,
      documentosSubidos: { ...prev.documentosSubidos, [idRequisito]: documento },
    }));
  }, []);

  return (
    <WizardContext.Provider value={{ ...state, update, reset, markDocumento }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error('useWizard debe usarse dentro de <WizardProvider>');
  return ctx;
}
