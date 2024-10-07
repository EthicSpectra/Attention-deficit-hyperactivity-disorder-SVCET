const sequence = ['p', 'b', 'd', 'q', 'r'];
let currentSet = 0;  // Tracks which set we are in (0: p, 1: b, ...)
let displayCount = 0;
let previousLetter = '';
let inputCount = 0;
let maxInputs = 50;
let totalInputs = 200;

// Object to track correct and wrong counts for each letter
let letterStats = {
  p: { correct: 0, wrong: 0, shown: 0 },
  b: { correct: 0, wrong: 0, shown: 0 },
  d: { correct: 0, wrong: 0, shown: 0 },
  q: { correct: 0, wrong: 0, shown: 0 },
  r: { correct: 0, wrong: 0, shown: 0 }
};

const timerEl = document.getElementById('timer');
const letterEl = document.getElementById('letter-display');
const inputField = document.getElementById('input-field');
const startButton = document.getElementById('start-button');
const resultsDiv = document.getElementById('results');

// Timer logic
let totalTime = 300;  // 5 minutes in seconds
let intervalId;

function startTimer() {
  intervalId = setInterval(() => {
    if (totalTime > 0) {
      totalTime--;
      const minutes = Math.floor(totalTime / 60);
      const seconds = totalTime % 60;
      timerEl.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else {
      clearInterval(intervalId);
      showResults();
    }
  }, 1000);
}

// Random letter generation logic
function getRandomLetter() {
  let randomLetter;
  do {
    randomLetter = sequence[Math.floor(Math.random() * sequence.length)];
  } while (randomLetter === previousLetter);
  previousLetter = randomLetter;
  return randomLetter;
}

function startLetterSequence() {
  let letterIntervalId = setInterval(() => {
    if (inputCount >= maxInputs || totalInputs <= 0) {
      clearInterval(letterIntervalId);
      if (totalInputs > 0) {
        takeBreak();
      } else {
        showResults();
      }
    } else {
      const letter = getRandomLetter();
      letterEl.textContent = letter;
      letterStats[letter].shown++;  // Increment shown count for the letter
      inputCount++;
    }
  }, 1000);
}

// Input handling
inputField.addEventListener('keyup', (event) => {
  const userInput = event.key.toLowerCase();  // Capture key press
  const currentLetter = letterEl.textContent.toLowerCase();

  if (sequence.includes(userInput)) {  // Only process valid inputs
    if (userInput === currentLetter) {
      letterStats[userInput].correct++;  // Correct input for the current letter
    } else {
      letterStats[currentLetter].wrong++;  // Wrong input, count against the shown letter
    }

    // Clear the input after processing
    inputField.value = '';
  }
});

function takeBreak() {
  letterEl.textContent = "Break...";
  setTimeout(() => {
    currentSet++;
    inputCount = 0;
    startLetterSequence();
  }, 15000);
}

function showResults() {
  clearInterval(intervalId);
  letterEl.textContent = "Test Complete!";
  
  // Generate and display results for each letter
  let resultsHtml = '';
  sequence.forEach(letter => {
    const stats = letterStats[letter];
    resultsHtml += `<p>Letter ${letter.toUpperCase()} - Shown: ${stats.shown}, Correct: ${stats.correct}, Wrong: ${stats.wrong}</p>`;
  });
  
  resultsDiv.innerHTML = resultsHtml + '<button onclick="downloadResults()">Download Results</button>';
  resultsDiv.style.display = 'block';
}

// Download results as text file
function downloadResults() {
  let resultsText = '';
  sequence.forEach(letter => {
    const stats = letterStats[letter];
    resultsText += `Letter ${letter.toUpperCase()}:\n  Shown: ${stats.shown}\n  Correct: ${stats.correct}\n  Wrong: ${stats.wrong}\n\n`;
  });

  const blob = new Blob([resultsText], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'results.txt';
  link.click();
}

// Start everything
function startTest() {
  startButton.style.display = 'none';  // Hide start button
  timerEl.style.display = 'block';     // Show timer
  letterEl.style.display = 'block';    // Show letter display
  inputField.style.display = 'block';  // Show input field
  inputField.focus();                  // Focus on input field

  // Start the test process
  startTimer();
  startLetterSequence();
}

startButton.addEventListener('click', startTest);
