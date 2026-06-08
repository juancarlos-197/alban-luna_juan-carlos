import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-box">
        <h1>Iniciar Sesión</h1>
        
        <form (ngSubmit)="onLogin()">
          <div class="form-group">
            <label for="email">Email:</label>
            <input 
              type="email" 
              id="email" 
              [(ngModel)]="email" 
              name="email"
              required
              placeholder="tu@email.com"
            />
          </div>

          <div class="form-group">
            <label for="password">Contraseña:</label>
            <input 
              type="password" 
              id="password" 
              [(ngModel)]="password" 
              name="password"
              required
              placeholder="••••••••"
            />
          </div>

          <div *ngIf="error()" class="error-message">
            {{ error() }}
          </div>

          <button 
            type="submit" 
            [disabled]="isLoading()"
            class="btn-login"
          >
            {{ isLoading() ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </form>

        <div class="signup-link">
          <p>¿No tienes cuenta? <a href="javascript:void(0)" (click)="toggleRegister()">
            {{ showRegister() ? 'Volver a login' : 'Registrarse' }}
          </a></p>
        </div>

        <form *ngIf="showRegister()" (ngSubmit)="onRegister()">
          <h2>Crear Cuenta</h2>
          <div class="form-group">
            <label for="reg-email">Email:</label>
            <input 
              type="email" 
              id="reg-email" 
              [(ngModel)]="registerEmail" 
              name="registerEmail"
              required
              placeholder="tu@email.com"
            />
          </div>

          <div class="form-group">
            <label for="reg-password">Contraseña:</label>
            <input 
              type="password" 
              id="reg-password" 
              [(ngModel)]="registerPassword" 
              name="registerPassword"
              required
              placeholder="••••••••"
            />
          </div>

          <div *ngIf="error()" class="error-message">
            {{ error() }}
          </div>

          <button 
            type="submit" 
            [disabled]="isLoading()"
            class="btn-register"
          >
            {{ isLoading() ? 'Registrando...' : 'Registrarse' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .login-box {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      width: 100%;
      max-width: 400px;
    }

    h1, h2 {
      text-align: center;
      color: #333;
      margin-bottom: 1.5rem;
    }

    h2 {
      font-size: 1.3rem;
      margin-top: 1.5rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      box-sizing: border-box;
      transition: border-color 0.3s;
    }

    input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    button {
      width: 100%;
      padding: 0.75rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s;
    }

    button:hover:not(:disabled) {
      background: #5568d3;
    }

    button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .error-message {
      background: #fee;
      color: #c33;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }

    .signup-link {
      text-align: center;
      margin-top: 1rem;
    }

    .signup-link a {
      color: #667eea;
      text-decoration: none;
      cursor: pointer;
      font-weight: 600;
    }

    .signup-link a:hover {
      text-decoration: underline;
    }

    .btn-register {
      background: #48bb78;
      margin-top: 1rem;
    }

    .btn-register:hover:not(:disabled) {
      background: #38a169;
    }
  `]
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
  ) {}

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
