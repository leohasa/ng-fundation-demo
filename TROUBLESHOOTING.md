# Troubleshooting y FAQs

## Problemas Comunes y Soluciones

### 1. Error: "Cannot find module '@angular/core'"

**Causa**: Dependencias no instaladas

**Solución**:
```bash
npm install
```

### 2. Error en Tailwind CSS no aplicándose

**Causa**: Configuración de Tailwind no cargada correctamente

**Solución**:
1. Verificar que `tailwind.config.js` existe en la raíz
2. Verificar que `postcss.config.js` existe
3. Verificar que `src/styles/styles.css` contiene las directivas de Tailwind:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
4. Reiniciar el servidor de desarrollo

### 3. Error: "inject() must be called from an injection context"

**Causa**: Uso de `inject()` fuera del contexto de inyección

**Solución**:
```typescript
// ❌ Incorrecto
export class MyComponent {
  private service = inject(MyService); // Fuera del contexto
  
  someMethod() {
    // ...
  }
}

// ✅ Correcto
export class MyComponent {
  private readonly service = inject(MyService); // En el nivel de clase
  
  // O en el constructor
  constructor() {
    const service = inject(MyService);
  }
}
```

### 4. Signal not updating in template

**Causa**: Olvidaste llamar el signal como función

**Solución**:
```typescript
// ❌ Incorrecto
<div>{{ mySignal }}</div>

// ✅ Correcto
<div>{{ mySignal() }}</div>
```

### 5. Error: "NG0301: Export not found!"

**Causa**: Componente/directiva/pipe no importado en el componente standalone

**Solución**:
```typescript
@Component({
  standalone: true,
  imports: [
    CommonModule,
    MissingComponent // ← Agregar aquí
  ]
})
```

### 6. Guards no funcionan

**Causa**: Guard no registrado en las rutas

**Solución**:
```typescript
// app.routes.ts
{
  path: 'admin',
  canActivate: [authGuard], // ← Asegúrate de incluir el guard
  loadChildren: () => import('./features/admin/admin.routes')
}
```

### 7. Interceptor no intercepta requests

**Causa**: Interceptor no registrado en `app.config.ts`

**Solución**:
```typescript
// app.config.ts
provideHttpClient(
  withFetch(),
  withInterceptors([
    loggingInterceptor,
    authInterceptor // ← Debe estar aquí
  ])
)
```

## FAQs

### ¿Por qué usar Signals en lugar de RxJS?

**Respuesta**: 
- Signals son más simples para estado local
- Mejor performance (fine-grained reactivity)
- Menos boilerplate
- API más intuitiva para casos comunes

**Cuándo usar RxJS**:
- Operaciones asíncronas complejas
- Necesitas operadores como `debounceTime`, `switchMap`, etc.
- HTTP requests (Angular HttpClient retorna Observables)

### ¿Cómo convertir un Observable a Signal?

```typescript
import { toSignal } from '@angular/core/rxjs-interop';

// Observable de RxJS
data$ = this.http.get('/api/data');

// Convertir a Signal
data = toSignal(this.data$, { initialValue: [] });

// Usar en template
{{ data().length }}
```

### ¿Puedo usar NgModules?

**No recomendado**. Este proyecto está diseñado para usar 100% standalone components. NgModules están deprecated desde Angular 14+.

### ¿Cómo hacer testing?

```typescript
// Component Test
describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent] // Import standalone component
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update signal', () => {
    component.mySignal.set('new value');
    expect(component.mySignal()).toBe('new value');
  });
});

// Store Test
describe('MyStore', () => {
  let store: MyStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(MyStore);
  });

  it('should load data', async () => {
    await store.loadData();
    expect(store.data().length).toBeGreaterThan(0);
  });
});
```

### ¿Cómo manejar formularios complejos?

Usa Reactive Forms con FormBuilder:

```typescript
form = this.fb.group({
  name: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  address: this.fb.group({
    street: [''],
    city: [''],
    zip: ['']
  }),
  hobbies: this.fb.array([])
});

// Agregar hobby
get hobbies() {
  return this.form.get('hobbies') as FormArray;
}

addHobby() {
  this.hobbies.push(this.fb.control(''));
}
```

