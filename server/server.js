// dependencies
const express = require('express');
const dotenv = require("dotenv");
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const app = express();
const PORT = 3001;


// middleware
app.use(cors());
app.use(express.json());
dotenv.config();
const apiKey = process.env.DG_KEY;

// database setup. Each user can have multiple conversations,
// and each conversation consists of multiple statements.
const uri = "mongodb+srv://edwardpraschifka:oZOVIOEhdtHg4ehN@bonsoir-cluster.2neujbs.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const database = client.db('bonsoir-db');
const conversations = database.collection('conversations');
const statements = database.collection('statements');

app.get("/apiKey", async (req, res) => {
  res.json({'apiKey':apiKey});
});

// create a new conversation with a supplied user email and 
// conversation title
app.post('/create-conversation', async (req,res) => {
  const email = req.body.email;
  const title = req.body.title;
  const statementIds = [];
  await conversations.insertOne({userEmail:email,title:title,statements:[]});
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
    console.log(`req.params.id=${req.params.id}`)
    const id = new ObjectId(req.params.id);
    console.log(`Searching for conversations with id=${id}`);
    const convo = await conversations.findOne({_id:id});
    console.log(convo);
    const success = convo ? true : false;
    res.send({success:success, convo:convo});
  } catch (error)
  {
    console.log(`Error encountered while 
                      retrieving conversation: ${error}`);
    res.send({success: false, convo:null});
  }
})

// update the conversation with id 'convoID' by adding the statement
// with id 'statementID'
app.post('/update-conversation', async (req,res) => {
  try {
    const convoID = new ObjectId(req.body.convoID);
    const statement = req.body.statement;
    const filter = {_id: convoID};
    console.log(`pushing a new statement ${JSON.stringify(statement)}
                   into the conversation with id ${convoID}`);
    const pushCommand = {$push: {statements: {text:statement,audio:'audio_file'}}};
    const updatedConvo = await conversations.updateOne(filter,pushCommand);
    console.log(`updatedConvo = ${JSON.stringify(updatedConvo)}`)
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