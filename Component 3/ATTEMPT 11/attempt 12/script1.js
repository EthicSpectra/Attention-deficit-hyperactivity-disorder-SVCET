let timeLeft = 45;
let inputCount = 0; // Track the number of inputs
const maxInputs = 40; // Maximum allowed inputs
const letters = ['P', 'B', 'D', 'Q', 'R'];
let lastLetter = '';
let secondLastLetter = ''; // To track the second last letter
let pAppeared = 0; // Track how many times 'P' appears
let pCorrect = 0; // Track how many times 'P' was correctly input by the user
let pMissed = 0; // Track how many times 'P' was missed or incorrectly input
let wrongKeyCount = 0; // Track how many wrong keys are pressed
let currentLetter = ''; // Track the current letter displayed
const totalP = 40; // Desired number of "P"s to appear
const letterChangeInterval = 1125; // Fixed interval for letter changes (in milliseconds)
let countdown;
let letterChange; // For letter interval
let nextPageButtonVisible = false; // Flag to track if the next page button is visible

// HTML elements
let timerElement = document.getElementById('timer');
let letterBox = document.getElementById('letter-box');
let inputBox = document.getElementById('input-box');
let pStatsElement = document.getElementById('p-stats'); // Real-time tracking window
let startBtn = document.getElementById('start-btn');
let nextPageBtn = document.getElementById('next-page-btn'); // Button to go to next page (hidden by default)

// Function to start the test
function startTest() {
    startBtn.style.display = 'none'; // Hide the start button
    inputBox.disabled = false; // Enable input
    inputBox.focus(); // Auto-focus input box

    // Start countdown
    countdown = setInterval(() => {
        if (timeLeft <= 0 || inputCount >= maxInputs) {
            clearInterval(countdown);
            clearInterval(letterChange);
            inputBox.disabled = true; // Disable input after time's up or inputs complete
            showNextPageButton(); // Show button to go to next page
        } else {
            timerElement.textContent = timeLeft;
            timeLeft--;
        }
    }, 1000);

    // Start showing letters at a fixed interval
    letterChange = setInterval(() => {
        if (timeLeft > 0 && inputCount < maxInputs) {
            letterBox.textContent = getRandomLetter();
        }
    }, letterChangeInterval);
}

// Function to get a random letter, ensuring "P" appears 40 times in total
function getRandomLetter() {
    let newLetter;

    // Ensure "P" appears exactly 40 times during the 45 seconds
    if (pAppeared < totalP) {
        if (Math.random() < (totalP - pAppeared) / (maxInputs - inputCount) && lastLetter !== 'P' && secondLastLetter !== 'P') {
            newLetter = 'P'; // Make "P" appear more frequently
        } else {
            do {
                newLetter = letters[Math.floor(Math.random() * letters.length)];
            } while (newLetter === lastLetter || (lastLetter === 'P' && secondLastLetter === 'P' && newLetter === 'P'));
        }
    } else {
        // If we've already shown 'P' 40 times, pick randomly from the other letters
        do {
            newLetter = letters[Math.floor(Math.random() * letters.length)];
        } while (newLetter === lastLetter);
    }

    // Update the tracking of the last two letters
    secondLastLetter = lastLetter;
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
                wrongKeyCount++; // Increment wrong key count if input is not 'P'
            }
        } else if (userInput !== currentLetter) {
            wrongKeyCount++; // Increment wrong key count for any incorrect input
        }

        updatePStats(); // Update the real-time tracking window
    }

    // Check if maximum inputs are reached
    if (inputCount >= maxInputs) {
        inputBox.disabled = true; // Disable input
        clearInterval(countdown); // Stop the timer
        clearInterval(letterChange); // Stop the letters from changing
        showNextPageButton(); // Show the button to go to the next page
    }
});

// Function to update real-time tracking stats
function updatePStats() {
    pStatsElement.innerHTML = `
        <p>Number of times 'P' appeared: ${pAppeared}</p>
        <p>Correct 'P' inputs: ${pCorrect}</p>
        <p>Missed 'P' inputs: ${pMissed}</p>
        <p>Wrong keys pressed: ${wrongKeyCount}</p>
    `;
}

// Function to show the button to proceed to the next page
function showNextPageButton() {
    if (!nextPageButtonVisible) {
        nextPageBtn.style.display = 'block'; // Show the button
        nextPageButtonVisible = true;
    }
}

// Start button event listener
startBtn.addEventListener('click', startTest);
