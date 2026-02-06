# MockDataService - Guía de Uso

## Descripción

`MockDataService` es un servicio centralizado que proporciona datos de prueba simulados para desarrollo y testing. Simula llamadas a una API real con delays realistas y manejo de errores.

## Ubicación

```
src/app/core/services/mock-data.service.ts
```

## Características

- ✅ Datos de prueba completos en español
- ✅ Delays simulados (800ms por defecto) para realismo
- ✅ Retorna Observables con RxJS
- ✅ Compatible con Signals usando `toSignal` o `firstValueFrom`
- ✅ Operaciones CRUD completas para todos los modelos
- ✅ Manejo de errores simulado
- ✅ Búsqueda y filtrado
- ✅ Estadísticas

## Modelos Soportados

### 1. Projects (Proyectos)
8 proyectos de ejemplo:
- Centro Comunitario San Miguel
- Programa de Becas Educativas 2026
- Huertos Urbanos Sostenibles
- Clínica Móvil de Salud
- Programa de Emprendimiento Juvenil
- Talleres de Arte para Niños
- Alfabetización Digital para Adultos Mayores
- Reforestación Sierra Verde

### 2. SupportInfo (Información de Apoyo)
9 opciones de apoyo:
- 3 opciones bancarias
- 6 otros métodos (PayPal, Mercado Pago, Cripto, etc.)

### 3. Settings (Configuraciones)
20 configuraciones del sistema:
- Información del sitio
- Contacto
- Redes sociales
- Parámetros operacionales

## Uso Básico

### Opción 1: Con Observables (Método tradicional)

```typescript
import { Injectable, inject } from '@angular/core';
import { MockDataService } from '@core/services/mock-data.service';

@Injectable({ providedIn: 'root' })
export class MyService {
  private readonly mockData = inject(MockDataService);

  loadProjects(): void {
    this.mockData.getProjects$().subscribe({
      next: (projects) => {
        console.log('Projects loaded:', projects);
      },
      error: (error) => {
        console.error('Error loading projects:', error);
      }
    });
  }
}
```

### Opción 2: Con async/await (Más moderno)

```typescript
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MockDataService } from '@core/services/mock-data.service';

@Injectable({ providedIn: 'root' })
export class MyService {
  private readonly mockData = inject(MockDataService);

  async loadProjects(): Promise<void> {
    try {
      const projects = await firstValueFrom(this.mockData.getProjects$());
      console.log('Projects loaded:', projects);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  }
}
```

### Opción 3: Con Signals (Recomendado para Angular 20+)

```typescript
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MockDataService } from '@core/services/mock-data.service';

@Component({
  selector: 'app-projects',
  template: `
    @if (projects(); as projectList) {
      @for (project of projectList; track project.id) {
        <div>{{ project.title }}</div>
      }
    }
  `
})
export class ProjectsComponent {
  private readonly mockData = inject(MockDataService);
  
  // Convierte Observable a Signal
  projects = toSignal(this.mockData.getProjects$(), { 
    initialValue: [] 
  });
}
```

## API Completa

### Projects

```typescript
// Obtener todos los proyectos
getProjects$(): Observable<Project[]>

// Obtener proyecto por ID
getProjectById$(id: string): Observable<Project | undefined>

// Obtener solo proyectos activos
getActiveProjects$(): Observable<Project[]>

// Crear proyecto
createProject$(dto: CreateProjectDto): Observable<Project>

// Actualizar proyecto
updateProject$(dto: UpdateProjectDto): Observable<Project>

// Eliminar proyecto
deleteProject$(id: string): Observable<void>

// Buscar proyectos
searchProjects$(term: string): Observable<Project[]>
```

### SupportInfo

```typescript
// Obtener toda la información de apoyo
getSupportInfo$(): Observable<SupportInfo[]>

// Obtener por tipo
getSupportInfoByType$(type: 'bank' | 'other'): Observable<SupportInfo[]>

// Obtener solo información bancaria
getBankSupportInfo$(): Observable<SupportInfo[]>

// Obtener otros tipos de apoyo
getOtherSupportInfo$(): Observable<SupportInfo[]>

// Crear información de apoyo
createSupportInfo$(dto: CreateSupportInfoDto): Observable<SupportInfo>

// Actualizar información de apoyo
updateSupportInfo$(dto: UpdateSupportInfoDto): Observable<SupportInfo>

// Eliminar información de apoyo
deleteSupportInfo$(id: string): Observable<void>
```

### Settings

```typescript
// Obtener todas las configuraciones
getSettings$(): Observable<Setting[]>

// Obtener configuración por clave
getSettingByKey$(key: string): Observable<Setting | undefined>

// Obtener solo el valor
getSettingValue$(key: string): Observable<string | undefined>

// Crear configuración
createSetting$(dto: CreateSettingDto): Observable<Setting>

// Actualizar configuración
updateSetting$(dto: UpdateSettingDto): Observable<Setting>

// Eliminar configuración
deleteSetting$(id: string): Observable<void>
```

### Utilidades

```typescript
// Obtener estadísticas generales
getStatistics$(): Observable<{
  totalProjects: number;
  activeProjects: number;
  totalSupportOptions: number;
  totalSettings: number;
}>

// Reiniciar datos (útil para testing)
resetData(): void
```

## Ejemplos Prácticos

### Ejemplo 1: Signal Store con MockDataService

