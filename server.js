const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))
//allows the access to the rest of the files (needed to access the js and css)

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));
//routing for the notes specific route(has to be before the wildcard so makes sure the wildcard doesn't override it)
app.get('/api/notes',(req,res)=>{res.sendFile(path.join(__dirname, '/db/db.json'));})

app.get('*',(req,res)=> res.sendFile(path.join(__dirname,'./public/index.html')))
//wild card routing to make sure that if any other route is put it'll lead back to home page


app.post('/api/notes',(req,res)=>{
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);

    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      
      id = uuidv4();

      // Variable for the object we will save
      const newNote = {
        title,
        text,
        id,
      };
      
      // Obtain existing reviews
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const notes = JSON.parse(data);
  
          // Add a new review
          notes.push(newNote);
  
          // Write updated reviews back to the file
          fs.writeFile(
            './db/db.json',
            JSON.stringify(notes, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated notes!')
          );
        }
      });
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error note not added');
    }
})


app.delete(`/api/notes/:id`,(req,res)=>{
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const notes = JSON.parse(data);

      notes.splice(notes.findIndex((notes)=>{notes.id == req.params}),1);

     // Write updated reviews back to the file
      fs.writeFile('./db/db.json',JSON.stringify(notes, null, 4),
        (writeErr) =>writeErr? console.error(writeErr): console.info('deleted the note')
      );
    }
  });
  const response = {
    status: 'success'
  };
  console.log(response);
  res.status(201).json(response);
})

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
//shows the local host link
