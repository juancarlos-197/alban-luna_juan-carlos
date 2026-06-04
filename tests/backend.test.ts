import request from 'supertest';
import { describe, it, expect } from 'vitest';

const { app } = await import('../backend/server.cjs');

describe('Express REST API de seguros', () => {
  it('devuelve pólizas por vencer en el mes solicitado', async () => {
    const response = await request(app)
      .get('/api/policies?dueMonth=2026-06')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'p1',
          clientName: 'María López',
          type: 'Auto',
          expiryDate: '2026-06-10'
        })
      ])
    );
  });

  it('marca una póliza existente como gestionada', async () => {
    const response = await request(app)
      .post('/api/policies/p2/manage')
      .send({})
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: 'p2',
        managed: true,
        clientName: 'María López'
      })
    );
  });

  it('devuelve 404 para una póliza inexistente al marcarla como gestionada', async () => {
    const response = await request(app)
      .post('/api/policies/unknown/manage')
      .send({})
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body).toEqual({
      error: 'Póliza no encontrada'
    });
  });
});
