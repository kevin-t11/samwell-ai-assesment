import React from 'react';

interface QuizLoadingProps {
  message?: string;
}

const QuizLoading: React.FC<QuizLoadingProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-10">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <h3 className="text-xl font-medium text-gray-700">{message}</h3>
      <p className="text-gray-500 mt-2">
        Please wait while we process your request.
      </p>
    </div>
  );
};

export default QuizLoading;
