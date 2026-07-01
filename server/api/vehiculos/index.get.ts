import { prisma } from '../../utils/prisma'

export default defineEventHandler(async () => {
  const vehiculos = await prisma.vehiculo.findMany({
    include: {
      tipo: true 
    },
    orderBy: {
      id: 'desc' 
    }
  })
  
  return vehiculos
})