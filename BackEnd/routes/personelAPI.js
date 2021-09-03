const express = require('express');
const router = express.Router();
const Personel = require('../models/personelSchema');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const nodemailer = require("nodemailer");
const env = require('dotenv');
//ADD PERSONEL
router.post('/addPersonel', async (req, res) => {
    const PersonelFound = await Personel.findOne({ Email: req.body.Email })
    if(!PersonelFound){
        bcrypt.hash(req.body.CIN, saltRounds, async (error, hash)=>{
            if (error) {
                res.status(500).json({message: 'Server error!!!!!'});
            }else{
                req.body.Password = hash;
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.PASSWORD,
                    },
                });

                let mailOptions = {
                    from: 'stbank.test@gmail.com',
                    to: req.body.Email,
                    subject: "STB account login", 
                    html: `
                        <h1 style="color:blue;">Login to your account with the link bellow:</h1>
                        <hr style="color=grey">
                        <p>http://localhost:3000/login</p>
                        <hr style="color=grey">
                        `
                }

                transporter.sendMail(mailOptions, async (err, data)=>{
                    if(err){
                        console.log('error occured!',err);
                    }else{
                        await Personel.create(req.body);
                        res.json({message: 'Registered successfully and email sent! '});
                    }
                });
            }
        });
    }else {
        res.status(400).json({message : 'Email already exist! '})
    }
});

//Sign In
router.post('/login', async (req, res) => {
    const loginPersonel = await Personel.findOne({ Email: req.body.Email });
    if (loginPersonel != null) {
        const validPassword = await bcrypt.compare(req.body.Password, loginPersonel.Password);
        if (validPassword) {
            const tokenData = {
                PersonelNOM: loginPersonel.NOM,
                PersonelID: loginPersonel._id,
                PersonelPost: loginPersonel.Post,
                PersonelEmail: loginPersonel.Email
            }
            const createdToken = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRE });
            res.status(200).json({ message: 'Logged in successfully', token: createdToken });
        } else {
            res.status(400).json({ message: 'Please verify your E-mail or Password' });
        }
    } else {
        res.status(400).json({ message: 'Please verify your E-mail or Password' });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    res.json({ message: 'Logged out!' })
});


// Get Personel List
router.get('/personel-list', async (req, res) => {
    const personels = await Personel.find();
    res.json(personels);
});



// Delete Personel
router.delete('/delete-personel/:id', async(req,res)=>{
    const deletePersonel = await Personel.findByIdAndDelete(req.params.id);
    res.json({message: 'Deleted successefuly'});
})


module.exports = router;