// server.js
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads')) // Para ver los archivos subidos

// Configuración de Supabase (usa tus mismas credenciales)
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://feylqcbnbndaefshhrpv.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'sb_publishable_RAlV0OCSUQNvEhmZam1cwA_3aViGAzg'
)

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/evidencias/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})
const upload = multer({ storage })

// ========== ENDPOINTS PARA CLIENTES ==========
app.get('/api/clientes', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('razon_social')
    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/clientes', async (req, res) => {
  try {
    const { error } = await supabase.from('clientes').insert(req.body)
    if (error) throw error
    res.status(201).json({ message: 'Cliente creado' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/clientes/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('clientes')
      .update(req.body)
      .eq('id', req.params.id)
    if (error) throw error
    res.json({ message: 'Cliente actualizado' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/clientes/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', req.params.id)
    if (error) throw error
    res.json({ message: 'Cliente eliminado' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ========== ENDPOINTS PARA SERVICIOS ==========
app.get('/api/servicios', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('servicios')
      .select('*')
      .eq('estatus', true)
    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ========== ENDPOINTS PARA COTIZACIONES ==========
app.get('/api/cotizaciones', async (req, res) => {
  try {
    // Obtener cotizaciones junto con el nombre del cliente y la evidencia de aprobación (desde ordenes_servicio)
    const { data, error } = await supabase
      .from('cotizaciones')
      .select(`
        *,
        clientes (razon_social),
        ordenes_servicio (evidencia_url)
      `)
      .order('id', { ascending: false })
    if (error) throw error
    
    const cotizaciones = data.map(c => ({
      id: c.id,
      folio: c.folio,
      fecha: c.fecha,
      subtotal: c.subtotal,
      iva: c.iva,
      total: c.total,
      cliente_nombre: c.clientes?.razon_social,
      aprobada: !!(c.ordenes_servicio && c.ordenes_servicio.length > 0 && c.ordenes_servicio[0]?.evidencia_url),
      evidencia_url: c.ordenes_servicio?.[0]?.evidencia_url || null
    }))
    res.json({ cotizaciones })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/cotizaciones/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cotizaciones')
      .select('*, clientes(razon_social)')
      .eq('id', req.params.id)
      .single()
    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/cotizaciones/:id/detalles', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cotizaciones_detalle')
      .select('*, servicios(clave, nombre)')
      .eq('cotizacion_id', req.params.id)
    if (error) throw error
    res.json(data.map(d => ({
      ...d,
      servicio_clave: d.servicios?.clave,
      servicio_nombre: d.servicios?.nombre
    })))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/cotizaciones', async (req, res) => {
  const { folio, cliente_id, fecha, subtotal, iva, total, detalles } = req.body
  try {
    // Insertar cabecera
    const { data: cotizacion, error: errorCab } = await supabase
      .from('cotizaciones')
      .insert({ folio, cliente_id, fecha, subtotal, iva, total, estatus: 'Pendiente' })
      .select()
      .single()
    if (errorCab) throw errorCab
    
    // Insertar detalles
    const detallesInsert = detalles.map(d => ({
      cotizacion_id: cotizacion.id,
      servicio_id: d.servicio_id,
      cantidad: d.cantidad,
      precio_unitario: d.precio_unitario,
      importe: d.importe
    }))
    const { error: detError } = await supabase
      .from('cotizaciones_detalle')
      .insert(detallesInsert)
    if (detError) throw detError
    
    res.status(201).json({ message: 'Cotización creada', cotizacion })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ========== ENDPOINT PARA ÓRDENES (subir evidencia de aprobación) ==========
app.post('/api/ordenes/subir-evidencia', upload.single('evidencia'), async (req, res) => {
  const { cotizacion_id } = req.body
  const file = req.file
  if (!file || !cotizacion_id) {
    return res.status(400).json({ message: 'Faltan datos (cotizacion_id y archivo)' })
  }
  
  const evidenciaUrl = `/uploads/evidencias/${file.filename}`
  
  try {
    // Verificar si ya existe una orden para esta cotización
    const { data: existing } = await supabase
      .from('ordenes_servicio')
      .select('id')
      .eq('cotizacion_id', cotizacion_id)
      .maybeSingle()
    
    if (existing) {
      // Actualizar
      const { error } = await supabase
        .from('ordenes_servicio')
        .update({ evidencia_url: evidenciaUrl, fecha_aprobacion: new Date().toISOString().split('T')[0] })
        .eq('cotizacion_id', cotizacion_id)
      if (error) throw error
    } else {
      // Insertar nueva orden
      const folioOrden = `OS-${Date.now()}`
      const { error } = await supabase
        .from('ordenes_servicio')
        .insert({
          cotizacion_id,
          folio: folioOrden,
          evidencia_url: evidenciaUrl,
          fecha_aprobacion: new Date().toISOString().split('T')[0],
          estatus: 'Aprobada'
        })
      if (error) throw error
    }
    
    // Opcional: actualizar estatus de la cotización
    await supabase.from('cotizaciones').update({ estatus: 'Aprobada' }).eq('id', cotizacion_id)
    
    // Obtener el folio de la cotización para responder
    const { data: cot } = await supabase.from('cotizaciones').select('folio').eq('id', cotizacion_id).single()
    res.json({ success: true, folio: cot?.folio, url: evidenciaUrl })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
})

// ========== ENDPOINT PARA FACTURAS (listado y subida de archivos) ==========
app.get('/api/facturas', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('facturas')
      .select('*, clientes(razon_social), ordenes_servicio(cotizacion_id, cotizaciones(folio))')
      .order('id', { ascending: false })
    if (error) throw error
    res.json({ facturas: data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/facturas/subir', upload.fields([{ name: 'xml' }, { name: 'pdf' }]), async (req, res) => {
  const { cotizacion_id, orden_servicio_id, cliente_id, subtotal, iva, total } = req.body
  const files = req.files
  try {
    const folioFactura = `F-${Date.now()}`
    const xmlUrl = files.xml ? `/uploads/facturas/${files.xml[0].filename}` : null
    const pdfUrl = files.pdf ? `/uploads/facturas/${files.pdf[0].filename}` : null
    
    const { error } = await supabase.from('facturas').insert({
      orden_servicio_id,
      folio_factura: folioFactura,
      cliente_id,
      fecha_emision: new Date().toISOString().split('T')[0],
      subtotal,
      iva,
      total,
      xml_url: xmlUrl,
      pdf_url: pdfUrl,
      estatus_pago: 'Pendiente'
    })
    if (error) throw error
    res.json({ success: true, folio: folioFactura })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ========== ENDPOINT PARA PAGOS ==========
app.get('/api/pagos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pagos')
      .select('*, facturas(folio_factura, total), cotizaciones(folio)')
      .order('fecha_pago', { ascending: false })
    if (error) throw error
    res.json({ pagos: data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/pagos/registrar', upload.single('comprobante'), async (req, res) => {
  const { factura_id, cotizacion_id, monto, metodo_pago, observaciones } = req.body
  const file = req.file
  const comprobanteUrl = file ? `/uploads/comprobantes/${file.filename}` : null
  try {
    const { error } = await supabase.from('pagos').insert({
      factura_id,
      cotizacion_id,
      fecha_pago: new Date().toISOString().split('T')[0],
      monto,
      comprobante_url: comprobanteUrl,
      metodo_pago,
      observaciones
    })
    if (error) throw error
    // Actualizar estatus de la factura a Pagada
    await supabase.from('facturas').update({ estatus_pago: 'Pagada' }).eq('id', factura_id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ========== ENDPOINTS PARA REPORTES (resumen) ==========
app.get('/api/reportes/resumen', async (req, res) => {
  try {
    // Ingresos totales (facturas pagadas)
    const { data: facturasPagadas } = await supabase
      .from('facturas')
      .select('total')
      .eq('estatus_pago', 'Pagada')
    const totalIngresos = facturasPagadas?.reduce((sum, f) => sum + f.total, 0) || 0
    
    // Facturas pendientes
    const { count: pendientes } = await supabase
      .from('facturas')
      .select('*', { count: 'exact', head: true })
      .eq('estatus_pago', 'Pendiente')
    
    // Cotizaciones aprobadas
    const { count: aprobadas } = await supabase
      .from('cotizaciones')
      .select('*', { count: 'exact', head: true })
      .eq('estatus', 'Aprobada')
    
    res.json({
      totalIngresos,
      facturasPendientes: pendientes,
      cotizacionesAprobadas: aprobadas
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/reportes/ingresos-mensuales', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('facturas')
      .select('fecha_emision, total')
      .eq('estatus_pago', 'Pagada')
    if (error) throw error
    const mensual = {}
    data.forEach(f => {
      const mes = f.fecha_emision.slice(0, 7)
      mensual[mes] = (mensual[mes] || 0) + f.total
    })
    res.json(mensual)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ========== INICIAR SERVIDOR ==========
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`)
})