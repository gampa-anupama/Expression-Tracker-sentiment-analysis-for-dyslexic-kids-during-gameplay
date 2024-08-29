import React, { useState, useEffect } from 'react';
import './Game.css';
import confetti from 'canvas-confetti';
import Header from './Header';
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
  // ... Other questions
];

const Game = () => {
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(3 * 60); // 3 minutes
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [answerStates, setAnswerStates] = useState([]); // Array to track button states
  const [hasStarted, setHasStarted] = useState(false); // New state for game start

  useEffect(() => {
    // shuffling the questions during the game play
    setShuffledQuestions(questions.sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (timeRemaining > 0 && !showEndScreen) {
      const timerId = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else if (timeRemaining <= 0) {
      endGame();
    }
  }, [timeRemaining, showEndScreen]);

  const startGame = () => {
    setShuffledQuestions(questions.sort(() => Math.random() - 0.5));
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeRemaining(3 * 60);
    setShowEndScreen(false);
    setSelectedAnswerIndex(null);
    setAnswerStates([]);
    setHasStarted(true); // Start the game
    document.body.classList.remove('correct', 'wrong');
    document.body.style.backgroundColor = ''; // Reset to original color at the start
  };

  const setNextQuestion = () => {
    setSelectedAnswerIndex(null);
    setAnswerStates([]);
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const selectAnswer = (index, correct) => {
    if (selectedAnswerIndex !== null) return; // Prevent further clicks

    const correctIndex = shuffledQuestions[currentQuestionIndex].answers.findIndex((ans) => ans.correct);
    const newAnswerStates = shuffledQuestions[currentQuestionIndex].answers.map((ans, i) => {
      if (i === correctIndex) {
        return 'correct';
      }
      if (i === index) {
        return correct ? 'correct' : 'wrong';
      }
      return 'wrong';
    });

    setSelectedAnswerIndex(index);
    setAnswerStates(newAnswerStates);

    if (correct) {
      setScore((prevScore) => prevScore + 1);
      document.body.classList.add('correct');
    } else {
      document.body.classList.add('wrong');
    }

    // Delay for visual feedback before moving to the next question
    setTimeout(() => {
      document.body.classList.remove('correct', 'wrong'); // Remove the class before next question
      document.body.style.backgroundColor = ''; // Reset to original color

      if (currentQuestionIndex + 1 < shuffledQuestions.length) {
        setNextQuestion();
      } else {
        endGame();
      }
    }, 1000); // 1 second delay
  };

  const endGame = () => {
    setShowEndScreen(true);
    document.body.classList.remove('correct', 'wrong');
    document.body.style.backgroundColor = ''; // Reset to original color for end screen
    triggerConfetti();
  };

  const triggerConfetti = () => {
    let particleCount = 500;
    const colorOptions = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#ffffff"];

    const createConfetti = () => {
      confetti({
        particleCount: 10,
        spread: 360,
        startVelocity: Math.random() * 15 + 15,
        ticks: 300,
        gravity: 0.6,
        colors: [colorOptions[Math.floor(Math.random() * colorOptions.length)]],
        origin: { x: Math.random(), y: -0.1 },
      });
    };

    const confettiInterval = setInterval(() => {
      createConfetti();
      particleCount -= 10;
      if (particleCount <= 0) {
        clearInterval(confettiInterval);
      }
    }, 30);

    setTimeout(() => clearInterval(confettiInterval), 10000);
  };

  return (
    <div className="game-container">
      <Header />
      {!hasStarted ? (
        <div className="start-screen">
          <button className="btn start-btn" onClick={startGame}>Start</button>
        </div>
      ) : !showEndScreen ? (
        <>
          <div className="timer">Time Remaining: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</div>
          <div id="question-container">
            <div className="question-text">{shuffledQuestions[currentQuestionIndex]?.question}</div>
            <img src={shuffledQuestions[currentQuestionIndex]?.image} alt="Question" className="question-img" />
            <div className="btn-grid">
              {shuffledQuestions[currentQuestionIndex]?.answers.map((answer, index) => (
                <button
                  key={index}
                  className={`btn ${answerStates[index] || ''}`}
                  onClick={() => selectAnswer(index, answer.correct)}
                  disabled={selectedAnswerIndex !== null}
                >
                  {answer.text}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="end-screen">
          <div className="end-message">
            {score === questions.length ? "Congrats! You have scored full marks!" : "You’ve Completed the Quiz!"}
          </div>
          <div className="score">Your score: {score}/{questions.length}</div>
          <button className="btn" onClick={() => window.location.href = '/'}>Home</button>
        </div>
      )}
    </div>
  );
};

export default Game;
