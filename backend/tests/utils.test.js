/**
 * Pruebas unitarias de las utilidades del backend.
 *
 * A diferencia del resto de la suite, aquí no se sustituye nada: se ejecuta
 * el código real. Son funciones puras (o que sólo dependen de un cliente de
 * base de datos que se puede simular con un objeto), de modo que no hace
 * falta una conexión a PostgreSQL.
 */
const { parseId, parsePagination, httpError } = require('../src/utils/validate');
const { generateExpedienteNumber } = require('../src/utils/generateExpediente');
const asyncHandler = require('../src/utils/asyncHandler');
const {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../src/utils/jwt.util');

describe('validate.parseId', () => {
  test('acepta un entero positivo en texto y lo convierte a número', () => {
    expect(parseId('42')).toBe(42);
    expect(parseId(7)).toBe(7);
  });

  test.each([['abc'], ['0'], ['-3'], ['1.5'], [''], [null], [undefined], ['1; DROP TABLE users']])(
    'rechaza %p con un error 400',
    (valor) => {
      expect(() => parseId(valor)).toThrow(/entero positivo/);
      try {
        parseId(valor);
      } catch (e) {
        expect(e.statusCode).toBe(400);
      }
    }
  );

  test('usa el nombre del campo en el mensaje de error', () => {
    expect(() => parseId('x', 'id_documento')).toThrow(/'id_documento'/);
  });
});

describe('validate.parsePagination', () => {
  test('aplica los valores por defecto cuando no se envía nada', () => {
    expect(parsePagination()).toEqual({ limit: 20, offset: 0 });
    expect(parsePagination({}, { defaultLimit: 50 })).toEqual({ limit: 50, offset: 0 });
  });

  test('respeta limit y offset válidos', () => {
    expect(parsePagination({ limit: '10', offset: '30' })).toEqual({ limit: 10, offset: 30 });
  });

  test('recorta el limit al máximo permitido', () => {
    expect(parsePagination({ limit: '5000' }, { maxLimit: 100 })).toEqual({
      limit: 100,
      offset: 0,
    });
  });

  test('acepta offset igual a cero pero rechaza offset negativo', () => {
    expect(parsePagination({ offset: '0' }).offset).toBe(0);
    expect(() => parsePagination({ offset: '-1' })).toThrow(/mayor o igual a 0/);
  });

  test.each([['abc'], ['0'], ['-5'], ['2.5']])('rechaza limit=%p con error 400', (limit) => {
    try {
      parsePagination({ limit });
      throw new Error('debió lanzar');
    } catch (e) {
      expect(e.statusCode).toBe(400);
    }
  });

  test('trata la cadena vacía como ausencia de valor', () => {
    expect(parsePagination({ limit: '', offset: '' })).toEqual({ limit: 20, offset: 0 });
  });
});

describe('validate.httpError', () => {
  test('construye un Error con statusCode adjunto', () => {
    const e = httpError('no encontrado', 404);
    expect(e).toBeInstanceOf(Error);
    expect(e.message).toBe('no encontrado');
    expect(e.statusCode).toBe(404);
  });
});

describe('generateExpedienteNumber', () => {
  const anio = new Date().getFullYear();
  const clienteCon = (filas) => ({ query: jest.fn().mockResolvedValue({ rows: filas }) });

  test('empieza en 000001 cuando no hay expedientes del año', async () => {
    expect(await generateExpedienteNumber(clienteCon([]))).toBe(`EXP-${anio}-000001`);
  });

  test('incrementa el último correlativo del año', async () => {
    const cliente = clienteCon([{ numero_expediente: `EXP-${anio}-000013` }]);
    expect(await generateExpedienteNumber(cliente)).toBe(`EXP-${anio}-000014`);
  });

  test('mantiene el relleno a seis dígitos al cruzar una decena', async () => {
    const cliente = clienteCon([{ numero_expediente: `EXP-${anio}-000099` }]);
    expect(await generateExpedienteNumber(cliente)).toBe(`EXP-${anio}-000100`);
  });

  test('filtra por el prefijo del año en curso', async () => {
    const cliente = clienteCon([]);
    await generateExpedienteNumber(cliente);
    expect(cliente.query).toHaveBeenCalledWith(expect.any(String), [`EXP-${anio}-%`]);
  });

  test('vuelve a 000001 si el último expediente tiene un formato inesperado', async () => {
    const cliente = clienteCon([{ numero_expediente: 'EXP-CORRUPTO' }]);
    expect(await generateExpedienteNumber(cliente)).toBe(`EXP-${anio}-000001`);
  });

  test('ordena por numero_expediente y no por id, para no repetir correlativos', async () => {
    const cliente = clienteCon([]);
    await generateExpedienteNumber(cliente);
    const sql = cliente.query.mock.calls[0][0];
    expect(sql).toMatch(/ORDER BY numero_expediente DESC/);
  });
});

describe('jwt.util', () => {
  test('un token de acceso se verifica y conserva el payload', () => {
    const token = signAccessToken({ id: 1, role: 'USER', email: 'a@unsaac.edu.pe' });
    const decoded = verifyAccessToken(token);

    expect(decoded).toMatchObject({ id: 1, role: 'USER', email: 'a@unsaac.edu.pe' });
    expect(decoded.exp).toBeGreaterThan(decoded.iat);
  });

  test('un token de renovación se verifica con su propio secreto', () => {
    const token = signRefreshToken({ id: 1, role: 'ADMIN' });
    expect(verifyRefreshToken(token)).toMatchObject({ id: 1, role: 'ADMIN' });
  });

  test('un token de acceso no sirve como token de renovación', () => {
    // Los secretos son distintos justamente para esto: filtrar el de acceso
    // no debe permitir forjar sesiones de larga duración.
    const acceso = signAccessToken({ id: 1, role: 'USER' });
    expect(() => verifyRefreshToken(acceso)).toThrow();
  });

  test('un token manipulado falla la verificación', () => {
    const token = signAccessToken({ id: 1, role: 'USER' });
    const manipulado = `${token.slice(0, -3)}abc`;
    expect(() => verifyAccessToken(manipulado)).toThrow();
  });
});

describe('asyncHandler', () => {
  test('deriva al siguiente middleware el error de una promesa rechazada', async () => {
    const fallo = new Error('boom');
    const next = jest.fn();

    await asyncHandler(async () => {
      throw fallo;
    })({}, {}, next);

    expect(next).toHaveBeenCalledWith(fallo);
  });

  test('no llama a next cuando el manejador termina bien', async () => {
    const next = jest.fn();

    await asyncHandler(async (req, res) => res.json({ ok: true }))(
      {},
      { json: jest.fn() },
      next
    );

    expect(next).not.toHaveBeenCalled();
  });
});
