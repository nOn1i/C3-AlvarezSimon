import {prisma} from '../../utils/prisma'
import bcrypt from 'bcryptjs'


export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { nombre, rut, email, password, perfilId } = body

  if (!nombre || !rut || !email || !password || !perfilId) {
    throw createError({ statusCode: 400, statusMessage: 'Todos los campos son obligatorios.' })
  }


  const existeUsuario = await prisma.usuario.findFirst({
    where: { OR: [{ email: email }, { rut: rut }] }
  })

  if (existeUsuario) {
    throw createError({ statusCode: 400, statusMessage: 'Ya existe un usuario con ese correo o RUT.' })
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  try {
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre: nombre.trim(),
        rut: rut.trim(),
        email: email.trim(),
        password: hashedPassword, 
        perfilId: parseInt(perfilId)
      }
    })

    return { success: true, usuario: nuevoUsuario }
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Error al registrar el usuario en la base de datos.' })
  }
})