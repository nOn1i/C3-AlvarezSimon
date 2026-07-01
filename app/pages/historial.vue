<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="font-bold text-4xl mb-8 text-blue-900">Historial de Arriendos</h1>

    <section class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div v-if="pending" class="p-8 text-center text-gray-500">
        Cargando historial...
      </div>
      
      <div v-else-if="!arriendos || arriendos.length === 0" class="p-8 text-center text-gray-500">
        No hay arriendos registrados en el sistema.
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehículo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Período</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Cobrado</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acción</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="arriendo in arriendos" :key="arriendo.id" class="hover:bg-gray-50 transition">
            <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
              {{ arriendo.vehiculo?.patente }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-600">
              {{ arriendo.nombreCliente }} <br>
              <span class="text-xs text-gray-400">{{ arriendo.rutCliente }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ formatearFecha(arriendo.fechaInicio) }} al {{ formatearFecha(arriendo.fechaTermino) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-700">
              {{ formatearDinero(arriendo.valorTotal) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 py-1 text-xs font-bold rounded-full"
                :class="arriendo.fechaRecepcion ? 'bg-gray-200 text-gray-800' : 'bg-green-100 text-green-800'"
              >
                {{ arriendo.fechaRecepcion ? 'FINALIZADO' : 'VIGENTE' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <button 
                @click="abrirDetalle(arriendo)"
                class="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 font-semibold text-sm transition"
              >
                Ver Detalles
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <div v-if="modalAbierto" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        
        <div class="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 class="text-2xl font-bold text-blue-900">Detalle del Arriendo #{{ arriendoSeleccionado.id }}</h2>
          <button @click="cerrarModal" class="text-gray-500 hover:text-red-600 font-bold text-xl">&times;</button>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 class="font-bold text-lg mb-3 text-gray-800 border-b pb-2">Datos Generales</h3>
              <p class="mb-1"><span class="font-semibold">Vehículo:</span> {{ arriendoSeleccionado.vehiculo?.marca }} {{ arriendoSeleccionado.vehiculo?.modelo }} ({{ arriendoSeleccionado.vehiculo?.patente }})</p>
              <p class="mb-1"><span class="font-semibold">Cliente:</span> {{ arriendoSeleccionado.nombreCliente }} ({{ arriendoSeleccionado.rutCliente }})</p>
              <p class="mb-1"><span class="font-semibold">Ejecutivo a cargo:</span> {{ arriendoSeleccionado.usuario?.nombre }}</p>
              <p class="mb-1"><span class="font-semibold">Total Cobrado:</span> {{ formatearDinero(arriendoSeleccionado.valorTotal) }}</p>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 class="font-bold text-lg mb-3 text-gray-800 border-b pb-2">Fechas Registradas</h3>
              <p class="mb-1"><span class="font-semibold">Inicio pactado:</span> {{ formatearFecha(arriendoSeleccionado.fechaInicio) }}</p>
              <p class="mb-1"><span class="font-semibold">Término pactado:</span> {{ formatearFecha(arriendoSeleccionado.fechaTermino) }}</p>
              <p class="mt-3 pt-2 border-t border-gray-200" :class="arriendoSeleccionado.fechaRecepcion ? 'text-green-700' : 'text-red-600 font-semibold'">
                <span class="font-semibold text-gray-800">Devolución real:</span> 
                {{ arriendoSeleccionado.fechaRecepcion ? formatearFecha(arriendoSeleccionado.fechaRecepcion) : 'AÚN NO DEVUELTO' }}
              </p>
            </div>
          </div>

          <h3 class="font-bold text-xl mb-4 text-blue-800 border-b pb-2">Registro Fotográfico</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div class="border rounded-lg overflow-hidden">
              <div class="bg-gray-100 p-2 text-center font-semibold text-gray-700 border-b">Estado de Entrega</div>
              <img 
                :src="arriendoSeleccionado.fotoEntrega" 
                alt="Foto Entrega" 
                class="w-full h-64 object-cover"
              >
            </div>

            <div class="border rounded-lg overflow-hidden">
              <div class="bg-gray-100 p-2 text-center font-semibold text-gray-700 border-b">Estado de Recepción</div>
              <div v-if="!arriendoSeleccionado.fotoRecepcion" class="w-full h-64 bg-gray-50 flex items-center justify-center text-gray-400">
                Pendiente de devolución
              </div>
              <img 
                v-else
                :src="arriendoSeleccionado.fotoRecepcion" 
                alt="Foto Recepción" 
                class="w-full h-64 object-cover"
              >
            </div>

          </div>
        </div>
        
      </div>
    </div>

  </div>
</template>

<script setup>
const { data: arriendos, pending } = await useFetch('/api/arriendos')


const modalAbierto = ref(false)
const arriendoSeleccionado = ref(null)


function abrirDetalle(arriendo) {
  arriendoSeleccionado.value = arriendo
  modalAbierto.value = true
  document.body.style.overflow = 'hidden'
}

function cerrarModal() {
  modalAbierto.value = false
  arriendoSeleccionado.value = null
  document.body.style.overflow = 'auto'
}

function formatearFecha(fechaISO) {
  if (!fechaISO) return ''
  const fecha = new Date(fechaISO)
  const utcDate = new Date(fecha.getTime() + fecha.getTimezoneOffset() * 60000)
  return utcDate.toLocaleDateString('es-CL')
}

function formatearDinero(monto) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(monto)
}
</script>