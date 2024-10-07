let currentLetter;
let letterCounts = { 'P': 0, 'B': 0, 'D': 0, 'Q': 0, 'R': 0 };
let correctCounts = { 'P': 0, 'B': 0, 'D': 0, 'Q': 0, 'R': 0 };
let wrongCounts = { 'P': 0, 'B': 0, 'D': 0, 'Q': 0, 'R': 0 };
let inputCounter = 0;
let currentSetIndex = 0; // Index for the current letter set
let inputsPerSet = 50;
let breakDuration = 15000; // 15 seconds
let timerDuration = 45; // 45 seconds
let timer;
let timerRunning = false;
let letters = ['P', 'B', 'D', 'Q', 'R']; // Array of letters
let currentSequence = []; // Holds the current random sequence

function startTest() {
  resetCounts();
  inputCounter = 0;
  document.getElementById('start-button').style.display = 'none'; // Hide the start button
  currentSetIndex = 0; // Reset the set index
  timerDuration = 45; // Reset timer duration
  timerRunning = true;

  // Start the timer
  timer = setInterval(updateTimer, 1000);

  nextSet(); // Start the first set
}

function nextSet() {
  if (currentSetIndex >= letters.length) {
    alert('Test completed! Check results.');
    clearInterval(timer);
    timerRunning = false;
    return;
  }

  generateRandomSequence();
  displayNextLetter();
}

function generateRandomSequence() {
  currentSequence = []; // Reset current sequence for the new stage
  let currentLetter = letters[currentSetIndex]; // Get the current letter

  for (let i = 0; i < inputsPerSet; i++) {
    let randomLetter;
    do {
      randomLetter = letters[Math.floor(Math.random() * letters.length)];
    } while (currentSequence[i - 1] === randomLetter); // Ensure no consecutive letters are the same

    currentSequence.push(randomLetter);
  }
}

function displayNextLetter() {
  if (inputCounter >= currentSequence.length) {
    // After the last letter of the set, start break before next set
    setTimeout(() => {
      currentSetIndex++;
      nextSet(); // Move to the next letter set after the break
    }, breakDuration);
    return; // Stop if all letters shown
  }

  currentLetter = currentSequence[inputCounter];
  document.getElementById('letter-display').innerText = currentLetter;
  letterCounts[currentLetter]++;

  // Update results card
  updateRealTimeResults();

  inputCounter++;
  setTimeout(displayNextLetter, 1000); // Show next letter after 1 second
}

function updateRealTimeResults() {
  const resultElements = document.querySelectorAll('#real-time-results p');
  resultElements.forEach((element) => {
    const letter = element.innerText.split(' ')[1];
    element.innerText = `Letter ${letter} - Shown: ${letterCounts[letter]}, Correct: ${correctCounts[letter]}, Wrong: ${wrongCounts[letter]}`;
  });
}

function updateTimer() {
  const timerElement = document.getElementById('timer');

  if (timerDuration <= 0) {
    clearInterval(timer);
    timerRunning = false;
    alert('Time is up!');
    return;
  }

  const minutes = Math.floor(timerDuration / 60);
  const seconds = timerDuration % 60;

  timerElement.innerText = `Time: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  timerDuration--;
}

function resetCounts() {
  for (let letter in letterCounts) {
    letterCounts[letter] = 0;
    correctCounts[letter] = 0;
    wrongCounts[letter] = 0; // Reset counts for the current test
  }
}

function downloadResults() {
  let results = 'Letter, Shown, Correct, Wrong\n';
  for (let letter in letterCounts) {
    results += `${letter}, ${letterCounts[letter]}, ${correctCounts[letter]}, ${wrongCounts[letter]}\n`;
  }

  const blob = new Blob([results], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'results.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Input handling
document.getElementById('input-field').addEventListener('input', function(event) {
  const inputField = document.getElementById('input-field');
  const userInput = inputField.value.toUpperCase();

  if (userInput === currentLetter) {
    correctCounts[currentLetter]++;
  } else if (userInput !== '') {
    wrongCounts[currentLetter]++;
  }

  // Update results after each input
  updateRealTimeResults();
  inputField.value = ''; // Clear the input

  // Proceed to next letter if input is submitted
  if (userInput !== '') {
    if (inputCounter < currentSequence.length) {
      displayNextLetter(); // Move to the next letter
    }
  }
});
