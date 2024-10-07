const letters = ['P', 'B', 'D', 'Q', 'R'];
let currentLetter = '';
let timerInterval, letterInterval;
let letterCount = 0, correctCount = 0, wrongCount = 0;
let set = 1;
let setLetter = 'P';
let results = [];
let timeLeft = 300;  // 5 minutes in seconds

// Function to start the test
function startTest() {
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('inputBox').focus();
    startTimer();
    startLetters();
}

// Function to start the timer
function startTimer() {
    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endTest();
        } else {
            timeLeft--;
            document.getElementById('timer').textContent = formatTime(timeLeft);
        }
    }, 1000);
}

// Function to format time as mm:ss
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Function to start the random letter sequence
function startLetters() {
    letterInterval = setInterval(() => {
        let nextLetter;
        do {
            nextLetter = letters[Math.floor(Math.random() * letters.length)];
        } while (nextLetter === currentLetter);
        currentLetter = nextLetter;
        document.getElementById('letterBox').textContent = currentLetter;
        letterCount++;
        document.getElementById('letterCount').textContent = letterCount;
        
        // Handle set letter focus
        if (letterCount % 50 === 0) {
            clearInterval(letterInterval);
            set++;
            if (set <= 5) {
                setLetter = letters[set - 1];
                setTimeout(startLetters, 15000); // 15 second break
            } else {
                endTest();
            }
        }
    }, 1000);
}

// Function to check user input
function checkInput() {
    const input = document.getElementById('inputBox').value.toUpperCase();
    document.getElementById('inputBox').value = '';  // Clear input box
    if (input === currentLetter) {
        correctCount++;
        document.getElementById('correctCount').textContent = correctCount;
    } else {
        wrongCount++;
        document.getElementById('wrongCount').textContent = wrongCount;
    }
    // Log the result
    results.push(`Letter: ${currentLetter}, Input: ${input}, ${input === currentLetter ? 'Correct' : 'Wrong'}`);
}

// Function to end the test
function endTest() {
    clearInterval(timerInterval);
    clearInterval(letterInterval);
    document.getElementById('downloadButton').style.display = 'inline';
}

// Function to download results
function downloadResults() {
    const resultText = `Results:\nCorrect: ${correctCount}\nWrong: ${wrongCount}\nDetails:\n${results.join('\n')}`;
    const blob = new Blob([resultText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'results.txt';
    link.click();
}
