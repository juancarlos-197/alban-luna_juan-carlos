import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { vi } from 'vitest';
import { Login } from './login';
import { AuthService } from '../../service/auth.service';

describe('Login component', () => {
  let fixture: ComponentFixture<Login>;
  let component: Login;
  let authServiceMock: AuthService;
  let router: Router;

  beforeEach(async () => {
    authServiceMock = {
      login: vi.fn().mockResolvedValue({}),
      register: vi.fn().mockResolvedValue({})
    } as unknown as AuthService;

    await TestBed.configureTestingModule({
      imports: [Login, FormsModule, RouterTestingModule.withRoutes([])],
      providers: [{ provide: AuthService, useValue: authServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
  });

  it('debe mostrar un error cuando los campos de login están vacíos', async () => {
    component.email = '';
    component.password = '';

    await component.onLogin();

    expect(component.error()).toBe('Por favor completa todos los campos');
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  it('debe llamar a authService.login con credenciales válidas', async () => {
    component.email = 'test@example.com';
    component.password = '123456';

    await component.onLogin();

    expect(authServiceMock.login).toHaveBeenCalledWith('test@example.com', '123456');
    expect(router.navigate).toHaveBeenCalledWith(['/expiring']);
    expect(component.error()).toBe('');
  });

  it('debe alternar el formulario de registro', () => {
    expect(component.showRegister()).toBe(false);

    component.toggleRegister();

    expect(component.showRegister()).toBe(true);
    expect(component.error()).toBe('');
  });

  it('debe mostrar un error cuando la contraseña de registro es muy corta', async () => {
    component.toggleRegister();
    component.registerEmail = 'new@example.com';
    component.registerPassword = '123';

    await component.onRegister();

    expect(component.error()).toBe('La contraseña debe tener al menos 6 caracteres');
    expect(authServiceMock.register).not.toHaveBeenCalled();
  });
});
