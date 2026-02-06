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
  templateUrl: './project-form.component.html'
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
