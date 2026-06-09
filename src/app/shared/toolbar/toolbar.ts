import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import type { User } from '@angular/fire/auth';

import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, RouterLink,MatToolbarModule, MatButtonModule, MatIconModule ],
  templateUrl: './toolbar.html',
  styleUrls: ['./toolbar.css']
})
export class Toolbar {
  @Input() currentUser$!: Observable<User | null>;
  @Output() logout = new EventEmitter<void>();

  handleLogout(): void {
    this.logout.emit();
  }
}
