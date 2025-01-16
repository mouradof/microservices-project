const express = require('express');
const Consul = require('consul');

const app = express();
const port = 5001;
const consul = new Consul({ host: 'consul-server', port: 8500 }); // Connexion à Consul

// Middleware
app.use(express.json());

// Endpoint
app.get('/schools', (req, res) => {
  res.json([
    { id: 1, name: 'Engineering School', location: 'Paris' },
    { id: 2, name: 'Business School', location: 'Lyon' },
  ]);
});

// Enregistrement auprès de Consul
const registerWithConsul = () => {
  consul.agent.service.register(
    {
      name: 'school-service',
      address: 'school-service',
      port: port,
    },
    (err) => {
      if (err) {
        console.error('Error registering with Consul:', err);
      } else {
        console.log('Registered with Consul');
      }
    }
  );
};

// Lancer le serveur
app.listen(port, () => {
  console.log(`School Service is running on http://localhost:${port}`);
  registerWithConsul();
});
