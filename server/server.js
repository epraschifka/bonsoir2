// dependencies
import { ChatGPTAPI } from 'chatgpt';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb'

const app = express();
const PORT = 3001;
const systemMessage = `You are Bonsoir, a cheerful French tutor who helps
                      french learners practice speaking and listening to French
                      by simulating authentic, real conversations in French.
                      Be as concise in your responses as possible. If you are
                      generating a list, do not have too many items. Do not
                      ask the user if they need help with anything, as this
                      sounds unnatural - remember that your job is to simulate
                      a conversation with a french person on the street, so
                      ask about their day, their hobbies, or anything else.
                      If asked these questions, come up with responses
                      as if you are a human. If something they say
                      doesn't make sense or sounds ungrammatical,
                      either correct them or ask for clarification - be 
                      very strict about this! Try to be warm, friendly and intimate rather than cold 
                      and robotic. Your plans today are to go shopping,
                      walk on the beach and make dinner.`

const api = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY,
  systemMessage: systemMessage             
})

// middleware
app.use(cors());
app.use(express.json());
dotenv.config();
const apiKey = process.env.DG_KEY;

// each user can have multiple conversations, and
// each conversation can consist of multiple statements
const uri = "mongodb+srv://edwardpraschifka:oZOVIOEhdtHg4ehN@bonsoir-cluster.2neujbs.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const database = client.db('bonsoir-db');
const conversations = database.collection('conversations');
const statements = database.collection('statements');

// post query to chatgpt, return response
async function generateText(query,parentMessageId) {
  const reply = await api.sendMessage(query, {
    parentMessageId: parentMessageId,
    systemMessage: systemMessage
  });

  console.log(`Received query '${query}', sending back
                  response ${reply.text}`);
  return reply;
}

// posts request body to chatgpt
app.post('/post-query', async (req,res) => {
  const query = req.body.query;
  const parentMessageId = req.body.parentMessageId;
  const maleVoiceID = "z5QwUJ8lCPK64PB6okBk";
  const femaleVoiceID = "hsDNToeZAyHpjnC5X924";
  const apiKey = '7893e3f397a96eac30deba97f42ab4f8'
  const reply = await generateText(query,parentMessageId);
  console.log(`reply = ${reply}`);
  // const reply_text = reply.text;
  // const reply_audio = await generateSpeech(reply_text,femaleVoiceID,apiKey);
  // const myAudio = Array.from(reply_audio);
  // console.log(`Sending back a response with myText=${reply} and myAudio=${reply_audio}`);
  res.send({'myText': reply.text});
});

// get deepgram api key
app.get("/apiKey", async (req, res) => {
  res.json({'apiKey':apiKey});
});

// create a new conversation with a supplied user email and 
// conversation title
app.post('/create-conversation', async (req,res) => {
  const email = req.body.email;
  const title = req.body.title;
  const statementIds = [];
  const result = await conversations.insertOne({userEmail:email,title:title,statements:[]});
  console.log(result);
  res.send({success:true,message:"New conversation created!",info:result.insertedId});
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
    const speaker = req.body.speaker;
    const statement = req.body.statement;
    const filter = {_id: convoID};
    console.log(`pushing a new statement ${JSON.stringify(statement)}
                   into the conversation with id ${convoID}`);
    const pushCommand = {$push: {statements: {text:statement,speaker:speaker,audio:'audio_file'}}};
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