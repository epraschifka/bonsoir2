// dependencies
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
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

// create a new conversation with a supplied email and title
app.post('/create-conversation', async (req,res) => {
  const email = req.body.email;
  const title = req.body.title;
  const statementIds = [];
  await conversations.insertOne({userEmail:email,title:title,statementIds:statementIds});
  res.send({success:true,message:"New conversation created!"})
})

// retrieve conversations with a given email
app.get('/retrieve-conversations-email/:email', async (req,res) => {
  const email = req.params.email
  console.log(`Searching for conversations with email=${email}`);
  const convos = conversations.find({userEmail:email});
  const convoArray = await convos.toArray();
  res.send(convoArray);
})

// retrieve the conversation with the given id
app.get('/retrieve-conversations-id/:id', async (req,res) => {
  try
  {
    const id = new ObjectId(req.params.id);
    console.log(`Searching for conversations with id=${id}`);
    const convos = conversations.find({_id:id});
    const convoArray = await convos.toArray();
    console.log(convoArray);
    const success = convoArray.length > 0 ? true : false;
    res.send({success:success, convo:convoArray});
  } catch (error)
  {
    res.send({success:false, convo: '[]'});
  }
})

// update the conversation with the given id
app.post('/update-conversation', async (req,res) => {
  try {
    console.log(`req.body.convoID = ${req.body.convoID}`);
    console.log(`req.body.statementID = ${req.body.statementID}`);
    const convoID = new ObjectId(req.body.convoID);
    const statementID = new ObjectId(req.body.statementID);
    const filter = {_id: convoID};
    const pushCommand = {$push: {statementIds: statementID}};
    const updatedConvo = await conversations.updateOne(filter,pushCommand);
    const success = updatedConvo ? true : false
    res.send({success:success, message: "Conversation successfully updated!"});
  } catch (error) 
  {
    console.log(`An error occured while updating a conversation: ${error}`);
    res.send({success:false, convo:'[]'});
  }
})

app.post('/create-statement', async (req,res) => {
  try {
    const statementText = req.body.statementText;
    const result = await statements.insertOne({text: statementText});
    const statementId = result.insertedId;
    res.send({success:true, statementId: statementId});
  } catch (error)
  {
    console.log(`An error occured while creating a statement: ${error}`);
    res.send({success:false, statementId:''});
  }
})

app.listen(PORT,() => {
  console.log(`Listening on port ${PORT}...`);
})