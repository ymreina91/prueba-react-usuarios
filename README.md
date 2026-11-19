# Usuarios y publicaciones

App en React y TypeScript que consume la API pública [JSONPlaceholder](https://jsonplaceholder.typicode.com).

- Lista de usuarios con búsqueda por nombre (sin distinguir mayúsculas ni tildes).
- Al elegir un usuario, muestra sus publicaciones y permite crear una nueva desde un modal con formulario validado (título y texto obligatorios).
- Estados de carga, error (con reintento) y vacío visibles.
- 9 pruebas con Vitest, Testing Library y MSW.

## Cómo ejecutarlo

Requisitos: Node.js 20 o superior.

```bash
npm install
npm run dev      # abre http://localhost:5173
npm test         # ejecuta las pruebas
npm run build    # revisa tipos y genera la versión de producción
```

## Tecnologías

React, TypeScript, Vite, TanStack Query, React Hook Form, Zod, Vitest, Testing Library y MSW.

## Estructura

```text
src/
  api/          cliente HTTP, tipos y funciones de la API
  components/   componentes compartidos (carga y error)
  features/
    users/      lista de usuarios, búsqueda y hook de datos
    posts/      publicaciones, modal, formulario y hook para crear
  test/         configuración de pruebas y respuestas simuladas (MSW)
```

## Decisiones

- **Capa de API separada.** Un cliente centraliza la URL base, los headers y el manejo de errores. `fetch` no falla con respuestas 4xx o 5xx, así que se revisa `response.ok` y se lanza un error para que la interfaz muestre el estado de error. El header `Content-Type` solo se envía cuando la petición lleva cuerpo, para evitar la petición CORS previa (OPTIONS) en los GET.
- **Tipos mínimos.** Solo se tipan los campos que la app usa. `NewPost` se deriva de `Post` con `Omit` para no duplicar campos.
- **Separación por capas, no arquitectura hexagonal completa.** Para una app de este tamaño, puertos y adaptadores serían sobreingeniería. Si creciera o cambiara el proveedor de datos, definiría interfaces (por ejemplo, un `PostsRepository`) y adaptadores inyectados por Context.
- **TanStack Query para el estado del servidor.** Resuelve caché, estados de carga y error y reintentos sin `useEffect` manual. La lista de usuarios se comparte entre componentes sin repetir la petición.
- **Búsqueda en el cliente.** Son 10 usuarios: filtrar en memoria es instantáneo y evita una petición por cada tecla. Se normalizan las tildes para que "jose" encuentre a "José".
- **Solo se guarda el id del usuario seleccionado.** El usuario se busca en la lista, así hay una sola fuente de verdad. El panel de publicaciones usa `key` por usuario para reiniciar su estado al cambiar de usuario.
- **La publicación nueva se agrega a la caché con `setQueryData`.** JSONPlaceholder simula la creación pero no guarda nada: invalidar o volver a pedir la lista haría desaparecer la publicación. Por eso las publicaciones usan `staleTime: Infinity` y se piden una sola vez por usuario.
- **Id único para publicaciones nuevas.** La API siempre devuelve `id: 101`. `withUniqueId` asigna uno mayor si ese id ya existe, para evitar keys duplicadas en React.
- **React Hook Form + Zod.** La validación vive en un esquema; un título con solo espacios también es inválido. Los errores se asocian a cada campo con `aria-invalid` y `aria-describedby`, el botón se desactiva durante el envío y lo escrito se conserva si la publicación falla.
- **Modal con `<dialog>` nativo** en lugar de una librería: manejo del foco, cierre con Escape y fondo bloqueado sin dependencias extra.
- **Pruebas centradas en el usuario.** Se busca por rol, etiqueta y texto, como lo haría una persona. MSW simula la API en la capa de red, así que también se prueba el cliente HTTP real. Se cubren el camino feliz, los errores y la validación.
- **Flujo de trabajo.** Una rama por funcionalidad, Pull Request y merge sin squash para conservar el historial de commits.

## Problema encontrado durante el desarrollo

Al crear una publicación, aparecía en la caché pero no en la pantalla. Comparando la caché (con `console.log`) y la pestaña Network, vi que justo después del POST se hacía un nuevo GET de la lista: al cerrar el modal se llamaba a `refetch()`, y como la API no guarda los cambios, la respuesta reemplazaba la caché sin la publicación nueva. Lo resolví quitando ese `refetch` y usando `staleTime: Infinity` para las publicaciones.

## Qué haría con más tiempo

- Validar las respuestas de la API en tiempo de ejecución con Zod; hoy `as T` solo confía en el tipo.
- Evitar que una publicación creada mientras la lista aún carga se pierda cuando llega la respuesta.
- Guardar el usuario seleccionado y la búsqueda en la URL para poder compartir el enlace.
- Pruebas end-to-end con Playwright y un pipeline en GitHub Actions con pruebas y cobertura.
- Reglas de ESLint con información de tipos, Prettier y un diseño visual más trabajado.

## Tiempo

Aproximadamente 10 horas en total, en varios intervalos entre el 16 y el 18 de noviembre de 2026, no en un solo bloque. Cerca de 2 horas fueron de preparación del entorno: el flujo de ramas y Pull Requests desde VS Code, y la configuración de Vitest y MSW. El resto fue desarrollo, pruebas y documentación. Superé las 3 horas sugeridas porque prioricé las pruebas, la accesibilidad y resolver el problema de la caché con una API que no persiste los datos.

## Cómo usé la IA

Usé Claude como apoyo durante el desarrollo.

- **Qué le pedí:** apoyo para definir la estructura del proyecto y una guía por pasos con ejemplos de código, que fui escribiendo y adaptando; explicaciones de cada parte (tipos, genéricos, TanStack Query, `<dialog>`); ayuda para entender y corregir errores, y un borrador de este README.
- **Qué acepté:** la estructura por funcionalidades, TanStack Query para el estado del servidor, React Hook Form con Zod para el formulario y MSW para simular la API en las pruebas, después de entender por qué convenía cada una.
- **Qué decidí o corregí yo:**
  - Trabajar con una rama por funcionalidad y Pull Requests, para que el historial muestre el avance.
  - Mover el formulario a un modal, porque dentro del panel quedaba recargado.
  - Adaptar nombres de componentes, props y textos a mi estilo.
  - Cuando la publicación nueva no aparecía en la lista, comparé la caché con `console.log` y la pestaña Network hasta encontrar el `refetch` que la borraba.
  - Corregí con ayuda de la IA los errores de tipos (`import type`, `Omit`).