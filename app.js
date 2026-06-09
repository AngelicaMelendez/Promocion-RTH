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

window.mostrarAlertaSistema = function (mensaje) {
  const anterior = document.querySelector('.modal-alerta-sistema')
  if (anterior) anterior.remove()

  const modal = document.createElement('div')
  modal.className = 'modal-alerta-sistema'

  modal.innerHTML = `
    <div class="modal-alerta-card">
      <h3>Aviso</h3>
      <p>${mensaje}</p>
      <button onclick="this.closest('.modal-alerta-sistema').remove()">
        Aceptar
      </button>
    </div>
  `

  document.body.appendChild(modal)
}

/* ==================================================
   LÓGICA DE LOGIN
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
        const nombre = obtenerNombreUsuario(data.user)

        localStorage.setItem('navUserName', nombre)

        try {
          localStorage.setItem('usuario', JSON.stringify({ Nombre: nombre }))
        } catch (e) {
          console.warn('No se pudo guardar objeto usuario en localStorage', e)
        }

        window.location.href = 'primerContacto.html'
      }
    } catch (err) {
      errorMessage.textContent = 'Error al iniciar sesión'
      errorMessage.style.display = 'block'
      console.error(err)
    }
  })
}

/* ==================================================
   AUTENTICACIÓN COMPARTIDA
   ================================================== */
let cerrandoSesionExplicitamente = false

function inicializarNombreDesdeCache() {
  const nombreEl = document.getElementById('nav-user-name')
  const areaEl = document.getElementById('nav-user-area')
  const avatarEl = document.getElementById('nav-avatar')

  if (!nombreEl || !avatarEl) return

  const cachedName = localStorage.getItem('navUserName')
  const cachedArea = localStorage.getItem('navUserArea')
  const cachedPhoto = localStorage.getItem('navUserPhoto')

  nombreEl.innerText = cachedName || 'Usuario'
  if (areaEl) areaEl.innerText = cachedArea || ''

  if (cachedPhoto) {
    avatarEl.innerHTML = `
      <img src="${cachedPhoto}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">
    `
  } else {
    avatarEl.innerText = cachedName ? cachedName.charAt(0).toUpperCase() : 'U'
  }
}

function obtenerNombreUsuario(user) {
  return (
    user?.user_metadata?.nombre ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    'Usuario'
  )
}


async function actualizarNombreDesdeUsuario(user) {
  const nombreEl = document.getElementById('nav-user-name')
  const areaEl = document.getElementById('nav-user-area')
  const avatarEl = document.getElementById('nav-avatar')

  if (!nombreEl || !avatarEl) return

  if (!user) {
    nombreEl.innerText = 'Usuario'
    if (areaEl) areaEl.innerText = ''
    avatarEl.innerText = 'U'
    return
  }

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('nombres, area, foto_url')
    .eq('id', localStorage.getItem('usuario_id'))
    .single()

  let nombre = 'Usuario'
  let area = ''
  let fotoUrl = ''

  if (usuario) {
    nombre = `${usuario.nombres || ''} ${usuario.apellido_paterno || ''}`.trim()
    area = usuario.area || ''
    fotoUrl = usuario.foto_url || ''
  }

  nombreEl.innerText = nombre
  if (areaEl) areaEl.innerText = area

  if (fotoUrl) {
    avatarEl.innerHTML = `
      <img src="${fotoUrl}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">
    `
  } else {
    avatarEl.innerText = nombre.charAt(0).toUpperCase()
  }

  localStorage.setItem('navUserName', nombre)
  localStorage.setItem('navUserArea', area)
  localStorage.setItem('navUserPhoto', fotoUrl)

  sessionStorage.setItem('navUserName', nombre)
  sessionStorage.setItem('navUserArea', area)
  sessionStorage.setItem('navUserPhoto', fotoUrl)
}

async function inicializarSesion() {
  const { data: { session } } = await supabase.auth.getSession()

  if (session?.user) {
    actualizarNombreDesdeUsuario(session.user)
  } else {
    actualizarNombreDesdeUsuario(null)
  }
}

