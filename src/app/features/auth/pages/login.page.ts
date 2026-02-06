import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button.component';
import { CardComponent } from '../../../shared/components/card.component';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { BaseAppError, isAppError } from '../../../core/models/error.model';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    ButtonComponent, 
    CardComponent,
    TranslatePipe
  ],
  templateUrl: './login.page.html'
})
export class LoginPage {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly errorHandler = inject(ErrorHandlerService);

  readonly errorMessage = signal<string>('');

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');

    try {
      await this.authService.login(this.loginForm.value);
      this.router.navigate(['/admin']);
    } catch (error) {
      // Get user-friendly error message
      if (error instanceof BaseAppError) {
        this.errorMessage.set(this.errorHandler.getUserMessage(error));
      } else {
        this.errorMessage.set('Error al iniciar sesión. Por favor, intenta nuevamente.');
      }
    }
  }
}
