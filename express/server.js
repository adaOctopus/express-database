import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import logger from './middleware/logger.js';
import wallets from './routes/wallets.js';
import dbwallets from './routes/dbwallets.js';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 8000;

app.use(cors())
// BodyMiddleware boilerplate
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/api/wallets', wallets);
app.use('/api/dbwallets', dbwallets);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
