<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <h1 class="font-bold text-4xl mb-8 text-blue-900">Módulo de Arriendos</h1>

    <section class="bg-white rounded-xl shadow-md p-6 mb-10 border border-gray-200">
      <h2 class="text-2xl font-bold mb-6 text-blue-800 border-b pb-2">Registrar Nuevo Arriendo</h2>
      
      <form class="grid grid-cols-1 md:grid-cols-2 gap-6" @submit.prevent="guardarArriendo">
        
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">RUT Cliente</label>
          <input v-model="formulario.rutCliente" type="text" required placeholder="12345678-9" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500">
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Nombre Cliente</label>
          <input v-model="formulario.nombreCliente" type="text" required placeholder="Nombre completo" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500">
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Fecha de Inicio</label>
          <input v-model="formulario.fechaInicio" type="date" required class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500">
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Fecha de Término</label>
          <input v-model="formulario.fechaTermino" type="date" required class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500">
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-semibold text-gray-700 mb-1">Vehículo a Arrendar</label>
          <select v-model="formulario.vehiculoId" required class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 bg-white">
            <option value="" disabled>Seleccione un vehículo disponible...</option>
            <option v-for="vehiculo in vehiculosDisponibles" :key="vehiculo.id" :value="vehiculo.id">
              {{ vehiculo.patente }} - {{ vehiculo.marca }} {{ vehiculo.modelo }} ({{ vehiculo.tipo?.nombre }} a ${{ vehiculo.tipo?.valorDia }}/día)
            </option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-semibold text-gray-700 mb-1">Fotografía del Estado de Entrega</label>
          <input type="file" accept="image/*" required @change="procesarImagen" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
        </div>

        <div class="md:col-span-2 flex items-center gap-4 mt-2">
          <button type="submit" :disabled="cargando" class="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 font-semibold disabled:opacity-50 transition">
            {{ cargando ? 'Procesando...' : 'Confirmar Arriendo' }}
          </button>
          <p v-if="mensajeError" class="text-red-600 font-medium">{{ mensajeError }}</p>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>

const { data: vehiculosDisponibles, refresh: refreshDisponibles } = await useFetch('/api/vehiculos/disponibles')

const cargando = ref(false)
const mensajeError = ref('')

const formulario = ref({
  rutCliente: '',
  nombreCliente: '',
  fechaInicio: '',
  fechaTermino: '',
  vehiculoId: '',
  fotoEntrega: ''
})

function procesarImagen(event) {
  const archivo = event.target.files[0]
  if (!archivo) return
  const lector = new FileReader()
  lector.onload = (e) => { formulario.value.fotoEntrega = e.target.result }
  lector.readAsDataURL(archivo)
}

async function guardarArriendo() {
  cargando.value = true
  mensajeError.value = ''

  if (new Date(formulario.value.fechaTermino) < new Date(formulario.value.fechaInicio)) {
    mensajeError.value = 'La fecha de término no puede ser anterior a la de inicio.'
    cargando.value = false
    return
  }

  try {
    // Llamada al endpoint POST que acabamos de crear
    const respuesta = await $fetch('/api/arriendos', {
      method: 'POST',
      body: formulario.value
    })

    // Mostrar el total calculado por el backend
    alert(`¡Arriendo registrado con éxito!\nEl total a cobrar es: $${respuesta.totalPagado}`)
    
    // Limpiar el formulario para el siguiente cliente
    formulario.value = { rutCliente: '', nombreCliente: '', fechaInicio: '', fechaTermino: '', vehiculoId: '', fotoEntrega: '' }
    
    // ¡Importante! Refrescar la lista para que el auto arrendado desaparezca del selector
    await refreshDisponibles()

  } 
  catch (error) {
    mensajeError.value = error.data?.statusMessage || 'Error al registrar el arriendo.'
  } 
  finally {
    cargando.value = false
  }



  if (new Date(formulario.value.fechaTermino) < new Date(formulario.value.fechaInicio)) {
    mensajeError.value = 'La fecha de término no puede ser anterior a la de inicio.'
    cargando.value = false
    return
  }

  try {

    alert("Formulario validado correctamente. Falta conectar el endpoint POST.")
  } catch (error) {
    mensajeError.value = 'Error al registrar.'
  } finally {
    cargando.value = false
  }
}
</script>