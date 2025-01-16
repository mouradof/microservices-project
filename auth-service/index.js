const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const port = 7000;
const SECRET_KEY = 'your_secret_key'; // Remplacez par une clé secrète sécurisée

app.use(express.json());

// Endpoint pour générer un token JWT
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
