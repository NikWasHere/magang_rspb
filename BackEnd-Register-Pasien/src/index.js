import express from 'express';
import dotenv from 'dotenv';
import dokterRoutes from './routes/dokterRoutes.js';
import poliDokterRoutes from './routes/poliDokterRoutes.js';
import polisRoutes from './routes/poliRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import usersRoutes from './routes/userRoutes.js';
import loginRoutes from './routes/loginRoutes.js';
import registerRoutes from './routes/registerRoutes.js';
import path from 'path';
import cors from 'cors';

dotenv.config();

const app = express(); // <-- deklarasi app dulu

app.use(cors());
app.use(express.json());

// Endpoint tes
app.get('/', (req, res) => res.send('API berjalan'));

// Routes
app.use('/dokters', dokterRoutes);
app.use('/poli-dokter', poliDokterRoutes);
app.use('/polis', polisRoutes);
app.use('/registrations', registrationRoutes);
app.use('/users', usersRoutes);
app.use('/register', registerRoutes);
app.use('/login', loginRoutes);

// Static file (foto)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
