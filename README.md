Gestion d'annonces immobilières
Ce TP va vous permettre de créer une application de gestion d'annonces immobilières avec une API REST et une base de données MongoDB.

1. Initialiser un nouveau projet Node.js :
Avec la commande npm init -y, initialisez votre projet Node.js. Cela va générer automatiquement un fichier package.json similaire à celui que nous avons utilisé pour le projet marvel-crud.

2. Installation des dépendances
Dans le terminal, installez les packages nécessaires :

Express, notre framework web, avec npm install express --save.
Mongoose, pour interagir avec MongoDB, avec npm install mongoose --save.
Mustache, un moteur de template simple, avec npm install mustache --save.
Supertest, pour tester les requêtes HTTP, avec npm install supertest --save-dev.
Jest, notre framework de test, avec npm install jest --save-dev.
Assurez-vous d'avoir la dernière version Node.js et npm pour éviter les problèmes de compatibilité.

3. Structure du projet et tests
Respectez la structure suivante pour organiser votre projet :

projet-annonces-immobilieres/
│   .env                     # Fichier de configuration des variables d'environnement
│   package.json             # Fichier de gestion des dépendances Node.js
│
├───config/                  # Fichiers de configuration du projet
│   │   database.js          # Configuration de la base de données MongoDB
│
├───tests/                   # Dossier pour les tests unitaires et d'intégration
│   │   annonces.test.js     # Tests pour les annonces immobilières
│
├───models/                  # Modèles Mongoose pour les objets du domaine
│   │   Annonce.js           # Modèle pour les annonces immobilières
│
|───public/                  # Dossier pour les fichiers statiques (images, CSS, JS)
|
├───routes/                  # Routes Express pour gérer les requêtes HTTP
│   │   annonces.js          # Routes dédiées aux annonces immobilières
│
├───views/                   # Templates Mustache pour les vues
│   │   index.mustache       # Vue pour la page d'accueil
│
└───app.js                   # Point d'entrée principal de l'application Node.js
Avant de commencer à coder, préparez un dossier tests/ avec Jest. Vos tests seront exécutés avec npm test, et vous servirez d'un fichier fourni par vos formateurs pour valider chaque étape de votre TP. https://www.npmjs.com/package/jest

4. Configuration de database.js
Créez un fichier config/database.js pour configurer la connexion à la base de données MongoDB. Ce fichier doit contenir les informations suivantes :

const mongoose = require("mongoose");

const connectDatabase = async () => {
  // TODO: Connexion à la base de données MongoDB
  // Utilisez les variables d'environnement pour la configuration
  // et referez-vous à la documentation de Mongoose
  // Utilisez un try/catch pour gérer les erreurs et n'oublier pas d'ajouter un log pour le serveur
};

module.exports = connectDatabase;
Utiliser mongoose simplifie considérablement les interactions avec MongoDB. Au lieu de manipuler directement le driver MongoDB, qui peut être complexe, vous définirez des schémas (modèles de données) pour organiser vos données efficacement.

5. Création du modèle Annonce
En utilisant Mongoose, définissez le schéma pour une annonce immobilière. Ce schéma représentera la structure de données d'une annonce et les comportements associés dans la base de données.

Voici un aperçu de ce à quoi pourrait ressembler votre modèle :

const mongoose = require("mongoose");

const annonceSchema = new mongoose.Schema({
  // TODO: Définissez les champs du schéma ici, par exemple titre, prix, caractéristiques, etc.
});

// l'etape de transformation du schema en modele sert a creer des instances de donnees
// a partir du schema et d'y ajouter des comportements (methodes)
// ici nous n'ajoutons pas de comportements mais on pourrait le faire avec par exemple
// annonceSchema.methods.rateAnnonce = function() { rating code here }

// le premier argument est le nom du modele, le deuxieme est le schema
// le nom du modele est important car il sera utilise pour creer la collection dans la base de donnees
const Annonce = mongoose.model("Annonce", annonceSchema);

module.exports = Annonce;
6.Configuration d'Express et du moteur de template Mustache
Après avoir installé Express et Mustache, configurez votre application pour utiliser ces outils. Le but est de créer une application web capable de servir des pages et de gérer les données de manière dynamique grâce à des templates et des API REST.

Par la suite, nous remplacerons les templates Mustache par des réponses JSON pour créer une API REST afin d'utiliser notre application avec un client React-Native.

Configurez votre serveur Express pour servir des fichiers statiques. Cela vous permettra de charger des ressources comme des images, des feuilles de style CSS ou des scripts JavaScript.

app.use(express.static("public")); // Le dossier 'public' contiendra vos fichiers statiques
Enregistrez et configurez Mustache comme moteur de template de votre application. Cela a été fait dans la portion de code que tu as fournie précédemment :

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");
Assurez-vous que votre application peut envoyer et recevoir des données JSON, ainsi que décoder les données des formulaires :

app.use(express.json()); // Pour le support des JSON dans le corps (body) des requêtes
app.use(express.urlencoded({ extended: true })); // Pour le support des formulaires
Connectez la base de données via la fonction connectDatabase que vous avez préalablement configurée :

