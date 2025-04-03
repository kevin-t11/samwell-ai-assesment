'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@clerk/nextjs";
import Header from '@/components/Header';
import HeroSection from '@/components/Herosection';
import SocialProof from '@/components/SocailProof';
import { extractTextFromFile, extractTextFromUrl } from './utils/documentProcessor';
import TutorContent from '@/components/TutorContent';

export default function Home() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [studyInput, setStudyInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartStudying = async () => {
    try {
      if (!isSignedIn) {
        router.push('/sign-in');
        return;
      }

      setIsLoading(true);
      let content = '';

      // If file is uploaded, extract content from file
      if (fileToUpload) {
        content = await extractTextFromFile(fileToUpload);
      }
      // If URL is provided, fetch content
      else if (urlInput.trim()) {
        content = await extractTextFromUrl(urlInput);
      }
      // If direct text input is provided
      else if (studyInput.trim()) {
        content = studyInput;
      } else {
        throw new Error('Please provide content to study');
      }

      sessionStorage.setItem('documentContent', content);

      router.push('/quiz');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start studying');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlAdd = async () => {
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    if (urlInput.trim()) {
      try {
        setIsLoading(true);
        const content = await extractTextFromUrl(urlInput);
        sessionStorage.setItem('documentContent', content);
        router.push('/quiz');
      } catch {
        setError('Failed to extract content from URL');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center px-4 py-4 max-w-6xl mx-auto">
      <Header />
      <main className="container mx-auto py-2">
        <div className="max-w-4xl mx-auto p-2">
          <HeroSection />
          <div className="mt-4">
            <TutorContent
              fileToUpload={fileToUpload}
              setFileToUpload={setFileToUpload}
              urlInput={urlInput}
              setUrlInput={setUrlInput}
              studyInput={studyInput}
              setStudyInput={setStudyInput}
              onUrlAdd={handleUrlAdd}
              onStartStudying={handleStartStudying}
              isLoading={isLoading}
              error={error}
              isSignedIn={isSignedIn}
            />
          </div>
          <SocialProof />
        </div>
      </main>
    </div>
  );
}

