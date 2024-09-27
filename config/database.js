const mongoose = require('mongoose');
require('dotenv').config(); // Assurez-vous d'avoir cette ligne pour charger les variables d'environnement

const connectDatabase = async () => {
    try {
        const uri = process.env.MONGODB_URI; // Récupère l'URI depuis le fichier .env
        console.log(`MongoDB URI: ${uri}`); // Optionnel : Affiche l'URI pour débogage
        await mongoose.connect(uri); // Supprimé les options obsolètes
        console.log('Connexion à MongoDB réussie');
    } catch (error) {
        console.error('Erreur de connexion à MongoDB:', error);
    }
};

module.exports = connectDatabase;
