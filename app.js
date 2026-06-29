// app.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

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

// ===== FUNCIÓN GLOBAL DE ALERTA (USADA POR VARIAS PÁGINAS) =====
window.mostrarAlertaSistema = function (mensaje) {
  const anterior = document.querySelector('.modal-alerta-sistema')
  if (anterior) anterior.remove()
  const modal = document.createElement('div')
  modal.className = 'modal-alerta-sistema'
  modal.innerHTML = `
    <div class="modal-alerta-card">
      <h3>Aviso</h3>
      <p>${mensaje}</p>
      <button onclick="this.closest('.modal-alerta-sistema').remove()">Aceptar</button>
    </div>
  `
  document.body.appendChild(modal)
}

/* ==================================================
   AUTENTICACIÓN COMPARTIDA
   ================================================== */
let cerrandoSesionExplicitamente = false
const CACHE_KEY = 'perfil_cache'
const CACHE_DURATION = 5 * 60 * 1000
let autenticacionInicializada = false

function guardarCachePerfil(nombre, area, fotoUrl) {
  sessionStorage.setItem(CACHE_KEY, JSON.stringify({ nombre, area, fotoUrl, timestamp: Date.now() }))
}
function obtenerCachePerfil() {
  const cached = sessionStorage.getItem(CACHE_KEY)
  if (!cached) return null
  const data = JSON.parse(cached)
  if (Date.now() - data.timestamp > CACHE_DURATION) {
    sessionStorage.removeItem(CACHE_KEY)
    return null
  }
  return data
}

function inicializarNombreDesdeCache() {
  const nombreEl = document.getElementById('nav-user-name')
  const areaEl = document.getElementById('nav-user-area')
  const avatarEl = document.getElementById('nav-avatar')
  if (!nombreEl || !avatarEl) return
  const cache = obtenerCachePerfil()
  if (cache) {
    nombreEl.innerText = cache.nombre
    if (areaEl) areaEl.innerText = cache.area
    if (cache.fotoUrl) {
      avatarEl.innerHTML = `<img src="${cache.fotoUrl}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" onerror="this.onerror=null; this.parentElement.innerText='${cache.nombre.charAt(0).toUpperCase()}'; this.remove();">`
    } else {
      avatarEl.innerText = cache.nombre.charAt(0).toUpperCase()
    }
    return
  }
  const cachedName = localStorage.getItem('navUserName') || 'Usuario'
  const cachedArea = localStorage.getItem('navUserArea') || ''
  const cachedPhoto = localStorage.getItem('navUserPhoto')
  nombreEl.innerText = cachedName
  if (areaEl) areaEl.innerText = cachedArea
  if (cachedPhoto) {
    avatarEl.innerHTML = `<img src="${cachedPhoto}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" onerror="this.onerror=null; this.parentElement.innerText='${cachedName.charAt(0).toUpperCase()}'; this.remove();">`
  } else {
    avatarEl.innerText = cachedName.charAt(0).toUpperCase()
  }
}

