"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"
import type { Result } from "../types/quiz"
import QuizResults from "@/components/quiz/Quizresult"

const ResultPage = () => {
  const router = useRouter()
  const [quizResults, setQuizResults] = useState<Result | null>(null)

  useEffect(() => {
    const results = sessionStorage.getItem("quizResults")
    if (!results) {
      router.push("/")
      return
    }
    setQuizResults(JSON.parse(results))
  }, [router])

  const handleTryAgain = () => {
    router.push("/quiz")
  }

  const handleBackToHome = () => {
    sessionStorage.removeItem("documentContent")
    sessionStorage.removeItem("quizResults")
    router.push("/")
  }

  const handleComplete = () => {
    sessionStorage.removeItem("documentContent")
    sessionStorage.removeItem("quizResults")
    router.push("/")
  }

  if (!quizResults) {
    return null
  }

  return (
    <div className="flex flex-col items-center px-4 py-8 max-w-6xl mx-auto">
      <Header />
      <main className="container mx-auto py-8 w-full">
        <QuizResults
          results={quizResults}
          onTryAgain={handleTryAgain}
          onBack={handleBackToHome}
          onComplete={handleComplete}
        />
      </main>
    </div>
  )
}

export default ResultPage
