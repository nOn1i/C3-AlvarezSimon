import {prisma} from '../../utils/prisma'

export default defineEventHandler(async (event) => {

  const session = await requireUserSession(event)
  const usuarioId = session.user.id


  const body = await readBody(event)
  const { rutCliente, nombreCliente, fechaInicio, fechaTermino, vehiculoId, fotoEntrega } = body

  if (!rutCliente || !nombreCliente || !fechaInicio || !fechaTermino || !vehiculoId || !fotoEntrega) {
    throw createError({ statusCode: 400, statusMessage: 'Todos los campos son obligatorios.' })
  }

  const vehiculo = await prisma.vehiculo.findUnique({
    where: { id: parseInt(vehiculoId) },
    include: { tipo: true }
  })

  if (!vehiculo || vehiculo.estado !== 'disponible') {
    throw createError({ statusCode: 400, statusMessage: 'El vehículo seleccionado ya no está disponible.' })
  }


  const inicio = new Date(fechaInicio)
  const termino = new Date(fechaTermino)
  const diferenciaTiempo = Math.abs(termino.getTime() - inicio.getTime())

  const diasArriendo = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24)) || 1 
  const valorTotal = diasArriendo * vehiculo.tipo.valorDia

  try {

    const nuevoArriendo = await prisma.arriendo.create({
      data: {
        rutCliente: rutCliente.trim(),
        nombreCliente: nombreCliente.trim(),
        fechaInicio: inicio,
        fechaTermino: termino,
        valorTotal: valorTotal,
        vehiculoId: parseInt(vehiculoId),
        usuarioId: usuarioId, 
        fotoEntrega: fotoEntrega
      }
    })


    await prisma.vehiculo.update({
      where: { id: parseInt(vehiculoId) },
      data: { estado: 'arrendado' }
    })

    return { success: true, totalPagado: valorTotal }
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Error interno al registrar el arriendo.' })
  }
})