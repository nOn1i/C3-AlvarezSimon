import {prisma} from '../../utils/prisma'

export default defineEventHandler(async () => {
  const filas = await prisma.arriendo.findMany({
    distinct: ['rutCliente'],
    select: { rutCliente: true, nombreCliente: true },
    orderBy: { nombreCliente: 'asc' }
  })
  return filas.map(f => ({ rut: f.rutCliente, nombre: f.nombreCliente }))
})
