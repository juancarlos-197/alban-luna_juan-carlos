import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import type { User } from '@angular/fire/auth';
import { AuthService } from '../service/auth.service';
import { Toolbar } from '../shared/toolbar/toolbar';

@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Toolbar],
  templateUrl: './feature.html',
  styleUrls: ['./feature.css']
})
export class Feature {
  protected readonly title = signal('Reportes');
  public currentUser$!: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}

