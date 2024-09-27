const express = require("express");
const router = express.Router();
const Annonce = require("../models/Annonce");
const multer = require("multer");
const path = require("path");

// le dossier 'public/img' existe, 
const imgDir = path.join(__dirname, "../public/img");

// Configuration de multer pour le stockage des images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, imgDir); // Dossier pour stocker les images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Renommer le fichier avec un timestamp
    }
});

const upload = multer({ storage: storage });

// GET /annonces/new (Afficher le formulaire pour créer une nouvelle annonce)
router.get("/new", (req, res) => {
    res.render("createAnnonce");
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
      console.log(req.body); // Pour voir ce qui est envoyé

      if (!req.file) {
          return res.status(400).json({ message: "Aucune image téléchargée." });
      }

      // Récupération des valeurs des champs
      const { titre, prix, description, surface, 'localisation.ville': ville, 'localisation.codePostal': codePostal, 
              'caracteristiques.chambre': chambre, 'caracteristiques.salleDeBain': salleDeBain, 
              'caracteristiques.balcon': balcon, 'caracteristiques.jardin': jardin, 'caracteristiques.parking': parking } = req.body;

      // Vérifie si toutes les informations nécessaires sont présentes
      if (!ville || !codePostal) {
          return res.status(400).json({ message: "Ville ou code postal manquant." });
      }

      const annonce = new Annonce({
          titre,
          prix,
          description,
          surface,
          localisation: {
              ville,
              codePostal
          },
          caracteristiques: {
              chambre,
              salleDeBain,
              balcon,
              jardin,
              parking
          },
          image: `/img/${req.file.filename}` // Chemin vers l'image téléchargée
      });

      const savedAnnonce = await annonce.save();
      res.redirect("/annonces"); // Redirige vers la liste des annonces
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});


// GET /annonces (Liste des annonces)
router.get("/", async (req, res) => {
    try {
        const annonces = await Annonce.find();
        res.render("index", { annonces }); // Passe les annonces à la vue index
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /annonces/:id (Détail d'une annonce)
router.get("/:id", async (req, res) => {
    try {
        const annonce = await Annonce.findById(req.params.id);
        if (!annonce) {
            return res.status(404).json({ message: "Annonce non trouvée" });
        }
        res.status(200).json(annonce);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /annonces/:id/edit (Afficher le formulaire pour modifier l'annonce)
router.get("/:id/edit", async (req, res) => {
  try {
      const annonce = await Annonce.findById(req.params.id);
      if (!annonce) {
          return res.status(404).json({ message: "Annonce non trouvée" });
      }
      // Définir les caractéristiques de manière sécurisée
      const caracteristiques = {
        balcon: annonce.caracteristiques.balcon || null,
        jardin: annonce.caracteristiques.jardin || null,
        parking: annonce.caracteristiques.parking || null,
        chambre: annonce.caracteristiques.chambre || 0,
        salleDeBain: annonce.caracteristiques.salleDeBain || 0,
    };

      res.render("editAnnonce", { 
          id: annonce._id,
          titre: annonce.titre,
          prix: annonce.prix,
          localisation: {
              ville: annonce.localisation.ville,
              codePostal: annonce.localisation.codePostal
          },
          description: annonce.description,
          surface: annonce.surface,
          image: annonce.image,
          caracteristiques: caracteristiques,
      }); 
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// POST /annonces/:id/edit (Mise à jour de l'annonce)
router.post("/:id/edit", upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      titre: req.body.titre,
      prix: req.body.prix,
      localisation: {
        ville: req.body['localisation.ville'] || '', // Récupérer la valeur directement
        codePostal: req.body['localisation.codePostal'] || '' // Récupérer la valeur directement
      },
      description: req.body.description,
      surface: req.body.surface,
      caracteristiques: {
        chambre: parseInt(req.body['caracteristiques.chambre']) || 0, // Convertir en entier
        salleDeBain: parseInt(req.body['caracteristiques.salleDeBain']) || 0, // Convertir en entier
        balcon: req.body['caracteristiques.balcon'] || 'non', // Valeur par défaut
        jardin: req.body['caracteristiques.jardin'] || 'non', // Valeur par défaut
        parking: req.body['caracteristiques.parking'] || 'non' // Valeur par défaut
      }
    };

    // Vérifiez si une nouvelle image a été téléchargée
    if (req.file) {
        updateData.image = `/img/${req.file.filename}`; // Met à jour l'image si un nouveau fichier a été téléchargé
    }

    const annonce = await Annonce.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!annonce) {
        return res.status(404).json({ message: "Annonce non trouvée" });
    }
    
    res.redirect("/annonces"); // Redirige vers la liste des annonces après la mise à jour
  } catch (error) {
    console.error("Error updating annonce:", error); // Log de l'erreur pour débogage
    res.status(400).json({ message: error.message });
  }
});


// DELETE /annonces/:id (Suppression d'une annonce)
router.post('/:id/delete', async (req, res) => {
  try {
      const annonce = await Annonce.findByIdAndDelete(req.params.id); // Supprime l'annonce
      if (!annonce) {
        return res.status(404).json({ message: "Annonce non trouvée" });
      }
      // res.status(200).json({ message: "Annonce supprimée avec succès" });
      res.redirect("/annonces"); // Redirect to annonces list

  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});




module.exports = router;
