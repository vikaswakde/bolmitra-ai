# BolMita AI - Interactive Audio Analysis Platform

## Core Value Proposition

- Transform raw audio into personalized intelligence and actionable feedback
- Gamified learning experience through structured audio interactions
- AI-powered detailed analysis of speaking patterns, content quality, and delivery
- Social sharing capabilities to drive organic growth

## System Architecture

### 1. Database Schema Updates

sql`
-- Categories for different types of interactions
CREATE TABLE categories (
id uuid DEFAULT gen_random_uuid() NOT NULL,
name VARCHAR(100) NOT NULL,
description TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT categories_pkey PRIMARY KEY (id)
);
-- Questions bank for different categories
CREATE TABLE questions (
id uuid DEFAULT gen_random_uuid() NOT NULL,
category_id uuid NOT NULL,
question_text TEXT NOT NULL,
difficulty_level VARCHAR(20),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT questions_pkey PRIMARY KEY (id),
CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(id)
);
-- User responses/attempts
CREATE TABLE responses (
id uuid DEFAULT gen_random_uuid() NOT NULL,
user_id VARCHAR(255) NOT NULL,
question_id uuid NOT NULL,
audio_url TEXT NOT NULL,
feedback_json JSONB,
metrics JSONB,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT responses_pkey PRIMARY KEY (id),
CONSTRAINT fk_question FOREIGN KEY (question_id) REFERENCES questions(id)
);
-- User progress and achievements
CREATE TABLE user_progress (
id uuid DEFAULT gen_random_uuid() NOT NULL,
user_id VARCHAR(255) NOT NULL,
category_id uuid NOT NULL,
questions_attempted INTEGER DEFAULT 0,
avg_score DECIMAL(5,2),
badges JSONB,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT user_progress_pkey PRIMARY KEY (id),
CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(id)
);`

### 2. Implementation Phases

#### Phase 1: Core Infrastructure

- [x] Update database schema
- [x] Set up category and question management system
- [x] Implement audio recording component with 60-second limit
- [x] Enhance upload system to handle multiple audio files
- [x] Create creative feedback analysis system using Gemini AI

#### Phase 2: User Experience

- [ ] Design category selection interface
- [ ] Create interactive question display system
- [ ] Implement progress tracking
- [ ] Design feedback visualization components
- [ ] Add gamification elements (badges, progress bars, etc.)

#### Phase 3: Social Features

- [ ] Design shareable cards for social media
- [ ] Implement sharing functionality
- [ ] Create public profile pages
- [ ] Add social engagement metrics

### 3. Plan Features by Tier

#### Free Tier

- Access to 1 category
- 3 questions per day
- Basic feedback analysis
- Simple progress tracking

#### Pro Tier

- Access to all categories
- Unlimited questions
- Advanced feedback analysis
- Detailed metrics and insights
- Priority processing
- Social sharing features
- Custom practice sessions

### 4. Technical Considerations

- Use WebRTC for audio recording
- Implement proper audio compression before upload
- Set up caching for frequently accessed questions
- Implement rate limiting for free tier users
- Use websockets for real-time feedback
- Implement proper error handling for audio processing

### 5. Next Steps

1. Begin with database schema migration
2. Create basic category and question management system
3. Implement audio recording component
4. Set up enhanced AI analysis pipeline
5. Design and implement basic feedback UI
