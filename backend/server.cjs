const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const clients = [
  { id: 'c1', name: 'María López', phone: '555-0100' },
  { id: 'c2', name: 'Carlos Pérez', phone: '555-0123' },
  { id: 'c3', name: 'Ana Torres', phone: '555-0145' }
];

const policies = [
  { id: 'p1', clientId: 'c1', type: 'Auto', expiryDate: '2026-06-10', managed: false, note: 'Renovación anual' },
  { id: 'p2', clientId: 'c1', type: 'Hogar', expiryDate: '2026-06-25', managed: false, note: 'Cobertura ampliada' },
  { id: 'p3', clientId: 'c2', type: 'Vida', expiryDate: '2026-07-01', managed: false, note: 'Pago mensual' },
  { id: 'p4', clientId: 'c3', type: 'Auto', expiryDate: '2026-06-20', managed: true, note: 'Seguimiento activo' }
];

const findClientName = (policy) => {
  const client = clients.find((client) => client.id === policy.clientId);
  return client ? client.name : 'Desconocido';
};

const serializePolicy = (policy) => ({
  ...policy,
  clientName: findClientName(policy)
});

const getExpiringPolicies = (month) => {
  return policies
    .filter((policy) => policy.expiryDate.startsWith(month))
    .map(serializePolicy);
};

const addOneYear = (dateString) => {
  const date = new Date(dateString);
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().slice(0, 10);
};

app.get('/api/clients', (req, res) => {
  res.json(clients);
});

app.get('/api/policies', (req, res) => {
  const dueMonth = String(req.query.dueMonth || new Date().toISOString().slice(0, 7));
  res.json(getExpiringPolicies(dueMonth));
});

app.post('/api/policies/:id/manage', (req, res) => {
  const policy = policies.find((item) => item.id === req.params.id);
  if (!policy) {
    return res.status(404).json({ error: 'Póliza no encontrada' });
  }

  policy.managed = true;
  if (req.body.note) {
    policy.note = String(req.body.note);
  }

  res.json(serializePolicy(policy));
});

app.post('/api/policies/:id/renew', (req, res) => {
  const policy = policies.find((item) => item.id === req.params.id);
  if (!policy) {
    return res.status(404).json({ error: 'Póliza no encontrada' });
  }

  policy.expiryDate = req.body.newExpiryDate || addOneYear(policy.expiryDate);
  policy.managed = true;
  if (req.body.note) {
    policy.note = String(req.body.note);
  }

  res.json(serializePolicy(policy));
});

app.get('/api/policies/:id', (req, res) => {
  const policy = policies.find((item) => item.id === req.params.id);
  if (!policy) {
    return res.status(404).json({ error: 'Póliza no encontrada' });
  }
  res.json(serializePolicy(policy));
});

if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`Express API REST escuchando en http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Error: Puerto ${PORT} ya está en uso`);
      console.error(`   Usa: PORT=3001 npm run backend (o cualquier otro puerto)`);
    } else {
      console.error(`❌ Error del servidor:`, err);
    }
    process.exit(1);
  });
}

module.exports = { app };