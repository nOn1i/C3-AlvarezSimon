import { prisma } from '../../utils/prisma'

export default defineEventHandler(async () => {
  const disponibles = await prisma.vehiculo.findMany({
    where: { estado: 'disponible' },
    include: { tipo: true }
  })
  return disponibles
})