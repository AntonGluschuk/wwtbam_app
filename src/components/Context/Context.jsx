import React, { createContext, useState, useEffect } from 'react';

const GameContext = createContext();

const GameProvider = (props) => {
  const APIURL = 'https://opentdb.com/api.php?amount=12&type=multiple';
  const money = ['$500', '$1,000', '$2,000',
    '$4,000', '$8,000', '$16,000', '$32,000',
    '$64,000', '$125,000', '$250,000', '$500,000', '$1,000,000'];
  const letters = ['A', 'B', 'C', 'D'];
  const [config, setConfig] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(money[0]);
  const [gameStart, setGameStart] = useState(false);
  const [gameEnd, setGameEnd] = useState(false);
  const [showAnswer, setShowAnswer] = useState(undefined);
  const [showSide, setShowSide] = useState(false);

  useEffect(() => {
    fetch(APIURL)
      .then((resp) => resp.json())
      .then((data) => {
        setQuestions(data.results);
        const handledData = data.results.map((singleData) => ({
          correct_answer: singleData.correct_answer,
          answers: [singleData.correct_answer, ...singleData.incorrect_answers],
        }));
        setConfig([letters, money, ...handledData]);
      });
  }, []);

  const handleAnswer = (answer) => {
    const nextStep = step + 1;
    if (answer === questions[step].correct_answer) {
      setShowAnswer('correct');
      setTimeout(() => {
        setStep(nextStep);
        setScore(money[step]);
      }, 1000);
    } else if (answer !== questions[step].correct_answer || nextStep >= questions.length) {
      setShowAnswer('wrong');
      setTimeout(() => setGameEnd(true), 1000);
    }
    setTimeout(() => setShowAnswer(undefined), 1000);
  };

  const resetGame = () => {
    setGameEnd(false);
    setGameStart(false);
    setScore(money[0]);
    setStep(0);
    setShowAnswer(0);
  };

  const providerValue = {
    config,
    questions,
    step,
    score,
    gameStart,
    setGameStart,
    gameEnd,
    showAnswer,
    handleAnswer,
    showSide,
    setShowSide,
    resetGame,
  };

  const { children } = props;

  return (
    <GameContext.Provider value={providerValue}>
      {children}
    </GameContext.Provider>
  );
};

export { GameContext, GameProvider };
