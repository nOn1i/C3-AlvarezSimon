<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <h1 class="font-bold text-4xl mb-8 text-blue-900">Recepción de Vehículos</h1>

    <section class="bg-white rounded-xl shadow-md p-6 mb-10 border border-gray-200">
      <h2 class="text-2xl font-bold mb-6 text-blue-800 border-b pb-2">Registrar Devolución</h2>
      
      <form class="grid grid-cols-1 gap-6" @submit.prevent="guardarDevolucion">
        
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Arriendo en Curso</label>
          <select v-model="formulario.arriendoId" required class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 bg-white">
            <option value="" disabled>Seleccione un vehículo a devolver...</option>
            <option v-for="arriendo in arriendosActivos" :key="arriendo.id" :value="arriendo.id">
              {{ arriendo.vehiculo?.patente }} - Arrendado a: {{ arriendo.nombreCliente }} (RUT: {{ arriendo.rutCliente }})
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Fotografía del Estado de Recepción</label>
          <input 
            type="file" 
            accept="image/*" 
            required 
            @change="procesarImagen" 
            class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          >
          <p class="text-xs text-gray-500 mt-1">Sube una foto actual para verificar el estado del vehículo.</p>
        </div>

        <div class="flex items-center gap-4 mt-2">
          <button 
            type="submit" 
            :disabled="cargando" 
            class="bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-800 font-semibold disabled:opacity-50 transition"
          >
            {{ cargando ? 'Procesando...' : 'Confirmar Devolución' }}
          </button>
          <p v-if="mensajeError" class="text-red-600 font-medium">{{ mensajeError }}</p>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>

const { data: arriendosActivos, refresh } = await useFetch('/api/arriendos/activos')

const cargando = ref(false)
const mensajeError = ref('')

const formulario = ref({
  arriendoId: '',
  fotoRecepcion: ''
})

function procesarImagen(event) {
  const archivo = event.target.files[0]
  if (!archivo) return
  const lector = new FileReader()
  lector.onload = (e) => { formulario.value.fotoRecepcion = e.target.result }
  lector.readAsDataURL(archivo)
}

async function guardarDevolucion() {
  cargando.value = true
  mensajeError.value = ''

  try {
    await $fetch('/api/arriendos/devolucion', {
      method: 'POST',
      body: formulario.value
    })

    alert("¡Vehículo recibido con éxito!\nEl estado del vehículo ha vuelto a 'disponible'.")

    formulario.value = { arriendoId: '', fotoRecepcion: '' }

    await refresh()

  } catch (error) {
    mensajeError.value = error.data?.statusMessage || 'Error al registrar la devolución.'
  } finally {
    cargando.value = false
  }
}
</script>