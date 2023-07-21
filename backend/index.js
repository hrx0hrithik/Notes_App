const connectToMongo = require("./db");
const express = require("express");
require('dotenv').config({path:"./.env"})

const app = express();
const port = process.env.PORT

app.use(express.json());

connectToMongo();

// Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`My Notebook backend is running at http://localhost:${port}`);
});
