const addParagraphBreaks = require("./utils/paragraphs.js");
const generatePrompt = require("./utils/prompt.js");

const OpenAI = require('openai');
const bcrypt = require('bcrypt');
const express = require("express");
const session = require('express-session');
const cors = require('cors')
const app = express();

app.use(express.static('build'));
app.use(cors());
app.use(express.json())
app.use(session({ secret: 'dbksbfknJ0HO7uuEQNipd7yR1Jii78g3yiNTyu1axu', resave: false, saveUninitialized: true }));

app.post('/', async (req, res) => {
  const userPassword = req.body.password;
  if (await bcrypt.compare(userPassword, '$2b$05$ATBklt72HeUdB8DzW8J0HO7uuEQNipd7yR1Ji0klK.52iNTyu1axu')) {
    req.session.authenticated = true;
    res.status(200).send('Logged in');
  } else {
    res.status(401).send('Unauthorized');
  }
})

app.post('/horrify', async (req, res) => {
  const userPassword = req.body.password;
  if (await bcrypt.compare(userPassword, '$2b$05$ATBklt72HeUdB8DzW8J0HO7uuEQNipd7yR1Ji0klK.52iNTyu1axu')) {
    const inputText = req.body.inputText;
    const prompt = generatePrompt(inputText);
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    try {
      const response = await openai.chat.completions.create({
        messages: [
          {"role": "system", "content": prompt},
          {"role": "user", "content": inputText}
        ],
        model: "gpt-4-1106-preview",
      });

      const data = response.choices[0].message.content
      const formattedText = addParagraphBreaks(data);
      res.send(formattedText);
    } catch (error) {
      setIsLoading(false);
      console.error('OpenAI API error: ', error);
      res.send(error);
    }
  } else {

  }
})

app.get('/health', (req, res) => {
  res.sendStatus(200);
})

app.listen(3000, () => console.log('Server started on port 3000'));