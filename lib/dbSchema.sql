CREATE TABLE users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id VARCHAR(255),
    full_name VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    customer_id VARCHAR(255),
    price_id VARCHAR(255),
    status VARCHAR(255),
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
);

-- Add new tables for the pivot
CREATE TABLE categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT categories_pkey PRIMARY KEY (id)
);

CREATE TABLE questions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category_id uuid NOT NULL,
    question_text TEXT NOT NULL,
    difficulty_level VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT questions_pkey PRIMARY KEY (id),
    CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE responses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    question_id uuid NOT NULL,
    audio_url TEXT NOT NULL,
    overall_score NUMBER,
    feedback_json JSONB,
    question_feedback JSONB,
    metrics JSONB,
    tokens_used INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT responses_pkey PRIMARY KEY (id),
    CONSTRAINT fk_question FOREIGN KEY (question_id) REFERENCES questions(id)
);

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
);

CREATE TABLE payments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    amount INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL,
    stripe_payment_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    refunded_at TIMESTAMP,
    user_email VARCHAR(255),
    price_id VARCHAR(255),
    CONSTRAINT payments_pkey PRIMARY KEY (id)
);

CREATE TABLE posts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT posts_pkey PRIMARY KEY (id)
);