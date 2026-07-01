import {prisma} from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id } = body

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'El ID del usuario es obligatorio.' })
  }

  try {
    await prisma.usuario.delete({
      where: { id: parseInt(id) }
    })

    return { success: true }
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Error al eliminar el usuario de la base de datos.' })
  }
})