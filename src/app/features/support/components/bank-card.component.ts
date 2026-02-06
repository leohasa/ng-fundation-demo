import { Component, input, output, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportInfo } from '../../../core/models/support-info.model';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-bank-card',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './bank-card.component.html',
  styleUrls: ['./bank-card.component.css']
})
export class BankCardComponent {
  // Signal inputs
  bankInfo = input.required<SupportInfo>();
  showActions = input<boolean>(false);
  
  // Signal outputs
  edit = output<SupportInfo>();
  delete = output<string>();

  // Local signal state
  copied = signal<boolean>(false);

  // Computed signal for bank gradient
  private bankGradientSignal = computed(() => {
    const bankName = this.bankInfo().bankName?.toLowerCase() || '';
    
    if (bankName.includes('industrial')) {
      return 'gradient-industrial';
    } else if (bankName.includes('banrural') || bankName.includes('rural')) {
      return 'gradient-banrural';
    } else if (bankName.includes('bac') || bankName.includes('credomatic')) {
      return 'gradient-bac';
    }
    
    return 'gradient-default';
  });

  constructor() {
    // Reset copied state when bankInfo changes
    effect(() => {
      // Read the signal to track it
      this.bankInfo();
      // Reset copied state
      this.copied.set(false);
    }, { allowSignalWrites: true });
  }

  getBankGradient(): string {
    return this.bankGradientSignal();
  }

  formatAccountNumber(accountNumber: string): string {
    // Formatea el número de cuenta para que se vea como una tarjeta de crédito
    return accountNumber.replace(/(.{4})/g, '$1 ').trim();
  }

  copyAccountNumber(): void {
    const accountNumber = this.bankInfo().accountNumber || '';
    navigator.clipboard.writeText(accountNumber).then(() => {
      this.copied.set(true);
      setTimeout(() => {
        this.copied.set(false);
      }, 2000);
    });
  }
}
