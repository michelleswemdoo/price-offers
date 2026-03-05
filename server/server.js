import express from 'express';
import cors from 'cors';
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(cors());

const priceOffers = JSON.parse(fs.readFileSync(path.join(__dirname, 'mockPriceOffers.json'), 'utf8'));

app.get('/price-offers', (_, res) => {
    res.json(priceOffers);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});