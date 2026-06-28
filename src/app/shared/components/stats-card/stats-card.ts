import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-card.html',
  styleUrl: './stats-card.css'
})
export class StatsCardComponent {

  @Input() title = '';

  @Input() value: number | string = 0;

  @Input() icon = '';

  @Input() color = 'bg-blue-600';

}