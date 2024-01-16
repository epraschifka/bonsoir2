// dependencies
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();
const PORT = 3001;

// middleware
app.use(cors());
app.use(express.json());

// database setup. Each user can have multiple conversations,
// and each conversation consists of multiple statements.
const uri = "mongodb+srv://edwardpraschifka:oZOVIOEhdtHg4ehN@bonsoir-cluster.2neujbs.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const database = client.db('bonsoir-db');
const users = database.collection('users');
const conversations = database.collection('conversations');
const statements = database.collection('statements');

// retrieve conversations with a given email
app.get('/retrieve-conversations/:email', async (req,res) => {
  const email = req.params.email
  console.log(`Searching for conversations with email=${email}`);
  const convos = conversations.find({userEmail:email});
  const convoArray = await convos.toArray();
  res.send(convoArray);
})

// create a new conversation with a supplied email and title
app.post('/create-conversation', async (req,res) => {
  const email = req.body.email;
  const title = req.body.title;
  console.log(`email = ${email}`);
  console.log(`title = ${title}`);
  await conversations.insertOne({userEmail:email,title:title});
  res.send({success:true,message:"New conversation created!"})
})

app.listen(PORT,() => {
  console.log(`Listening on port ${PORT}...`);
})