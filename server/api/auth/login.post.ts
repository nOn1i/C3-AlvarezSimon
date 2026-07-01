import bcrypt from 'bcryptjs'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({
        statusCode: 400,
        statusMessage: 'Email y contraseña son requeridos'
    })
  }

  const usuario = await prisma.usuario.findUnique({
    where: { email },
    include: { perfil: true }
    })

    if (!usuario) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Usuario no encontrado'
        })
    }

    const passwordCorrecta = await bcrypt.compare(password, usuario.password)
    if (!passwordCorrecta) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Contraseña incorrecta'
        })
    }

    await setUserSession(event, {
        user: {
            id: usuario.id,
            rut: usuario.rut,
            email: usuario.email,
            nombre: usuario.nombre,
            perfil: usuario.perfil.nombre
        }
    })

    return {success:true}
})
    