
const fs = require('fs');

const _ = require('underscore');

const express = require('express');
const app = express();

app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


  app.get('/highscores', (req, res) => {
   
   
    let data = fs.readFileSync('./highscores.json');
    let highscoresData = JSON.parse(data);
    
  
    highscoresData = _.sortBy(highscoresData, score => -score.score);
  
    console.log(highscoresData);
    res.send(highscoresData);
  });




  function updateHighscore(name, score, res) {
    
    fs.readFile('./highscores.json', (err, data) => {
      if (err) { 
      
        res.status(500).send('Error reading high scores');
      } else {
       
        let existingData = JSON.parse(data);
  
     
        existingData.push({ name, score });
  
       
        existingData = _.sortBy(existingData, score => -score.score).splice(0, 5);
  
      
        fs.writeFile('./highscores.json', JSON.stringify(existingData), (err) => {
          if (err) { 
      
            res.status(500).send('Error writing high scores');
          } else {
            res.send('High scores updated');
          }
        }); 
      }
    });
  };

  app.post('/highscores', (req, res) => {
    const { name, score } = req.body;
  
    // Update the highscore data
    updateHighscore(name, score, res);
  });

// Start the server on port 4000
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
