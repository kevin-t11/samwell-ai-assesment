import { useState, useEffect } from 'react';
import { Question as QuizQuestionType } from '@/app/types/quiz';

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswerSubmit: (questionId: string, answer: string | string[]) => void;
  onSkip: () => void;
  currentAnswer?: string | string[];
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  onAnswerSubmit,
  onSkip,
  currentAnswer,
}) => {
  // Local state for multiple-choice selected option
  const [selectedOption, setSelectedOption] = useState<string>('');

  useEffect(() => {
    if (currentAnswer && typeof currentAnswer === 'string') {
      setSelectedOption(currentAnswer);
    }
  }, [currentAnswer]);

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
    onAnswerSubmit(question.id, option);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-6">{question.question}</h2>

      {question.type === 'multiple-choice' && question.options && (
        <div className="grid grid-cols-2 gap-4">
          {question.options.map((option, index) => {
            const isSelected = selectedOption === option;
            return (
              <label
                key={index}
                className={`flex items-center space-x-2 p-4 border rounded-lg cursor-pointer transition-colors ${isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
                  }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={isSelected}
                  onChange={() => handleOptionChange(option)}
                  className="h-4 w-4 text-blue-500 focus:ring-0"
                />
                <span className="font-medium text-gray-700">{option}</span>
              </label>
            );
          })}
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={onSkip}
          className="text-blue-500 hover:underline text-sm focus:outline-none"
        >
          Don’t know?
        </button>
      </div>
    </div>
  );
};

export default QuizQuestion;
