const express = require('express');
const fs = require('fs');
const path = require('path');
const basicAuth = require('express-basic-auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/reserver', (req, res) => {
  const reservation = {...req.body, timestamp: new Date().toISOString()};
  fs.appendFileSync('reservations.json', JSON.stringify(reservation) + '\n');
  res.sendStatus(200);
});

app.use('/admin', basicAuth({
  users: { 'admin': 'motdepasse123' },
  challenge: true
}));

app.get('/admin', (req, res) => {
  let data = '';
  if (fs.existsSync('reservations.json')) {
    data = fs.readFileSync('reservations.json', 'utf-8')
      .split('\n').filter(Boolean)
      .map(l => JSON.parse(l))
      .map(r => `<li>${r.timestamp} — ${r.name} | ${r.email} | ${r.date} | ${r.message}</li>`)
      .join('');
  }
  res.send(`<h1>Réservations</h1><ul>${data}</ul>`);
});

app.listen(PORT, () => console.log(`Serveur sur http://localhost:${PORT}`));
