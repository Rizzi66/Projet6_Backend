const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user')
const dotenv = require('dotenv').config().parsed

//Création de l'application express
const app = express();

//Connexion à la BDD MongoDB avec Mongoose
mongoose.connect(`mongodb+srv://${dotenv.MONGOOSE_USER}:${dotenv.MONGOOSE_PASS}@cluster0.taw3ysv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !')
);

//Conversion en JSON pour les routes POST
app.use(express.json());

//Ajout de plusieurs éléments dans le header pour gérer les erreurs de CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//Création des différentes middleware de base
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;