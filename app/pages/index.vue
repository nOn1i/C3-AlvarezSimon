<template>
  <div class="container mx-auto px-4 py-12">
    <div class="text-center bg-white rounded-lg shadow-md p-10 border border-gray-200 max-w-3xl mx-auto">
      <h1 class="text-4xl font-bold text-blue-900 mb-4">Bienvenido</h1>
      <p class="text-lg text-gray-700 mb-8">Sistema de gestion y arriendo de vehiculos</p>
      
      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <NuxtLink to="/vehiculos" class="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-md font-semibold transition">
          Gestionar Vehículos
        </NuxtLink>
        <NuxtLink to="/arriendos" class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-semibold transition">
          Módulo de Arriendos
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>