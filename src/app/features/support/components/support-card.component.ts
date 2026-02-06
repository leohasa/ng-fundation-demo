import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportInfo } from '../../../core/models/support-info.model';
import { CardComponent } from '../../../shared/components/card.component';
import { ButtonComponent } from '../../../shared/components/button.component';

@Component({
  selector: 'app-support-card',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent],
  template: `
    <app-card [variant]="'bordered'">
      <div class="space-y-3">
        <!-- Header with type badge -->
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span 
                [class]="
                  supportInfo.type === 'bank_account' 
                    ? 'px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800'
                    : 'px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800'
                "
              >
                {{ supportInfo.type === 'bank_account' ? 'Cuenta Bancaria' : 'Otra Forma' }}
              </span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">
              {{ supportInfo.title }}
            </h3>
          </div>
          
          @if (showActions) {
            <div class="flex gap-2 ml-4">
              <app-button
                [variant]="'ghost'"
                [size]="'sm'"
                (click)="onEdit()"
              >
                Editar
              </app-button>
              <app-button
                [variant]="'danger'"
                [size]="'sm'"
                (click)="onDelete()"
              >
                Eliminar
              </app-button>
            </div>
          }
        </div>

        <!-- Description -->
        <div class="prose prose-sm max-w-none">
          <p class="text-gray-600 whitespace-pre-wrap">{{ supportInfo.description }}</p>
        </div>

        <!-- Copy button for easy sharing -->
        @if (!showActions) {
          <div class="pt-2 border-t border-gray-200">
            <app-button
              [variant]="'secondary'"
              [size]="'sm'"
              (click)="copyToClipboard()"
              class="w-full"
            >
              {{ copied ? '¡Copiado!' : 'Copiar Información' }}
            </app-button>
          </div>
        }
      </div>
    </app-card>
  `
})
export class SupportCardComponent {
  @Input({ required: true }) supportInfo!: SupportInfo;
  @Input() showActions = false;
  @Output() edit = new EventEmitter<SupportInfo>();
  @Output() delete = new EventEmitter<string>();

  copied = false;

  onEdit(): void {
    this.edit.emit(this.supportInfo);
  }

  onDelete(): void {
    this.delete.emit(this.supportInfo.id);
  }

  copyToClipboard(): void {
    const text = `${this.supportInfo.title}\n\n${this.supportInfo.description}`;
    navigator.clipboard.writeText(text).then(() => {
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    });
  }
}
