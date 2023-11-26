import generatePrompt from "./utils/prompt.js";
import OpenAI from 'openai';
import bcrypt from 'bcrypt';
import express from "express";
import session from 'express-session';
import cors from 'cors';
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const app = express();

async function getSecret() {
  const secretArn = 'arn:aws:secretsmanager:us-east-1:099208431742:secret:OPENAI-LeWLvq';
  const client = new SecretsManagerClient({ region: "us-east-1" });

  try {
    const response = await client.send(new GetSecretValueCommand({ SecretId: secretArn }));
    return response.SecretString;
  } catch (error) {
    throw error;
  }
}

async function main() {
  const openAIKey = await getSecret();

  app.use(express.static('dist'));
  app.use('/journal', express.static('dist'));
  app.use(cors());
  app.use(express.json());
  app.use(session({ secret: 'bigsecretboom!', resave: false, saveUninitialized: true }));

  app.post('/', async (req, res) => {
    const userPassword = req.body.password;
    const passHash = '$2b$05$ATBklt72HeUdB8DzW8J0HO7uuEQNipd7yR1Ji0klK.52iNTyu1axu';
  
    try {
      if (await bcrypt.compare(userPassword, passHash)) {
        req.session.authenticated = true;
        res.status(200).send('Logged in');
      } else {
        console.log('invalid')
        res.status(401).send('Invalid credentials');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  });

  app.get('/journal', async (req, res) => {
    res.status(200).send('Access granted');
  });

  app.get('/api/auth', (req, res) => {
    if (req.session.authenticated) {
        res.json({ isAuthenticated: true });
    } else {
        res.json({ isAuthenticated: false });
    }
  });

  app.post('/horrify', async (req, res) => {
    if (req.session.authenticated) {
      const inputText = req.body.inputText;
      const prompt = generatePrompt(inputText);
      const openai = new OpenAI({
        apiKey: openAIKey
      });
      try {
        const response = await openai.chat.completions.create({
          messages: [
            {"role": "system", "content": prompt},
            {"role": "user", "content": inputText}
          ],
          model: "gpt-4-1106-preview",
        });

        const data = response.choices[0].message.content;
        res.send(data);
      } catch (error) {
        console.error('OpenAI API error: ', error);
        res.send(error);
      }
    } else {
      res.status(401).send('Unauthorized');
    }
  });

  app.get('/health', (req, res) => {
    res.sendStatus(200);
  });

  app.listen(3000, () => console.log('Server started on port 3000'));
}

main().catch(error => console.error(error));