connectDatabase();
Définissez les routes de votre application en utilisant le module Express Router. Par exemple, pour les annonces immobilières, vous avez déjà inclus le fichier routage :

app.use("/", require("./routes/annonces"));
Vous pouvez créer d'autres fichiers de routes pour gérer d'autres fonctionnalités ou ressources de votre application.

Lancez votre serveur Express sur le port défini et assurez-vous qu'il démarre correctement :

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
Pensez à exporter l'application Express comme module pour permettre les tests et la modularisation de votre projet :

module.exports = app;
7. Création des routes pour les annonces immobilières
Express Router est un module qui permet de définir des routes pour votre application. Vous pouvez créer des fichiers de routes pour chaque ressource de votre application, par exemple annonces.js pour les annonces immobilières. https://expressjs.com/fr/guide/routing.html#express-router

Noubliez pas de bien lire la documentation de mongoose pour savoir comment utiliser votre modele Annonce dans vos routes. https://mongoosejs.com/docs/guide.html toutes les méthodes natives des models sont décrites dans la documentation: https://mongoosejs.com/docs/api/model.html. vous devrez les utiliser pour save, find, findOne, findById, findByIdAndUpdate, findByIdAndDelete, etc...

Vous devez établir les fondements pour la gestion de vos annonces immobilières avec un ensemble de routes CRUD (Create, Read, Update, Delete). Voici comment procéder pour créer et sécuriser chacune de ces routes :

POST / (Création d'une annonce) :
Cette route doit réceptionner les données du formulaire ou les données JSON d'une requête API, les valider et créer une nouvelle annonce avec ces données. Pensez à gérer correctement les champs booléens, comme la présence d'un balcon ou d'un jardin, pour les convertir de façon appropriée à partir des données reçues.

GET / (Liste des annonces) :
Cette route doit récupérer toutes les annonces actives depuis la base de données et les afficher. Pour une API, vous renverriez un tableau JSON, et pour une application web complète, vous pourriez les rendre sur une vue avec Mustache.

GET /:id (Détail d'une annonce) :
Cette route doit permettre de récupérer les détails d'une seule annonce en fonction de son identifiant. Gérez correctement l'absence de résultat en renvoyant le bon code de statut.

PUT /:id (Mise à jour d'une annonce) :
Cette route doit permettre la mise à jour d'une annonce existante. Assurez-vous que l'ID correspond à une annonce valide et appliquez les changements demandés. Utilisez les options de findByIdAndUpdate pour renvoyer l'annonce mise à jour.

DELETE /:id (Suppression d'une annonce) :
Cette route doit permettre la suppression d'une annonce. Comme pour la route PUT, vérifiez que l'annonce existe avant de procéder à sa suppression et renvoyez un message de confirmation ou d'erreur selon le cas.

Pour chaque route, gérez les erreurs potentielles avec des blocs try/catch et renvoyez des réponses appropriées au client, incluant le statut HTTP et les messages d'erreur. Vous pouvez également ajouter des middlewares pour sécuriser les routes, par exemple avec l'authentification JWT ou d'autres mécanismes selon les bes oins de votre application.

Lorsque vous définissez l'objet data pour la création d'annonces, soyez attentif à ne pas inclure d'entrées indésirables. Filtrez et nettoyez les données reçues pour éviter les injections de code ou d'autres vulnérabilités.

TEST !
Pour valider votre crud, vous devez avoir un test qui passe avec succès. Pour cela, vous pouvez utiliser le code suivant :

const request = require("supertest");
let app = require("../app");

beforeAll(() => {
  app = require("../app");
});

describe("POST /annonces", () => {
  it("should create a new annonce", async () => {
    const data = {
      titre: "Superbe appartement en centre-ville",
      description: "Un appartement charmant avec vue sur la rivière",
      prix: 250000,
      surface: 80,
      localisation: {
        ville: "Lyon",
        codePostal: "69000",
      },
      caractéristiques: {
        chambre: 2,
        salleDeBain: 1,
        balcon: true,
        jardin: false,
        parking: true,
      },
    };

    const res = await request(app).post("/annonces").send(data);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("_id");
  });
});
describe("GET /annonces", () => {
  it("should retrieve all annonces", async () => {
    const res = await request(app).get("/annonces");

    expect(res.statusCode).toEqual(200);
  });
});
Vous pouvez utiliser ce test pour définir les champs de votre schéma.

Copiez le tel quel dans votre fichier tests/annonces.test.js et exécutez npm test pour valider cette étape.

Attention : vous devez dabord avoir créé le fichier app.js et configurez votre serveur express pour que les tests passent.

de plus, le serveur doit etre arrete pour que les tests se lancent correctement

8. Création des vues pour les annonces immobilières
Maintenant que vous avez créé les routes pour gérer les annonces immobilières, vous pouvez créer les vues pour les afficher. Pour cela, vous utiliserez le moteur de template Mustache.

le but de ces templates est d'avoir un petit rendu en html avant de toute transformation en API REST. Cela permet de tester rapidement les fonctionnalités de votre application.

Une fois que tout fonctione, vous pourrez transformer votre application en API REST pour l'utiliser avec un client React-Native. les reponses seront alors en JSON au lieu d'etre des render mustache.

FIN DU TP