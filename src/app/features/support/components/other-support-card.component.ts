import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportInfo } from '../../../core/models/support-info.model';

@Component({
  selector: 'app-other-support-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './other-support-card.component.html',
  styleUrls: ['./other-support-card.component.css']
})
export class OtherSupportCardComponent {
  // Signal input
  supportOption = input.required<SupportInfo>();

  // Computed signals that automatically update when supportOption changes
  iconType = computed(() => this.supportOption().icon || 'default');
  iconColor = computed(() => `color-${this.iconType()}`);

  // Getter methods for template compatibility
  getIconType(): string {
    return this.iconType();
  }

  getIconColor(): string {
    return this.iconColor();
  }
}
