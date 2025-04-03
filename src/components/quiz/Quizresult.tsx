"use client"

import React from "react"
import { ChevronRight } from "lucide-react"
import { Result } from "@/app/types/quiz"
import { TriangleAlert } from "lucide-react";

interface QuizResultsProps {
  results: Result
  onTryAgain: () => void
  onBack: () => void
  onComplete: () => void
}

const QuizResults: React.FC<QuizResultsProps> = ({
  results,
  onTryAgain,
  onBack,
  onComplete,
}) => {
  const percentage = results?.percentage ?? 0;

  // Get score-based colors
  const getScoreColors = (score: number) => {
    if (score > 70) return {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-200',
      hover: 'hover:bg-emerald-100'
    };
    if (score >= 50) return {
      bg: 'bg-yellow-50',
      text: 'text-yellow-600',
      border: 'border-yellow-200',
      hover: 'hover:bg-yellow-100'
    };
    return {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-200',
      hover: 'hover:bg-rose-100'
    };
  };

  const scoreColors = getScoreColors(percentage);

  if (!results) {
    return <div>Error: Quiz results are incomplete.</div>
  }

  // Calculate total time taken in seconds
  const calculateTotalTime = (time?: { hours: number; minutes: number; seconds: number }) => {
    if (!time) return 0;
    return (time.hours * 3600) + (time.minutes * 60) + time.seconds;
  }

  const formatTimeFromSeconds = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return {
      minutes,
      seconds,
      formatted: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    };
  }

  const totalTimeInSeconds = calculateTotalTime(results.timeCompleted);

  const timePerQuestion = results.timePerQuestion || 600; // 10 minutes in seconds
  const totalAllowedTime = timePerQuestion; // Use the single time limit

  // Calculate remaining time
  const timeRemaining = Math.max(0, totalAllowedTime - totalTimeInSeconds);
  const timeRemainingFormatted = formatTimeFromSeconds(timeRemaining);

  const avgTimePerQuestion = results.totalQuestions > 0
    ? Math.round(totalTimeInSeconds / results.totalQuestions)
    : 0;
  const avgTimeFormatted = formatTimeFromSeconds(avgTimePerQuestion);

  const expectedTimeFormatted = formatTimeFromSeconds(timePerQuestion);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        {percentage >= 70 ? "Great job!" : `Don't worry, you'll bounce back!`}
      </h1>
      <p className="text-gray-600 text-base mb-6">
        {`Here's a quick overview of how you did on the quiz.`}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="col-span-3 flex flex-col gap-6">
          <div className={`rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6 ${scoreColors.bg} border ${scoreColors.border}`}>
            <h2 className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-3">Quiz Score</h2>
            <div className="flex items-center justify-between">
              <div className="text-5xl md:text-6xl font-bold">
                <span className={scoreColors.text}>
                  {percentage}%
                </span>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <span className="block text-2xl font-bold text-emerald-600">{results.correctAnswers}</span>
                  <span className="text-xs font-medium text-gray-600">Correct</span>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-bold text-rose-600">
                    {results.totalQuestions - results.correctAnswers}
                  </span>
                  <span className="text-xs font-medium text-gray-600">Incorrect</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6">
              <h2 className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-4">Time Stats</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Time Taken</p>
                  <div className="flex items-center space-x-2">
                    {[
                      Math.floor(totalTimeInSeconds / 60),
                      totalTimeInSeconds % 60
                    ].map((value, idx) => (
                      <React.Fragment key={idx}>
                        <div className="bg-gray-900 text-white px-3 py-2 rounded-md text-xl font-mono">
                          {String(value).padStart(2, '0')}
                        </div>
                        {idx < 1 && <span className="text-xl text-gray-400">:</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Time Remaining</p>
                  <div className="text-base font-semibold text-amber-600">
                    {timeRemainingFormatted.formatted}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6">
              <h2 className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-4">
                Time Per Question
              </h2>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">Average Time</p>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {avgTimeFormatted.minutes}:{String(avgTimeFormatted.seconds).padStart(2, '0')}
                </div>
                <p className="text-xs font-medium text-gray-500">
                  Expected: {expectedTimeFormatted.minutes}:{String(expectedTimeFormatted.seconds).padStart(2, '0')} minutes
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6">
              <h2 className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-4">
                Questions That Took Longest
              </h2>
              <div className="space-y-2">
                {results.longestQuestions?.map((q, index) => (
                  <div
                    key={index}
                    className="group cursor-pointer"
                  >
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5 transition-all duration-200 hover:bg-gray-100">
                      <span className="text-sm font-medium text-gray-700">Question {q}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6">
          <div className="space-y-6">
            <div>
              <h3 className="flex items-center gap-1 text-base font-semibold text-gray-900 mb-1">Try Again <ChevronRight className="w-4 h-4 text-gray-700 transition-transform duration-200 group-hover:translate-x-0.5" /></h3>
              <p className="text-sm text-gray-600">
                Retake the test to improve your score.
              </p>
            </div>
            <div>
              <h3 className="flex items-center gap-1 p-1.5 rounded-4xl w-[150px] text-base font-semibold bg-[#FFE7C2]">
                <TriangleAlert className="w-4 h-4 text-[#992900]" />
                {results.totalQuestions - results.correctAnswers} Missed items
              </h3>
              <div className="text-sm text-gray-600 mt-2">
                Review your answers and get AI feedback
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={onTryAgain}
                className={`w-full px-3 py-2 text-white rounded-md transition-colors duration-200 font-medium text-sm ${percentage > 70 ? 'bg-emerald-600 hover:bg-emerald-700' :
                  percentage >= 50 ? 'bg-yellow-600 hover:bg-yellow-700' :
                    'bg-rose-600 hover:bg-rose-700'
                  }`}
              >
                Try Again
              </button>
              <button
                onClick={onComplete}
                className="w-full px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors duration-200 font-medium text-sm"
              >
                Complete
              </button>
            </div>
          </div>
        </div>
      </div>

      {results.questionFeedback && results.questionFeedback.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Question Review</h2>
          <div className="space-y-4">
            {results.questionFeedback.map((item, index) => (
              <div
                key={index}
                className="border-l-4 pl-4 py-3 hover:bg-gray-50 transition-colors duration-200"
                style={{ borderColor: item.correct ? "#059669" : "#dc2626" }}
              >
                <p className="text-sm font-medium text-gray-900 mb-1">{item.question}</p>
                <p className={`text-sm font-medium ${item.correct ? "text-emerald-600" : "text-rose-600"}`}>
                  {item.correct ? "✓ Correct" : "✗ Incorrect"}
                </p>
                {!item.correct && item.feedback && (
                  <p className="text-xs text-gray-600 mt-1">{item.feedback}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors duration-200 font-medium text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default QuizResults
