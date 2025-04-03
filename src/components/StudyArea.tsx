'use client';

import { FC, Dispatch, SetStateAction } from 'react';
import { Button } from './ui/button';

export interface StudyAreaProps {
  studyInput: string;
  setStudyInput: Dispatch<SetStateAction<string>>;
  onStartStudying: () => Promise<void>;
  isLoading: boolean;
  isSignedIn?: boolean;
}

const StudyArea: FC<StudyAreaProps> = ({
  studyInput,
  setStudyInput,
  onStartStudying,
  isLoading,
  isSignedIn
}) => {
  return (
    <div className="mt-4">
      <textarea
        placeholder="Or paste your study material here..."
        className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        value={studyInput}
        onChange={(e) => setStudyInput(e.target.value)}
        disabled={!isSignedIn}
      />
      <div className="mt-4 flex justify-end">
        <button
          onClick={onStartStudying}
          disabled={!isSignedIn || isLoading}
          className={`px-4 py-2 bg-blue-500 text-white rounded-md ${(!isSignedIn || isLoading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
        >
          {isLoading ? 'Generating Quiz...' : 'Start Studying'}
        </button>
      </div>
    </div>
  );
};

export default StudyArea;