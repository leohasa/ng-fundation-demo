# Foundation Demo - Angular 20

Proyecto Angular 20 con **Vertical Slice Architecture** y **Signals-based State Management**.

## Características

- Angular 20+ con Standalone Components
- Vertical Slice Architecture
- Signals para manejo de estado (sin RxJS excepto para flujos asíncronos)
- Reactive Forms
- Tailwind CSS
- Interceptores funcionales
- Guards funcionales
- TypeScript estricto

## Estructura del Proyecto

```
src/app/
├── core/                    # Servicios singleton y configuración global
│   ├── models/             # Interfaces y tipos compartidos
│   │   ├── project.model.ts
│   │   ├── support-info.model.ts
│   │   └── setting.model.ts
│   ├── services/           # Servicios core (auth, api)
│   │   ├── auth.service.ts
│   │   └── api.service.ts
│   ├── guards/             # Guards funcionales
│   │   ├── auth.guard.ts
│   │   └── admin.guard.ts
│   └── interceptors/       # Interceptores HTTP funcionales
│       ├── auth.interceptor.ts
│       └── logging.interceptor.ts
├── shared/                  # Componentes, pipes y directivas reutilizables
│   ├── components/         # UI Components
│   │   ├── button.component.ts
│   │   ├── input.component.ts
│   │   ├── modal.component.ts
│   │   └── card.component.ts
│   └── pipes/              # Pipes compartidos
│       └── time-ago.pipe.ts
├── features/                # Vertical Slices (features)
│   ├── projects/           # Feature: Gestión de proyectos
│   │   ├── components/     # Componentes internos de la feature
│   │   │   ├── project-card.component.ts
│   │   │   └── project-form.component.ts
│   │   ├── pages/          # Smart components vinculados a rutas
│   │   │   ├── projects-list.page.ts
│   │   │   └── project-detail.page.ts
│   │   ├── services/       # Signal Stores y lógica local
│   │   │   └── projects.store.ts
│   │   └── projects.routes.ts
│   ├── home/
│   │   └── pages/
│   │       └── home.page.ts
│   ├── auth/
│   │   └── pages/
│   │       └── login.page.ts
│   └── admin/
│       ├── pages/
│       │   └── admin-projects.page.ts
│       └── admin.routes.ts
├── app.config.ts            # Configuración de la aplicación
├── app.routes.ts            # Rutas principales
└── app.component.ts         # Componente raíz
```

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`

## Build

```bash
npm run build
```

## Conceptos Clave

### Vertical Slice Architecture

Cada feature es una "rebanada vertical" que contiene:
- **Components**: Componentes de presentación específicos
- **Pages**: Smart components conectados a rutas
- **Services**: Signal Stores y lógica de negocio local
- **Models**: Interfaces y tipos exclusivos de la feature
- **Routes**: Definición de rutas de la feature

### Signals-based State Management

- **`signal()`**: Estado mutable reactivo
- **`computed()`**: Valores derivados
- **`effect()`**: Efectos secundarios
- **Signal Stores**: Servicios que encapsulan estado con signals

Ejemplo:
```typescript
private readonly _projects = signal<Project[]>([]);
readonly projects = this._projects.asReadonly();
readonly activeProjects = computed(() => 
  this._projects().filter(p => p.isActive)
);
```

### Standalone Components

Todos los componentes son standalone (sin NgModules):
```typescript
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  // ...
})
```

### Interceptores y Guards Funcionales

Guards:
```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  return authService.isAuthenticated();
};
```

Interceptores:
```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  // ...
  return next(req);
};
```

## Features Implementadas

### Projects
- Listado de proyectos
- Detalle de proyecto
- CRUD completo en panel admin
- Signal Store para gestión de estado

### Auth
- Login con signals
- Persistencia en localStorage
- Guards para protección de rutas

### Admin
- Panel de administración
- Gestión de proyectos
- Protegido con authGuard y adminGuard

## Tecnologías

- Angular 20
- TypeScript 5.6
- Tailwind CSS 3.4
- RxJS 7.8 (solo para HTTP)

## Próximos Pasos

1. Conectar con API real (reemplazar mocks en stores)
2. Agregar más features siguiendo la estructura vertical
3. Implementar tests unitarios
4. Agregar más componentes shared según necesidades
