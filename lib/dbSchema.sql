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