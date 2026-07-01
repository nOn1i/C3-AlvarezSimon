import {prisma} from '../../utils/prisma'

export default defineEventHandler(async () => {
  return await prisma.usuario.findMany({
    include: { perfil: true },
    orderBy: { id: 'desc' }
  })
})