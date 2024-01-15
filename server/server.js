// dependencies
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();
const PORT = 3001;

// middleware
app.use(cors());
app.use(express.json());

// database setup
const uri = "mongodb+srv://epraschifka:ec94wEXSUDeHPENR@cluster0.g5jtbq3.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const database = client.db('bonsoir');
const statements = database.collection('statements');

app.listen(PORT,() => {
  console.log(`Listening on port ${PORT}...`);
})