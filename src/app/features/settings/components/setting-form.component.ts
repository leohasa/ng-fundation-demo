import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Setting, CreateSettingDto, UpdateSettingDto } from '../../../core/models/setting.model';
import { ModalComponent } from '../../../shared/components/modal.component';
import { InputComponent } from '../../../shared/components/input.component';
import { ButtonComponent } from '../../../shared/components/button.component';

@Component({
  selector: 'app-setting-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalComponent,
    InputComponent,
    ButtonComponent
  ],
  template: `
    <app-modal
      [isOpen]="isOpen"
      [title]="editMode ? 'Editar Configuración' : 'Nueva Configuración'"
      [size]="'md'"
      (close)="onCancel()"
    >
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="space-y-4">
          <!-- Key -->
          <app-input
            label="Clave"
            type="text"
            formControlName="key"
            [required]="true"
            placeholder="site_name"
            hint="Identificador único de la configuración"
          />

          <!-- Value -->
          <app-input
            label="Valor"
            type="text"
            formControlName="value"
            [required]="true"
            placeholder="Mi Fundación"
            hint="Valor de la configuración"
          />

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              formControlName="description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Descripción de la configuración (opcional)"
            ></textarea>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-4">
            <app-button
              type="button"
              [variant]="'ghost'"
              (click)="onCancel()"
            >
              Cancelar
            </app-button>
            <app-button
              type="submit"
              [variant]="'primary'"
              [disabled]="form.invalid || saving"
            >
              {{ saving ? 'Guardando...' : (editMode ? 'Actualizar' : 'Crear') }}
            </app-button>
          </div>
        </div>
      </form>
    </app-modal>
  `
})
export class SettingFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  @Input() isOpen = false;
  @Input() setting: Setting | null = null;
  @Input() saving = false;
  @Output() save = new EventEmitter<CreateSettingDto | UpdateSettingDto>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  editMode = false;

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(): void {
    if (this.form) {
      this.editMode = !!this.setting;
      if (this.setting) {
        this.form.patchValue({
          key: this.setting.key,
          value: this.setting.value,
          description: this.setting.description || ''
        });
        // Disable key field when editing
        this.form.get('key')?.disable();
      } else {
        this.form.reset();
        this.form.get('key')?.enable();
      }
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      key: ['', [Validators.required, Validators.pattern(/^[a-z_]+$/)]],
      value: ['', Validators.required],
      description: ['']
    });

    if (this.setting) {
      this.editMode = true;
      this.form.patchValue({
        key: this.setting.key,
        value: this.setting.value,
        description: this.setting.description || ''
      });
      this.form.get('key')?.disable();
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.getRawValue();
      
      if (this.editMode && this.setting) {
        const dto: UpdateSettingDto = {
          id: this.setting.id,
          value: formValue.value,
          description: formValue.description || undefined
        };
        this.save.emit(dto);
      } else {
        const dto: CreateSettingDto = {
          key: formValue.key,
          value: formValue.value,
          description: formValue.description || undefined
        };
        this.save.emit(dto);
      }
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
