import { Injectable } from '@angular/core';
import { Policy } from '../models/policy.model';

const parsePolicy = (raw: any): Policy => ({
  id: String(raw?.id ?? ''),
  clientId: raw?.clientId ? String(raw.clientId) : undefined,
  clientName: raw?.clientName ?? '',
  type: raw?.type ?? '',
  expiryDate: raw?.expiryDate ? new Date(raw.expiryDate) : new Date(NaN),
  premium: raw?.premium !== undefined ? Number(raw.premium) : undefined,
  status: raw?.status ?? 'active',
  managed: Boolean(raw?.managed),
  note: raw?.note
});

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  private readonly baseUrl = '/api';

  async getExpiringPolicies(dueMonth: string): Promise<Policy[]> {
    const response = await fetch(`${this.baseUrl}/policies?dueMonth=${dueMonth}`);
    const data = await response.json();
    if (!Array.isArray(data)) return [];
    return data.map(parsePolicy);
  }

  async markManaged(id: string): Promise<Policy> {
    const response = await fetch(`${this.baseUrl}/policies/${id}/manage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const data = await response.json();
    return parsePolicy(data);
  }

  async renewPolicy(id: string, newExpiryDate: string): Promise<Policy> {
    const response = await fetch(`${this.baseUrl}/policies/${id}/renew`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newExpiryDate })
    });
    const data = await response.json();
    return parsePolicy(data);
  }
}

