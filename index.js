const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const UserSchema = require('./schema.js');
require('dotenv').config();

const mongoURL = process.env.DB_URL;

const app = express();
const port = 3010;

mongoose.connect(mongoURL)
.then(() => console.log('Successfully connected to the database'))
.catch((err) => console.log('Error connecting to the database', err));

app.use(express.static('static'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.post('/login', async (req, res) => {
  try{
    const {mail, password} = req.body;

    if(!mail || !password){
      return res.status(400).json({ message:'All fields are required'})
    }

    const checkIfUserExists = await UserSchema.findOne( {email:mail})
    // console.log(checkIfUserExists)
    if(!checkIfUserExists){
      return res.status(404).json({ message: 'User not found'})
    }
    const passwordMatch = await bcrypt.compare(password, checkIfUserExists.password)
    if(passwordMatch){
      return res.status(200).json({message: 'Successfully logged in'})
    }
    else{
      return res.status(400).json({ message: "Invalid Credentials... Try Again"})
    }
  }

  catch(err){
    return res.status(500).json({message: 'Internal Server Error', error:err.message})
  }
  
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