async function actualizarNombreDesdeUsuario(user) {
  const nombreEl = document.getElementById('nav-user-name')
  const areaEl = document.getElementById('nav-user-area')
  const avatarEl = document.getElementById('nav-avatar')
  if (!nombreEl || !avatarEl) return
  if (!user) {
    inicializarNombreDesdeCache()
    return
  }
  const cache = obtenerCachePerfil()
  if (cache) {
    nombreEl.innerText = cache.nombre
    if (areaEl) areaEl.innerText = cache.area
    if (cache.fotoUrl) {
      avatarEl.innerHTML = `<img src="${cache.fotoUrl}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" onerror="this.onerror=null; this.parentElement.innerText='${cache.nombre.charAt(0).toUpperCase()}'; this.remove();">`
    } else {
      avatarEl.innerText = cache.nombre.charAt(0).toUpperCase()
    }
    localStorage.setItem('navUserName', cache.nombre)
    localStorage.setItem('navUserArea', cache.area)
    localStorage.setItem('navUserPhoto', cache.fotoUrl)
    sessionStorage.setItem('navUserName', cache.nombre)
    sessionStorage.setItem('navUserArea', cache.area)
    sessionStorage.setItem('navUserPhoto', cache.fotoUrl)
    return
  }
  const userId = user.id
  const { data: usuario, error } = await supabase
    .from('usuarios')
    .select('nombres, apellido_paterno, area, foto_url')
    .eq('id', userId)
    .single()
  let nombre = 'Usuario', area = '', fotoUrl = ''
  if (!error && usuario) {
    nombre = `${usuario.nombres || ''} ${usuario.apellido_paterno || ''}`.trim()
    if (!nombre) nombre = 'Usuario'
    area = (usuario.area || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()
    fotoUrl = usuario.foto_url || ''
  } else {
    nombre = localStorage.getItem('navUserName') || nombre
    area = localStorage.getItem('navUserArea') || area
    fotoUrl = localStorage.getItem('navUserPhoto') || fotoUrl
  }
  nombreEl.innerText = nombre
  if (areaEl) areaEl.innerText = area
  if (fotoUrl) {
    avatarEl.innerHTML = `<img src="${fotoUrl}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" onerror="this.onerror=null; this.parentElement.innerText='${nombre.charAt(0).toUpperCase()}'; this.remove();">`
  } else {
    avatarEl.innerText = nombre.charAt(0).toUpperCase()
  }
  localStorage.setItem('navUserName', nombre)
  localStorage.setItem('navUserArea', area)
  localStorage.setItem('navUserPhoto', fotoUrl)
  sessionStorage.setItem('navUserName', nombre)
  sessionStorage.setItem('navUserArea', area)
  sessionStorage.setItem('navUserPhoto', fotoUrl)
  guardarCachePerfil(nombre, area, fotoUrl)
}

async function inicializarSesion() {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user) {
    actualizarNombreDesdeUsuario(session.user)
  } else {
    actualizarNombreDesdeUsuario(null)
  }
}

// ==================== RESTRICCIÓN DE ACCESO ====================
function aplicarRestriccionesDeAcceso() {
  let area = localStorage.getItem('navUserArea') || ''
  area = area.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()

  const paginasPermitidas = {
    promocion: ['primerContacto', 'cotizacion', 'ordenes', 'factura', 'reportes'],
    juridico: ['ordenes', 'factura'],
    administracion: ['ordenes', 'factura'],
    director: ['primerContacto', 'cotizacion', 'ordenes', 'factura', 'reportes']
  }

  if (!area || !paginasPermitidas[area]) return

  const permitidas = paginasPermitidas[area]
  const path = window.location.pathname
  const paginaActual = path.substring(path.lastIndexOf('/') + 1).replace('.html', '').toLowerCase()

  // Redirigir solo si es jurídico/administración y está en primerContacto
  if ((area === 'juridico' || area === 'administracion') && paginaActual === 'primercontacto') {
    setTimeout(() => {
      window.location.replace('ordenes.html')
    }, 200)
    return
  }

  // Para juridico/administracion en otras páginas: deshabilitar enlaces no permitidos
  if (area === 'juridico' || area === 'administracion') {
    const navLinks = document.querySelectorAll('.nav-links a')
    navLinks.forEach(link => {
      const href = link.getAttribute('href')
      if (!href) return
      const destino = href.replace('.html', '').toLowerCase()
      if (!permitidas.includes(destino)) {
        link.style.pointerEvents = 'none'
        link.style.opacity = '0.5'
        link.title = 'Acceso restringido'
      } else {
        link.style.pointerEvents = 'auto'
        link.style.opacity = '1'
        link.title = ''
      }
    })
  }

  // Para director: modo solo lectura
  if (area === 'director') {
    document.querySelectorAll('button').forEach(btn => {
      if (btn.classList.contains('logout-btn')) return
      btn.disabled = true
      btn.style.pointerEvents = 'none'
      btn.style.opacity = '0.6'
    })
    document.querySelectorAll('input, select, textarea').forEach(input => {
      if (input.hasAttribute('readonly')) return
      input.disabled = true
      input.style.backgroundColor = '#f5f5f5'
    })
    document.querySelectorAll('a.btn-ver, a.btn-action').forEach(a => {
      a.style.pointerEvents = 'none'
      a.style.opacity = '0.6'
    })
  }
}

