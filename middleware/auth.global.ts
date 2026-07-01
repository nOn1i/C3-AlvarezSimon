export default defineNuxtRouteMiddleware(async (to, from) => {
  const { loggedIn } = useUserSession()

  const rutasPublicas = ['/login', '/'] 
  
  if (!loggedIn.value && !rutasPublicas.includes(to.path)){
    return navigateTo('/login')
  }
  if (loggedIn.value && to.path === '/login'){
    return navigateTo('/')
  }
})