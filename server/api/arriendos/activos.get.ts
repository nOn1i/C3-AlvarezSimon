import {prisma} from '../../utils/prisma'
export default defineEventHandler(async () => {

  const activos = await prisma.arriendo.findMany({
    where: {
      fechaRecepcion: null
    },
    include: {
      vehiculo: true 
    }
  })
  
  return activos
})