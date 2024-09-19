import { Buffer } from 'buffer';
import process from 'process';
import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import './Game.css';
import confetti from 'canvas-confetti';
import Header from './Header';
import axios from 'axios';

import { v4 as uuidv4 } from 'uuid'; // Import uuid

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
  
  const [webcamGranted, setWebcamGranted] = useState(false); // State to track webcam access
  const [cameraActive, setCameraActive] = useState(false); // State to track if the camera is active

  const [sessionId, setSessionId] = useState(null); // State for session ID
  const { v4: uuidv4 } = require('uuid');
  let newSessionId="null";

  const videoRef = useRef(null); // Reference to the video element
  const canvasRef = useRef(null); // Reference to the canvas element for capturing images
  const captureIntervalRef = useRef(null); // To store the interval ID for image capture

  const isCameraActive = () => {
    const stream = videoRef.current?.srcObject;
    if (stream && stream.getVideoTracks().length > 0) {
      const track = stream.getVideoTracks()[0];
      return track.readyState === 'live' && track.enabled; // Check if track is live and enabled
    }
    return false;
  };
  
  // Function to request webcam access
  const requestWebcamAccess = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        setWebcamGranted(true);
        
        const track = stream.getVideoTracks()[0];
      
      // Check if the camera track is live
      if (track.readyState === 'live' && track.enabled) {
        setCameraActive(true);
      } else {
        setCameraActive(false);
      }

        videoRef.current.style.display='none' // hide the vedio feed

        // Periodically check if the camera is still active
      const checkInterval = setInterval(() => {
        if (!isCameraActive()) {
          alert("Camera is not active. Please ensure the camera is turned on.");
          setCameraActive(false);
        } else {
          console.log("Camera is active only ")
          setCameraActive(true);
        }
      }, 5000); // Check every 5 seconds

      return () => clearInterval(checkInterval); // Clean up interval

      })
      .catch((err) => {
        console.error('Error accessing webcam:', err);
        setWebcamGranted(false); // Webcam access denied
        setCameraActive(false); // Camera not active
      });
  };

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
    if(!webcamGranted || !isCameraActive())
      {
        alert("Please allow access to the camera and ensure it is active to start the game.");
      return;
      } 
    newSessionId = uuidv4();
    setSessionId(uuidv4()); // Generate a new session ID 
    console.log("Session id generated..."+newSessionId)
    setShuffledQuestions(questions.sort(() => Math.random() - 0.5));
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeRemaining(3 * 60);
    setShowEndScreen(false);
    setSelectedAnswerIndex(null);
    setAnswerStates([]);
    setHasStarted(true); // Start the game
    captureIntervalRef.current = setInterval(captureImage, 10000);
     // start image caputre(calling the image capture function for every 30 secs)
    document.body.classList.remove('correct', 'wrong');
    document.body.style.backgroundColor = ''; // Reset to original color at the start
  };

  const captureImage = () => {
    if(!isCameraActive())
    {
      alert("Camera is not active. Please ensure the camera is turned on.");
    return;
    }
    if (!newSessionId) { // Check if sessionId is null
      console.error("Session ID is null. Cannot capture images.");
      return; // Skip capture if no session ID is set
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      const formData = new FormData();
      formData.append('image', blob, `capture-${Date.now()}.png`);
      formData.append('newSessionId', newSessionId); // Add session ID to the form data
      console.log("Image- "+"SessionId -"+newSessionId);
      // Send the image to the server
      axios.post('http://localhost:5000/uploads', formData)
        .then((response) => console.log('Image uploaded:', response.data))
        .catch((error) => console.error('Error uploading image:', error));
    });
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
    clearInterval(captureIntervalRef.current); // Stop image capture
    
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
      <video ref={videoRef} autoPlay playsInline style={{ display : 'none' }}></video>
      <canvas ref={canvasRef} style={{ display: 'none' }} width="640" height="480"></canvas>

      {!webcamGranted ? (
        <div className="start-screen">
          <button className="btn start-btn" onClick={requestWebcamAccess}>Allow to access camera</button>
        </div>
      ): !cameraActive ? (
        <div className="start-screen">
          <div className="message">Camera is not active. Please ensure your camera is turned on and try again.</div>
          <button className="btn start-btn" onClick={requestWebcamAccess}>Retry Camera Access</button>
        </div>)
       :!hasStarted ? (
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
