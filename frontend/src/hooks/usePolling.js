import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Carga datos de la API y los re-consulta cada `intervalMs`.
 *
 * Se eligió polling (y no WebSockets) para la actualización en tiempo real
 * entre las dos sesiones: reutiliza los endpoints REST que ya existen, no
 * necesita un segundo transporte ni lógica de reconexión, y sobrevive a que
 * el backend se reinicie durante la demo.
 *
 * - La primera carga expone `loading`; los refrescos posteriores no lo activan,
 *   para que la pantalla no parpadee cada pocos segundos.
 * - Pausa el polling cuando la pestaña está oculta y refresca al volver.
 */
export function usePolling(fetcher, { intervalMs = 4000, enabled = true, deps = [] } = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const loadedOnce = useRef(false);
  const abortRef = useRef(null);

  const load = useCallback(async ({ silent = false } = {}) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    if (!silent && !loadedOnce.current) setLoading(true);

    try {
      const result = await fetcherRef.current({ signal: controller.signal });
      if (controller.signal.aborted) return;
      setData(result);
      setError(null);
      loadedOnce.current = true;
    } catch (err) {
      if (err.name === 'AbortError' || controller.signal.aborted) return;
      setError(err);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadedOnce.current = false;
    if (!enabled) {
      setLoading(false);
      return;
    }

    load();

    let timer = setInterval(() => {
      if (document.visibilityState === 'visible') load({ silent: true });
    }, intervalMs);

    const onVisible = () => {
      if (document.visibilityState === 'visible') load({ silent: true });
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      clearInterval(timer);
      timer = null;
      document.removeEventListener('visibilitychange', onVisible);
      abortRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, intervalMs, load, ...deps]);

  return { data, error, loading, refresh: () => load({ silent: true }) };
}

export default usePolling;
