# Feynman Technique Learning App 

This is the build of the learning app for the Submission in the Presidential AI Challenge. An educational application that uses the Feynman Technique to help users learn complex topics through AI-powered explanations and interactive prompts.

## Features

- **AI-Powered Explanations**: Get clear, simple explanations of any topic
- **Knowledge Gap Identification**: Discover exactly where your understanding needs improvement
- **Interactive Learning Sessions**: Step-by-step guidance through the Feynman Technique
- **Practice Questions**: Test your understanding with AI-generated questions
- **Explanation Refinement**: Get suggestions to improve your explanations
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS

## The Feynman Technique

The Feynman Technique is a learning method with four simple steps:

1. **Choose a Concept**: Pick any topic you want to understand better
2. **Teach It to a Child**: Explain the concept in simple terms, avoiding jargon
3. **Identify Knowledge Gaps**: Notice where you struggle to explain clearly
4. **Review and Simplify**: Go back to your sources and simplify your explanation

## Tech Stack

### Backend
- Node.js with Express
- OpenAI API integration
- CORS and security middleware
- Rate limiting

### Frontend
- React 18
- React Router for navigation
- Tailwind CSS for styling
- Lucide React for icons
- Axios for API calls

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Feynman_Technique
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cd server
   cp env.example .env
   ```
   
   Edit the `.env` file and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

### Alternative: Start servers separately

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Click "Start Learning" to begin
3. Enter a topic you'd like to learn about
4. Choose your current knowledge level
5. Follow the guided learning session through all four steps of the Feynman Technique

## API Endpoints

- `POST /api/feynman/explain` - Generate simple explanation
- `POST /api/feynman/identify-gaps` - Identify knowledge gaps
- `POST /api/feynman/generate-questions` - Generate practice questions
- `POST /api/feynman/refine-explanation` - Refine user explanation
- `POST /api/feynman/complete-session` - Complete learning session
- `GET /api/health` - Health check

## Project Structure

```
Feynman_Technique/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Node.js backend
│   ├── routes/             # API route handlers
│   ├── services/           # Business logic
│   ├── index.js           # Server entry point
│   ├── package.json
│   └── env.example        # Environment variables template
├── package.json           # Root package.json with scripts
└── README.md
```

## Environment Variables

### Server (.env)
- `OPENAI_API_KEY` - Your OpenAI API key (required)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `CLIENT_URL` - Frontend URL for CORS (default: http://localhost:3000)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
