'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import QuizContainer from '@/components/quiz/QuizContainer';
import { Result } from '../types/quiz';

const QuizPage = () => {
  const router = useRouter();
  const [documentContent, setDocumentContent] = useState<string>('');

  useEffect(() => {
    const content = sessionStorage.getItem('documentContent');
    if (!content) {
      // If no content, redirect back to home
      router.push('/');
      return;
    }
    setDocumentContent(content);
  }, [router]);

  const handleQuizComplete = (results: Result) => {
    sessionStorage.setItem('quizResults', JSON.stringify(results));
    router.push('/result');
  };

  const handleBack = () => {
    router.push('/');
  };

  if (!documentContent) {
    return null;
  }

  return (
    <div className="flex flex-col items-center px-4 py-8 max-w-6xl mx-auto">
      <Header />
      <main className="container mx-auto py-8">
        <QuizContainer
          documentContent={documentContent}
          onComplete={handleQuizComplete}
          onBack={handleBack}
        />
      </main>
    </div>
  );
};

export default QuizPage; 