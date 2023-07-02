/** @format */

const PORT = 8000;
const express = require("express");
const cors = require("cors");

//Initialize express app
const app = express();

//Enable cors and json
app.use(cors());
app.use(express.json());

//Load environment variables
require("dotenv").config();

//Require fs and multer packages
const fs = require("fs");
const multer = require("multer");

//Require OpenAI packages
const { Configuration, OpenAIApi } = require("openai");

//Set OpenAI configuration using API key
const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});

//Initialize OpenAI
const openai = new OpenAIApi(configuration);

//Set multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    console.log("file", file);
    cb(null, Date.now() + "-" + file.originalname);
  },
});

//Initialize multer upload
const upload = multer({ storage: storage }).single("file");

//Set file path
let filePath;

//POST route to generate images from prompt
app.post("/images", async (req, res) => {
  //Use OpenAI to generate images
  const response = await openai.createImage({
    prompt: req.body.message,
    n: 2,
    size: "256x256",
  });
  //Send response
  res.send(response.data.data);
});

//POST route to upload images
app.post("/upload", (req, res) => {
  //Use multer to upload image
  upload(req, res, (err) => {
    //Check for errors
    if (err) {
      return res.status(500).json(err);
    }
    //Get file path
    filePath = req.file.path;
  });
});

//POST route to generate image variations
app.post("/variations", async (req, res) => {
  try {
    //Use OpenAI to generate image variations
    const response = await openai.createImageVariation(
      fs.createReadStream(filePath),
      2,
      "256x256"
    );
    res.send(response.data.data);
  } catch (error) {
    console.error(error);
  }
});

//Listen on port
app.listen(PORT, () => console.log("Server Running on PORT:" + PORT));
