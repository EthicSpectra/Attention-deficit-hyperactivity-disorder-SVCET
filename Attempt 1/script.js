document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();  // Prevent page refresh

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simulating login check
    if (username === 'admin' && password === 'password') {
        window.location.href = 'home.html';  // Redirect to the home page
    } else {
        document.getElementById('message').textContent = 'Invalid username or password';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const exitButton = document.getElementById('exitButton');
    const testScreen = document.getElementById('testScreen');
    const startScreen = document.getElementById('startScreen');
    const letterDisplay = document.getElementById('letterDisplay');
    const userInput = document.getElementById('userInput');
    const timerDisplay = document.getElementById('timer');
    const message = document.getElementById('message');

    const letters = ['p', 'b', 'd', 'q', 'r'];
    const totalInputs = 200;
    const inputsPerPhase = 50;
    const breakDuration = 30; // seconds
    const totalDuration = 300; // 5 minutes in seconds

    let currentInput = 0;
    let currentPhase = 0;
    let timer = totalDuration;
    let intervalId;

    startButton.addEventListener('click', startTest);
    exitButton.addEventListener('click', () => {
        window.location.href = 'home.html';
    });

    userInput.addEventListener('keyup', handleInput);

    function startTest() {
        startScreen.classList.add('hidden');
        testScreen.classList.remove('hidden');
        userInput.focus();
        displayNextLetter();
        intervalId = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        if (timer <= 0) {
            endTest();
            return;
        }
        timer--;
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        timerDisplay.textContent = `${pad(minutes)}:${pad(seconds)}`;
    }

    function pad(number) {
        return number < 10 ? '0' + number : number;
    }

    function displayNextLetter() {
        if (currentInput >= totalInputs) {
            endTest();
            return;
        }

        // Check if we need to start a break
        if (currentInput > 0 && currentInput % inputsPerPhase === 0) {
            currentPhase++;
            showBreak();
            return;
        }

        const randomLetter = letters[Math.floor(Math.random() * letters.length)];
        letterDisplay.textContent = randomLetter.toUpperCase();
        userInput.value = '';
        userInput.focus();
    }

    function handleInput(e) {
        const expectedLetter = letterDisplay.textContent.toLowerCase();
        const inputLetter = e.target.value.toLowerCase();

        if (inputLetter === expectedLetter) {
            currentInput++;
            displayNextLetter();
        } else if (inputLetter.length === 1) {
            // Optional: Provide feedback for incorrect input
            e.target.value = '';
        }
    }

    function showBreak() {
        letterDisplay.textContent = 'Break';
        userInput.classList.add('hidden');
        message.classList.remove('hidden');
        message.textContent = `Take a 30-second break.`;

        setTimeout(() => {
            message.classList.add('hidden');
            userInput.classList.remove('hidden');
            displayNextLetter();
        }, breakDuration * 1000);
    }

    function endTest() {
        clearInterval(intervalId);
        testScreen.classList.add('hidden');
        message.classList.remove('hidden');
        message.textContent = 'Test Completed!';
        // Optionally, redirect to results page or home
    }
});
