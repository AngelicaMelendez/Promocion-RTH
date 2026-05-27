import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function RegistroCliente() {

  const [form, setForm] = useState({
    razon_social: '',
    rfc: '',
    domicilio_fiscal: '',
    correo: '',
    telefono: '',
    regimen_fiscal: '',
    uso_cfdi: '',
    representante: ''
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const registrarCliente = async (e) => {
    e.preventDefault()

    const { error } = await supabase
      .from('clientes')
      .insert([form])

    if (error) {
      console.log(error)
      alert('Error al registrar')
      return
    }

    alert('Cliente registrado correctamente')

    setForm({
      razon_social: '',
      rfc: '',
      domicilio_fiscal: '',
      correo: '',
      telefono: '',
      regimen_fiscal: '',
      uso_cfdi: '',
      representante: ''
    })
  }

  return (
    <div>
      <h1>Registro Cliente</h1>

      <form onSubmit={registrarCliente}>

        <input
          name="razon_social"
          placeholder="Razón Social"
          onChange={handleChange}
          value={form.razon_social}
        />

        <input
          name="rfc"
          placeholder="RFC"
          onChange={handleChange}
          value={form.rfc}
        />

        <input
          name="correo"
          placeholder="Correo"
          onChange={handleChange}
          value={form.correo}
        />

        <input
          name="telefono"
          placeholder="Teléfono"
          onChange={handleChange}
          value={form.telefono}
        />

        <button type="submit">
          Registrar
        </button>

      </form>
    </div>
  )
}