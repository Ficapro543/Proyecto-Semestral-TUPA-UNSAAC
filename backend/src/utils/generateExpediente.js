async function generateExpedienteNumber(client) {
  const currentYear = new Date().getFullYear();
  const yearPrefix = `EXP-${currentYear}-`;

  // Ordenar por numero_expediente y no por id_solicitud: el borrador se crea
  // antes de asignarse el expediente, así que el id más alto no siempre tiene
  // el correlativo más alto — y repetirlo viola el UNIQUE de la columna.
  const query = `
    SELECT numero_expediente
    FROM solicitud
    WHERE numero_expediente LIKE $1
    ORDER BY numero_expediente DESC
    LIMIT 1;
  `;
  
  const result = await client.query(query, [`${yearPrefix}%`]);
  
  let nextNumber = 1;
  if (result.rows.length > 0) {
    const lastExp = result.rows[0].numero_expediente;
    const parts = lastExp.split('-');
    if (parts.length === 3) {
      const lastSeq = parseInt(parts[2], 10);
      if (!isNaN(lastSeq)) {
        nextNumber = lastSeq + 1;
      }
    }
  }

  const paddedNumber = String(nextNumber).padStart(6, '0');
  return `${yearPrefix}${paddedNumber}`;
}

module.exports = { generateExpedienteNumber };
