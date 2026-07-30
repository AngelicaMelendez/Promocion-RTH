# 📡 Sistema de Promociones RTH

![Estado](https://img.shields.io/badge/Estado-En%20desarrollo-bc955b?style=for-the-badge)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

Sistema web institucional desarrollado para **Radio y Televisión de Hidalgo (RTH)**, enfocado en el control, monitoreo y seguimiento de las operaciones realizadas dentro del área de Promoción.

El sistema permite administrar los procesos de **Primer Contacto, Cotización, Documentación, Facturas, Creación de Trabajo, Entregables y Reportes**, centralizando la información en **Supabase** para mejorar el control operativo, el seguimiento de actividades, la gestión documental y la consulta de estadísticas por área.

---

## 📌 Objetivo del sistema

Desarrollar una plataforma web que permita llevar un control de monitoreo sobre las operaciones realizadas dentro del sistema RTH, considerando los siguientes apartados:

- 👥 Primer Contacto
- 🧾 Cotización
- 📂 Documentación / Órdenes
- 🧾 Facturas
- 🛠️ Creación de Trabajo
- 📤 Entregables
- 📊 Reportes

El sistema utiliza **Supabase** como base de datos principal para guardar y consultar los datos generados desde los diferentes módulos del programa.

---

## 🧩 Descripción general

El sistema permite registrar, consultar, editar y dar seguimiento a la información operativa del área de Promoción de RTH.

Actualmente el sistema permite:

- Crear usuarios autorizados mediante login y registro.
- Iniciar sesión con usuarios registrados.
- Recuperar contraseña.
- Crear nueva contraseña.
- Mostrar nombre, área y perfil del usuario.
- Registrar clientes en Primer Contacto.
- Generar ID automático de cliente.
- Generar folio automático de cotización.
- Guardar datos en Supabase.
- Consultar información desde Supabase.
- Generar cotizaciones.
- Generar PDF de cotización.
- Controlar documentación obligatoria.
- Registrar evidencias.
- Registrar facturas en PDF y XML.
- Descargar documentación.
- Crear trabajos internos.
- Subir entregables.
- Consultar reportes y estadísticas.
- Visualizar quién realizó cada cotización.
- Controlar información por tipo de cliente.

---

## 🛠️ Herramientas técnicas utilizadas

### 🌐 Lenguajes y tecnologías web

| Herramienta | Uso dentro del sistema |
|---|---|
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) | Estructura de las pantallas del sistema. |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) | Diseño visual, estilos institucionales, navbar, footer, tablas, botones, formularios y modales. |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | Lógica del sistema, validaciones, eventos, interacción con Supabase y generación dinámica de contenido. |

---

### 🗄️ Backend, base de datos y almacenamiento

| Herramienta | Uso dentro del sistema |
|---|---|
| ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white) | Backend principal del sistema. |
| ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white) | Base de datos relacional utilizada por Supabase. |
| 🔐 Supabase Auth | Autenticación de usuarios, login, registro, recuperación y nueva contraseña. |
| 🗂️ Supabase Storage | Almacenamiento de archivos PDF, XML, evidencias, documentos y entregables. |
| ⚡ Supabase Edge Functions | Funciones del sistema como envío de códigos de autorización. |

---

### 📚 Librerías y recursos externos

