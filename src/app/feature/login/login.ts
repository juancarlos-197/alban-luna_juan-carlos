import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  email = '';
  password = '';
  registerEmail = '';
  registerPassword = '';
  isLoading = signal(false);
  error = signal('');
  showRegister = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  async onLogin(): Promise<void> {
    if (!this.email || !this.password) {
      this.error.set('Por favor completa todos los campos');
      return;
    }

    this.isLoading.set(true);
    this.error.set('');

    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/expiring']);
    } catch (err: any) {
      this.error.set(this.getErrorMessage(err.code));
    } finally {
      this.isLoading.set(false);
    }
  }

  async onRegister(): Promise<void> {
    if (!this.registerEmail || !this.registerPassword) {
      this.error.set('Por favor completa todos los campos');
      return;
    }

    if (this.registerPassword.length < 6) {
      this.error.set('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    this.isLoading.set(true);
    this.error.set('');

    try {
      await this.authService.register(this.registerEmail, this.registerPassword);
      this.email = this.registerEmail;
      this.password = this.registerPassword;
      this.registerEmail = '';
      this.registerPassword = '';
      this.showRegister.set(false);
      this.error.set('Cuenta creada exitosamente. Inicia sesión ahora.');
    } catch (err: any) {
      this.error.set(this.getErrorMessage(err.code));
    } finally {
      this.isLoading.set(false);
    }
  }

  toggleRegister(): void {
    this.showRegister.update(v => !v);
    this.error.set('');
  }

  private getErrorMessage(code: string): string {
    const messages: { [key: string]: string } = {
      'auth/invalid-email': 'Email inválido',
      'auth/user-disabled': 'Usuario deshabilitado',
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/email-already-in-use': 'El email ya está registrado',
      'auth/weak-password': 'La contraseña es muy débil',
      'auth/operation-not-allowed': 'Operación no permitida',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.'
    };
    return messages[code] || 'Error de autenticación. Intenta de nuevo.';
  }
}
