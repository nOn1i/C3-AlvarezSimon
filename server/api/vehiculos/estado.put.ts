import {prisma} from '../../utils/prisma'

export default defineEventHandler(async (event) =>{
  const body=await readBody(event)
  const {vehiculoId, nuevoEstado} = body

  if (!vehiculoId || !nuevoEstado){
    throw createError({statusCode: 400, statusMessage: 'Faltan datos para actualizar el estado.'})
  }

  try{
    await prisma.vehiculo.update({
      where: {id: parseInt(vehiculoId)},
      data: {estado: nuevoEstado}
    })

    return {success: true}
  } 
  catch (error){
    throw createError({ statusCode: 500, statusMessage: 'Error al cambiar el estado del vehículo.'})
  }
})