| Herramienta | Uso dentro del sistema |
|---|---|
| ![Font Awesome](https://img.shields.io/badge/Font%20Awesome-528DD7?style=flat-square&logo=fontawesome&logoColor=white) | Íconos en navbar, botones, tablas, acciones, documentos y modales. |
| ![Google Fonts](https://img.shields.io/badge/Google%20Fonts-4285F4?style=flat-square&logo=googlefonts&logoColor=white) | Tipografía Montserrat utilizada en el diseño institucional. |
| 📄 jsPDF | Generación del PDF de cotización. |
| ✉️ Resend | Envío de correos electrónicos y códigos de autorización. |

---

### 💻 Herramientas de desarrollo

| Herramienta | Uso dentro del proyecto |
|---|---|
| ![Visual Studio Code](https://img.shields.io/badge/VS%20Code-007ACC?style=flat-square&logo=visualstudiocode&logoColor=white) | Editor principal para desarrollar y modificar el sistema. |
| ![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white) | Control de versiones del proyecto. |
| ![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white) | Repositorio del sistema y control de ramas. |
| 🧰 Supabase Dashboard | Administración de tablas, registros, usuarios, Storage y Auth. |
| 🧾 SQL Editor | Creación y modificación de tablas, columnas y consultas SQL. |
| 🌐 Navegador web | Pruebas del sistema. |
| 🧪 Servidor local | Ejecución del sistema durante desarrollo y pruebas. |

---

## 🎨 Diseño institucional

El sistema mantiene una identidad visual basada en los colores institucionales de RTH.

| Elemento | Color |
|---|---|
| Vino institucional | `#691b31` |
| Vino claro | `#a02142` |
| Dorado | `#bc955b` |
| Beige | `#ddc9a3` |
| Fondo | `#f7f3ed` |
| Blanco | `#ffffff` |

También se integraron:

- Navbar institucional.
- Footer institucional.
- Íconos en botones y acciones.
- Modales personalizados.
- Alertas visuales con mejor diseño.
- Tablas con formato institucional.
- Perfil de usuario.
- Nombre y área visibles en la navegación.

---

## 🧱 Módulos del sistema

---

## 🔐 Login y registro

El sistema cuenta con acceso mediante usuarios autorizados.

### Funciones implementadas

- Login de usuarios.
- Registro de usuarios autorizados.
- Recuperación de contraseña.
- Pantalla de nueva contraseña.
- Autenticación mediante Supabase Auth.
- Redirección según el área del usuario.
- Visualización del nombre del usuario.
- Visualización del área del usuario.
- Perfil de usuario.
- Cierre de sesión.

---

## 👥 Primer Contacto

Módulo encargado del registro inicial de clientes.

### Funciones implementadas

- Registro de clientes.
- Captura de datos fiscales.
- Captura de datos de contacto.
- Generación automática de ID.
- Guardado de datos en Supabase.
- Validación de campos obligatorios.
- Mensajes en pantalla con diseño mejorado.
- Botones de acción.
- Registro del tipo de cliente.
- Campo de institución pública para persona moral.
- Limpieza automática de formulario después del registro.

### Tipos de cliente

Actualmente se registra el tipo de cliente como:

- 👤 Persona física
- 🏢 Persona moral
- 🏛️ Institución pública

### Lógica del tipo de cliente

```text
Si no se activa Persona Moral:
tipo_cliente = Persona física

Si se activa Persona Moral y se selecciona Institución Pública = No:
tipo_cliente = Persona moral

Si se activa Persona Moral y se selecciona Institución Pública = Sí:
tipo_cliente = Institución pública
🧾 Cotización

Módulo utilizado para generar cotizaciones institucionales.

Funciones implementadas
Creación automática de folio de cotización.
Selección de cliente registrado.
Selección de servicios.
Cálculo automático de subtotal.
Cálculo automático de IVA.
Cálculo automático de total.
Guardado de cotizaciones en Supabase.
Guardado de detalle de cotización.
Registro del usuario que realizó la cotización.
Columna para identificar quién cotizó.
Registro del tipo de cliente en la cotización.
Generación de PDF de cotización.
Corrección del apartado de generación de PDF.
Integración de logo institucional.
Integración de logo ISO.
Integración de íconos.
Manejo de precios unitarios.
Manejo de precios mínimos.
Edición de precios.
Envío de códigos de autorización por correo.
Conversión de precios a UMA.
Validación de cantidad de UMA.
Mensajes visuales personalizados.
Funcionalidad de autorización de precio

Se agregó el apartado para editar precio mínimo y máximo, enviando códigos de autorización por correo mediante Supabase Edge Functions y Resend.

📂 Documentación / Órdenes

Módulo utilizado para el control documental de las cotizaciones.

Funciones implementadas
Visualización de cotizaciones registradas.
Visualización del tipo de cliente.
Confirmación de cotización mediante evidencia.
Subida de archivos obligatorios.
Validación de documentos PDF.
Descarga de documentos.
Visualización de documentos.
Corrección del archivo ordenes.html.
Documentación dinámica según tipo de cliente.
Validación para que se suban todos los archivos requeridos.
Documentación por tipo de cliente
🏛️ Institución Pública
Decreto de creación.
RFC: constancia de situación fiscal.
Comprobante de domicilio.
Nombramiento oficial del titular de la dependencia.
Identificación oficial vigente del titular o representante legal.
👤 Persona Física
Identificación oficial vigente.
Comprobante de domicilio.
RFC: constancia de situación fiscal.
Opinión de cumplimiento positiva.
🏢 Persona Moral
Acta constitutiva.
Comprobante de domicilio.
RFC: constancia de situación fiscal.
Opinión de cumplimiento positiva.
Poder notarial del representante legal.
Identificación oficial vigente del representante legal.
🧾 Facturas

Módulo utilizado para registrar facturas de cotizaciones confirmadas.

Funciones implementadas
Visualización de cotizaciones confirmadas pendientes de factura.
Visualización del tipo de cliente.
Subida de factura PDF.
Subida de factura XML.
Registro de evidencia de factura.
Actualización del estatus de factura.
Descarga de PDF de factura.
Descarga de XML de factura.
Descarga de documentación relacionada.
Filtrado de documentación según tipo de cliente.
Visualización del usuario que generó la cotización.
Documentación descargable en Facturas

El módulo de Facturas permite descargar la documentación correspondiente según el tipo de cliente:

Institución pública.
Persona física.
Persona moral.
🛠️ Creación de Trabajo

Módulo agregado para la creación y asignación de trabajos internos.

Funciones implementadas
Creación de trabajos por área.
Selección de área destino.
Vinculación con cotización.
Generación de asunto con número de orden.
Generación de asunto con nombre del cliente.
Envío de notificaciones internas.
Carga de archivos adjuntos.
Relación con cotización.
📤 Entregables

Módulo agregado para administrar entregables relacionados con cotizaciones.

Funciones implementadas
Subida de archivos entregables.
Relación con cotizaciones.
Consulta de archivos cargados.
Eliminación de archivos.
Visualización de entregables.
Uso de Supabase Storage.
Mensajes visuales personalizados.
Confirmación personalizada para eliminación.
🔔 Notificaciones

Módulo utilizado para mostrar notificaciones internas por área.

Funciones implementadas
Visualización de notificaciones.
Filtrado por área.
Relación con cotizaciones.
Visualización de folio de cotización.
Archivos adjuntos.
Control de lectura.
Soporte para áreas como Radio, Televisión, Ingeniería y Testigos.
📊 Reportes

Módulo utilizado para el monitoreo y consulta estadística del sistema.

Funciones implementadas
Consulta de reportes operativos.
Estadísticas por área.
Información relacionada con cotizaciones.
Nuevo botón agregado en reportes.
Integración de dos tablas relacionadas con cotizaciones.
Monitoreo de actividades.
Apoyo al control operativo del sistema.
🧾 Cambios realizados hasta el avance actual
✅ Requerimientos de Minuta 2

Se finalizaron los requerimientos correspondientes a la segunda minuta.

Cambios realizados:

Control de monitoreo de operaciones.
Módulos principales funcionales.
Registro de usuarios autorizados.
Login funcional.
Registro funcional.
Recuperación de contraseña.
Pantalla de nueva contraseña.
IDs de cliente automáticos.
Folios de cotización automáticos.
Datos guardados en Supabase.
Tablas correspondientes actualizadas.
Botones para editar.
Mensajes en pantalla con mejor diseño.
Columna para identificar quién cotizó.
Corrección del archivo de órdenes.
Finalización de pantallas para su funcionamiento.
Nombre de usuario visible en el sistema.
Área del usuario visible en el sistema.
Perfil de usuario.
Footer corregido en cada archivo.
Navbar corregido en los archivos.
Corrección del PDF de cotización.
Agregado de íconos.
Agregado de logo ISO.
📅 Avance presentado el 23/06/2026

El día 23 de junio de 2026 se presentó la versión correspondiente hasta la rama:

fase29

A partir de esa versión se iniciaron nuevos cambios acordados.

Cambios realizados después de fase29
Modificación de la tabla usuarios.
Modificación de la tabla servicios.
Modificación del módulo de cotización.
Agregado del apartado para editar precio mínimo y máximo.
Envío de códigos de autorización.
Nuevas pantallas:
creacionTrabajo.html
entregables.html
Mejoras en login.
Mejoras en nueva contraseña.
Archivos obligatorios en órdenes.
Separación de backend y frontend.
Mejoras en reportes.
Nuevo botón en reportes.
Dos tablas relacionadas con cotizaciones.
Integración del tipo de cliente en Primer Contacto.
Integración del tipo de cliente en Cotización.
Visualización del tipo de cliente en Documentación.
Visualización del tipo de cliente en Facturas.
Documentación dinámica por tipo de cliente.
Descarga de documentación por tipo de cliente en Facturas.
🗄️ Base de datos

El sistema utiliza Supabase con PostgreSQL como base de datos principal.

Tablas principales
Tabla	Descripción
usuarios	Información de usuarios autorizados.
roles	Roles del sistema.
clientes	Registro de clientes y tipo de cliente.
cotizaciones	Cotizaciones generadas.
cotizacion_detalle	Servicios agregados a cada cotización.
servicios	Catálogo de servicios.
documentos_cotizacion	Documentos cargados por cotización.
facturas	Información relacionada con facturación.
entregables	Archivos entregables.
notificaciones	Notificaciones internas.
reportes_financieros	Información para reportes.
control_institucional	Control y seguimiento institucional.
🧩 Columnas importantes agregadas
Tabla clientes
alter table public.clientes
add column if not exists institucion_publica text,
add column if not exists tipo_cliente text;
Tabla cotizaciones
alter table public.cotizaciones
add column if not exists tipo_cliente text;
Tabla documentos_cotizacion

Se utiliza para guardar los documentos relacionados con cada cotización.

Campos principales:

id
cotizacion_id
tipo_documento
url
nombre_archivo
created_at
🗂️ Almacenamiento de archivos

Se utiliza Supabase Storage para guardar archivos del sistema.

Buckets utilizados
Bucket	Uso
documentos	Documentos de clientes, XML y archivos relacionados.
evidencias	Evidencias de aprobación y facturas PDF.
entregables	Archivos finales entregables.
Archivos almacenados
Documentos de clientes.
Evidencias de aprobación.
Facturas PDF.
Facturas XML.
Entregables.
Archivos adjuntos.
Documentación por cotización.
Documentos por tipo de cliente.
🔁 Flujo principal del sistema
Usuario inicia sesión
        ↓
Registra cliente en Primer Contacto
        ↓
Selecciona tipo de cliente
        ↓
Genera cotización
        ↓
Se guarda el tipo de cliente en cotización
        ↓
Confirma cotización en Documentación
        ↓
Sube documentos obligatorios según tipo de cliente
        ↓
Registra factura PDF/XML
        ↓
Descarga documentación desde Facturas
        ↓
Consulta reportes y estadísticas
📁 Estructura general del proyecto
/
├── index.html
├── login.html
├── nueva-password.html
├── primerContacto.html
├── cotizacion.html
├── ordenes.html
├── factura.html
├── creacionTrabajo.html
├── entregables.html
├── notificaciones.html
├── reportes.html
├── app.js
├── img/
│   ├── logo_RYT.png
│   ├── Logo-rth1.png
│   ├── logoISO.png
│   ├── logoMicrofono.png
│   ├── logoTv.png
│   └── logoRadio.png
└── README.md
🚀 Instalación y ejecución
1. Clonar el repositorio
git clone URL_DEL_REPOSITORIO
2. Entrar al proyecto
cd nombre-del-proyecto
3. Abrir en Visual Studio Code
code .
4. Configurar Supabase

Configurar las credenciales del proyecto en el archivo:

app.js

Ejemplo:

const SUPABASE_URL = 'URL_DEL_PROYECTO'
const SUPABASE_KEY = 'ANON_KEY_DEL_PROYECTO'
5. Ejecutar localmente

Puede ejecutarse con un servidor local o con Live Server.

Ejemplo:

npx serve
🌿 Control de versiones

El sistema utiliza Git y GitHub para el control de versiones.

Rama presentada
fase29
Comandos básicos
git status
git add .
git commit -m "Actualización del sistema de promociones RTH"
git push origin nombre-de-la-rama
📌 Estado actual del sistema

El sistema se encuentra funcional con los módulos principales integrados a Supabase.

Actualmente cuenta con:

Login funcional.
Registro de usuarios autorizados.
Recuperación de contraseña.
Nueva contraseña.
Primer Contacto.
Cotizaciones.
Documentación.
Facturas.
Creación de Trabajo.
Entregables.
Notificaciones.
Reportes.
Perfil de usuario.
Navbar corregido.
Footer corregido.
Generación de PDF.
Manejo de archivos.
Estadísticas de operación.
Tipo de cliente.
Documentación dinámica por tipo de cliente.
Descarga de documentación por tipo de cliente.
👨‍💻 Autor

Proyecto desarrollado para:

Radio y Televisión de Hidalgo

Área:

Promoción RTH

📝 Notas finales

Este sistema continuará recibiendo mejoras conforme a los nuevos requerimientos institucionales, validaciones internas y ajustes operativos del área.

El objetivo principal es mantener una plataforma funcional, organizada y centralizada para el seguimiento de clientes, cotizaciones, documentación, facturación, entregables y reportes del sistema de Promociones RTH.