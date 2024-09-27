
const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

// Exemple d'utilisateur (remplace par une base de données réelle)
const users = []; // Une liste d'utilisateurs pour cet exemple

// Route pour s'inscrire
router.post('/register', (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;
    const newUser = { username, password }; // Ajouter le nouvel utilisateur
    users.push(newUser);
    res.status(201).send('Utilisateur enregistré');
});

// Route pour se connecter
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) return res.sendStatus(401); // Mauvais identifiants

    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Créer le token
    res.json({ token }); // Retourner le token au client
});

module.exports = router;
