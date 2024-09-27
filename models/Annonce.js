const mongoose = require("mongoose");

const annonceSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    prix: { type: Number, required: true },
    description: { type: String, required: true },
    surface: { type: Number, required: true },
    localisation: {
        ville: { type: String, required: true },
        codePostal: { type: String, required: true }, 
    },
    caracteristiques: {
        chambre: { type: Number, required: true },
        salleDeBain: { type: Number, required: true },
        balcon: { type: String, required: true }, 
        jardin: { type: String, required: true },
        parking: { type: String, required: true },
    },
    image: { type: String, required: true } 

});

module.exports = mongoose.model("Annonce", annonceSchema);
