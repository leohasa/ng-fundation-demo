import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button.component';
import { CardComponent } from '../../../shared/components/card.component';
import { SettingsStore } from '../../settings/services/settings.store';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    ReactiveFormsModule,
    ButtonComponent, 
    CardComponent,
    TranslatePipe
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.css']
})
export class HomePage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly settingsStore = inject(SettingsStore);

  contactForm: FormGroup;
  isSubmitting = signal(false);
  showSuccessMessage = signal(false);

  // Settings signals
  mission = signal<string>('');
  vision = signal<string>('');
  values = signal<string>('');
  peopleHelped = signal<string>('');
  projectsCompleted = signal<string>('');
  communitiesSupported = signal<string>('');
  yearsOfExperience = signal<string>('');

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    await this.settingsStore.loadSettings();
    this.loadSettingsData();
  }

  private loadSettingsData(): void {
    const settings = this.settingsStore.settings();
    
    this.mission.set(
      settings.find(s => s.key === 'mission')?.value || 
      'Transformar vidas a través de programas de educación, salud y desarrollo comunitario sostenible.'
    );
    
    this.vision.set(
      settings.find(s => s.key === 'vision')?.value || 
      'Ser un referente de cambio social en Guatemala, construyendo comunidades más fuertes y resilientes.'
    );
    
    this.values.set(
      settings.find(s => s.key === 'values')?.value || 
      'Compromiso, Transparencia, Solidaridad, Respeto, Integridad'
    );
    
    this.peopleHelped.set(
      settings.find(s => s.key === 'people_helped')?.value || '5,000'
    );
    
    this.projectsCompleted.set(
      settings.find(s => s.key === 'projects_completed')?.value || '50'
    );
    
    this.communitiesSupported.set(
      settings.find(s => s.key === 'communities_supported')?.value || '25'
    );
    
    this.yearsOfExperience.set(
      settings.find(s => s.key === 'years_of_experience')?.value || '10'
    );
  }

  scrollToContact(): void {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting.set(true);
      
      const formData = this.contactForm.value;
      console.log('📧 Formulario de contacto enviado:', {
        nombre: formData.name,
        email: formData.email,
        mensaje: formData.message,
        fecha: new Date().toISOString()
      });

      // Simular envío
      setTimeout(() => {
        this.isSubmitting.set(false);
        this.showSuccessMessage.set(true);
        this.contactForm.reset();

        // Ocultar mensaje de éxito después de 5 segundos
        setTimeout(() => {
          this.showSuccessMessage.set(false);
        }, 5000);
      }, 1500);
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }
}
