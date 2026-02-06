import { Component, input, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class ModalComponent {
  // Inputs
  isOpen = input<boolean>(false);
  title = input<string>('');
  size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
  closeOnBackdrop = input<boolean>(true);
  showCloseButton = input<boolean>(true);
  showFooter = input<boolean>(true);

  // Outputs
  close = output<void>();

  constructor() {
    // Effect para manejar el scroll del body
    effect(() => {
      if (this.isOpen()) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  handleClose(): void {
    this.close.emit();
  }

  handleBackdropClick(event: MouseEvent): void {
    if (this.closeOnBackdrop() && event.target === event.currentTarget) {
      this.handleClose();
    }
  }
}
