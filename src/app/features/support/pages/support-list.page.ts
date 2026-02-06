import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportStore } from '../services/support.store';
import { BankCardComponent } from '../components/bank-card.component';
import { OtherSupportCardComponent } from '../components/other-support-card.component';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-support-list',
  standalone: true,
  imports: [CommonModule, BankCardComponent, OtherSupportCardComponent, TranslatePipe],
  templateUrl: './support-list.page.html'
})
export class SupportListPage implements OnInit {
  readonly store = inject(SupportStore);

  ngOnInit(): void {
    this.store.loadSupportInfo();
  }
}
