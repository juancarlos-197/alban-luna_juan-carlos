import { Injectable } from '@angular/core';

export interface Policy {
  id: string;
  clientName: string;
  type: string;
  expiryDate: string;
  managed: boolean;
  note?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  private readonly baseUrl = '/api';

  async getExpiringPolicies(dueMonth: string): Promise<Policy[]> {
    const response = await fetch(`${this.baseUrl}/policies?dueMonth=${dueMonth}`);
    return await response.json();
  }

  async markManaged(id: string): Promise<Policy> {
    const response = await fetch(`${this.baseUrl}/policies/${id}/manage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    return await response.json();
  }

  async renewPolicy(id: string, newExpiryDate: string): Promise<Policy> {
    const response = await fetch(`${this.baseUrl}/policies/${id}/renew`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newExpiryDate })
    });
    return await response.json();
  }
}
