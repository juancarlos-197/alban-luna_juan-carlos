import request from 'supertest';
import { describe, it, expect } from 'vitest';

const { app } = await import('../backend/server.cjs');

describe('Express REST API de seguros', () => {
  it('devuelve pólizas por vencer en el mes solicitado', async () => {
    const response = await request(app)
      .get('/api/policies?dueMonth=2026-06')
      .set('Authorization', 'Bearer test-token')
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
      .set('Authorization', 'Bearer test-token')
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

  it('renueva una póliza existente y actualiza la fecha de vencimiento', async () => {
    const response = await request(app)
      .post('/api/policies/p1/renew')
      .set('Authorization', 'Bearer test-token')
      .send({ newExpiryDate: '2027-06-15', note: 'Renovación temprana' })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: 'p1',
        managed: true,
        expiryDate: '2027-06-15',
        clientName: 'María López'
      })
    );
  });

  it('renueva una póliza existente sin payload y agrega un año', async () => {
    const response = await request(app)
      .post('/api/policies/p3/renew')
      .set('Authorization', 'Bearer test-token')
      .send({})
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: 'p3',
        managed: true,
        expiryDate: '2027-07-01',
        clientName: 'Carlos Pérez'
      })
    );
  });

  it('devuelve 404 para una póliza inexistente al marcarla como gestionada', async () => {
    const response = await request(app)
      .post('/api/policies/unknown/manage')
      .set('Authorization', 'Bearer test-token')
      .send({})
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body).toEqual({
      error: 'Póliza no encontrada'
    });
  });
});
