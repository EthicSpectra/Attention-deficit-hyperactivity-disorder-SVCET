let timeLeft = 45;
let inputCount = 0; // Track the number of inputs
const maxInputs = 40; // Maximum allowed inputs
const letters = ['P', 'B', 'D', 'Q', 'R'];
let lastLetter = '';
let pAppeared = 0; // Track how many times 'P' appears
let pCorrect = 0; // Track how many times 'P' was correctly input by the user
let pMissed = 0; // Track how many times 'P' was missed or incorrectly input
let currentLetter = ''; // Track the current letter displayed

// HTML elements
let timerElement = document.getElementById('timer');
let letterBox = document.getElementById('letter-box');
let inputBox = document.getElementById('input-box');
let pStatsElement = document.getElementById('p-stats'); // Real-time tracking window
let startBtn = document.getElementById('start-btn');

// Timer function (starts only after the start button is clicked)
let countdown;

// Function to start the test
function startTest() {
    startBtn.style.display = 'none'; // Hide the start button
    inputBox.disabled = false; // Enable input
    inputBox.focus(); // Auto-focus input box

    countdown = setInterval(() => {
        if (timeLeft <= 0 || inputCount >= maxInputs) {
            clearInterval(countdown);
            inputBox.disabled = true; // Disable input after time's up or inputs complete

            // Redirect to another page after the test ends
            window.location.href = "end.html"; // Replace "end.html" with your desired page
        } else {
            timerElement.textContent = timeLeft;
            timeLeft--;
        }
    }, 1000);

    // Update letter every second
    setInterval(() => {
        if (timeLeft > 0 && inputCount < maxInputs) {
            letterBox.textContent = getRandomLetter();
        }
    }, 1000);
}

// Function to get a random letter
function getRandomLetter() {
    let newLetter;
    do {
        newLetter = letters[Math.floor(Math.random() * letters.length)];
    } while (newLetter === lastLetter);
    lastLetter = newLetter;

    if (newLetter === 'P') {
        pAppeared++; // Increment 'P' appearance count
    }

    currentLetter = newLetter; // Keep track of the current letter
    updatePStats(); // Update the real-time tracking window
    return newLetter;
}

// Input event listener (capture on keystroke)
inputBox.addEventListener('input', (event) => {
    if (inputCount < maxInputs) {
        const userInput = event.target.value.toUpperCase(); // Capture the user input
        inputCount++; // Increment input count
        inputBox.value = ''; // Clear the input after each keystroke

        if (currentLetter === 'P') {
            if (userInput === 'P') {
                pCorrect++; // Increment correct 'P' input
            } else {
                pMissed++; // Increment missed or incorrect 'P' input
            }
        }

        updatePStats(); // Update the real-time tracking window
    }

    // Check if maximum inputs are reached
    if (inputCount >= maxInputs) {
        inputBox.disabled = true; // Disable input
        clearInterval(countdown); // Stop the timer
        window.location.href = "end.html"; // Redirect to another page
    }
});

// Function to update real-time tracking stats
function updatePStats() {
    pStatsElement.innerHTML = `
        <p>Number of times 'P' appeared: ${pAppeared}</p>
        <p>Correct 'P' inputs: ${pCorrect}</p>
        <p>Missed 'P' inputs: ${pMissed}</p>
    `;
}

// Start button event listener
startBtn.addEventListener('click', startTest);
