<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <h1 class="font-bold text-4xl mb-8 text-blue-900">Gestión de Vehículos</h1>

    <section class="bg-white rounded-xl shadow-md p-6 mb-10 border border-gray-200">
      <h2 class="text-2xl font-bold mb-6 text-blue-800 border-b pb-2">Registrar Nuevo Vehículo</h2>
      
      <form class="grid grid-cols-1 md:grid-cols-2 gap-6" @submit.prevent="guardarVehiculo">
        
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Patente</label>
          <input
            v-model="formulario.patente"
            type="text"
            required
            placeholder="Ej: AB-CD-12"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 uppercase"
          >
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Marca</label>
          <input
            v-model="formulario.marca"
            type="text"
            required
            placeholder="Ej: Toyota"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          >
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Modelo</label>
          <input
            v-model="formulario.modelo"
            type="text"
            required
            placeholder="Ej: Yaris"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          >
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Tipo de Vehículo</label>
          <select 
            v-model="formulario.tipoVehiculoId" 
            required
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 bg-white"
          >
            <option value="" disabled>Seleccione un tipo...</option>
            <option v-for="tipo in tipos" :key="tipo.id" :value="tipo.id">
              {{ tipo.nombre }} - Valor diario: ${{ tipo.valorDia }}
            </option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-semibold text-gray-700 mb-1">Fotografía del Vehículo</label>
          <input 
            type="file" 
            accept="image/*"
            required
            @change="procesarImagen"
            class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          >
          <p class="text-xs text-gray-500 mt-1">Sube una imagen en formato JPG o PNG.</p>
        </div>

        <div class="md:col-span-2 flex items-center gap-4 mt-2">
          <button
            type="submit"
            :disabled="cargando"
            class="bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-800 font-semibold disabled:opacity-50 transition"
          >
            {{ cargando ? 'Guardando...' : 'Guardar Vehículo' }}
          </button>
          <p v-if="mensajeExito" class="text-green-600 font-medium">¡Vehículo registrado exitosamente!</p>
          <p v-if="mensajeError" class="text-red-600 font-medium">{{ mensajeError }}</p>
        </div>
      </form>
    </section>

    <section>
      <h2 class="text-2xl font-bold mb-6 text-blue-800 border-b pb-2">Flota Actual</h2>
      
      <div v-if="!vehiculos || vehiculos.length === 0" class="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-200">
        No hay vehículos registrados en la base de datos.
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="vehiculo in vehiculos" :key="vehiculo.id" class="bg-white rounded-lg shadow-md flex flex-col overflow-hidden border border-gray-200">
          <img
            :src="vehiculo.foto || 'https://via.placeholder.com/400x250?text=Sin+Foto'"
            :alt="vehiculo.patente"
            class="w-full h-48 object-cover"
          >
          <div class="p-4 flex flex-col flex-grow">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-xl font-bold text-gray-900 uppercase">{{ vehiculo.patente }}</h3>
                <select
                    v-model="vehiculo.estado"
                    @change="actualizarEstado(vehiculo.id, vehiculo.estado)"
                    class="text-xs font-bold rounded-full px-2 py-1 border-0 cursor-pointer outline-none shadow-sm"
                    :class="{
                     'bg-green-100 text-green-800': vehiculo.estado === 'disponible',
                     'bg-blue-100 text-blue-800': vehiculo.estado === 'arrendado',
                        'bg-yellow-100 text-yellow-800': vehiculo.estado === 'en mantenimiento',
                        'bg-red-100 text-red-800': vehiculo.estado === 'de baja'
                      }"
                  >
                      <option value="disponible">disponible</option>
                   <option value="arrendado">arrendado</option>
                   <option value="en mantenimiento">en mantenimiento</option>
                   <option value="de baja">de baja</option>
                 </select>
            </div>
            
            <p class="text-gray-600 mb-1"><span class="font-semibold">Marca:</span> {{ vehiculo.marca }}</p>
            <p class="text-gray-600 mb-1"><span class="font-semibold">Modelo:</span> {{ vehiculo.modelo }}</p>
            
            <button class="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 font-medium transition">
              Ver Detalles
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>

const { data: tipos } = await useFetch('/api/tipos')
const { data: vehiculos, pending, refresh } = await useFetch('/api/vehiculos')

const cargando = ref(false)
const mensajeExito = ref(false)
const mensajeError = ref('')

const formulario = ref({
  patente: '',
  marca: '',
  modelo: '',
  tipoVehiculoId: '',
  foto: '' 
})

function procesarImagen(event) {
  const archivo = event.target.files[0]
  if (!archivo) return

  const lector = new FileReader()
  lector.onload = (e) => {
    formulario.value.foto = e.target.result 
  }
  lector.readAsDataURL(archivo)
}

async function guardarVehiculo() {
  cargando.value = true
  mensajeExito.value = false
  mensajeError.value = ''

  try {
    await $fetch('/api/vehiculos', { 
      method: 'POST', 
      body: formulario.value 
    })
    
    mensajeExito.value = true
    formulario.value = { patente: '', marca: '', modelo: '', tipoVehiculoId: '', foto: '' }
    
    await refresh()
    
    setTimeout(() => { mensajeExito.value = false }, 3000)

  } catch (error) {
    mensajeError.value = error.data?.statusMessage || 'Error al registrar el vehículo.'
  } finally {
    cargando.value = false
  }
}

async function actualizarEstado(idVehiculo, estadoNuevo) {
  try {
    await $fetch('/api/vehiculos/estado', {
      method: 'PUT',
      body: { 
        vehiculoId: idVehiculo, 
        nuevoEstado: estadoNuevo 
      }
    })
    
  } catch (error) {
    alert('Error al actualizar el estado. Se revertirá el cambio.')

    await refresh()
  }
}

</script>