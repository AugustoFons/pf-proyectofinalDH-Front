# Sprint 1 – Bitácora

## 1.1 Definición del proyecto

**marketplease!** es una aplicación web orientada a la publicación, visualización y gestión de productos, con un enfoque tanto en la compra/venta como en la reserva de los mismos.  
El objetivo principal es permitir a los usuarios explorar productos de manera simple e intuitiva, mientras que los administradores pueden gestionar el catálogo mediante funcionalidades dedicadas (Publicar, Editar y Eliminar).

El proyecto está desarrollado con:
- **Frontend:** React
- **Backend:** Java Spring Boot
- **Base de datos:** MySQL

---

## 1.2 Objetivo del Sprint 1

El objetivo del Sprint 1 fue construir la **estructura base de la aplicación**, implementando las funcionalidades principales de:
- Registro de productos
- Visualización de productos
- Eliminación de productos
- Navegación básica del sitio, tanto en su versión pública como en el acceso administrativo (mock).
- Funcionalidad de administración inicial

---

## 1.3 User Stories implementadas

Durante el Sprint 1 se implementaron las siguientes historias de usuario:

- #1 Colocar encabezado
- #2 Definir el cuerpo del sitio
- #3 Registrar producto
- #4 Visualizar productos en el home
- #5 Visualizar detalle de producto
- #6 Visualizar galería de imágenes
- #7 Colocar pie de página
- #8 Paginar productos
- #9 Panel de administración
- #10 Listar productos
- #11 Eliminar producto

Todas las historias planificadas para el sprint fueron implementadas y testeadas correctamente.

---

## 1.4 Licencias de diseño y adaptaciones

Durante el desarrollo se tomaron algunas decisiones que implicaron adaptaciones respecto a los criterios originales:

- **Footer:**  
  Por un criterio visual se optó por una disposición centrada del footer, colocando el logotipo en el centro y el copyright debajo del mismo.

- **Galería de imágenes:**  
  Se optó por una disposición alternativa a la propuesta en los criterios de aceptación, cumpliendo el objetivo principal: permitir al usuario visualizar claramente las imágenes del producto.

- **Panel de administración y Listado de productos:**  
  Si bien el criterio de aceptación menciona la existencia de un menú con las funciones de administración, en este Sprint se decidió no implementar un menú independiente, dado que la única funcionalidad administrativa desarrollada corresponde a la gestión de productos.

  En su lugar, se optó por un enfoque basado en acciones, donde las opciones de edición y eliminación se encuentran directamente asociadas a las cards de cada producto. Esta decisión mejora la usabilidad y evita una navegación innecesaria.

  La incorporación de un menú administrativo queda contemplada para sprints posteriores, en caso de que se desarrollen múltiples funcionalidades que justifiquen su implementación.

  El acceso a la lista de productos se realiza directamente al ingresar al panel de administración, funcionando como vista principal. Por este motivo, no se incluyó un botón adicional “Lista de productos”, ya que la funcionalidad solicitada se encuentra disponible de forma inmediata.

---

# Sprint 2 – Bitácora (Modelo)

## 2.1 Objetivo del Sprint 2

El objetivo del Sprint 2 fue ampliar las funcionalidades de la plataforma incorporando **gestión de usuarios, autenticación y categorización de productos**, permitiendo mejorar la organización del catálogo y habilitar funcionalidades personalizadas para usuarios registrados.

Durante este sprint se trabajó principalmente en:
- Registro de usuarios
- Inicio y cierre de sesión
- Gestión de roles de administrador
- Categorías de productos
- Características de productos
- Visualización de características en el detalle de producto

---

## 2.2 User Stories implementadas

Durante el Sprint 2 se planificaron e implementaron las siguientes historias de usuario:

- #12 Categorizar productos
- #13 Registrar usuario
- #14 Identificar usuario (login)
- #15 Cerrar sesión
- #16 Identificar administrador
- #17 Administrar características de producto
- #18 Visualizar características del producto
- #20 Crear sección de categorías
- #21 Agregar categoría

*(Opcional)*  
- #19 Notificación de confirmación de registro por correo electrónico

---

## 2.3 Licencias de diseño y decisiones de implementación

Durante el desarrollo del Sprint 2 se tomaron algunas decisiones técnicas y de diseño para mejorar la experiencia de usuario y la mantenibilidad del sistema.

- **Identificar usuario:**  
  El usuario puede accerder a su información personal una vez iniciada la sesión, dirijiendose al avatar del Header donde se abrira un dropdown para llegar a esta sección.

- **Administrar características:**  
  Las caracteristicas se pueden asociar al crear o al editar un producto siendo un administrador. El nombre de la característica es "libre" y se puede asociar a iconos predefinidos que se ponen a disposición.

- **Notificación: Confirmación de registro de usuario:**  
  Se decidió por el momento no implementar el desafio opcional, y evaluarlo en el sprint 4 en el que se piden implementaciones de envios de emails.

- **Características de producto:**  
  Se optó por implementar las características como entidades reutilizables que pueden asociarse a múltiples productos, facilitando su mantenimiento desde el panel administrativo.

---