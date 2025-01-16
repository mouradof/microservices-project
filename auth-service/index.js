const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const port = 7000;
const SECRET_KEY = 'e1a5b6f7d4e2b1a6f4c2d3f9b2b8f5c8';

app.use(express.json());

app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;

  // Vérification basique
  if (username === 'user' && password === 'password') {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    return res.json({ token });
  }

  res.status(401).json({ message: 'Invalid credentials' });
});

// Lancer le service
app.listen(port, () => {
  console.log(`Auth-Service is running on http://localhost:${port}`);
});
