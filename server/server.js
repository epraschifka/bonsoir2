const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

app.post('/login', (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username,password);
})

app.listen(PORT,() => {
    console.log(`Server listening on port ${PORT}...`);
})