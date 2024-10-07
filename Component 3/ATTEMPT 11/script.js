let letters = ['P', 'B', 'D', 'Q', 'R'];
let currentLetter = '';
let correctCount = 0;
let wrongCount = 0;
let unattendedPCount = 0;
let timeLeft = 45;
let timerInterval;
let letterInterval;
let totalInputs = 40;
let inputCount = 0;
let letterOccurrences = [];
let pCount = 0;
let remainingPCount = 40;
let awaitingInput = false;

function startTest() {
    document.getElementById('start-button').style.display = 'none';
    document.getElementById('user-input').focus();
    startTimer();
    startLetterInterval();  // Start changing letters every second
}

function startTimer() {
    timerInterval = setInterval(function () {
        if (timeLeft <= 0 || inputCount >= totalInputs) {
            clearInterval(timerInterval);
            clearInterval(letterInterval);  // Stop changing letters when the test ends
            endTest();
        } else {
            document.getElementById('timer').innerText = timeLeft;
            timeLeft--;
        }
    }, 1000);
}

function startLetterInterval() {
    // Change the letter every second
    letterInterval = setInterval(function () {
        displayLetter();
    }, 1000);
}

function displayLetter() {
    if (inputCount >= totalInputs) return;

    // Handle unattended 'P' letters
    if (awaitingInput && currentLetter === 'P') {
        unattendedPCount++;
        document.getElementById('unattended-p-count').innerText = unattendedPCount;
        document.getElementById('monitor-unattended-p').innerText = unattendedPCount;
    }

    let newLetter;

    // Generate a new random letter that is different from the last one
    do {
        if (currentLetter === 'P') {
            // If the current letter is 'P', choose from the other letters
            newLetter = letters.filter(letter => letter !== 'P')[Math.floor(Math.random() * 4)];
        } else {
            // Choose a random letter, ensuring it's not the same as the current letter
            newLetter = letters[Math.floor(Math.random() * letters.length)];
        }
    } while (newLetter === currentLetter);  // Ensure the letter is different from the current one

    currentLetter = newLetter;

    // Ensure we are still showing enough 'P' letters
    if (pCount < 40 && Math.random() > 0.5) {
        currentLetter = 'P';  // Force a 'P' with a probability
        pCount++;
        remainingPCount--;
    }

    awaitingInput = true;  // Awaiting input from the user
    letterOccurrences.push(currentLetter);
    document.getElementById('letter-box').innerText = currentLetter;

    // Update Real-Time Monitoring Screen
    document.getElementById('monitor-current-letter').innerText = currentLetter;
    document.getElementById('monitor-p-count').innerText = remainingPCount;
    document.getElementById('monitor-input-remaining').innerText = totalInputs - inputCount;
}



document.getElementById('user-input').addEventListener('input', function () {
    const input = this.value.toUpperCase();

    // Check if input matches the current letter
    if (input === currentLetter) {
        correctCount++;
        document.getElementById('correct-count').innerText = correctCount;
        document.getElementById('monitor-correct').innerText = correctCount;
    } else {
        wrongCount++;
        document.getElementById('wrong-count').innerText = wrongCount;
        document.getElementById('monitor-wrong').innerText = wrongCount;
    }

    // Clear the input and update counts
    inputCount++;
    document.getElementById('input-count').innerText = inputCount;
    awaitingInput = false;  // Reset waiting input state
    this.value = '';  // Clear the input field
});

function endTest() {
    document.getElementById('letter-box').innerText = 'Test Complete';
    document.getElementById('user-input').disabled = true;
    document.getElementById('start-button').style.display = 'block';
}
