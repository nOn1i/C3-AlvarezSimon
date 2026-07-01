import { prisma } from '../../utils/prisma'


export default defineEventHandler(async (event)=> {
    const body = await readBody(event)
    const {patente, marca, modelo, tipoVehiculoId, foto} = body

    if (!patente || !marca || !modelo || !tipoVehiculoId || !foto ) {
        throw createError({
            statusCode: 400, 
            statusMessage: 'Todos los campos son obligatorios'
        })
    }
        
    const patenteEnMayusculas = patente.toUpperCase().trim()
    const existeVehiculo = await prisma.vehiculo.findUnique({
        where: {patente: patenteEnMayusculas}
    })
    
    if (existeVehiculo){
        throw createError({
            statusCode: 400,
            statusMessage: 'ya existe un vehiculo registrado con esta patente'
        })
    }

    try {
        const nuevoVehiculo = await prisma.vehiculo.create({
            data: {
                patente: patenteEnMayusculas,
                marca: marca.trim(),
                modelo: modelo.trim(),
                foto: foto,
                tipoVehiculoId: parseInt(tipoVehiculoId),
                estado: 'disponible'
            }
        })
        return {success: true, vehiculo: nuevoVehiculo}
    }
    catch(error){
        throw createError({
            statusCode:500,
            statusMessage: 'Error al guardar vehiculo en la base de datos'
        })
    
    }
})