### ¿Cómo hacer validaciones custom?

```typescript
// Validator function
function emailDomainValidator(domain: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value;
    if (email && !email.endsWith(`@${domain}`)) {
      return { emailDomain: { requiredDomain: domain } };
    }
    return null;
  };
}

// Usar en form
email: ['', [Validators.required, emailDomainValidator('company.com')]]
```

### ¿Cómo implementar búsqueda/filtrado?

```typescript
// Store
private readonly _items = signal<Item[]>([]);
private readonly _searchTerm = signal<string>('');

readonly filteredItems = computed(() => {
  const term = this._searchTerm().toLowerCase();
  return this._items().filter(item => 
    item.name.toLowerCase().includes(term)
  );
});

setSearchTerm(term: string) {
  this._searchTerm.set(term);
}

// Component
<input 
  type="text" 
  (input)="store.setSearchTerm($event.target.value)"
  placeholder="Buscar..."
/>

@for (item of store.filteredItems(); track item.id) {
  <div>{{ item.name }}</div>
}
```

### ¿Cómo manejar paginación?

```typescript
// Store
private readonly _items = signal<Item[]>([]);
private readonly _page = signal<number>(1);
private readonly _pageSize = signal<number>(10);

readonly paginatedItems = computed(() => {
  const start = (this._page() - 1) * this._pageSize();
  const end = start + this._pageSize();
  return this._items().slice(start, end);
});

readonly totalPages = computed(() => 
  Math.ceil(this._items().length / this._pageSize())
);

nextPage() {
  if (this._page() < this.totalPages()) {
    this._page.update(p => p + 1);
  }
}

prevPage() {
  if (this._page() > 1) {
    this._page.update(p => p - 1);
  }
}
```

### ¿Cómo implementar drag & drop?

```typescript
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

// Component
@Component({
  imports: [DragDropModule],
  template: `
    <div cdkDropList (cdkDropListDropped)="drop($event)">
      @for (item of items(); track item.id) {
        <div cdkDrag>{{ item.name }}</div>
      }
    </div>
  `
})
export class MyComponent {
  items = signal([...]);

  drop(event: CdkDragDrop<string[]>) {
    const items = [...this.items()];
    moveItemInArray(items, event.previousIndex, event.currentIndex);
    this.items.set(items);
  }
}
```

### ¿Cómo hacer upload de archivos?

```typescript
// Component
<input 
  type="file" 
  (change)="onFileSelect($event)"
  accept="image/*"
/>

onFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  
  if (file) {
    const formData = new FormData();
    formData.append('file', file);
    
    this.store.uploadFile(formData);
  }
}

// Store
async uploadFile(formData: FormData): Promise<void> {
  this._loading.set(true);
  try {
    const result = await this.api.post('/upload', formData);
    // Procesar resultado
  } finally {
    this._loading.set(false);
  }
}
```

## Performance Tips

### 1. OnPush Change Detection (Automático con Signals)

Los componentes con signals automáticamente se benefician de change detection optimizado.

### 2. TrackBy en @for

```typescript
// ✅ Siempre usa track
@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}

// ❌ Evitar sin track (peor performance)
@for (item of items(); track $index) {
  <div>{{ item.name }}</div>
}
```

### 3. Lazy Loading

Ya implementado en todas las features del proyecto.

### 4. Computed Values

Usa `computed()` en lugar de métodos en el template:

```typescript
// ❌ Se ejecuta en cada change detection
get fullName() {
  return `${this.firstName} ${this.lastName}`;
}

// ✅ Solo se recalcula cuando cambian las dependencias
fullName = computed(() => 
  `${this.firstName()} ${this.lastName()}`
);
```

## Recursos Adicionales

- [Angular Docs](https://angular.dev)
- [Angular Signals](https://angular.dev/guide/signals)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Contacto y Soporte

Para más ayuda:
1. Revisa la documentación del proyecto
2. Consulta ejemplos en `features/projects`
3. Busca en Angular DevTools
4. Stack Overflow con tag `angular`

---

Última actualización: Febrero 2026
