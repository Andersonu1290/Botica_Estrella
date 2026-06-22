import { beforeEach, describe, expect, it } from 'vitest';
import {
  guardarAdminSesion,
  guardarClienteSesion,
  normalizarSesionAutenticacion,
  obtenerAdminSesion,
  obtenerClienteSesion,
  esJwtExpirado
} from '@/utils/auth';

const crearJwt = (payload) => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${header}.${body}.firma`;
};

describe('auth utils', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('normaliza respuestas anidadas del backend', () => {
    const normalizado = normalizarSesionAutenticacion({
      token: 'abc.token',
      usuario: {
        idUsuario: 7,
        username: 'anderson',
        rol: 'CLIENTE'
      }
    });

    expect(normalizado).toMatchObject({
      idUsuario: 7,
      username: 'anderson',
      rol: 'CLIENTE',
      token: 'abc.token'
    });
    expect(normalizado.usuario).toBeUndefined();
  });

  it('persiste y recupera la sesión del cliente con token', () => {
    guardarClienteSesion({
      idUsuario: 10,
      username: 'cliente1',
      rol: 'CLIENTE',
      token: 'jwt-cliente'
    });

    expect(obtenerClienteSesion()).toMatchObject({
      idUsuario: 10,
      username: 'cliente1',
      rol: 'CLIENTE',
      token: 'jwt-cliente'
    });
  });

  it('persiste y recupera la sesión del admin con su token', () => {
    guardarAdminSesion({
      idUsuario: 1,
      username: 'admin',
      rol: 'ADMIN',
      token: 'jwt-admin'
    });

    expect(obtenerAdminSesion()).toMatchObject({
      idUsuario: 1,
      username: 'admin',
      rol: 'ADMIN',
      token: 'jwt-admin'
    });
  });

  it('detecta tokens expirados y vigentes', () => {
    const vigente = crearJwt({ exp: Math.floor(Date.now() / 1000) + 3600 });
    const expirado = crearJwt({ exp: Math.floor(Date.now() / 1000) - 3600 });

    expect(esJwtExpirado(vigente)).toBe(false);
    expect(esJwtExpirado(expirado)).toBe(true);
  });
});