```typescript
import { Injectable, signal, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MockDataService } from '@core/services/mock-data.service';

@Injectable({ providedIn: 'root' })
export class ProjectsStore {
  private readonly mockData = inject(MockDataService);
  
  private readonly _projects = signal<Project[]>([]);
  private readonly _loading = signal(false);
  
  readonly projects = this._projects.asReadonly();
  readonly loading = this._loading.asReadonly();
  
  async loadProjects(): Promise<void> {
    this._loading.set(true);
    try {
      const projects = await firstValueFrom(this.mockData.getProjects$());
      this._projects.set(projects);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      this._loading.set(false);
    }
  }
}
```

### Ejemplo 2: Componente con Búsqueda

```typescript
import { Component, inject, signal } from '@angular/core';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { MockDataService } from '@core/services/mock-data.service';

@Component({
  selector: 'app-search-projects',
  template: `
    <input [formControl]="searchControl" placeholder="Buscar proyectos..." />
    
    @if (results(); as projectList) {
      <div>{{ projectList.length }} resultados</div>
      @for (project of projectList; track project.id) {
        <div>{{ project.title }}</div>
      }
    }
  `
})
export class SearchProjectsComponent {
  private readonly mockData = inject(MockDataService);
  
  searchControl = new FormControl('');
  
  results = toSignal(
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.mockData.searchProjects$(term || ''))
    ),
    { initialValue: [] }
  );
}
```

### Ejemplo 3: Cargar Configuraciones

```typescript
import { Component, inject, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MockDataService } from '@core/services/mock-data.service';

@Component({
  selector: 'app-footer',
  template: `
    <footer>
      <p>{{ siteName() }}</p>
      <p>{{ tagline() }}</p>
      <p>Email: {{ email() }}</p>
      <a [href]="facebook()">Facebook</a>
    </footer>
  `
})
export class FooterComponent implements OnInit {
  private readonly mockData = inject(MockDataService);
  
  siteName = signal<string>('');
  tagline = signal<string>('');
  email = signal<string>('');
  facebook = signal<string>('');
  
  async ngOnInit(): Promise<void> {
    const settings = await firstValueFrom(this.mockData.getSettings$());
    
    this.siteName.set(settings.find(s => s.key === 'site_name')?.value || '');
    this.tagline.set(settings.find(s => s.key === 'site_tagline')?.value || '');
    this.email.set(settings.find(s => s.key === 'contact_email')?.value || '');
    this.facebook.set(settings.find(s => s.key === 'social_facebook')?.value || '');
  }
}
```

### Ejemplo 4: Estadísticas Dashboard

```typescript
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MockDataService } from '@core/services/mock-data.service';

@Component({
  selector: 'app-stats-dashboard',
  template: `
    @if (stats(); as statistics) {
      <div class="grid grid-cols-4 gap-4">
        <div class="stat-card">
          <h3>Total Proyectos</h3>
          <p>{{ statistics.totalProjects }}</p>
        </div>
        <div class="stat-card">
          <h3>Proyectos Activos</h3>
          <p>{{ statistics.activeProjects }}</p>
        </div>
        <div class="stat-card">
          <h3>Opciones de Apoyo</h3>
          <p>{{ statistics.totalSupportOptions }}</p>
        </div>
        <div class="stat-card">
          <h3>Configuraciones</h3>
          <p>{{ statistics.totalSettings }}</p>
        </div>
      </div>
    }
  `
})
export class StatsDashboardComponent {
  private readonly mockData = inject(MockDataService);
  
  stats = toSignal(this.mockData.getStatistics$());
}
```

## Migración a API Real

Cuando estés listo para conectar con una API real:

1. **Mantén MockDataService** para testing y desarrollo
2. **Crea un nuevo servicio** (ej: `ApiDataService`) con la misma interfaz
3. **Usa injection token** para cambiar entre mock y real:

```typescript
// data.service.interface.ts
export interface IDataService {
  getProjects$(): Observable<Project[]>;
  // ... otros métodos
}

// data.service.token.ts
export const DATA_SERVICE = new InjectionToken<IDataService>('DATA_SERVICE');

// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    // Desarrollo: usar MockDataService
    { provide: DATA_SERVICE, useClass: MockDataService }
    
    // Producción: usar ApiDataService
    // { provide: DATA_SERVICE, useClass: ApiDataService }
  ]
};

// Uso en componentes
private readonly dataService = inject(DATA_SERVICE);
```

## Testing

```typescript
import { TestBed } from '@angular/core/testing';
import { MockDataService } from '@core/services/mock-data.service';

describe('MyComponent', () => {
  let mockData: MockDataService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockDataService]
    });
    
    mockData = TestBed.inject(MockDataService);
  });
  
  it('should load projects', async () => {
    const projects = await firstValueFrom(mockData.getProjects$());
    expect(projects.length).toBeGreaterThan(0);
  });
});
```

## Notas Importantes

1. **Delay Simulado**: El delay de 800ms simula latencia de red real
2. **Datos en Memoria**: Los cambios persisten durante la sesión pero se pierden al recargar
3. **IDs Generados**: Los IDs de nuevos registros usan `Date.now().toString()`
4. **Errores Simulados**: Lanza errores para IDs no encontrados
5. **Thread-Safe**: El servicio es singleton y thread-safe

## Ventajas

- ✅ No requiere backend para desarrollo
- ✅ Datos realistas en español
- ✅ Desarrollo más rápido
- ✅ Testing sin dependencias externas
- ✅ Demos y prototipos funcionales
- ✅ Fácil migración a API real

---

**Última actualización**: Febrero 2026  
**Versión**: 1.0.0
