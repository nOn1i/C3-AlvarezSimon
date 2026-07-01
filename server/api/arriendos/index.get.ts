import {prisma} from '../../utils/prisma'


export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  try {
    // Buscamos todos los arriendos en la base de datos
    const historial = await prisma.arriendo.findMany({
      include: {
        vehiculo: {
          include: {
            tipo: true 
          }
        },
        usuario: {
          select: {
            nombre: true,
            email: true 
          }
        }
      },
      orderBy: {
        id: 'desc' 
      }
    })

    return historial
  } catch (error) {
    console.error("ERROR AL OBTENER EL HISTORIAL:", error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno al cargar el historial de arriendos.'
    })
  }
})