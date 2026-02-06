import { Component, input, output, OnInit, inject, effect, signal } from '@angular/core';
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
  templateUrl: './setting-form.component.html'
})
export class SettingFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  // Signal inputs
  isOpen = input<boolean>(false);
  setting = input<Setting | null>(null);
  saving = input<boolean>(false);
  
  // Signal outputs
  save = output<CreateSettingDto | UpdateSettingDto>();
  cancel = output<void>();

  // Local signal state
  editMode = signal<boolean>(false);
  form!: FormGroup;

  constructor() {
    // React to setting changes
    effect(() => {
      const currentSetting = this.setting();
      if (this.form) {
        this.editMode.set(!!currentSetting);
        if (currentSetting) {
          this.form.patchValue({
            key: currentSetting.key,
            value: currentSetting.value,
            description: currentSetting.description || ''
          });
          // Disable key field when editing
          this.form.get('key')?.disable();
        } else {
          this.form.reset();
          this.form.get('key')?.enable();
        }
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      key: ['', [Validators.required, Validators.pattern(/^[a-z_]+$/)]],
      value: ['', Validators.required],
      description: ['']
    });

    const currentSetting = this.setting();
    if (currentSetting) {
      this.editMode.set(true);
      this.form.patchValue({
        key: currentSetting.key,
        value: currentSetting.value,
        description: currentSetting.description || ''
      });
      this.form.get('key')?.disable();
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.getRawValue();
      const currentSetting = this.setting();
      
      if (this.editMode() && currentSetting) {
        const dto: UpdateSettingDto = {
          id: currentSetting.id,
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
