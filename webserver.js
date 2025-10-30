// webserver.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir les fichiers statiques du dossier web
app.use(express.static(path.join(__dirname, 'web')));

// Endpoint formulaire
app.post("/submit", async (req, res) => {
  try {
    const { title, discord, description } = req.body;
    if (!title || !discord || !description)
      return res.status(400).send("Les champs marqués * sont obligatoires !");

    const body = `**Pseudo Discord :** ${discord}\n\n**Description :**\n${description}`;

    // Créer l'issue GitHub
    const response = await axios.post(
      `https://api.github.com/repos/${process.env.GITHUB_REPO}/issues`,
      { title, body },
      { headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` } }
    );

    res.status(200).send("OK"); // Le front JS affichera le message success

  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).send("Erreur lors de la création de l'issue.");
  }
});

app.listen(PORT, () => {
  console.log(`🌐 Webserver running on port ${PORT}`);
});
