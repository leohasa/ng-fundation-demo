import { Component, input, output, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Project, CreateProjectDto, UpdateProjectDto } from '../../../core/models/project.model';
import { ModalComponent } from '../../../shared/components/modal.component';
import { ButtonComponent } from '../../../shared/components/button.component';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    ModalComponent, 
    ButtonComponent
  ],
  template: `
    <app-modal
      [isOpen]="isOpen()"
      [title]="project() ? 'Editar Proyecto' : 'Nuevo Proyecto'"
      size="lg"
      (closed)="handleCancel()"
    >
      <form [formGroup]="form" (ngSubmit)="handleSubmit()">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Título <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              formControlName="title"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Ingrese el título del proyecto"
            />
            @if (form.get('title')?.invalid && form.get('title')?.touched) {
              <p class="mt-1 text-sm text-red-600">El título es requerido</p>
            }
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Descripción corta <span class="text-red-500">*</span>
            </label>
            <textarea
              formControlName="shortDescription"
              rows="2"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Ingrese una descripción corta"
            ></textarea>
            @if (form.get('shortDescription')?.invalid && form.get('shortDescription')?.touched) {
              <p class="mt-1 text-sm text-red-600">La descripción corta es requerida</p>
            }
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Contenido <span class="text-red-500">*</span>
            </label>
            <textarea
              formControlName="content"
              rows="6"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Ingrese el contenido completo del proyecto"
            ></textarea>
            @if (form.get('content')?.invalid && form.get('content')?.touched) {
              <p class="mt-1 text-sm text-red-600">El contenido es requerido</p>
            }
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              URL de imagen <span class="text-red-500">*</span>
            </label>
            <input
              type="url"
              formControlName="imageUrl"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            @if (form.get('imageUrl')?.invalid && form.get('imageUrl')?.touched) {
              <p class="mt-1 text-sm text-red-600">Ingrese una URL válida</p>
            }
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Fecha de publicación <span class="text-red-500">*</span>
            </label>
            <input
              type="date"
              formControlName="publishDate"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div class="flex items-center">
            <input
              type="checkbox"
              formControlName="isActive"
              id="isActive"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="isActive" class="ml-2 block text-sm text-gray-900">
              Proyecto activo
            </label>
          </div>
        </div>

        <div footer class="flex gap-3">
          <app-button
            type="button"
            variant="secondary"
            (clicked)="handleCancel()"
          >
            Cancelar
          </app-button>
          <app-button
            type="submit"
            [disabled]="form.invalid || submitting()"
          >
            {{ submitting() ? 'Guardando...' : 'Guardar' }}
          </app-button>
        </div>
      </form>
    </app-modal>
  `
})
export class ProjectFormComponent implements OnInit {
  isOpen = input.required<boolean>();
  project = input<Project | null>(null);
  submitting = input<boolean>(false);

  submitted = output<CreateProjectDto | UpdateProjectDto>();
  cancelled = output<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    const project = this.project();
    
    this.form = this.fb.group({
      title: [project?.title || '', Validators.required],
      shortDescription: [project?.shortDescription || '', Validators.required],
      content: [project?.content || '', Validators.required],
      imageUrl: [project?.imageUrl || '', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
      publishDate: [
        project?.publishDate ? new Date(project.publishDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        Validators.required
      ],
      isActive: [project?.isActive ?? true]
    });
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    const dto = {
      ...formValue,
      publishDate: new Date(formValue.publishDate)
    };

    if (this.project()) {
      this.submitted.emit({ ...dto, id: this.project()!.id });
    } else {
      this.submitted.emit(dto);
    }
  }

  handleCancel(): void {
    this.form.reset();
    this.cancelled.emit();
  }
}
