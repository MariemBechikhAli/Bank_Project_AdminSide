const mongoose = require('mongoose');
const Hotel = mongoose.Schema({
    NOM: { type: String, required: true },
    Emplacement: { type: String, required: true },
    DateDebut: { type: String, required: true },
    DateFin: { type: String, required:true },
    Places: { type: Number, required:true},
    Etoiles: { type: Number, required: true },
    Prix: { type: Number, required: true },
    Image: { type: String, required: true },
    Lien: { type: String, required: true },
    Reservations:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "reservations"
        }
    ]
},
    {
        versionKey: false,
        timestamps: true
    })

module.exports = mongoose.model('Hotel', Hotel, 'Hotel')