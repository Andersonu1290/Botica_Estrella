const CLIENT_STORAGE_KEY = 'clienteEstrella';
const ADMIN_STORAGE_KEY = 'usuarioActivo';
const ADMIN_TOKEN_KEY = 'jwt_token';
const ADMIN_ROLES = ['ADMIN', 'ALMACEN', 'JEFE_ALMACEN'];

const readStorageItem = (storage, key) => {
  try {
    return storage?.getItem(key) ?? null;
  } catch {
    return null;
  }
};

const writeStorageItem = (storage, key, value) => {
  try {
    storage?.setItem(key, value);
  } catch {
    // Silencioso: el navegador puede bloquear storage en modo privado.
  }
};

const removeStorageItem = (storage, key) => {
  try {
    storage?.removeItem(key);
  } catch {
    // Silencioso.
  }
};

const readJson = (storage, key) => {
  const raw = readStorageItem(storage, key);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const base64UrlDecode = (segment) => {
  const normalized = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');

  if (typeof atob === 'function') {
    return atob(padded);
  }

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(padded, 'base64').toString('utf8');
  }

  return '';
};

const normalizarRol = (payload = {}) => {
  const rolDirecto = payload.rol ?? payload.role ?? payload.authority ?? null;

  if (typeof rolDirecto === 'string' && rolDirecto.trim()) {
    return rolDirecto.replace(/^ROLE_/, '').trim().toUpperCase();
  }

  if (Array.isArray(payload.authorities) && payload.authorities.length > 0) {
    const autoridad = payload.authorities[0];
    if (typeof autoridad === 'string' && autoridad.trim()) {
      return autoridad.replace(/^ROLE_/, '').trim().toUpperCase();
    }
  }

  return null;
};

export const normalizarSesionAutenticacion = (payload) => {
  if (!payload || typeof payload !== 'object') return payload;

  const usuario = payload.usuario && typeof payload.usuario === 'object'
    ? payload.usuario
    : {};

  const normalizado = {
    ...payload,
    ...usuario
  };

  delete normalizado.usuario;

  if (!normalizado.token) {
    normalizado.token = payload.token || usuario.token || null;
  }

  if (!normalizado.rol) {
    normalizado.rol = normalizarRol(payload) || normalizarRol(usuario);
  }

  if (normalizado.idUsuario == null && normalizado.id != null) {
    normalizado.idUsuario = normalizado.id;
  }

  return normalizado;
};

export const obtenerClienteSesion = () => {
  const sesion = readJson(globalThis.localStorage, CLIENT_STORAGE_KEY);
  if (!sesion) return null;
  return normalizarSesionAutenticacion(sesion);
};

export const guardarClienteSesion = (payload) => {
  const normalizado = normalizarSesionAutenticacion(payload);
  writeStorageItem(globalThis.localStorage, CLIENT_STORAGE_KEY, JSON.stringify(normalizado));
  return normalizado;
};

export const cerrarClienteSesion = () => {
  removeStorageItem(globalThis.localStorage, CLIENT_STORAGE_KEY);
};

export const obtenerAdminSesion = () => {
  const sesion = readJson(globalThis.sessionStorage, ADMIN_STORAGE_KEY);
  if (!sesion) return null;
  return normalizarSesionAutenticacion(sesion);
};

export const guardarAdminSesion = (payload) => {
  const normalizado = normalizarSesionAutenticacion(payload);
  writeStorageItem(globalThis.sessionStorage, ADMIN_STORAGE_KEY, JSON.stringify(normalizado));

  if (normalizado.token) {
    writeStorageItem(globalThis.sessionStorage, ADMIN_TOKEN_KEY, normalizado.token);
  }

  return normalizado;
};

export const cerrarAdminSesion = () => {
  removeStorageItem(globalThis.sessionStorage, ADMIN_STORAGE_KEY);
  removeStorageItem(globalThis.sessionStorage, ADMIN_TOKEN_KEY);
};

export const obtenerTokenCliente = () => obtenerClienteSesion()?.token || null;

export const obtenerTokenAdmin = () => {
  const sesion = obtenerAdminSesion();
  return readStorageItem(globalThis.sessionStorage, ADMIN_TOKEN_KEY) || sesion?.token || null;
};

export const obtenerTokenAutenticacion = (tipo = 'auto') => {
  if (tipo === 'cliente') return obtenerTokenCliente();
  if (tipo === 'admin') return obtenerTokenAdmin();

  return obtenerTokenAdmin() || obtenerTokenCliente();
};

export const decodificarJwt = (token) => {
  if (!token || typeof token !== 'string' || token.split('.').length < 2) {
    return null;
  }

  try {
    const payloadSegment = token.split('.')[1];
    const json = base64UrlDecode(payloadSegment);
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const esJwtExpirado = (token) => {
  if (!token) return true;

  const payload = decodificarJwt(token);
  if (!payload || typeof payload.exp !== 'number') return false;

  return Date.now() >= payload.exp * 1000;
};

export const esRolAdmin = (rol) => ADMIN_ROLES.includes(String(rol || '').toUpperCase());

export const esSesionClienteValida = () => {
  const sesion = obtenerClienteSesion();
  return Boolean(sesion && sesion.token && !esJwtExpirado(sesion.token) && String(sesion.rol || '').toUpperCase() === 'CLIENTE');
};

export const esSesionAdminValida = () => {
  const sesion = obtenerAdminSesion();
  const token = obtenerTokenAdmin();
  return Boolean(sesion && token && !esJwtExpirado(token) && esRolAdmin(sesion.rol));
};

export const obtenerRolSesion = (tipo = 'auto') => {
  if (tipo === 'cliente') return obtenerClienteSesion()?.rol || null;
  if (tipo === 'admin') return obtenerAdminSesion()?.rol || null;

  return obtenerAdminSesion()?.rol || obtenerClienteSesion()?.rol || null;
};

