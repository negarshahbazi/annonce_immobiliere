const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

// Exemple d'utilisateur (remplace par une base de données réelle)
const users = []; // Une liste d'utilisateurs pour cet exemple

// Route pour afficher la page d'inscription
router.get('/register', (req, res) => {
    res.render('register'); // Rendre la page 'register.mustache'
});

// Route pour s'inscrire
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    
    // Vérification simple pour voir si l'utilisateur existe déjà
    const existingUser = users.find(u => u.username === username );
    if (existingUser) {
        return res.status(400).send('L\'utilisateur existe déjà');
    }

    const newUser = { username, password }; // Ajouter le nouvel utilisateur
    users.push(newUser);
    res.redirect('/auth/login'); // Rediriger vers la page de connexion après inscription
});

// Route pour afficher la page de connexion
router.get('/login', (req, res) => {
    res.render('login'); // Rendre la page 'login.mustache'
});

// Route pour se connecter
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
        return res.status(401).render('login', { error: 'Identifiants incorrects' }); // Mauvais identifiants avec message d'erreur
    }

    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Créer le token
    res.render('index', {username: user.username, token }); // Rendre une page après connexion avec le token (tu peux changer 'dashboard' selon tes besoins)
});



// Route pour se déconnecter
router.get('/logout', (req, res) => {
    // Ici, tu peux supprimer le token côté client, par exemple en utilisant le stockage local ou les cookies

    res.redirect('/auth/login');
});

module.exports = router;
