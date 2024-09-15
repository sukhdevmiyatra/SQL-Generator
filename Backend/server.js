const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: '*', // Be cautious with this in production
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

// Handle preflight requests
app.options('*', cors(corsOptions));

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.error('API_KEY is missing. Please provide a valid API key.');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

app.post('/generate-sql', async (req, res) => {
  try {
    const userInput = req.body.userInput;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Convert natural language into SQL queries. '''do not answer to anything else than SQL queries'''
     
      User Has said:
      ${userInput}  
    `;

    const result = await model.generateContent(prompt);
    const generatedText = result.response.text();

    if (generatedText) {
      res.json({ generatedText });
    } else {
      res.status(500).json({ error: 'Failed to generate SQL code.' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app; // This is important for Vercel deployment
