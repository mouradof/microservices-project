const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const Consul = require('consul');

const app = express();
const port = 8080;
const consul = new Consul({ host: 'consul-server', port: 8500 });
const SECRET_KEY = 'e1a5b6f7d4e2b1a6f4c2d3f9b2b8f5c8'; // Doit correspondre à la clé utilisée dans Auth-Service

app.use(express.json());

// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

// Autoriser les redirections sans authentification pour Auth-Service
app.use('/auth', (req, res) => {
  axios({
    method: req.method,
    url: `http://auth-service:7000${req.url}`,
    data: req.body,
    headers: req.headers,
  })
    .then((response) => res.status(response.status).json(response.data))
    .catch((error) => res.status(error.response?.status || 500).json(error.response?.data));
});

// Endpoint sécurisé pour les étudiants
app.get('/students', verifyToken, async (req, res) => {
  try {
    const services = await consul.agent.service.list();
    const studentService = services['student-service'];

    if (!studentService) {
      return res.status(404).send('Student Service not found');
    }

    const url = `http://${studentService.Address}:${studentService.Port}/students`;
    const response = await axios.get(url);

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching students:', error.message);
    res.status(500).send('Error fetching students');
  }
});

// Endpoint sécurisé pour les écoles
app.get('/schools', verifyToken, async (req, res) => {
  try {
    const services = await consul.agent.service.list();
    const schoolService = services['school-service'];

    if (!schoolService) {
      return res.status(404).send('School Service not found');
    }

    const url = `http://${schoolService.Address}:${schoolService.Port}/schools`;
    const response = await axios.get(url);

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching schools:', error.message);
    res.status(500).send('Error fetching schools');
  }
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`API Gateway is running on http://localhost:${port}`);
});
