import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { ButtonComponent } from '../components/button.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, ButtonComponent],
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent {
  private readonly router = inject(Router);
  
  mobileMenuOpen = false;
  currentYear = new Date().getFullYear();

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  goToAdmin(): void {
    this.router.navigate(['/login']);
  }
}
