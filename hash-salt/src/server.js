const express = require('express');
const bcrypt = require('bcrypt');
const fs = require('fs');

const app = express();

app.get('/', (req, res) => {
   const username = req.query.username;
   const password = req.query.password;
   const write = req.query.write;

   if (write === 'true') {
       const salt = bcrypt.genSaltSync(10);
       const hash = bcrypt.hashSync(password, salt);

       fs.writeFileSync('saltsAndHashes.csv', `${username},${salt},${hash}`);
       res.send('Done writing to file.');
   } else {
       const data = fs.readFileSync('saltsAndHashes.csv', 'utf8');
       const [fileUsername, fileSalt, fileHash] = data.split(',');

       const calculatedHash = bcrypt.hashSync(password, fileSalt);
       
       const trimmedFileHash = fileHash.trim();

       console.log(`Hash from file: ${trimmedFileHash}`);
       console.log(`Calculated Hash: ${calculatedHash}`);

       if (trimmedFileHash === calculatedHash) {
           console.log('Hashes match!');
       } else {
           console.log('Hashes do not match');
       }
   }
});

app.listen(3000, () => {
   console.log('Server is up and running on port 3000');
});