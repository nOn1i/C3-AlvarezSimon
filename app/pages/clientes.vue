<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <h1 class="font-bold text-4xl text-blue-900 mb-8">Clientes</h1>

    <!-- Lista -->
    <section class="bg-white rounded-xl shadow-md p-6">
      <div v-if="pending" class="text-center py-8 text-gray-500">Cargando...</div>
      <div v-else-if="!clientes || clientes.length === 0" class="text-center py-8 text-gray-400 italic">
        No hay clientes registrados. Los clientes aparecen al crear un arriendo.
      </div>
      <table v-else class="w-full text-sm">
        <thead>
          <tr class="text-left border-b-2 border-gray-200">
            <th class="pb-3 pr-4 font-semibold text-gray-700">RUT</th>
            <th class="pb-3 pr-4 font-semibold text-gray-700">Nombre</th>
            <th class="pb-3 font-semibold text-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="cliente in clientes"
            :key="cliente.rut"
            class="border-b border-gray-100 hover:bg-gray-50"
          >
            <td class="py-3 pr-4 font-mono">{{ cliente.rut }}</td>
            <td class="py-3 pr-4 font-medium">{{ cliente.nombre }}</td>
            <td class="py-3">
              <button
                class="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-semibold hover:bg-blue-200"
                @click="verDetalle(cliente.rut)"
              >
                Ver arriendos
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Modal detalle del cliente -->
    <div v-if="detalle" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-6">
      <div class="bg-white rounded-xl shadow-xl p-8 w-full max-w-4xl mx-4">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h2 class="text-2xl font-bold text-blue-900">{{ detalle.nombre }}</h2>
            <p class="text-gray-500 text-sm mt-1 font-mono">{{ detalle.rut }}</p>
          </div>
          <button class="text-gray-400 hover:text-gray-600 text-2xl leading-none" @click="detalle = null">
            ✕
          </button>
        </div>

        <div v-if="cargandoDetalle" class="text-center py-8 text-gray-500">Cargando arriendos...</div>
        <template v-else>
          <!-- Vigentes -->
          <section class="mb-6">
            <h3 class="text-lg font-bold text-green-700 mb-3 flex items-center gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-green-500" />
              Arriendos Vigentes ({{ detalle.arriendosVigentes?.length || 0 }})
            </h3>
            <p v-if="!detalle.arriendosVigentes?.length" class="text-gray-400 text-sm italic">Sin arriendos vigentes.</p>
            <table v-else class="w-full text-sm">
              <thead>
                <tr class="text-left border-b border-gray-200">
                  <th class="pb-2 pr-3 font-semibold text-gray-600">Vehículo</th>
                  <th class="pb-2 pr-3 font-semibold text-gray-600">Inicio</th>
                  <th class="pb-2 pr-3 font-semibold text-gray-600">Término</th>
                  <th class="pb-2 font-semibold text-gray-600">Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="a in detalle.arriendosVigentes" :key="a.id" class="border-b border-gray-100">
                  <td class="py-2 pr-3">{{ a.vehiculo.marca }} {{ a.vehiculo.modelo }} ({{ a.vehiculo.patente }})</td>
                  <td class="py-2 pr-3">{{ formatFecha(a.fechaInicio) }}</td>
                  <td class="py-2 pr-3">{{ formatFecha(a.fechaTermino) }}</td>
                  <td class="py-2">{{ a.valorTotal ? `$${a.valorTotal.toLocaleString('es-CL')}` : '—' }}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- Históricos -->
          <section>
            <h3 class="text-lg font-bold text-gray-600 mb-3 flex items-center gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-gray-400" />
              Historial de Arriendos ({{ detalle.arriendosHistoricos?.length || 0 }})
            </h3>
            <p v-if="!detalle.arriendosHistoricos?.length" class="text-gray-400 text-sm italic">Sin historial.</p>
            <table v-else class="w-full text-sm">
              <thead>
                <tr class="text-left border-b border-gray-200">
                  <th class="pb-2 pr-3 font-semibold text-gray-600">Vehículo</th>
                  <th class="pb-2 pr-3 font-semibold text-gray-600">Inicio</th>
                  <th class="pb-2 pr-3 font-semibold text-gray-600">Término</th>
                  <th class="pb-2 pr-3 font-semibold text-gray-600">Recepción</th>
                  <th class="pb-2 font-semibold text-gray-600">Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="a in detalle.arriendosHistoricos" :key="a.id" class="border-b border-gray-100">
                  <td class="py-2 pr-3">{{ a.vehiculo.marca }} {{ a.vehiculo.modelo }} ({{ a.vehiculo.patente }})</td>
                  <td class="py-2 pr-3">{{ formatFecha(a.fechaInicio) }}</td>
                  <td class="py-2 pr-3">{{ formatFecha(a.fechaTermino) }}</td>
                  <td class="py-2 pr-3">{{ a.fechaRecepcion ? formatFecha(a.fechaRecepcion) : '—' }}</td>
                  <td class="py-2">{{ a.valorTotal ? `$${a.valorTotal.toLocaleString('es-CL')}` : '—' }}</td>
                </tr>
              </tbody>
            </table>
          </section>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: clientes, pending } = await useFetch('/api/clientes')

const detalle = ref(null)
const cargandoDetalle = ref(false)

async function verDetalle(rut) {
  cargandoDetalle.value = true
  detalle.value = { rut, nombre: '', arriendosVigentes: [], arriendosHistoricos: [] }
  detalle.value = await $fetch(`/api/clientes/rut?rut=${rut}`)
  cargandoDetalle.value = false
}

function formatFecha(fechaStr) {
  return new Date(fechaStr).toLocaleDateString('es-CL', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  })
}
</script>
