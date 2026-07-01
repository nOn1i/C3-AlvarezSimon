import {prisma} from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { nombre, valorDia } = body

  if (!nombre || !valorDia){
    throw createError({ statusCode: 400, statusMessage: 'Nombre y valor diario son obligatorios.' })
  }

  try{
    const nuevoTipo = await prisma.tipoVehiculo.create({
      data:{
        nombre: nombre.trim(),
        valorDia: parseInt(valorDia)
      }
    })

    return { success: true, tipo: nuevoTipo }
  } catch (error){
    throw createError({ statusCode: 500, statusMessage: 'Error al registrar el tipo de vehículo.' })
  }
})