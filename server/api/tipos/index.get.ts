import {prisma} from '../../utils/prisma'

export default defineEventHandler(async () => {
  const tipos = await prisma.tipoVehiculo.findMany()
  return tipos
})