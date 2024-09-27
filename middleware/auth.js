
const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // Récupérer le token du header

    if (!token) return res.sendStatus(401); // Pas de token

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Token invalide
        req.user = user; // Stocker l'utilisateur dans la requête
        next(); // Passer au middleware suivant
    });
}

module.exports = authenticateToken;
