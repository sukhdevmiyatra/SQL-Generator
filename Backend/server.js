const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// Initialize the GoogleGenerativeAI client with the API key
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Verify if the API_KEY is set
if (!process.env.API_KEY) {
  console.error('API_KEY is missing. Please provide a valid API key.');
  process.exit(1);
}

app.post('/generate-sql', async (req, res) => {
  try {
    const userInput = req.body.userInput;

    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Convert natural language into SQL queries. '''do not answer to anything else than SQL queries'''
     
      User Has said:
      ${userInput}  
    `;

    // Generate content based on the user input
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = await response.text();

    if (generatedText) {
      res.json({ generatedText });
    } else {
      res.status(500).json({ error: 'Failed to generate SQL code.' });
    }
  } catch (error) {
    console.error(error); // Logging the error can help in debugging
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
