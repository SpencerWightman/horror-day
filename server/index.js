const express = require("express");
const { createServer } = require("http");

const app = express();
const httpServer = createServer(app);

app.use(express.static('build'));
const cors = require('cors')
app.use(cors());
app.use(express.json())

const PORT = 3000
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})