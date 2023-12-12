import generatePrompt from "./utils/prompt.js";
import OpenAI from 'openai';
import bcrypt from 'bcrypt';
import express from "express";
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import {
  storeUser,
  storeEntry,
  validateLogin,
  fetchEntriesTimestamps,
  fetchSingleEntry,
} from "./db/dynamo.js";

const app = express();
dotenv.config();

const sessionSecret = process.env.SESSION_SECRET || uuidv4();

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true
}));

app.use(cors());
app.use(express.json());

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
  app.use('/entries', express.static('dist'));
  app.use('/entry/:id', express.static('dist'));

  app.post('/', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
      const status = await validateLogin(username, password);
      console.log(status);
      if (status === 'valid password') {
        req.session.authenticated = true;
        res.status(200).send('Logged in');
      } else if (status === 'no username') {
        await storeUser(username, password)
        req.session.authenticated = true;
        res.status(200).send('Signed up and logged in');
      } else if (status === 'wrong password') {
        console.log('invalid')
        res.status(401).send('Invalid signup or login');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('An error with login/signup occurred');
    }
  });

  app.get('/api/auth', (req, res) => {
    if (req.session.authenticated) {
        res.json({ isAuthenticated: true });
    } else {
        res.json({ isAuthenticated: false });
    }
  });

  // fetch single entry
  app.get('/api/entry', async (req, res) => {
    if (req.session.authenticated) {
      const username = req.query.username;
      const timestamp = req.query.id;
      try {
        const entry = await fetchSingleEntry(username, timestamp)
        res.send(entry);
      } catch (error) {
        console.error(error);
        res.status(500).send('An error fetching the entry occurred');
      }
    } else {
      res.status(401).send('Unauthorized');
    }
  });

  // fetch story_ids list
  app.get('/api/entries', async (req, res) => {
    if (req.session.authenticated) {
      const username = req.query.username;
      try {
        const entries = await fetchEntriesTimestamps(username)
        res.send(entries);
      } catch (error) {
        console.error(error);
        res.status(500).send('An error fetching the entries occurred');
      }
    } else {
      res.status(401).send('Unauthorized');
    }
  });

  // save story
  app.post('/entry', async (req, res) => {
    if (req.session.authenticated) {
      const timestamp = Date.now();
      const username = req.body.username
      const llm_story = req.body.LLMText
      try {
        await storeEntry(username, timestamp, llm_story);
        res.status(201).send('Story saved');
      } catch (error) {
        console.error('Saving to DB error: ', error);
        res.send(error);
      }
    } else {
      res.status(401).send('Unauthorized');
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