export async function initAuth() {
  if (autenticacionInicializada) return
  autenticacionInicializada = true

  inicializarNombreDesdeCache()

  // Obtener área desde BD (por si login.html no la guardó)
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      const { data: usuario, error } = await supabase
        .from('usuarios')
        .select('area')
        .eq('id', session.user.id)
        .single()
      if (!error && usuario?.area) {
        const areaNormalizada = usuario.area
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .trim()
          .toLowerCase()
        localStorage.setItem('navUserArea', areaNormalizada)
        sessionStorage.setItem('navUserArea', areaNormalizada)
      }
    }
  } catch (e) {
    console.warn('No se pudo obtener el área del usuario:', e)
  }

  aplicarRestriccionesDeAcceso()

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
      if (cerrandoSesionExplicitamente) {
        localStorage.removeItem('navUserName')
        localStorage.removeItem('navUserArea')
        sessionStorage.removeItem('navUserName')
        sessionStorage.removeItem('navUserArea')
        sessionStorage.removeItem(CACHE_KEY)
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
    } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
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
      setTimeout(aplicarRestriccionesDeAcceso, 300)
    }
  })

  await inicializarSesion()

  window.cerrarSesion = async function () {
    cerrandoSesionExplicitamente = true
    await supabase.auth.signOut()
    window.location.href = 'login.html'
  }
}

// ==================================================
// PERFIL DE USUARIO (CÓDIGO ORIGINAL SIN CAMBIOS)
// ==================================================
let usuarioActualPerfil = null
let fotoSeleccionadaPerfil = null
let actualizandoPerfil = false

window.abrirPerfilUsuario = async function () {
  if (actualizandoPerfil) return
  actualizandoPerfil = true
  try {
    const cache = obtenerCachePerfil()
    if (cache && cache.nombre && document.getElementById('perfilNombre')) {
      document.getElementById('perfilNombre').innerText = cache.nombre
      document.getElementById('perfilArea').innerText = cache.area || '-'
      const perfilFoto = document.getElementById('perfilFoto')
      if (cache.fotoUrl) perfilFoto.src = cache.fotoUrl
      else perfilFoto.src = ''
      document.getElementById('modalPerfilUsuario').classList.add('active')
      const storedId = localStorage.getItem('usuario_id')
      if (storedId) {
        usuarioActualPerfil = { id: storedId }
      }
      return
    }

    const { data: { session } } = await supabase.auth.getSession()
    if (!session || !session.user) {
      return
    }
    const user = session.user
    usuarioActualPerfil = user

    let usuarioId = localStorage.getItem('usuario_id')
    if (!usuarioId) {
      usuarioId = user.id
      localStorage.setItem('usuario_id', usuarioId)
    }

    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('nombres, apellido_paterno, apellido_materno, area, foto_url')
      .eq('id', usuarioId)
      .single()

    if (error) throw error

    const nombreCompleto = `${usuario.nombres || ''} ${usuario.apellido_paterno || ''} ${usuario.apellido_materno || ''}`.trim()
    document.getElementById('perfilNombre').innerText = nombreCompleto || 'Usuario'
    document.getElementById('perfilArea').innerText = usuario.area || '-'
    const foto = usuario.foto_url || ''
    const perfilFoto = document.getElementById('perfilFoto')
    if (foto) {
      perfilFoto.src = foto
      perfilFoto.onerror = () => { perfilFoto.src = ''; perfilFoto.alt = nombreCompleto || 'Usuario' }
    } else {
      perfilFoto.src = ''
      perfilFoto.alt = nombreCompleto || 'Usuario'
    }
    guardarCachePerfil(nombreCompleto, usuario.area, foto)
    document.getElementById('modalPerfilUsuario').classList.add('active')
  } catch (err) {
    console.error("Error al abrir perfil:", err)
  } finally {
    actualizandoPerfil = false
  }
}

