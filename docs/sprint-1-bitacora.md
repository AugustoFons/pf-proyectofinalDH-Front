# Sprint 1 – Bitácora

## 1. Definición del proyecto

**marketplease!** es una aplicación web orientada a la publicación, visualización y gestión de productos, con un enfoque tanto en la compra/venta como en la reserva de los mismos.  
El objetivo principal es permitir a los usuarios explorar productos de manera simple e intuitiva, mientras que los administradores pueden gestionar el catálogo mediante funcionalidades dedicadas (Publicar, Editar y Eliminar).

El proyecto está desarrollado con:
- **Frontend:** React
- **Backend:** Java Spring Boot
- **Base de datos:** MySQL

---

## 2. Objetivo del Sprint 1

El objetivo del Sprint 1 fue construir la **estructura base de la aplicación**, implementando las funcionalidades principales de:
- Registro de productos
- Visualización de productos
- Eliminación de productos
- Navegación básica del sitio, tanto en su versión pública como en el acceso administrativo (mock).
- Funcionalidad de administración inicial

---

## 3. User Stories implementadas

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

## 4. Licencias de diseño y adaptaciones

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
