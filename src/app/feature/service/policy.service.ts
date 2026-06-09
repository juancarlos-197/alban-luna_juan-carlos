import { Injectable } from '@angular/core';
import { Policy } from '../../models/policy.model';
import { AuthService } from './auth.service';

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

  constructor(private authService: AuthService) {}

  private async getHeaders(): Promise<HeadersInit> {
    const token = await this.authService.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  async getExpiringPolicies(dueMonth: string): Promise<Policy[]> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}/policies?dueMonth=${dueMonth}`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (!Array.isArray(data)) return [];
      return data.map(parsePolicy);
    } catch (error) {
      console.error('Error fetching policies:', error);
      throw error;
    }
  }

  async markManaged(id: string): Promise<Policy> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}/policies/${id}/manage`, {
        method: 'POST',
        headers,
        body: JSON.stringify({})
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      
      const data = await response.json();
      return parsePolicy(data);
    } catch (error) {
      console.error('Error marking policy as managed:', error);
      throw error;
    }
  }

  async renewPolicy(id: string, newExpiryDate: string): Promise<Policy> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}/policies/${id}/renew`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ newExpiryDate })
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      
      const data = await response.json();
      return parsePolicy(data);
    } catch (error) {
      console.error('Error renewing policy:', error);
      throw error;
    }
  }
}

