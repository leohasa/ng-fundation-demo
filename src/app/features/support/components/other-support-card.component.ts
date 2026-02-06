import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportInfo } from '../../../core/models/support-info.model';

@Component({
  selector: 'app-other-support-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="support-option">
      <!-- Icono -->
      <div class="icon-wrapper" [ngClass]="getIconColor()">
        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          @if (getIconType() === 'volunteer') {
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          } @else if (getIconType() === 'donation') {
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          } @else if (getIconType() === 'heart') {
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          } @else if (getIconType() === 'professional') {
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          } @else {
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          }
        </svg>
      </div>
      
      <!-- Contenido -->
      <div class="content">
        <h3 class="title">{{ supportOption.title }}</h3>
        <p class="description">{{ supportOption.description }}</p>
        
        @if (supportOption.contactInfo) {
          <div class="contact-info">
            <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span class="contact-text">{{ supportOption.contactInfo }}</span>
          </div>
        }
      </div>
      
      <!-- Flecha indicadora -->
      <div class="arrow">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  `,
  styles: [`
    .support-option {
      display: flex;
      align-items: flex-start;
      gap: 20px;
      padding: 24px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      transition: all 0.3s;
      cursor: pointer;
    }
    
    .support-option:hover {
      border-color: #3b82f6;
      box-shadow: 0 10px 25px rgba(59, 130, 246, 0.1);
      transform: translateY(-2px);
    }
    
    .icon-wrapper {
      flex-shrink: 0;
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s;
    }
    
    .support-option:hover .icon-wrapper {
      transform: scale(1.1);
    }
    
    .icon-wrapper.color-volunteer {
      background-color: #dbeafe;
      color: #2563eb;
    }
    
    .icon-wrapper.color-donation {
      background-color: #fce7f3;
      color: #db2777;
    }
    
    .icon-wrapper.color-heart {
      background-color: #fee2e2;
      color: #dc2626;
    }
    
    .icon-wrapper.color-professional {
      background-color: #e0e7ff;
      color: #6366f1;
    }
    
    .icon-wrapper.color-default {
      background-color: #f3f4f6;
      color: #6b7280;
    }
    
    .icon {
      width: 32px;
      height: 32px;
    }
    
    .content {
      flex: 1;
    }
    
    .title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #111827;
      margin-bottom: 8px;
    }
    
    .description {
      font-size: 0.875rem;
      color: #6b7280;
      line-height: 1.6;
      margin-bottom: 12px;
    }
    
    .contact-info {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background-color: #f9fafb;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
    }
    
    .contact-icon {
      width: 16px;
      height: 16px;
      color: #6b7280;
      flex-shrink: 0;
    }
    
    .contact-text {
      font-size: 0.75rem;
      color: #374151;
      font-weight: 500;
    }
    
    .arrow {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      color: #9ca3af;
      transition: all 0.3s;
    }
    
    .support-option:hover .arrow {
      color: #3b82f6;
      transform: translateX(4px);
    }
    
    .arrow svg {
      width: 100%;
      height: 100%;
    }
    
    @media (max-width: 768px) {
      .support-option {
        padding: 16px;
        gap: 16px;
      }
      
      .icon-wrapper {
        width: 48px;
        height: 48px;
      }
      
      .icon {
        width: 28px;
        height: 28px;
      }
      
      .title {
        font-size: 1.125rem;
      }
      
      .arrow {
        display: none;
      }
    }
  `]
})
export class OtherSupportCardComponent {
  @Input({ required: true }) supportOption!: SupportInfo;

  getIconType(): string {
    return this.supportOption.icon || 'default';
  }

  getIconColor(): string {
    const icon = this.getIconType();
    return `color-${icon}`;
  }
}
