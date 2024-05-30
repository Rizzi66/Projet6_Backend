const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Modèle "User"
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

//Utilisation de uniqueValidator en plus du "unique:true" pour empecher la création de plusieurs même adresse mail
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);