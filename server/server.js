// dependencies
import { ChatGPTAPI } from 'chatgpt';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb'

const app = express();
const PORT = 3001;
const elevenLabsKey = process.env.elevenLabsKey;
// const elevenLabsVoice = 'hsDNToeZAyHpjnC5X924'
const elevenLabsVoice = '21m00Tcm4TlvDq8ikWAM'
/* const systemMessage = `You are Bonsoir, a cheerful French tutor who helps
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
                      very strict about this! Try to be warm and friendly rather than cold 
                      and robotic. Your plans today are to go shopping,
                      walk on the beach and make dinner.` */
const systemMessage = `You are a friendly, warm assistant who answers
                      questions from the user and likes to have interesting
                      conversations! Keep your answers short and sweet.`

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
  return reply;
}

async function generateSpeech(script,voiceId,apiKey) {
  const url = 'https://api.elevenlabs.io/v1/text-to-speech/' + voiceId;
  const options = {
    method: 'POST',
    headers: {
      accept: 'audio/mpeg',
      'content-type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      model_id: "eleven_multilingual_v2",
      text: script,
      voice_settings:{"similarity_boost":1,"stability":1,"style":0,"use_speaker_boost":true}
    }),
    responseType: 'arraybuffer',
  };

  try {
    const speechDetails = await fetch(url, options);
    const audioBuffer = await speechDetails.arrayBuffer();
    const mp3Blob = new Uint8Array(audioBuffer);
    return mp3Blob;
  } catch (error) {
    console.error('Error:', error);
  }
}

// posts request body to chatgpt
app.post('/post-query', async (req,res) => {
  const query = req.body.query;
  console.log(`received a request with query=${query}.`)
  const parentMessageId = req.body.parentMessageId;
  console.log(`server-side: received query with id=${parentMessageId}`);
  const reply = await generateText(query,parentMessageId);
  const reply_audio = await generateSpeech(reply.text,elevenLabsVoice,elevenLabsKey)
  console.log(`sending back a response with id=${reply.parentMessageId}`)
  res.send({'text': reply.text, 'id':reply.parentMessageId, 
                  'audio': reply_audio});
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
  res.send({success:true,message:"New conversation created!",info:result.insertedId});
})

// retrieve conversations with a given email
app.get('/retrieve-conversations-email/:email', async (req,res) => {
  const email = req.params.email
  const convos = conversations.find({userEmail:email});
  const convoArray = await convos.toArray();
  res.send(convoArray);
})

// retrieve the conversation with the given id
app.get('/retrieve-conversations-id/:id', async (req,res) => {
  try
  {
    const id = new ObjectId(req.params.id);
    const convo = await conversations.findOne({_id:id});
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
    const text = req.body.statement.text;
    const messageId = req.body.messageId
    const filter = {_id: convoID};
    console.log(`convoID=${convoID},speaker=${speaker},text=${text},messageId=${messageId}`);
    const pushCommand = {$push: {statements: {speaker:speaker,text:text,messageId:messageId}}};
    const updatedConvo = await conversations.updateOne(filter,pushCommand);
    const success = updatedConvo ? true : false
    res.send({success:success, message: "Conversation successfully updated!"});
  } catch (error) 
  {
    console.log(`An error occured while updating a conversation: ${error}`);
    res.send({success:false, convo:'[]'});
  }
})

app.delete('/delete-conversation', async (req,res) => {
  try {
    const id = new ObjectId(req.body.id);
    const result = conversations.deleteOne({_id:id});
    const success = result ? true : false;
    res.send({success:success, message: "Conversation successfully updated!"});
  } catch (error)
  {
    console.log(`An error occured while deleting a conversation: ${error}`);
    res.send({success:false, message: "An error occured while deleting a conversation."});
  
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