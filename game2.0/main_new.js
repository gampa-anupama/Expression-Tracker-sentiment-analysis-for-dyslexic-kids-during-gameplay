

const nextButton=document.getElementById('next-btn')
const startButton = document.getElementById('start-btn');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const questionImageElement=document.getElementById("question-img");
const answerButtonsElement = document.getElementById('answer-buttons');
let shuffledQuestions, currentQuestionIndex;

// for the timer of the game 
const timerElement=document.getElementById("timer");
let timerInterval;
const GAME_DURATION=3*60*1000;

// to display marks of the game
let score=0;

startButton.addEventListener('click', startGame);
nextButton.addEventListener('click',()=>{
    currentQuestionIndex++
    setNextQuestion()
})

function startGame() {
    console.log('Started');
    startButton.classList.add('hide');
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    questionContainerElement.classList.remove('hide');
    setNextQuestion();
    startTimer();
}

function setNextQuestion() {
    resetState()
    showQuestion(shuffledQuestions[currentQuestionIndex]);
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    questionImageElement.src=question.image;
    answerButtonsElement.innerHTML = ''; // Clear previous answers
    question.answers.forEach(answer => {

        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if(answer.correct){
            button.dataset.correct=answer.correct
        }
        button.addEventListener('click', () => selectAnswer(answer));
        answerButtonsElement.appendChild(button);
    });
}
function resetState(){
    clearStatusClass(document.body)
    nextButton.classList.add('hide')
    while(answerButtonsElement.firstChild){
        answerButtonsElement.removeChild(answerButtonsElement.firstChild)
    }
}

function selectAnswer(answer) {
   // console.log('Selected answer:', answer);
    const correct = answer.correct;
    if(correct){
        score++;
    }
    setStatusClass(document.body, correct);
    Array.from(answerButtonsElement.children).forEach(button => {
        //console.log('Button data-correct:', button.dataset.correct);
        const isCorrect = button.dataset.correct === 'true';
        setStatusClass(button, isCorrect);
    });
    if(shuffledQuestions.length > currentQuestionIndex + 1)
    {
        nextButton.classList.remove('hide');
    }
    else{
        endGame();
    }
    
}


function setStatusClass(element,correct){
    clearStatusClass(element)
    if(correct){
        element.classList.add('correct')
    }
    else{
        element.classList.add('wrong')
    }
}

function clearStatusClass(element){
    element.classList.remove('correct')
    element.classList.remove('wrong')
}
const questions = [
    {
        question: 'Guess the correct spelling',
        image: "images/baby.jpeg",
        answers: [
            { text: 'baby', correct: true },
            { text: 'bady', correct: false },
            { text: 'dady', correct: false },
            { text: 'daby', correct: false }
        ]
    },
    {
        question:'guess the spelling correctly',
        image: 'images/cat.jpeg',
        answers:[
            {text:'cat',correct:true},
            {text:'kat',correct:false}
        ]
    },
    {
        question:'Which of the two is correct ???',
        image:'images/q3.jpeg.jpg',
        answers:[
            {text:'A',correct:true},
            {text:'B',correct:false}
        ]
    },
    {
        question:'what is the boy doing ???',
        image:'images/swimming.jpg',
        answers:
        [
            {text:'SWIMMING', correct: true},
            {text:'SWIMMMING',correct: false}
        ]
    }
];

function startTimer(){
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
    timerElement.innerText = `Time Remaining: ${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function endGame() {
    console.log('Time is up!');
    questionContainerElement.classList.add('hide');
    // removing the restart button
    //startButton.innerText = "Restart";
    startButton.classList.remove('hide');
    clearStatusClass(document.body);
    nextButton.classList.add('hide');
    startButton.classList.add('hide')
    // Optionally handle any game end logic here
    timerElement.classList.add('hide');
   
    displayScore();

   
    
}
// to diasplay the marks at end 

function displayScore() {
    // Create a div to display the message
    const messageElement = document.createElement('div');
    messageElement.classList.add('end-message');
    messageElement.innerText = `Congratulations! You did a great job!`;

    // to display score 
    const totalQuestions = questions.length;
    const scoreElement = document.createElement('div');
    scoreElement.classList.add('score');
    scoreElement.innerText = `Your score: ${score}/${totalQuestions}`;
    document.querySelector('.container').appendChild(scoreElement);

    const container = document.querySelector('.container');
    container.appendChild(messageElement);
    container.appendChild(scoreElement);

    triggerConfetti();
}
function triggerConfetti(){
    const colors=['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff']
    {
    confetti({
        particleCount: 200,
    spread: 360,
    startVelocity: 30,
    colors: colors, // Customize colors
    origin: { y: 0.6 },
    gravity: 0.6,
    });
}
}