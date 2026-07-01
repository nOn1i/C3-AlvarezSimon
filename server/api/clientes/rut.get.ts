import {prisma} from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const { rut } = getQuery(event)

  const arriendos = await prisma.arriendo.findMany({
    where: { rutCliente: rut },
    include: { vehiculo: { include: { tipo: true } }, usuario: true },
    orderBy: { fechaInicio: 'desc' }
  })

  if (!arriendos.length) {
    throw createError({ statusCode: 404, statusMessage: 'Cliente no encontrado' })
  }

  const ahora = new Date()
  return {
    rut,
    nombre: arriendos[0].nombreCliente,
    arriendosVigentes: arriendos.filter(a => !a.fechaRecepcion && new Date(a.fechaTermino) >= ahora),
    arriendosHistoricos: arriendos.filter(a => a.fechaRecepcion || new Date(a.fechaTermino) < ahora)
  }
})
