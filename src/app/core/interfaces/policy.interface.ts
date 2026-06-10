export interface Policy {
  id: string;
  clientId?: string;
  clientName: string;
  type: string;
  expiryDate: Date;
  premium?: number;
  status?: 'active' | 'expired' | 'cancelled';
  managed: boolean;
  note?: string;
}