export async function initAuth() {
  inicializarNombreDesdeCache()

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
      if (cerrandoSesionExplicitamente) {
        localStorage.removeItem('navUserName')
localStorage.removeItem('navUserArea')
sessionStorage.removeItem('navUserName')
sessionStorage.removeItem('navUserArea')

const nombreEl = document.getElementById('nav-user-name')
const areaEl = document.getElementById('nav-user-area')
const avatarEl = document.getElementById('nav-avatar')

if (nombreEl) nombreEl.innerText = 'Usuario'
if (areaEl) areaEl.innerText = ''
if (avatarEl) avatarEl.innerText = 'U'

        cerrandoSesionExplicitamente = false
      } else {
        inicializarNombreDesdeCache()
      }
    } else if (
      event === 'SIGNED_IN' ||
      event === 'TOKEN_REFRESHED' ||
      event === 'INITIAL_SESSION'
    ) {
      if (session?.user) {
        actualizarNombreDesdeUsuario(session.user)
      } else {
        actualizarNombreDesdeUsuario(null)
      }
    }
  })

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      inicializarNombreDesdeCache()
      inicializarSesion()
    }
  })

  await inicializarSesion()

  window.cerrarSesion = async function () {
    cerrandoSesionExplicitamente = true
    await supabase.auth.signOut()
    window.location.href = 'login.html'
  }
}

let usuarioActualPerfil = null
let fotoSeleccionadaPerfil = null

window.abrirPerfilUsuario = async function () {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  usuarioActualPerfil = user

  const { data: usuario, error } = await supabase
    .from('usuarios')
    .select('nombres, apellido_paterno, apellido_materno, area, foto_url')
    .eq('id', localStorage.getItem('usuario_id'))
    .single()

  if (error) {
    console.error(error)
    mostrarAlertaSistema('No se pudo cargar el perfil.')
    return
  }

  const nombreCompleto = `${usuario.nombres || ''} ${usuario.apellido_paterno || ''} ${usuario.apellido_materno || ''}`.trim()

  document.getElementById('perfilNombre').innerText = nombreCompleto || 'Usuario'
  document.getElementById('perfilArea').innerText = usuario.area || '-'

  const foto = usuario.foto_url || ''
  console.log('FOTO URL:', usuario.foto_url)
  console.log(usuario)
  const perfilFoto = document.getElementById('perfilFoto')

  if (foto) {
    perfilFoto.src = foto
  } else {
    perfilFoto.src = ''
    perfilFoto.alt = nombreCompleto || 'Usuario'
  }

  document.getElementById('modalPerfilUsuario').classList.add('active')
}

window.cerrarPerfilUsuario = function () {
  document.getElementById('modalPerfilUsuario').classList.remove('active')
  fotoSeleccionadaPerfil = null
}

document.addEventListener('change', function (e) {
  if (e.target.id === 'inputFotoPerfil') {
    fotoSeleccionadaPerfil = e.target.files[0]

    if (fotoSeleccionadaPerfil) {
      document.getElementById('perfilFoto').src =
        URL.createObjectURL(fotoSeleccionadaPerfil)
    }
  }
})

window.guardarFotoPerfil = async function () {
  if (!usuarioActualPerfil) return

  if (!fotoSeleccionadaPerfil) {
   mostrarAlertaSistema('Selecciona una foto primero.')
    return
  }

  const extension = fotoSeleccionadaPerfil.name.split('.').pop()
  const ruta = `perfiles/${usuarioActualPerfil.id}.${extension}`

  await supabase.storage
    .from('documentos')
    .remove([ruta])

  const { error: uploadError } = await supabase.storage
    .from('documentos')
    .upload(ruta, fotoSeleccionadaPerfil)

  if (uploadError) {
    mostrarAlertaSistema('Error al subir foto: ' + uploadError.message)
    return
  }

  const { data } = supabase.storage
    .from('documentos')
    .getPublicUrl(ruta)
    console.log('PUBLIC URL:', data.publicUrl)

  const fotoFinal = `${data.publicUrl}?v=${Date.now()}`

  const usuarioId = localStorage.getItem('usuario_id')
console.log('ID USUARIO:', usuarioId)

const { data: usuarioActualizado, error } = await supabase
  .from('usuarios')
  .update({
    foto_url: fotoFinal
  })
  .eq('id', usuarioId)
  .select()

console.log('ACTUALIZADO:', usuarioActualizado)
console.log('ERROR UPDATE:', error)

  if (error) {
    mostrarAlertaSistema('Error al guardar foto: ' + error.message)
    return
  }

  localStorage.setItem('navUserPhoto', fotoFinal)
  sessionStorage.setItem('navUserPhoto', fotoFinal)

  const avatarEl = document.getElementById('nav-avatar')
  avatarEl.innerHTML = `
    <img src="${fotoFinal}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">
  `

  const perfilFoto = document.getElementById('perfilFoto')
  if (perfilFoto) perfilFoto.src = fotoFinal

  mostrarAlertaSistema('Foto actualizada correctamente.')
  cerrarPerfilUsuario()
}