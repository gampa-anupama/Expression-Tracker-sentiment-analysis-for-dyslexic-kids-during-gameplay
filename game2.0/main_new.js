const nextButton = document.getElementById("next-btn");
const startButton = document.getElementById("start-btn");
const questionContainerElement = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const questionImageElement = document.getElementById("question-img");
const answerButtonsElement = document.getElementById("answer-buttons");
const timerElement = document.getElementById("timer");
//
//
let shuffledQuestions, currentQuestionIndex;
let score = 0;
let timerInterval;
const GAME_DURATION = 3 * 60 * 1000;

startButton.addEventListener("click", startGame);
nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  setNextQuestion();
});

function startGame() {
  console.log("Started");
  startButton.classList.add("hide");
  shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  questionContainerElement.classList.remove("hide");
  setNextQuestion();
  startTimer();
}

function setNextQuestion() {
  resetState();
  showQuestion(shuffledQuestions[currentQuestionIndex]);
}

function showQuestion(question) {
  questionElement.innerText = question.question;
  questionImageElement.src = question.image;
  answerButtonsElement.innerHTML = ""; // Clear previous answers
  question.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    button.dataset.correct = answer.correct;
    button.addEventListener("click", () =>
      selectAnswer(button, answer.correct)
    );
    answerButtonsElement.appendChild(button);
  });
}

function resetState() {
  clearStatusClass(document.body);
  nextButton.classList.add("hide");
  answerButtonsElement.innerHTML = "";
}

function selectAnswer(button, isCorrect) {
  clearSelection();
  button.classList.add("selected"); // Highlight selected button

  setStatusClass(document.body, isCorrect);
  Array.from(answerButtonsElement.children).forEach((btn) => {
    const isCorrectAnswer = btn.dataset.correct === "true";
    setStatusClass(btn, isCorrectAnswer);
  });

  if (isCorrect) score++;

  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove("hide");
  } else {
    endGame();
  }
}

function clearSelection() {
  Array.from(answerButtonsElement.children).forEach((button) => {
    button.classList.remove("selected");
  });
  document.body.classList.remove("correct", "wrong"); // Reset background
}

function setStatusClass(element, correct) {
  clearStatusClass(element);
  if (correct) {
    element.classList.add("correct");
  } else {
    element.classList.add("wrong");
  }
}

function clearStatusClass(element) {
  element.classList.remove("correct", "wrong");
}

function startTimer() {
  let timeRemaining = GAME_DURATION;
  updateTimerDisplay(timeRemaining);

  timerInterval = setInterval(() => {
    timeRemaining -= 1000; // Decrease by 1 second
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      endGame();
    } else {
      updateTimerDisplay(timeRemaining);
    }
  }, 1000); // Update every second
}

function updateTimerDisplay(timeRemaining) {
  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);
  timerElement.innerText = `Time Remaining: ${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function endGame() {
  console.log("Time is up!");
  questionContainerElement.classList.add("hide"); // Hide the question container
  clearInterval(timerInterval);

  const endScreenElement = document.querySelector(".end-screen");
  console.log("End Screen State:", endScreenElement.classList); // Debugging line
  endScreenElement.classList.remove("hide"); // Ensure end screen is visible

  document.body.style.backgroundColor = "#a4cada"; // Set the background color to light

  displayScore(); // Display the score on the end screen
}

function displayScore() {
  const endScreenElement = document.querySelector(".end-screen"); // Get the end screen element
  const messageElement = endScreenElement.querySelector(".end-message"); // Find end message inside end screen
  const scoreElement = endScreenElement.querySelector(".score"); // Find score element inside end screen

  messageElement.innerText = `You’ve Completed the Quiz!`;
  const totalQuestions = questions.length;
  scoreElement.innerText = `Your score: ${score}/${totalQuestions}`;

  triggerConfetti();
}

function triggerConfetti() {
  confetti({
    particleCount: 200,
    spread: 360,
    startVelocity: 30,
    colors: [
      "#ff0000",
      "#00ff00",
      "#0000ff",
      "#ffff00",
      "#ff00ff",
      "#00ffff",
      "#ffffff",
    ],
    origin: { y: 0.6 },
    gravity: 0.6,
  });
}

const questions = [
  {
    question: "Guess the correct spelling",
    image: "images/baby.jpeg",
    answers: [
      { text: "baby", correct: true },
      { text: "bady", correct: false },
      { text: "dady", correct: false },
      { text: "daby", correct: false },
    ],
  },
  {
    question: "Guess the spelling correctly",
    image: "images/cat.jpeg",
    answers: [
      { text: "cat", correct: true },
      { text: "kat", correct: false },
    ],
  },
  {
    question: "Which of the two is correct ???",
    image: "images/q3.jpeg.jpg",
    answers: [
      { text: "A", correct: true },
      { text: "B", correct: false },
    ],
  },
  {
    question: "What is the boy doing ???",
    image: "images/swimming.jpg",
    answers: [
      { text: "SWIMMING", correct: true },
      { text: "SWIMMMING", correct: false },
    ],
  },
  {
    question: "Guess the spelling correctly",
    image: "images/hat.jpg",
    answers: [
      { text: "nat", correct: false },
      { text: "hat", correct: true },
    ],
  },
  {
    question:"What does the image show?",
    image: "images/pencil.jpeg",
    answers:[
        {text: "QUENCIL",correct:false},
        {text: "PENCIL",correct:true}
    ]
},
{
    question:"Which numbers shows NINE?",
    image: "images/69.jpg",
    answers:[
        {text: "A",correct:false},
        {text: "B",correct:true}
    ]
},
{
    question:"Guess the spelling correctly",
    image: "images/sun.jpeg",
    answers:[
        {text: "Son",correct:false},
        {text: "Sun",correct:true}
    ]
},
{
    question:"Guess the spelling correctly",
    image: "images/net.jpeg",
    answers:[
        {text: "Met",correct:false},
        {text: "Net",correct:true}
    ]
},
];
