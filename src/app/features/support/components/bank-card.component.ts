import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportInfo } from '../../../core/models/support-info.model';

@Component({
  selector: 'app-bank-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bank-card-container" (click)="copyAccountNumber()">
      <div class="bank-card" [class.copied-animation]="copied">
        <!-- Gradiente de fondo según el banco -->
        <div class="card-background" [ngClass]="getBankGradient()"></div>
        
        <!-- Chip simulado -->
        <div class="chip"></div>
        
        <!-- Contenido de la tarjeta -->
        <div class="card-content">
          <!-- Logo del banco (nombre) -->
          <div class="bank-logo">
            <h3 class="bank-name">{{ bankInfo.bankName }}</h3>
          </div>
          
          <!-- Número de cuenta -->
          <div class="account-number">
            {{ formatAccountNumber(bankInfo.accountNumber || '') }}
          </div>
          
          <!-- Información inferior -->
          <div class="card-footer">
            <div class="account-holder">
              <div class="label">Titular</div>
              <div class="value">{{ bankInfo.accountHolder }}</div>
            </div>
            <div class="account-type">
              <div class="label">Tipo</div>
              <div class="value">{{ bankInfo.accountType }}</div>
            </div>
          </div>
        </div>
        
        <!-- Icono de copiar -->
        <div class="copy-indicator">
          <svg class="copy-icon" [class.hidden]="copied" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <svg class="check-icon" [class.show]="copied" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      
      <!-- Descripción debajo de la tarjeta -->
      <p class="card-description">{{ bankInfo.description }}</p>
      
      <!-- Botón de copiar -->
      <button class="copy-button" [class.copied]="copied">
        {{ copied ? '¡Copiado!' : 'Clic para copiar número de cuenta' }}
      </button>
    </div>
  `,
  styles: [`
    .bank-card-container {
      cursor: pointer;
      transition: transform 0.2s;
    }
    
    .bank-card-container:hover {
      transform: translateY(-4px);
    }
    
    .bank-card {
      position: relative;
      width: 100%;
      aspect-ratio: 1.586;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      transition: all 0.3s;
    }
    
    .bank-card:hover {
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
    }
    
    .copied-animation {
      animation: pulse 0.5s ease-in-out;
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.02); }
    }
    
    .card-background {
      position: absolute;
      inset: 0;
      transition: opacity 0.3s;
    }
    
    .card-background.gradient-industrial {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .card-background.gradient-banrural {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
    
    .card-background.gradient-bac {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }
    
    .card-background.gradient-default {
      background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    }
    
    .chip {
      position: absolute;
      top: 50px;
      left: 30px;
      width: 50px;
      height: 40px;
      background: linear-gradient(135deg, #ffd89b 0%, #ffb347 100%);
      border-radius: 8px;
      opacity: 0.8;
    }
    
    .card-content {
      position: relative;
      padding: 30px;
      color: white;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    
    .bank-logo {
      display: flex;
      justify-content: flex-end;
    }
    
    .bank-name {
      font-size: 1.25rem;
      font-weight: 700;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      letter-spacing: 1px;
    }
    
    .account-number {
      font-size: 1.5rem;
      font-weight: 600;
      letter-spacing: 4px;
      text-align: center;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      font-family: 'Courier New', monospace;
      margin: 20px 0;
    }
    
    .card-footer {
      display: flex;
      justify-content: space-between;
      gap: 20px;
    }
    
    .account-holder,
    .account-type {
      flex: 1;
    }
    
    .label {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      opacity: 0.8;
      margin-bottom: 4px;
    }
    
    .value {
      font-size: 0.9rem;
      font-weight: 600;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }
    
    .copy-indicator {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 32px;
      height: 32px;
    }
    
    .copy-icon,
    .check-icon {
      width: 32px;
      height: 32px;
      color: white;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
      transition: all 0.3s;
    }
    
    .copy-icon.hidden {
      opacity: 0;
      transform: scale(0);
    }
    
    .check-icon {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      transform: scale(0);
    }
    
    .check-icon.show {
      opacity: 1;
      transform: scale(1);
    }
    
    .card-description {
      margin-top: 12px;
      font-size: 0.875rem;
      color: #6b7280;
      text-align: center;
    }
    
    .copy-button {
      margin-top: 8px;
      width: 100%;
      padding: 8px 16px;
      background-color: #f3f4f6;
      color: #6b7280;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 500;
      transition: all 0.2s;
    }
    
    .copy-button:hover {
      background-color: #e5e7eb;
    }
    
    .copy-button.copied {
      background-color: #dcfce7;
      color: #16a34a;
      border-color: #86efac;
    }
    
    @media (max-width: 768px) {
      .card-content {
        padding: 20px;
      }
      
      .bank-name {
        font-size: 1rem;
      }
      
      .account-number {
        font-size: 1.1rem;
        letter-spacing: 2px;
      }
      
      .value {
        font-size: 0.75rem;
      }
      
      .chip {
        top: 35px;
        left: 20px;
        width: 40px;
        height: 32px;
      }
    }
  `]
})
export class BankCardComponent {
  @Input({ required: true }) bankInfo!: SupportInfo;
  @Input() showActions = false;
  @Output() edit = new EventEmitter<SupportInfo>();
  @Output() delete = new EventEmitter<string>();

  copied = false;

  getBankGradient(): string {
    const bankName = this.bankInfo.bankName?.toLowerCase() || '';
    
    if (bankName.includes('industrial')) {
      return 'gradient-industrial';
    } else if (bankName.includes('banrural') || bankName.includes('rural')) {
      return 'gradient-banrural';
    } else if (bankName.includes('bac') || bankName.includes('credomatic')) {
      return 'gradient-bac';
    }
    
    return 'gradient-default';
  }

  formatAccountNumber(accountNumber: string): string {
    // Formatea el número de cuenta para que se vea como una tarjeta de crédito
    return accountNumber.replace(/(.{4})/g, '$1 ').trim();
  }

  copyAccountNumber(): void {
    const accountNumber = this.bankInfo.accountNumber || '';
    navigator.clipboard.writeText(accountNumber).then(() => {
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    });
  }
}
