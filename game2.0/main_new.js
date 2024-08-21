//const is used to declare variables that should not be reassigned after their initial value is set
const nextButton = document.getElementById('next-btn');
const startButton = document.getElementById('start-btn');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const questionImageElement = document.getElementById("question-img");
const answerButtonsElement = document.getElementById('answer-buttons');
let shuffledQuestions, currentQuestionIndex;

// for the timer of the game 
const timerElement = document.getElementById("timer");
let timerInterval;
const GAME_DURATION = 3 * 60 * 1000; // Game duration in milliseconds (3 minutes)

// to display marks of the game
let score = 0;

startButton.addEventListener('click', startGame);
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});

// Starts the game, shuffles questions, and begins the timer
function startGame() {
    console.log('Started');
    startButton.classList.add('hide');
    shuffledQuestions = questions.sort(() => Math.random() - 0.5); // Shuffle questions
    currentQuestionIndex = 0;
    questionContainerElement.classList.remove('hide');
    setNextQuestion();
    startTimer(); // Start the game timer
}

// Sets the next question in the quiz
function setNextQuestion() {
    resetState(); // Reset previous state
    showQuestion(shuffledQuestions[currentQuestionIndex]); // Show the next question
}

// Displays the current question and its answers
function showQuestion(question) {
    questionElement.innerText = question.question;
    questionImageElement.src = question.image;
    answerButtonsElement.innerHTML = ''; // Clear previous answers
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', () => selectAnswer(answer)); // Attach click event
        answerButtonsElement.appendChild(button);
    });
}

// Resets the state for the next question
function resetState() {
    clearStatusClass(document.body);
    nextButton.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

// Handles answer selection and updates the score
function selectAnswer(answer) {
    const correct = answer.correct;
    if (correct) {
        score++;
    }
    setStatusClass(document.body, correct);
    Array.from(answerButtonsElement.children).forEach(button => {
        const isCorrect = button.dataset.correct === 'true';
        setStatusClass(button, isCorrect);
    });
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide'); // Show next button if there are more questions
    } else {
        endGame(); // End the game if no more questions
    }
}

// Adds the correct or wrong status class to an element
function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

// Removes status classes from an element
function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

// Starts the timer and updates every second
function startTimer() {
    let timeRemaining = GAME_DURATION;
    updateTimerDisplay(timeRemaining);
    
    timerInterval = setInterval(() => {
        timeRemaining -= 1000; // Decrease by 1 second
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            endGame(); // End game when time runs out
        } else {
            updateTimerDisplay(timeRemaining);
        }
    }, 1000); // Update every second
}

// Updates the timer display with the remaining time
function updateTimerDisplay(timeRemaining) {
    const minutes = Math.floor(timeRemaining / 60000);
    const seconds = Math.floor((timeRemaining % 60000) / 1000);
    timerElement.innerText = `Time Remaining: ${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Ends the game, shows the final score and hides the game elements
function endGame() {
    console.log('Time is up!');
    questionContainerElement.classList.add('hide');
    startButton.classList.remove('hide');
    clearStatusClass(document.body);
    nextButton.classList.add('hide');
    startButton.classList.add('hide');
    timerElement.classList.add('hide');
    displayScore(); // Show the final score
}

// Displays the final score and a congratulatory message
function displayScore() {
    const messageElement = document.createElement('div');
    messageElement.classList.add('end-message');
    messageElement.innerText = `Congratulations! You did a great job!`;

    const totalQuestions = questions.length;
    const scoreElement = document.createElement('div');
    scoreElement.classList.add('score');
    scoreElement.innerText = `Your score: ${score}/${totalQuestions}`;
    document.querySelector('.container').appendChild(scoreElement);

    const container = document.querySelector('.container');
    container.appendChild(messageElement);
    container.appendChild(scoreElement);

    triggerConfetti(); // Show confetti effect
}

// Triggers a confetti effect at the end of the game
function triggerConfetti() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff'];
    confetti({
        particleCount: 200,
        spread: 360,
        startVelocity: 30,
        colors: colors,
        origin: { y: 0.6 },
        gravity: 0.6,
    });
}
