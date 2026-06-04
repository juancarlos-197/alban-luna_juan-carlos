import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyService, Policy } from '../../service/policy.service';

@Component({
  selector: 'policy-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="policy-list">
      <h2>Pólizas por vencer este mes</h2>

      <div *ngIf="loading()" class="status">Cargando pólizas...</div>
      <div *ngIf="error()" class="status error">{{ error() }}</div>

      <table *ngIf="!loading() && policies().length > 0" class="policy-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Tipo</th>
            <th>Vencimiento</th>
            <th>Gestionado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let policy of policies()">
            <td>{{ policy.clientName }}</td>
            <td>{{ policy.type }}</td>
            <td>{{ policy.expiryDate }}</td>
            <td [class.managed]="policy.managed">{{ policy.managed ? 'Sí' : 'No' }}</td>
            <td class="actions">
              <button (click)="markManaged(policy)" [disabled]="policy.managed">Marcar gestionado</button>
              <button (click)="renew(policy)">Renovar +1 año</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="!loading() && policies().length === 0" class="status">No hay pólizas venciendo este mes.</div>
    </section>
  `,
  styles: [
    `
      .policy-list {
        padding: 1.25rem;
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 1.25rem;
        background: #ffffff;
        box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
      }

      .policy-list h2 {
        margin: 0 0 1rem;
        font-size: 1.75rem;
        color: #0f172a;
      }

      .policy-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        overflow: hidden;
        border-radius: 0.75rem;
      }

      .policy-table th,
      .policy-table td {
        padding: 1rem 0.85rem;
        text-align: left;
      }

      .policy-table thead {
        background: #eff6ff;
      }

      .policy-table th {
        color: #0f172a;
        font-weight: 700;
        font-size: 0.95rem;
      }

      .policy-table tbody tr {
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      }

      .policy-table tbody tr:last-child {
        border-bottom: none;
      }

      .policy-table td {
        color: #334155;
        font-size: 0.95rem;
      }

      .policy-table td:first-child {
        width: 25%;
      }

      .policy-table td:nth-child(4) {
        color: #0f766e;
        font-weight: 600;
      }

      .policy-table td:nth-child(4):not(.managed) {
        color: #dc2626;
      }

      .policy-table td.managed {
        color: #0f766e;
      }

      .status {
        margin: 1rem 0;
        padding: 0.85rem 1rem;
        border-radius: 0.85rem;
        background: #f8fafc;
        color: #334155;
      }

      .status.error {
        background: #fef2f2;
        color: #991b1b;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      button {
        border: none;
        border-radius: 0.75rem;
        padding: 0.65rem 0.95rem;
        cursor: pointer;
        font-weight: 700;
        transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
      }

      button:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 10px 20px rgba(37, 99, 235, 0.12);
      }

      button:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }

      button:first-of-type {
        background: #2563eb;
        color: white;
      }

      button:last-of-type {
        background: #0f766e;
        color: white;
      }
    `
  ]
})
export class PolicyList implements OnInit {
  protected readonly policies = signal<Policy[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal('');

  constructor(private readonly service: PolicyService) {}

  async ngOnInit(): Promise<void> {
    await this.loadPolicies();
  }

  protected async loadPolicies(): Promise<void> {
    this.loading.set(true);
    this.error.set('');

    try {
      const month = new Date().toISOString().slice(0, 7);
      this.policies.set(await this.service.getExpiringPolicies(month));
    } catch (err) {
      this.error.set('No se pudieron cargar las pólizas.');
    } finally {
      this.loading.set(false);
    }
  }

  protected async markManaged(policy: Policy): Promise<void> {
    await this.service.markManaged(policy.id);
    await this.loadPolicies();
  }

  protected async renew(policy: Policy): Promise<void> {
    const nextExpiry = new Date(policy.expiryDate);
    nextExpiry.setFullYear(nextExpiry.getFullYear() + 1);
    await this.service.renewPolicy(policy.id, nextExpiry.toISOString().slice(0, 10));
    await this.loadPolicies();
  }
}
