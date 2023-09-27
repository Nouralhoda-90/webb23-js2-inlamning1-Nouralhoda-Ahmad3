
import _ from 'underscore';

const url = 'http://localhost:4000/highscores';

const handButtons = document.querySelectorAll('.hand-button');
const playerNameInput = document.querySelector('#player-name-input');
const playerNameDisplay = document.querySelector('#player-name');
const highScoresList = document.querySelector('#high-scores');
const scoreElement = document.querySelector('#score');
const playerHandElement = document.querySelector('#player-hand');
const computerHandElement = document.querySelector('#computer-hand');
const resultElement = document.querySelector('#result');
const playerForm = document.querySelector('#player-form');

let playerScore = 0;
let playerName = '';
let highScores = [];
let isGameStarted = false;

// Function to start the game
function startGame() {
  playerName = playerNameInput.value.trim();
  if (playerName) {
    playerNameDisplay.textContent = playerName;
    playerNameInput.value = '';
    playerForm.style.display = 'none';
    handButtons.forEach((button) => {
      button.disabled = false;
    });
    isGameStarted = true;
  } else {
    alert('Please enter your name to start the game.');
  }
}

// Function to reset the game
function resetGame() {
  playerScore = 0;
  scoreElement.textContent = `Score: ${playerScore}`;
  playerForm.style.display = 'block';
  playerNameDisplay.textContent = '';
  
  handButtons.forEach((button) => {
    button.disabled = true;
  });
  isGameStarted = false;
}

// Function to get the computer's hand
function getComputerHand() {
  const hands = ['rock', 'paper', 'scissors'];
  const randomIndex = Math.floor(Math.random() * hands.length);
  return hands[randomIndex];
}

// Function to determine the game result
function getResult(playerHand, computerHand) {
  if (playerHand === computerHand) {
    return 'tie';
  } else if (
    (playerHand === 'rock' && computerHand === 'scissors') ||
    (playerHand === 'paper' && computerHand === 'rock') ||
    (playerHand === 'scissors' && computerHand === 'paper')
  ) {
    return 'player';
  } else {
    return 'computer';
  }
}

// Function to update the player's score
async function updateScore(result) {
  if (result === 'player') {
    playerScore++;
    scoreElement.textContent = `Score: ${playerScore}`;
  } else if (result === 'computer') {
    const topFiveScores = highScores.slice(0, 5);
    const lowestTopScore = topFiveScores[topFiveScores.length - 1];
    if (!lowestTopScore || playerScore > lowestTopScore.score) {
      await saveHighScores(playerName, playerScore);
      await fetchHighScores();
      
     
      resetGame();
    } else {
      resetGame();
    }
  }
}


// Function to save the high scores to the server
async function saveHighScores(name, score) {
  const data = { name, score };
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    await fetch(url, options);
  } catch (error) {
    console.error('Error saving high scores:', error);
  }
}

// Function to fetch and display high scores from the server
async function fetchHighScores() {
  try {
    const response = await fetch(url);
    if (response.ok) {
      highScores = await response.json();
      renderHighScores();
    } else {
      throw new Error('Failed to fetch high scores');
    }
  } catch (error) {
    console.error('Error retrieving high scores:', error);
  }
}

// Function to render the list of high scores
function renderHighScores() {
  highScoresList.innerHTML = '';

  for (const score of highScores) {
    const listItem = document.createElement('li');
    listItem.textContent = `${score.name}: ${score.score}`;
    highScoresList.appendChild(listItem);
  }
}



 fetchHighScores();

 


  handButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (isGameStarted) {
        const playerHand = button.id.toLowerCase();
        const computerHand = getComputerHand();
        const result = getResult(playerHand, computerHand);
        updateScore(result);
        updateUI(playerHand, computerHand, result);
      } else {
        alert('Please enter your name and start the game.');
      }
    });
  });


function updateUI(playerHand = '', computerHand = '', result = '') {
  playerHandElement.textContent = `Your Choice: ${playerHand}`;
  computerHandElement.textContent = `Computer's Choice: ${computerHand}`;
  if (result === 'tie') {
    resultElement.textContent = 'Tie';
  } else if (result === 'player') {
    resultElement.textContent = 'You win!';
  } else if (result === 'computer') {
    resultElement.textContent = 'Computer wins!';
  }
}

// Event listener for the player name form submission
playerForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent form submission
  startGame();
});

// Render high scores on page load
renderHighScores();
