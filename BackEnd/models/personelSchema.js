const mongoose = require('mongoose');
const Personel = mongoose.Schema({
    NOM: { type: String, required: true },
    Email: { type: String, required: true },
    CIN: { type: String, required: true },
    Post: { type: String, required:true },
    Password: { type: String, required:true},
    RIB: { type: String, default: '' },
    Numero_telephonique: { type: String, default: '' },
    Nbre_enfants: { type: String, default: '' },
    Etat_matrimoniale: { type: String, default: '' },
    Agence: { type: String, default: '' },
    Valide: { type: Boolean, default: false }
},
{
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('Personel', Personel, 'Personel')