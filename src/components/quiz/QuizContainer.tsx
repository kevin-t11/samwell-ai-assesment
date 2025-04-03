'use client';

import { useState, useEffect } from 'react';
import QuizLoading from './QuizLoading';
import QuizResults from './Quizresult';
import { Question, Result } from '@/app/types/quiz';
import QuizQuestion from './QuizQuestion';
import React from 'react';

interface QuizContainerProps {
  documentContent: string;
  onComplete: (results: Result) => void;
  onBack: () => void;
  timeLimitInSeconds?: number;
}

const QuizContainer: React.FC<QuizContainerProps> = ({
  documentContent,
  onComplete,
  onBack,
  timeLimitInSeconds = 600, // 10 minutes default
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string | string[]>>({});
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [quizResults, setQuizResults] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Generating Quiz...');
  const [totalTimeLimit, setTotalTimeLimit] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [questionTimes, setQuestionTimes] = useState<Record<string, number>>({});
  const [currentQuestionStartTime, setCurrentQuestionStartTime] = useState<number>(Date.now());

  useEffect(() => {
    generateQuiz(documentContent);
  }, [documentContent]);

  useEffect(() => {
    if (questions.length > 0) {
      const totalTime = timeLimitInSeconds;
      setTotalTimeLimit(totalTime);
      setTimeLeft(totalTime);
    }
  }, [questions, timeLimitInSeconds]);

  // Start countdown timer and track time once quiz is loaded
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (!isLoading && !isQuizComplete) {
      if (!startTime) {
        setStartTime(Date.now());
        setCurrentQuestionStartTime(Date.now());
      }

      timer = setInterval(() => {
        const currentTime = Date.now();
        const elapsedSeconds = startTime ? Math.floor((currentTime - startTime) / 1000) : 0;
        const remaining = Math.max(0, totalTimeLimit - elapsedSeconds);

        setTimeLeft(remaining);

        if (remaining <= 0) {
          clearInterval(timer as NodeJS.Timeout);
          evaluateQuiz(); // auto-finish when time is up
        }
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLoading, isQuizComplete, startTime, totalTimeLimit]);

  // Track time spent on current question
  useEffect(() => {
    if (!isLoading && startTime) {
      const currentQuestion = questions[currentQuestionIndex]?.id;
      if (currentQuestion) {
        setQuestionTimes(prev => ({
          ...prev,
          [currentQuestion]: (prev[currentQuestion] || 0) + (Date.now() - currentQuestionStartTime) / 1000
        }));
        setCurrentQuestionStartTime(Date.now());
      }
    }
  }, [currentQuestionIndex]);

  const generateQuiz = async (content: string) => {
    try {
      setIsLoading(true);
      setLoadingMessage('Generating Quiz...');
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }

      const data = await response.json();
      setQuestions(data.questions);
      setIsLoading(false);
    } catch {
      setError('Failed to generate quiz. Please try again.');
      setIsLoading(false);
    }
  };

  const evaluateQuiz = async () => {
    try {
      setIsLoading(true);
      setLoadingMessage('Analyzing your answers...');

      const currentQuestion = questions[currentQuestionIndex]?.id;
      if (currentQuestion) {
        setQuestionTimes(prev => ({
          ...prev,
          [currentQuestion]: (prev[currentQuestion] || 0) + (Date.now() - currentQuestionStartTime) / 1000
        }));
      }

      // Calculate total time taken
      const endTime = Date.now();
      const totalTimeInSeconds = startTime ? Math.floor((endTime - startTime) / 1000) : 0;
      const minutes = Math.floor(totalTimeInSeconds / 60);
      const seconds = totalTimeInSeconds % 60;

      // Find longest questions
      const sortedQuestions = Object.entries(questionTimes)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([id]) => {
          const questionIndex = questions.findIndex(q => q.id === id);
          return questionIndex + 1;
        });

      const response = await fetch('/api/evaluate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions, userAnswers }),
      });

      if (!response.ok) {
        throw new Error('Failed to evaluate quiz');
      }

      const results = await response.json();
      const finalResults = {
        ...results,
        timeCompleted: { hours: 0, minutes, seconds },
        avgTimePerQuestion: Math.round(totalTimeInSeconds / questions.length),
        longestQuestions: sortedQuestions,
        timePerQuestion: timeLimitInSeconds
      };

      setQuizResults(finalResults);
      setIsQuizComplete(true);
      onComplete(finalResults);
      setIsLoading(false);
    } catch {
      setError('Failed to evaluate quiz. Please try again.');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <QuizLoading message={loadingMessage} />;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h3 className="text-red-500 mb-4">{error}</h3>
        <button
          onClick={() => generateQuiz(documentContent)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Try Again
        </button>
        <button
          onClick={onBack}
          className="px-4 py-2 ml-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          Go Back
        </button>
      </div>
    );
  }

  // If quiz is complete
  if (isQuizComplete && quizResults) {
    return (
      <QuizResults
        results={quizResults}
        onTryAgain={() => {
          setIsQuizComplete(false);
          setCurrentQuestionIndex(0);
          setUserAnswers({});
          setQuizResults(null);
          setTimeLeft(totalTimeLimit);
          setStartTime(null);
          setQuestionTimes({});
          setCurrentQuestionStartTime(Date.now());
        }}
        onBack={onBack}
        onComplete={onBack}
      />
    );
  }

  const handleAnswerSubmit = (questionId: string, answer: string | string[]) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSkip = () => {
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      evaluateQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="w-1/3">
          <h2 className="text-xl font-semibold">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h2>
        </div>

        <div className="w-1/3 flex justify-center">
          <div className="flex items-center">
            {[
              Math.floor(timeLeft / 60),
              timeLeft % 60
            ].map((value, idx) => (
              <React.Fragment key={idx}>
                <div className="bg-[#14161A] text-white px-3 py-1 rounded font-mono">
                  {String(value).padStart(2, '0')}
                </div>
                {idx < 1 && <span className="mx-1">:</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="w-1/3 flex justify-end">
          <button
            onClick={onBack}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {questions.length > 0 && (
          <QuizQuestion
            question={questions[currentQuestionIndex]}
            onAnswerSubmit={handleAnswerSubmit}
            onSkip={handleSkip}
            currentAnswer={userAnswers[questions[currentQuestionIndex].id]}
          />
        )}

        <div className="mt-6 flex justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-2 rounded-md text-white ${currentQuestionIndex === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gray-500 hover:bg-gray-600'
              }`}
          >
            Previous
          </button>

          <button
            onClick={handleNextQuestion}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            {currentQuestionIndex === questions.length - 1
              ? 'Finish Quiz'
              : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizContainer;
