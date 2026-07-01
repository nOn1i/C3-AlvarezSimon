import { prisma } from '../../utils/prisma'
import bcrypt from 'bcryptjs'


export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const usuarioId = session.user.id

  const body = await readBody(event)
  const { passwordActual, passwordNueva } = body

  if (!passwordActual || !passwordNueva) {
    throw createError({ statusCode: 400, statusMessage: 'Ambas contraseñas son obligatorias.' })
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId }
  })


  const passwordCorrecta = await bcrypt.compare(passwordActual, usuario.password)
  
  if (!passwordCorrecta) {
    throw createError({ statusCode: 400, statusMessage: 'La contraseña actual es incorrecta.' })
  }


  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(passwordNueva, salt)

  try {
    await prisma.usuario.update({
      where: { id: usuarioId },
      data: { password: hashedPassword }
    })

    return { success: true }
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Error interno al actualizar la contraseña.' })
  }
})