<template>
  <div class="max-w-md mx-auto mt-16 bg-white rounded-xl shadow-md p-8 border border-gray-200">
    <h1 class="text-3xl font-bold text-blue-900 mb-6 text-center">Iniciar Sesión</h1>
    
    <form @submit.prevent="hacerLogin" class="space-y-4">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label>
        <input 
          v-model="credenciales.email" 
          type="email" 
          required 
          placeholder="ejemplo@correo.cl"
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
        >
      </div>
      
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
        <input 
          v-model="credenciales.password" 
          type="password" 
          required 
          placeholder="••••••••"
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
        >
      </div>

      <button 
        type="submit" 
        :disabled="cargando"
        class="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 font-semibold mt-4 disabled:opacity-50 transition"
      >
        {{ cargando ? 'Verificando...' : 'Ingresar' }}
      </button>

      <p v-if="mensajeError" class="text-red-600 text-sm text-center mt-3 font-medium">
        {{ mensajeError }}
      </p>
    </form>
  </div>
</template>

<script setup>
const { fetch } = useUserSession() 

const credenciales = ref({
  email: '',
  password: ''
})

const cargando = ref(false)
const mensajeError = ref('')

async function hacerLogin() {
  cargando.value = true
  mensajeError.value = ''
  
  try {

    await $fetch('/api/auth/login', {
      method: 'POST',
      body: credenciales.value
    })
    

    await fetch()
    navigateTo('/') 
  } catch (error) {
    mensajeError.value = error.data?.statusMessage || 'Error al iniciar sesión. Intenta nuevamente.'
  } finally {
    cargando.value = false
  }
}
</script>