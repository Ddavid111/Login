const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { User, connectDB } = require('./dbConfig');
require('dotenv').config();

const app = express();

app.use(cors());

connectDB();

app.use(express.json());

const router = express.Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "mintakalman1@gmail.com",
        pass: "vqij pquo hgqr ccjj"
    },
    secure: true,
    tls: {
        rejectUnauthorized: false
    }
});


// Regisztráció
router.post('/register', async (req, res) => {
    try {
        const { fullname, username, password, email, role } = req.body;
        
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'A felhasználónév vagy email már foglalt!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({ fullname, username, email, password: hashedPassword, role });
        await newUser.save();
        
        res.status(201).json({ message: 'Regisztráció sikeres!' });
    } catch (error) {
        res.status(500).json({ message: 'Szerverhiba', error });
    }
});

// Bejelentkezés
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Hibás felhasználónév vagy jelszó!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Hibás felhasználónév vagy jelszó!' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role }, 
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Bejelentkezés sikeres!', token });
    } catch (error) {
        console.error("Hiba a bejelentkezés során:", error); 
        res.status(500).json({ message: 'Szerverhiba', error: error.message }); 
    }
});

// Jelszó visszaállítási kérés (forgot password)
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Nincs ilyen felhasználó!' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        const resetUrl = `http://localhost:4200/reset-password/${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Jelszó visszaállítása',
            html: `<p>Ha elfelejtetted a jelszavad, kattints az alábbi linkre a visszaállításhoz:</p>
                   <a href="${resetUrl}">Jelszó visszaállítása</a>`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'A jelszó-visszaállító emailt elküldtük!' });
    } catch (error) {
        console.error('Hiba a jelszó visszaállítási kérés során:', error);
        res.status(500).json({ message: 'Szerverhiba', error });
    }
});

app.use('/api', router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Szerver elindítva a ${PORT} porton`);
});
