# BolMita AI - Interactive Audio Analysis Platform

BolMita AI is a sophisticated platform that transforms spoken responses into actionable feedback using AI-powered analysis. It helps users improve their communication skills through structured practice sessions and detailed performance insights.

## 🌟 Key Features

- **AI-Powered Analysis**: Advanced feedback on speaking patterns, content quality, and delivery
- **Interactive Practice Sessions**: Structured question sets across multiple categories
- **Real-time Feedback**: Instant analysis of audio responses with detailed metrics
- **Progress Tracking**: Comprehensive performance monitoring and improvement suggestions
- **Multi-tier Access**: Flexible subscription plans for different user needs

## 🏗️ Technical Architecture

### Database Schema

- Categories for practice sessions
- Question bank with difficulty levels
- User responses with detailed feedback
- Progress tracking and achievements

### Core Technologies

- **Frontend**: Next.js 15.1, React 19, TypeScript
- **UI Components**: Tailwind CSS, Radix UI, Framer Motion
- **Authentication**: Clerk
- **AI Integration**: Google Generative AI (Gemini)
- **Audio Processing**: HuggingFace
- **Database**: PostgreSQL with Neon

## 🚀 Implementation Features

### Phase 1 (Completed)

- Database schema implementation
- Category and question management
- Audio recording with 60-second limit
- Multi-file upload system
- AI feedback analysis using Gemini

### Phase 2 (In Progress)

- Category selection interface
- Interactive question display
- Progress tracking system
- Feedback visualization
- Gamification elements

### Phase 3 (Planned)

- Social sharing capabilities
- Public profile system
- Engagement metrics
- Community features

## 💎 Subscription Tiers

### Free Tier

- Access to 1 category
- 3 questions per day
- Basic feedback analysis
- Simple progress tracking

### Pro Tier

- Full category access
- Unlimited questions
- Advanced feedback analysis
- Detailed metrics
- Priority processing
- Social features
- Custom practice sessions

## 🛠️ Technical Considerations

- WebRTC for audio capture
- Audio compression optimization
- Question caching system
- Rate limiting for free tier
- WebSocket real-time feedback
- Robust error handling

## 🔧 Setup and Installation

1. Clone the repository
2. Install dependencies:

## ENV

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
GEMINI_API_KEY=
DATABASE_URL=
HUGGING_FACE_TOKEN=
```

## 👥 Contact

For support or inquiries:

- Email: vikaswakdepc@gmail.com
- Hours: Monday-Friday, 9 AM - 6 PM EST
