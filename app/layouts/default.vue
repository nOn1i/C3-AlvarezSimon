<template>
  <div class="flex flex-col min-h-screen bg-gray-50 text-gray-900">
    <div class="fixed inset-0 -z-10">
      <img src="https://previews.123rf.com/images/photosky99/photosky991503/photosky99150300008/37564729-background-texture-abstract-grey-background-grunge-design.jpg" class="w-full h-full object-cover opacity-110 blur-xs brightness-80">
    </div>

    <nav class="bg-blue-700 text-white">
      <div class="container mx-auto px-1 py-1 flex items-baseline-last justify-between">
        <div class="text-5xl">
          <span class="font-bold">ARRIENDOS</span>
          <span class="font-normal">Vehículos</span>
        </div>
        
        <ul class="hidden md:flex space-x-6 items-center">
          <li v-if="loggedIn"><NuxtLink to="/arriendos" class="hover:underline">Arriendos</NuxtLink></li>
          <li v-if="loggedIn"><NuxtLink to="/vehiculos" class="hover:underline">Vehículos</NuxtLink></li>
          <li v-if="loggedIn"><NuxtLink to="/devoluciones" class="hover:underline">Devoluciones</NuxtLink></li>
          <li v-if="loggedIn"><NuxtLink to="/historial" class="hover:underline">Historial</NuxtLink></li>
          <li v-if="loggedIn"><NuxtLink to="/clientes" class="hover:underline">Clientes</NuxtLink></li>
          <li v-if="loggedIn && user?.perfil === 'administrador'"><NuxtLink to="/admin" class="hover:underline font-semibold">Admin</NuxtLink></li>
        </ul>

        <div v-if="loggedIn" class="flex items-center gap-4 text-sm ml-4">
          <span class="text-blue-200">Hola, {{ user?.nombre }} ({{ user?.perfil }})</span>
          <NuxtLink to="/perfil" class="text-sm font-medium hover:underline mr-4">Mi Perfil</NuxtLink>
          <button @click="logout" class="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white font-semibold text-xs transition">
            Cerrar Sesión
          </button>
        </div>
        <div v-else class="text-sm">
          <NuxtLink to="/login" class="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white font-semibold transition">
            Iniciar Sesión
          </NuxtLink>
        </div>
      </div>
    </nav>

    <main class="flex-grow">
      <slot />
    </main>

    <footer class="bg-gray-900 text-gray-300 py-8 px-4 mt-auto">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <p class="font-bold text-white">Simon Alvarez Rojas</p>
          <p>Ingeniería en informática</p>
          <p>Taller de Lenguaje de Programación</p>
        </div>
        <div class="text-sm">
          <p>Certamen 3 - 2026</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>

const { loggedIn, user, clear } = useUserSession()

async function logout() {
  await clear()
  navigateTo('/login')
}
</script>