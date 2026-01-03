import express from 'express';
import dotenv from 'dotenv';
import dokterRoutes from './routes/dokterRoutes.js';
import poliDokterRoutes from './routes/poliDokterRoutes.js';
import polisRoutes from './routes/poliRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import usersRoutes from './routes/userRoutes.js';
import loginRoutes from './routes/loginRoutes.js';
import registerRoutes from './routes/registerRoutes.js';
import { multerErrorHandler, generalErrorHandler } from './middleware/errorHandler.js';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); // <-- deklarasi app dulu

app.use(cors());
app.use(express.json());
app.use(cookieParser());

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

// Static file (foto) - serve from the backend uploads folder
const uploadsPath = path.join(__dirname, '..', 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Error handlers - HARUS DI AKHIR
// app.use(multerErrorHandler);
// app.use(generalErrorHandler);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
