# Ejemplo de Uso: MockDataService

## Ejemplo Rápido de Integración

Este archivo muestra cómo el MockDataService ya está integrado en el proyecto.

### ProjectsStore (Ya actualizado)

El `ProjectsStore` ahora usa `MockDataService` en lugar de métodos mock internos:

```typescript
// src/app/features/projects/services/projects.store.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MockDataService } from '../../../core/services/mock-data.service';

@Injectable({ providedIn: 'root' })
export class ProjectsStore {
  private readonly mockData = inject(MockDataService);

  async loadProjects(): Promise<void> {
    this._loading.set(true);
    try {
      // Usa MockDataService que retorna 8 proyectos con datos en español
      const projects = await firstValueFrom(this.mockData.getProjects$());
      this._projects.set(projects);
    } finally {
      this._loading.set(false);
    }
  }

  async createProject(dto: CreateProjectDto): Promise<void> {
    const newProject = await firstValueFrom(this.mockData.createProject$(dto));
    this._projects.update(projects => [...projects, newProject]);
  }
}
```

## Datos Disponibles

### 8 Proyectos de Ejemplo
1. Centro Comunitario San Miguel
2. Programa de Becas Educativas 2026
3. Huertos Urbanos Sostenibles
4. Clínica Móvil de Salud
5. Programa de Emprendimiento Juvenil
6. Talleres de Arte para Niños (inactivo)
7. Alfabetización Digital para Adultos Mayores
8. Reforestación Sierra Verde

### 9 Opciones de Apoyo
**Bancarias:**
- Banco Nacional - Cuenta Corriente
- Banco del Estado - Cuenta de Ahorros
- Transferencias Internacionales

**Otros métodos:**
- PayPal
- Mercado Pago
- Criptomonedas
- Donaciones en Especie
- Voluntariado
- Apadrinamiento

### 20 Configuraciones del Sistema
- Información del sitio (nombre, tagline)
- Datos de contacto (email, teléfono, dirección)
- Redes sociales (Facebook, Instagram, Twitter, YouTube, LinkedIn)
- Parámetros operacionales (metas, contadores, flags)

## Crear Nuevas Features con MockDataService

### Feature: Support (Información de Apoyo)

```typescript
// src/app/features/support/services/support.store.ts
import { Injectable, signal, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MockDataService } from '../../../core/services/mock-data.service';
import { SupportInfo } from '../../../core/models/support-info.model';

@Injectable({ providedIn: 'root' })
export class SupportStore {
  private readonly mockData = inject(MockDataService);
  
  private readonly _supports = signal<SupportInfo[]>([]);
  private readonly _loading = signal(false);
  
  readonly supports = this._supports.asReadonly();
  readonly loading = this._loading.asReadonly();
  
  readonly bankSupports = computed(() => 
    this._supports().filter(s => s.type === 'bank')
  );
  
  readonly otherSupports = computed(() => 
    this._supports().filter(s => s.type === 'other')
  );
  
  async loadSupports(): Promise<void> {
    this._loading.set(true);
    try {
      const supports = await firstValueFrom(this.mockData.getSupportInfo$());
      this._supports.set(supports);
    } finally {
      this._loading.set(false);
    }
  }
}
```

### Feature: Settings (Configuraciones)

```typescript
// src/app/features/settings/services/settings.store.ts
import { Injectable, signal, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MockDataService } from '../../../core/services/mock-data.service';
import { Setting } from '../../../core/models/setting.model';

@Injectable({ providedIn: 'root' })
export class SettingsStore {
  private readonly mockData = inject(MockDataService);
  
  private readonly _settings = signal<Setting[]>([]);
  readonly settings = this._settings.asReadonly();
  
  async loadSettings(): Promise<void> {
    const settings = await firstValueFrom(this.mockData.getSettings$());
    this._settings.set(settings);
  }
  
  async getSetting(key: string): Promise<string | undefined> {
    const value = await firstValueFrom(this.mockData.getSettingValue$(key));
    return value;
  }
}
```

## Ventajas de la Nueva Implementación

### Antes (con métodos mock internos)
```typescript
// ❌ Cada store tenía sus propios datos mock
private async mockFetchProjects(): Promise<Project[]> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    { id: '1', title: 'Proyecto Demo 1', ... },
    { id: '2', title: 'Proyecto Demo 2', ... }
  ];
}
```

### Ahora (con MockDataService)
```typescript
// ✅ Datos centralizados, reutilizables y realistas
const projects = await firstValueFrom(this.mockData.getProjects$());
// Retorna 8 proyectos completos con contenido en español
```

## Beneficios

1. **Datos Centralizados**: Un solo lugar para todos los datos mock
2. **Datos Realistas**: Contenido completo en español con imágenes
3. **Reutilizable**: Cualquier store/componente puede usar el servicio
4. **Testing Fácil**: Mock datos consistentes para pruebas
5. **Delay Simulado**: 800ms de latencia para realismo
6. **CRUD Completo**: Crear, leer, actualizar, eliminar
7. **Búsqueda**: Método de búsqueda incorporado
8. **Estadísticas**: Métricas agregadas disponibles

## Próximos Pasos

1. **Crear Feature Support**:
   - Store usando `MockDataService.getSupportInfo$()`
   - Página para mostrar opciones de apoyo
   - Filtros por tipo (bank/other)

2. **Crear Feature Settings**:
   - Store usando `MockDataService.getSettings$()`
   - Panel de administración de configuraciones
   - Formulario CRUD

3. **Mejorar Home Page**:
   - Usar `MockDataService.getStatistics$()`
   - Mostrar contador de proyectos activos
   - Obtener configuraciones (nombre, tagline)

4. **Agregar Búsqueda**:
   - Usar `MockDataService.searchProjects$(term)`
   - Barra de búsqueda en header
   - Página de resultados

## Testing del MockDataService

Para probar que funciona correctamente, ejecuta la aplicación:

```bash
npm start
```

Luego navega a:
- `/projects` - Verás 8 proyectos con datos en español
- `/projects/1` - Detalle del Centro Comunitario San Miguel
- `/admin/projects` - CRUD completo funcionando

Los datos aparecen con un delay de 800ms simulando una API real.

---

El MockDataService está completamente integrado y funcionando. Los datos son mucho más realistas y completos que los anteriores placeholders.
