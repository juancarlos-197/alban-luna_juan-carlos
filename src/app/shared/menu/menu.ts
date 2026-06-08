import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import type { User } from '@angular/fire/auth';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class Menu {
  @Input() currentUser$!: Observable<User | null>;
  @Output() logout = new EventEmitter<void>();

  handleLogout(): void {
    this.logout.emit();
  }
}
