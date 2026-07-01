import {prisma} from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { arriendoId, fotoRecepcion } = body

  if (!arriendoId || !fotoRecepcion) {
    throw createError({ 
      statusCode: 400, 
      statusMessage: 'El ID del arriendo y la fotografía son obligatorios.' 
    })
  }

  try {

    const arriendoActualizado = await prisma.arriendo.update({
      where: { id: parseInt(arriendoId) },
      data: {
        fechaRecepcion: new Date(), 
        fotoRecepcion: fotoRecepcion
      }
    })

    await prisma.vehiculo.update({
      where: { id: arriendoActualizado.vehiculoId },
      data: { estado: 'disponible' }
    })

    return { success: true }
  } catch (error: any) {
    console.error("ERROR EN DEVOLUCION:", error)
    throw createError({ 
      statusCode: 500, 
      statusMessage: 'Error interno al registrar la devolución.' 
    })
  }
})