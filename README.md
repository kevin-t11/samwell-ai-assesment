# Samwell AI Assessment

A modern, intelligent quiz generation platform that helps students and professionals assess their understanding of any study material through AI-powered quizzes.

## Features

- **Smart Quiz Generation**: Automatically generates relevant questions from:
  - Uploaded documents
  - URLs
  - Pasted text content
- **Secure Authentication**: User authentication powered by Clerk
- **Interactive Quiz Experience**:
  - Multiple-choice questions
  - Real-time progress tracking
  - Timed assessments
  - Question navigation
- **Detailed Results Analysis**:
  - Performance metrics
  - Time tracking per question
  - Comprehensive feedback

## Tech Stack

- **Frontend**:

  - Next.js 14 (React Framework)
  - TypeScript
  - Tailwind CSS for styling
  - Clerk for authentication

- **Backend**:

  - Next.js API Routes
  - Google's Generative AI (Gemini)
  - Cheerio for web scraping

- **Development Tools**:
  - ESLint for code linting
  - Modern module bundling with Next.js
  - Git for version control

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/samwell-ai-assessment.git
cd samwell-ai-assessment
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env.local` file with the following:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
GOOGLE_API_KEY=your_google_api_key
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
samwell-ai/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/            # API routes
│   │   ├── quiz/           # Quiz pages
│   │   ├── result/         # Results pages
│   │   └── utils/          # Utility functions
│   ├── components/         # React components
│   │   ├── quiz/          # Quiz-related components
│   │   └── ui/            # UI components
│   └── middleware.ts       # Authentication middleware
├── public/                 # Static assets
└── package.json           # Project dependencies
```

## Key Features Explained

### Authentication

- Secure user authentication using Clerk
- Protected routes and API endpoints
- Middleware configuration for route protection

### Quiz Generation

- AI-powered question generation using Google's Generative AI
- Support for multiple content sources (files, URLs, text)
- Intelligent content extraction and processing

### Interactive Quiz Interface

- Real-time progress tracking
- Timer functionality
- Navigation between questions
- Answer submission and validation

### Results Analysis

- Detailed performance metrics
- Time tracking per question
- Overall quiz statistics

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Clerk for authentication solutions
- Google for the Generative AI API
- All contributors and users of this project
