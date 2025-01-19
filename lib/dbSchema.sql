CREATE TABLE users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    customer_id VARCHAR(255),
    price_id VARCHAR(255),
    status VARCHAR(255),
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_clerk_id_key UNIQUE (user_id)
);

-- Add new tables for the pivot
CREATE TABLE categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    context TEXT,
    is_custom BOOLEAN DEFAULT false,
    user_id VARCHAR(255),
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
    subscription_id uuid REFERENCES subscriptions(id),
    paddle_transaction_id VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT payments_pkey PRIMARY KEY (id),
    CONSTRAINT payments_paddle_transaction_id_key UNIQUE (paddle_transaction_id)
);

CREATE TABLE posts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT posts_pkey PRIMARY KEY (id)
);

CREATE TABLE subscriptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    paddle_subscription_id VARCHAR(255) NOT NULL,
    paddle_customer_id VARCHAR(255) NOT NULL,
    plan_type VARCHAR(50) NOT NULL, -- 'free' or 'pro'
    status VARCHAR(50) NOT NULL, -- 'active', 'cancelled', 'past_due'
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT subscriptions_pkey PRIMARY KEY (id),
    CONSTRAINT subscriptions_paddle_subscription_id_key UNIQUE (paddle_subscription_id)
);

-- Pending transactions table
CREATE TABLE pending_transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    paddle_transaction_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'pending', 'completed', 'failed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pending_transactions_pkey PRIMARY KEY (id),
    CONSTRAINT pending_transactions_paddle_id_key UNIQUE (paddle_transaction_id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Add indexes for better query performance
CREATE INDEX idx_users_user_id ON users(user_id);
CREATE INDEX idx_pending_transactions_user_id ON pending_transactions(user_id, status);