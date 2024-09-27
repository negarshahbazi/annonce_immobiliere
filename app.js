const express = require("express");
const mustacheExpress = require("mustache-express");
const connectDatabase = require("./config/database");
require("dotenv").config();
console.log('MongoDB URI:', process.env.MONGODB_URI);



const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static("public"));
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Connexion à la base de données
connectDatabase();

// Routes
app.use("/annonces", require("./routes/annonces"));

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

// Exporter l'application pour les tests
module.exports = app;
