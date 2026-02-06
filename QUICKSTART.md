# Foundation Demo - Guía de Inicio Rápido

## Resumen del Proyecto

Andamiaje completo de Angular 20 con:
- ✅ Vertical Slice Architecture
- ✅ Signals-based State Management
- ✅ Standalone Components (100% sin NgModules)
- ✅ Tailwind CSS
- ✅ Guards e Interceptores funcionales
- ✅ TypeScript estricto

## Estructura Creada

```
foundation-demo/
├── src/
│   ├── app/
│   │   ├── core/                    # Singleton services
│   │   │   ├── models/             # Project, SupportInfo, Setting
│   │   │   ├── services/           # AuthService, ApiService
│   │   │   ├── guards/             # authGuard, adminGuard
│   │   │   └── interceptors/       # authInterceptor, loggingInterceptor
│   │   ├── shared/                  # UI Components reutilizables
│   │   │   ├── components/         # Button, Input, Modal, Card
│   │   │   └── pipes/              # TimeAgoPipe
│   │   ├── features/                # Vertical Slices
│   │   │   ├── projects/           # Feature completa con CRUD
│   │   │   │   ├── components/     # ProjectCard, ProjectForm
│   │   │   │   ├── pages/          # List, Detail
│   │   │   │   ├── services/       # ProjectsStore (Signal Store)
│   │   │   │   └── projects.routes.ts
│   │   │   ├── home/               # Página de inicio
│   │   │   ├── auth/               # Login
│   │   │   └── admin/              # Panel admin con guards
│   │   ├── app.component.ts
│   │   ├── app.config.ts           # Providers funcionales
│   │   └── app.routes.ts           # Lazy loading
│   ├── environments/
│   ├── styles/
│   └── index.html
├── angular.json
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── README.md
└── ARCHITECTURE.md
```

## Pasos para Iniciar

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Iniciar Servidor de Desarrollo

```bash
npm start
```

Abre http://localhost:4200

### 3. Explorar Features Implementadas

#### Home (`/home`)
- Página de bienvenida con diseño Tailwind
- Links a proyectos y login

#### Projects (`/projects`)
- Listado de proyectos con cards
- Detalle de proyecto individual
- Signal Store con estado reactivo
- Datos mock (listos para conectar con API real)

#### Login (`/login`)
- Formulario reactivo
- Auth con Signals
- Persistencia en localStorage
- Demo mode (acepta cualquier credencial)

#### Admin (`/admin/projects`)
- Protegido con authGuard y adminGuard
- CRUD completo de proyectos
- Formulario modal
- Confirmación de eliminación

## Conceptos Clave Implementados

### 1. Signal Store Pattern

```typescript
// src/app/features/projects/services/projects.store.ts
@Injectable({ providedIn: 'root' })
export class ProjectsStore {
  private readonly _projects = signal<Project[]>([]);
  readonly projects = this._projects.asReadonly();
  readonly activeProjects = computed(() => 
    this._projects().filter(p => p.isActive)
  );
  
  async loadProjects(): Promise<void> {
    this._loading.set(true);
    const data = await this.api.get('/projects');
    this._projects.set(data);
    this._loading.set(false);
  }
}
```

### 2. Signal Inputs/Outputs

```typescript
// Componentes usando nueva API de signals
export class ButtonComponent {
  variant = input<ButtonVariant>('primary');
  disabled = input<boolean>(false);
  clicked = output<MouseEvent>();
}
```

### 3. Guards Funcionales

```typescript
// src/app/core/guards/auth.guard.ts
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  return authService.isAuthenticated();
};
```

### 4. Interceptores Funcionales

```typescript
// src/app/core/interceptors/auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token();
  
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  return next(req);
};
```

## Próximos Pasos

### 1. Conectar con API Real

Reemplazar los métodos mock en `ProjectsStore`:

```typescript
// De esto:
private async mockFetchProjects(): Promise<Project[]> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockData;
}

// A esto:
async loadProjects(): Promise<void> {
  this._loading.set(true);
  try {
    const response = await this.api.get<Project[]>('/projects');
    this._projects.set(response);
  } finally {
    this._loading.set(false);
  }
}
```

### 2. Agregar Nueva Feature

```bash
# Crear estructura
mkdir -p src/app/features/mi-feature/{components,pages,services}

# Crear store
touch src/app/features/mi-feature/services/mi-feature.store.ts

# Crear page
touch src/app/features/mi-feature/pages/mi-feature.page.ts

# Crear rutas
touch src/app/features/mi-feature/mi-feature.routes.ts
```

### 3. Componentes Shared Adicionales

Agregar según necesites:
- Spinner/Loader
- Notification/Toast
- Dropdown
- Tabs
- Badge
- Avatar
- etc.

### 4. Pipes Útiles

Crear pipes adicionales en `src/app/shared/pipes/`:
- CurrencyPipe personalizado
- TruncatePipe
- HighlightPipe
- SafeHtmlPipe

## Comandos Útiles

```bash
# Desarrollo
npm start                    # Inicia dev server

# Build
npm run build               # Build producción
npm run build -- --configuration development  # Build desarrollo

# Linting (después de configurar ESLint)
npm run lint

# Testing (después de configurar)
npm test
```

## Tips de Desarrollo

### 1. DevTools
Instala Angular DevTools (extensión Chrome/Firefox) para:
- Inspeccionar componentes
- Ver valores de signals en tiempo real
- Profiling de performance

### 2. Signals Debugging
```typescript
// Usar effect para debug
constructor() {
  effect(() => {
    console.log('Projects changed:', this.store.projects());
  });
}
```

### 3. Path Aliases (Opcional)
Agregar a `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@core/*": ["src/app/core/*"],
      "@shared/*": ["src/app/shared/*"],
      "@features/*": ["src/app/features/*"]
    }
  }
}
```

## Recursos

- **README.md**: Visión general del proyecto
- **ARCHITECTURE.md**: Documentación detallada de arquitectura
- **Angular Docs**: https://angular.dev
- **Tailwind CSS**: https://tailwindcss.com/docs

## Soporte

Para dudas o problemas:
1. Revisa la documentación en README.md y ARCHITECTURE.md
2. Consulta los ejemplos implementados en features/projects
3. Revisa los comentarios en el código

---

**¡Listo para desarrollar!** 🚀

El proyecto está completamente configurado con todas las mejores prácticas de Angular 20.
Solo necesitas ejecutar `npm install` y `npm start` para comenzar.
