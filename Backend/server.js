const express = require('express');
const { TextServiceClient } = require('@google-ai/generativelanguage').v1beta2;
const { GoogleAuth } = require('google-auth-library');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');

var whitelist = ['https://sql-generator-gamma.vercel.app/']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

const MODEL_NAME = 'models/text-bison-001';
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error('API_KEY is missing. Please provide a valid API key.');
  process.exit(1);
}

app.post('/generate-sql',cors(corsOptions), async (req, res) => {
  try {
    const userInput = req.body.userInput;

    const client = new TextServiceClient({
      authClient: new GoogleAuth().fromAPIKey(API_KEY),
    });

    const prompt = `
      You are a SQL expert. You have to recreate the SQL query for text provided to you by user. '''don't include any other explanation.'''
     
      User Has said:
      ${userInput}

      '''Begin Generating Only SQL Code:'''
    `;

    const result = await client.generateText({
      model: MODEL_NAME,
      prompt: {
        text: prompt,
      },
    });

    const generatedText = result[0]?.candidates[0]?.output;

    if (generatedText) {
      res.json({ generatedText });
    } else {
      res.status(500).json({ error: 'Failed to generate SQL code.' });
    }
  } catch (error) {
    
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
 
});
