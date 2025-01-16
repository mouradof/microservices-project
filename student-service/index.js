const express = require('express');
const axios = require('axios');
const Consul = require('consul');

const app = express();
const port = 4000;
const consul = new Consul({ host: 'consul-server', port: 8500 });

app.use(express.json());

app.get('/students', (req, res) => {
  res.json([
    { id: 1, name: 'Alice', age: 22 },
    { id: 2, name: 'Bob', age: 24 },
  ]);
});

app.get('/schools', async (req, res) => {
  try {
    const services = await consul.agent.service.list();
    const schoolService = services['school-service'];

    if (!schoolService) {
      return res.status(404).send('School Service not found');
    }

    // Appel à l'API du service `school-service`
    const url = `http://${schoolService.Address}:${schoolService.Port}/schools`;
    const response = await axios.get(url);

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching schools:', error.message);
    res.status(500).send('Error fetching schools');
  }
});

const registerWithConsul = () => {
  consul.agent.service.register(
    {
      name: 'student-service',
      address: 'student-service',
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

app.listen(port, () => {
  console.log(`Student Service is running on http://localhost:${port}`);
  registerWithConsul();
});
