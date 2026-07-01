<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <h1 class="font-bold text-4xl mb-8 text-blue-900">Panel de Administración</h1>
    <section class="bg-white rounded-xl shadow-md p-6 mb-10 border border-gray-200">
      <h2 class="text-2xl font-bold mb-4 text-blue-800 border-b pb-2">Registrar Nuevo Tipo de Vehículo</h2>
      
      <form class="flex flex-col sm:flex-row gap-4 items-end" @submit.prevent="guardarTipo">
        <div class="flex-grow">
          <label class="block text-sm font-semibold text-gray-700 mb-1">Nombre (Ej: Coupé)</label>
          <input v-model="formTipo.nombre" type="text" required class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500">
        </div>
        
        <div class="flex-grow">
          <label class="block text-sm font-semibold text-gray-700 mb-1">Valor por Día ($)</label>
          <input v-model="formTipo.valorDia" type="number" required min="0" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500">
        </div>
        
        <button type="submit" :disabled="cargandoTipo" class="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 font-semibold disabled:opacity-50 transition h-[42px] mb-[2px]">
          {{ cargandoTipo ? 'Guardando...' : 'Agregar Tipo' }}
        </button>
      </form>
    </section>
    <section class="bg-white rounded-xl shadow-md p-6 mb-10 border border-gray-200">
      <h2 class="text-2xl font-bold mb-6 text-blue-800 border-b pb-2">Registrar Nuevo Usuario</h2>
      
      <form class="grid grid-cols-1 md:grid-cols-2 gap-6" @submit.prevent="guardarUsuario">
        
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Nombre Completo</label>
          <input v-model="formulario.nombre" type="text" required placeholder="Ej: Simon Alvarez" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500">
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">RUT</label>
          <input v-model="formulario.rut" type="text" required placeholder="21558825-4" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500">
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label>
          <input v-model="formulario.email" type="email" required placeholder="ejecutivo@usm.cl" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500">
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
          <input v-model="formulario.password" type="password" required placeholder="••••••••" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500">
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-semibold text-gray-700 mb-1">Perfil del Usuario</label>
          <select v-model="formulario.perfilId" required class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 bg-white">
            <option value="" disabled>Seleccione un rol...</option>
            <option v-for="perfil in perfiles" :key="perfil.id" :value="perfil.id">
              {{ perfil.nombre.toUpperCase() }}
            </option>
          </select>
        </div>

        <div class="md:col-span-2 flex items-center gap-4 mt-2">
          <button type="submit" :disabled="cargando" class="bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-800 font-semibold disabled:opacity-50 transition">
            {{ cargando ? 'Guardando...' : 'Crear Cuenta' }}
          </button>
          <p v-if="mensajeError" class="text-red-600 font-medium">{{ mensajeError }}</p>
        </div>
      </form>
    </section>

    <section>
      <h2 class="text-2xl font-bold mb-6 text-blue-800 border-b pb-2">Usuarios del Sistema</h2>
      
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
       <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RUT</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="usuario in usuarios" :key="usuario.id">
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ usuario.nombre }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ usuario.rut }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ usuario.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {{ usuario.perfil?.nombre }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="eliminarUsuario(usuario.id)" 
                  class="text-red-600 hover:text-red-900 font-bold bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>

const { user } = useUserSession()
if (user.value?.perfil !== 'administrador') {
  navigateTo('/')
}


const { data: perfiles } = await useFetch('/api/admin/perfiles')
const { data: usuarios, refresh } = await useFetch('/api/admin/usuarios')

const cargando = ref(false)
const mensajeError = ref('')

const formulario = ref({
  nombre: '',
  rut: '',
  email: '',
  password: '',
  perfilId: ''
})

async function guardarUsuario() {
  cargando.value = true
  mensajeError.value = ''

  try {
    await $fetch('/api/admin/usuarios', {
      method: 'POST',
      body: formulario.value
    })

    alert("¡Usuario creado exitosamente!")
    formulario.value = { nombre: '', rut: '', email: '', password: '', perfilId: '' }
    await refresh()

  } catch (error) {
    mensajeError.value = error.data?.statusMessage || 'Error al crear el usuario.'
  } finally {
    cargando.value = false
  }
}
const cargandoTipo = ref(false)
const formTipo = ref({
  nombre: '',
  valorDia: ''
})

async function guardarTipo() {
  cargandoTipo.value = true
  
  try {
    await $fetch('/api/admin/tipos', {
      method: 'POST',
      body: formTipo.value
    })

    alert("¡Tipo de vehículo agregado con éxito a la base de datos!")
    formTipo.value = { nombre: '', valorDia: '' }
    
  } catch (error) {
    alert(error.data?.statusMessage || 'Error al guardar el tipo de vehículo.')
  } finally {
    cargandoTipo.value = false
  }
}

async function eliminarUsuario(idUsuario){
  if (!confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción es irreversible.')) {
    return
  }

  try {
    await $fetch('/api/admin/usuarios', {
      method: 'DELETE',
      body: { id: idUsuario }
    })
    
    alert('Usuario eliminado correctamente.')
    await refresh()
    
  } catch (error) {
    alert(error.data?.statusMessage || 'Error al intentar eliminar el usuario.')
  }
}
</script>