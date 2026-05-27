// app.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Configuración unificada del cliente Supabase
export const supabase = createClient(
  'https://feylqcbnbndaefshhrpv.supabase.co',
  'sb_publishable_RAlV0OCSUQNvEhmZam1cwA_3aViGAzg',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
)

/* ==================================================
   LÓGICA DE LOGIN (solo se ejecuta en login.html)
   ================================================== */
const loginForm = document.getElementById('loginForm')
const errorMessage = document.getElementById('error-message')

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const correo = document.getElementById('correo').value.trim()
    const clave = document.getElementById('clave').value

    if (!correo || !clave) {
      errorMessage.textContent = 'Completa todos los campos'
      errorMessage.style.display = 'block'
      return
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: correo,
        password: clave
      })

      if (error) {
        errorMessage.textContent = error.message
        errorMessage.style.display = 'block'
        return
      }

      if (data.user) {
        // Guardar nombre en localStorage para el navbar
        const u = data.user
        const nombreFromMetadata = u.user_metadata && (u.user_metadata.full_name || u.user_metadata.name)
        const nombre = nombreFromMetadata || (u.email ? u.email.split('@')[0] : 'Usuario')
        localStorage.setItem('navUserName', nombre)
        // Compatibilidad con páginas que aún lean 'usuario'
        try {
          localStorage.setItem('usuario', JSON.stringify({ Nombre: nombre }))
        } catch (e) {
          console.warn('No se pudo guardar objeto usuario en localStorage', e)
        }

        window.location.href = 'primimim.html'
      }
    } catch (err) {
      errorMessage.textContent = 'Error al iniciar sesión'
      errorMessage.style.display = 'block'
      console.error(err)
    }
  })
}

/* ==================================================
   AUTENTICACIÓN COMPARTIDA (navbar + sesión)
   ================================================== */
let cerrandoSesionExplicitamente = false

function inicializarNombreDesdeCache() {
  const nombreEl = document.getElementById('nav-user-name')
  const avatarEl = document.getElementById('nav-avatar')
  const cachedName = localStorage.getItem('navUserName') || sessionStorage.getItem('navUserName')
  if (cachedName) {
    nombreEl.innerText = cachedName
    avatarEl.innerText = cachedName.charAt(0).toUpperCase()
  } else {
    nombreEl.innerText = 'Usuario'
    avatarEl.innerText = 'U'
  }
}

function actualizarNombreDesdeUsuario(user) {
  const nombreEl = document.getElementById('nav-user-name')
  const avatarEl = document.getElementById('nav-avatar')
  if (!nombreEl || !avatarEl) return

  if (user?.email) {
    const nombre = user.email.split('@')[0]
    nombreEl.innerText = nombre
    avatarEl.innerText = nombre.charAt(0).toUpperCase()
    localStorage.setItem('navUserName', nombre)
    sessionStorage.setItem('navUserName', nombre)
  } else {
    const cachedName = localStorage.getItem('navUserName') || sessionStorage.getItem('navUserName')
    if (cachedName) {
      nombreEl.innerText = cachedName
      avatarEl.innerText = cachedName.charAt(0).toUpperCase()
    } else {
      nombreEl.innerText = 'Usuario'
      avatarEl.innerText = 'U'
    }
  }
}

async function inicializarSesion() {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user) {
    actualizarNombreDesdeUsuario(session.user)
  } else {
    actualizarNombreDesdeUsuario(null)
  }
}

// Función principal que deben llamar las páginas con navbar
export async function initAuth() {
  // Mostrar inmediatamente lo que haya en caché
  inicializarNombreDesdeCache()

  // Listener de cambios de sesión
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
      if (cerrandoSesionExplicitamente) {
        localStorage.removeItem('navUserName')
        sessionStorage.removeItem('navUserName')
        document.getElementById('nav-user-name').innerText = 'Usuario'
        document.getElementById('nav-avatar').innerText = 'U'
        cerrandoSesionExplicitamente = false
      } else {
        // Falsa alarma (error 429, red, etc.): conservamos el nombre
        inicializarNombreDesdeCache()
      }
    } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
      if (session?.user) {
        actualizarNombreDesdeUsuario(session.user)
      } else {
        actualizarNombreDesdeUsuario(null)
      }
    }
  })

  // Soporte para bfcache (volver atrás/adelante)
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      inicializarNombreDesdeCache()
      inicializarSesion()
    }
  })

  await inicializarSesion()

  // Exponer función de cierre de sesión global
  window.cerrarSesion = async function () {
    cerrandoSesionExplicitamente = true
    await supabase.auth.signOut()
    window.location.href = 'login.html'
  }
}
