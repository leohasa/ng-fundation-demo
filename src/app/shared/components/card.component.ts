import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CardVariant = 'default' | 'bordered' | 'elevated';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getCardClasses()">
      @if (title() || subtitle()) {
        <div class="px-6 py-4 border-b border-gray-200">
          @if (title()) {
            <h3 class="text-lg font-semibold text-gray-900">{{ title() }}</h3>
          }
          @if (subtitle()) {
            <p class="text-sm text-gray-500 mt-1">{{ subtitle() }}</p>
          }
        </div>
      }
      
      <div [class]="padding() ? 'p-6' : ''">
        <ng-content />
      </div>

      @if (hasFooter()) {
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <ng-content select="[footer]" />
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class CardComponent {
  // Inputs
  title = input<string>('');
  subtitle = input<string>('');
  variant = input<CardVariant>('default');
  padding = input<boolean>(true);
  hasFooter = input<boolean>(false);

  getCardClasses(): string {
    const baseClasses = 'bg-white rounded-lg overflow-hidden';
    
    const variantClasses: Record<CardVariant, string> = {
      default: 'border border-gray-200',
      bordered: 'border-2 border-gray-300',
      elevated: 'shadow-lg'
    };

    return `${baseClasses} ${variantClasses[this.variant()]}`;
  }
}
