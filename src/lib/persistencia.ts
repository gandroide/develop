export interface EstadoPersistencia {
  soportado: boolean;
  persistente: boolean;
}

export const solicitarPersistencia = async (): Promise<EstadoPersistencia> => {
  const storage = typeof navigator !== 'undefined' ? navigator.storage : undefined;
  if (!storage || typeof storage.persist !== 'function') {
    return { soportado: false, persistente: false };
  }
  try {
    const yaPersistente = typeof storage.persisted === 'function' ? await storage.persisted() : false;
    if (yaPersistente) return { soportado: true, persistente: true };
    const concedido = await storage.persist();
    return { soportado: true, persistente: concedido };
  } catch {
    return { soportado: true, persistente: false };
  }
};
