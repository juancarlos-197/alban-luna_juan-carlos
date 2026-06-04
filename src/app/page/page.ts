import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './page.html',
  styleUrls: ['./page.css']
})
export class Page {
  protected readonly title = signal('Reportes');
}
