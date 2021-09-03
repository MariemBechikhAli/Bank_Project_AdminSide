const passport = require('passport');
const jwt = require('jsonwebtoken');
const BearerStrategy = require('passport-http-bearer').Strategy;
const Personel = require('../models/personelSchema');

passport.use(new BearerStrategy(
    (token, done)=> {
      const decodedData = jwt.verify(token, process.env.JWT_SECRET);
      // console.log(decodedData);
      Personel.findById(decodedData.PersonelId, (err, user)=> {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        return done(null, user, { scope: 'all' });
      });
    }
  ));