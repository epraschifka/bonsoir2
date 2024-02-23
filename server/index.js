// dependencies
import 'dotenv/config';
import { ChatGPTAPI } from 'chatgpt';
import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';

const app = express();
const PORT = 3000;
const elevenLabsKey = process.env.ELEVENLABS_KEY;
const elevenLabsVoice = '21m00Tcm4TlvDq8ikWAM'
const systemMessage = `You are a friendly, warm assistant who answers
                      questions from the user and likes to have interesting
                      conversations! Keep your answers short and sweet.`

const api = new ChatGPTAPI({
  apiKey: process.env.OPENAI_KEY,
  systemMessage: systemMessage             
})

app.use(express.json());
app.use(cors());
const apiKey = process.env.DEEPGRAM_KEY;

// each user can have multiple conversations, and
// each conversation can consist of multiple statements
const client = new MongoClient(process.env.MONGO_URI);
const database = client.db('bonsoir-db');
const conversations = database.collection('conversations');

function getTime()
{
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const time = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} 
                               ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return time;
  }

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
      accept: 'audio/mp4',
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

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

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
  const result = await conversations.insertOne({userEmail:email,title:title,statements:[]});
  const filter = {_id: result.insertedId};
  const text = `Press the button below to start speaking.
                Speak clearly and try not to pause between 
                words for the best experience. If your speech is transcribed but you
                don't hear a confirmation ding, try repeating your statement. Have fun!`
  const pushCommand = {$push: {statements: {speaker:'Bonsoir',text:text,messageId:'#',time:getTime()}}};
  await conversations.updateOne(filter,pushCommand);

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
    const time = getTime();
    const messageId = req.body.messageId
    const filter = {_id: convoID};
    const pushCommand = {$push: {statements: {speaker:speaker,text:text,messageId:messageId,time:time}}};
    const updatedConvo = await conversations.updateOne(filter,pushCommand);
    const success = updatedConvo ? true : false
    res.send({success:success, message: "Conversation successfully updated!"});
  } catch (error) 
  {
    console.log(`An error occured while updating a conversation: ${error}`);
    res.send({success:false, convo:'[]'});
  }
})

app.put('/rename-conversation', async (req,res) => {
  try {
    const id = new ObjectId(req.body.id);
    const title = req.body.title;
    const result = await conversations.updateOne({_id:id},{$set:{title:title}});
    const success = result ? true : false;
    res.send({success:success, message: "Conversation successfully updated!"});
  } catch (error)
  {
    console.log(`An error occured while renaming a conversation: ${error}`);
    res.send({success:false, message: "An error occured while renaming a conversation."});
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

app.listen(PORT,() => {
  console.log(`Listening on port ${PORT}...`);
})