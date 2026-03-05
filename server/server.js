// import express from 'express';
// import cors from 'cors';
// import fs from 'fs'
// import path from 'path'
// import { fileURLToPath } from 'url'

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// const port = 3000;

// app.use(cors());

// const priceOffers = JSON.parse(fs.readFileSync(path.join(__dirname, 'mockPriceOffers.json'), 'utf8'));

// app.get('/price-offers', (_, res) => {
//     res.json(priceOffers);
// });

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

// server.js
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Serve frontend static files
app.use(express.static(path.join(__dirname, "frontend/dist")));

// API: /price-offers
const priceOffersPath = path.join(__dirname, "mockPriceOffers.json");
const priceOffers = JSON.parse(fs.readFileSync(priceOffersPath, "utf8"));

app.get("/price-offers", (_, res) => {
  res.json(priceOffers);
});

// Serve Vue frontend for any other route (SPA routing)
app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
