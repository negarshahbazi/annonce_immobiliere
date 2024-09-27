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

// Route pour créer une annonce pour images
router.post("/", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) { // Vérifiez si le fichier existe
            return res.status(400).json({ message: "Aucune image téléchargée." });
        }

        const annonce = new Annonce({
            ...req.body,
            image: `/img/${req.file.filename}` // Chemin vers l'image téléchargée (relatif)
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
          chambre: annonce.caracteristiques?.chambre || 0,
          salleDeBain: annonce.caracteristiques?.salleDeBain || 0,
          balcon: annonce.caracteristiques?.balcon ? 'oui' : 'non',
          jardin: annonce.caracteristiques?.jardin ? 'oui' : 'non',
          parking: annonce.caracteristiques?.parking ? 'oui' : 'non'
      };

      res.render("editAnnonce", { 
          id: annonce._id,
          titre: annonce.titre,
          prix: annonce.prix,
          localisation: {
              ville: annonce.localisation?.ville || '',
              codePostal: annonce.localisation?.codePostal || ''
          },
          description: annonce.description || '',
          surface: annonce.surface || 0,
          image: annonce.image || '',
          caracteristiques // Passe les caractéristiques à la vue
      }); 
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// POST /annonces/:id/edit (Mise à jour de l'annonce)
router.post("/:id/edit", upload.single("image"), async (req, res) => {
  try {
    // Vérifiez si `localisation` est présent dans `req.body`, sinon définissez-le à un objet vide
    const localisation = req.body.localisation || {}; 

    const updateData = {
            titre: req.body.titre || '',
            prix: req.body.prix || 0,
            localisation: {
                ville: localisation.ville || '', // Assurez-vous que 'ville' existe
                codePostal: localisation.codePostal || '' // Assurez-vous que 'codePostal' existe
            },
            description: req.body.description || '',
            surface: req.body.surface || 0,
            caracteristiques: {
                chambre: req.body.caracteristiques?.chambre || 0,
                salleDeBain: req.body.caracteristiques?.salleDeBain || 0,
                balcon: req.body.caracteristiques?.balcon === 'oui',
                jardin: req.body.caracteristiques?.jardin === 'oui',
                parking: req.body.caracteristiques?.parking === 'oui'
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
      res.status(400).json({ message: error.message });
  }
});


// DELETE /annonces/:id (Suppression d'une annonce)
router.delete('/:id', async (req, res) => {
  try {
      const annonce = await Annonce.findByIdAndDelete(req.params.id); // Supprime l'annonce
      if (!annonce) {
          return res.status(404).json({ message: "Annonce non trouvée" });
      }
      res.status(200).json({ message: "Annonce supprimée avec succès" });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});




module.exports = router;
