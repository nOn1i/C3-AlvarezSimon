<template>
  <div class="max-w-2xl mx-auto px-4 py-12">
    <h1 class="font-bold text-4xl mb-8 text-blue-900">Mi Perfil</h1>

    <section class="bg-white rounded-xl shadow-md p-8 border border-gray-200">
      <h2 class="text-2xl font-bold mb-6 text-blue-800 border-b pb-2">Cambiar Contraseña</h2>
      
      <form class="flex flex-col gap-5" @submit.prevent="cambiarPassword">
        
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Contraseña Actual</label>
          <input 
            v-model="formulario.passwordActual" 
            type="password" 
            required 
            placeholder="••••••••" 
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          >
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Nueva Contraseña</label>
          <input 
            v-model="formulario.passwordNueva" 
            type="password" 
            required 
            placeholder="••••••••" 
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          >
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Confirmar Nueva Contraseña</label>
          <input 
            v-model="formulario.passwordConfirmacion" 
            type="password" 
            required 
            placeholder="••••••••" 
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          >
        </div>

        <div class="flex items-center gap-4 mt-4">
          <button 
            type="submit" 
            :disabled="cargando" 
            class="bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-800 font-semibold disabled:opacity-50 transition"
          >
            {{ cargando ? 'Verificando...' : 'Actualizar Contraseña' }}
          </button>
          <p v-if="mensajeExito" class="text-green-600 font-medium">¡Contraseña actualizada con éxito!</p>
          <p v-if="mensajeError" class="text-red-600 font-medium">{{ mensajeError }}</p>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>
const cargando = ref(false)
const mensajeExito = ref(false)
const mensajeError = ref('')

const formulario = ref({
  passwordActual: '',
  passwordNueva: '',
  passwordConfirmacion: ''
})

async function cambiarPassword() {
  cargando.value = true
  mensajeExito.value = false
  mensajeError.value = ''


  if (formulario.value.passwordNueva !== formulario.value.passwordConfirmacion) {
    mensajeError.value = 'Las contraseñas nuevas no coinciden.'
    cargando.value = false
    return
  }

  try {
    await $fetch('/api/auth/password', {
      method: 'PUT',
      body: {
        passwordActual: formulario.value.passwordActual,
        passwordNueva: formulario.value.passwordNueva
      }
    })
    
    mensajeExito.value = true
    

    formulario.value = { passwordActual: '', passwordNueva: '', passwordConfirmacion: '' }
    

    setTimeout(() => { mensajeExito.value = false }, 3000)

  } catch (error) {
    mensajeError.value = error.data?.statusMessage || 'Error al cambiar la contraseña.'
  } finally {
    cargando.value = false
  }
}
</script>