window.cerrarPerfilUsuario = function () {
  document.getElementById('modalPerfilUsuario').classList.remove('active')
  fotoSeleccionadaPerfil = null
}

document.addEventListener('change', function (e) {
  if (e.target.id === 'inputFotoPerfil') {
    fotoSeleccionadaPerfil = e.target.files[0]
    if (fotoSeleccionadaPerfil) {
      document.getElementById('perfilFoto').src = URL.createObjectURL(fotoSeleccionadaPerfil)
    }
  }
})

window.guardarFotoPerfil = async function () {
  if (!usuarioActualPerfil) {
    window.mostrarAlertaSistema('No se pudo identificar tu sesión. Recarga la página.')
    return
  }
  if (!fotoSeleccionadaPerfil) {
    window.mostrarAlertaSistema('Selecciona una foto primero.')
    return
  }

  const { data: { session } } = await supabase.auth.getSession()
  if (!session || !session.user) {
    window.mostrarAlertaSistema('Tu sesión expiró. Recarga la página y vuelve a intentar.')
    return
  }

  const extension = fotoSeleccionadaPerfil.name.split('.').pop()
  const timestamp = Date.now()
  const ruta = `perfiles/${usuarioActualPerfil.id}_${timestamp}.${extension}`

  const { error: uploadError } = await supabase.storage
    .from('documentos')
    .upload(ruta, fotoSeleccionadaPerfil)

  if (uploadError) {
    window.mostrarAlertaSistema('Error al subir foto: ' + uploadError.message)
    return
  }

  const { data } = supabase.storage.from('documentos').getPublicUrl(ruta)
  const fotoFinal = `${data.publicUrl}?v=${timestamp}`

  const usuarioId = localStorage.getItem('usuario_id')
  const { error: updateError } = await supabase
    .from('usuarios')
    .update({ foto_url: fotoFinal })
    .eq('id', usuarioId)

  if (updateError) {
    window.mostrarAlertaSistema('Error al guardar foto: ' + updateError.message)
    return
  }

  const oldPhotoUrl = localStorage.getItem('navUserPhoto')
  if (oldPhotoUrl && oldPhotoUrl.includes('/perfiles/')) {
    try {
      const oldPath = oldPhotoUrl.split('/').slice(-2).join('/').split('?')[0]
      if (oldPath) await supabase.storage.from('documentos').remove([oldPath])
    } catch (e) { console.warn('No se pudo eliminar foto antigua', e) }
  }

  localStorage.setItem('navUserPhoto', fotoFinal)
  sessionStorage.setItem('navUserPhoto', fotoFinal)
  guardarCachePerfil(
    localStorage.getItem('navUserName'),
    localStorage.getItem('navUserArea'),
    fotoFinal
  )

  const avatarEl = document.getElementById('nav-avatar')
  avatarEl.innerHTML = `<img src="${fotoFinal}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" onerror="this.onerror=null; this.parentElement.innerText='${(localStorage.getItem('navUserName') || 'U').charAt(0).toUpperCase()}'; this.remove();">`

  const perfilFoto = document.getElementById('perfilFoto')
  if (perfilFoto) perfilFoto.src = fotoFinal

  window.mostrarAlertaSistema('Foto actualizada correctamente.')
  cerrarPerfilUsuario()
}

function asignarClickAvatar() {
  const avatar = document.getElementById('nav-avatar')
  if (avatar && !avatar.hasAttribute('data-perfil-listener')) {
    avatar.setAttribute('data-perfil-listener', 'true')
    avatar.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (typeof window.abrirPerfilUsuario === 'function') {
        window.abrirPerfilUsuario()
      }
    })
  } else if (!avatar) {
    setTimeout(asignarClickAvatar, 300)
  }
}
document.addEventListener('DOMContentLoaded', () => {
  asignarClickAvatar()
})