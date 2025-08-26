# Frontend - Sistema de Administración (React + Vite)

Este proyecto es el frontend de un sistema de administración de usuarios y productos. Utiliza React, Vite y PrimeReact para una experiencia moderna y minimalista.

## Características
- CRUD de productos y usuarios
- Login y registro con JWT
- Control de permisos y visualización según rol (admin, moderador, cliente)
- Exportación a PDF
- Interfaz moderna y responsiva

## Requisitos
- Node.js (LTS recomendado)
- Tener el backend corriendo en http://localhost:3000

## Instalación
1. Clona el repositorio y entra a la carpeta frontend:
   ```bash
git clone <url-del-repo>
cd frontend
```
2. Instala las dependencias:
   ```bash
npm install
```

## Ejecución
```bash
npm run dev
```
La app estará disponible en http://localhost:5173 (por defecto)

## Estructura
- `/src/components` → Navbar y componentes generales
- `/src/layouts` → vistas de productos, usuarios, auth y home
- `/src/context` → contextos de autenticación, productos y usuarios
- `/src/utils` → utilidades (rutas protegidas, exportar PDF)

## Roles y permisos
- Solo admin puede crear, editar o eliminar productos y usuarios
- Usuarios no admin solo pueden visualizar
- El frontend oculta botones de acción según el rol

## Ejemplo de uso
1. Regístrate o inicia sesión
2. Si eres admin, accede a la gestión completa de usuarios y productos
3. Si eres cliente o moderador, solo podrás visualizar

## Personalización
- El diseño puede modificarse en `src/App.css` y los componentes de PrimeReact

## Notas
- El backend debe estar corriendo para que la app funcione
- El sistema utiliza JWT almacenado en localStorage
- El token expira en 1 hora (se renueva al hacer login)

---

¡Listo para usar y entregar!
