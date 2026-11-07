-- Users table
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  first_name    VARCHAR(50)  NOT NULL,
  last_name     VARCHAR(50)  NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT         NOT NULL,
  role          VARCHAR(20)  NOT NULL DEFAULT 'student'
                CHECK (role IN ('student', 'staff', 'admin')),
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  -- backup_email is used for password recovery, and must be a valid UNT email address
  CONSTRAINT users_unt_email CHECK (email ~* '^[a-z0-9._%+-]+@my\.unt\.edu$'),
  CONSTRAINT users_email_lower CHECK (email = LOWER(email)),
  CONSTRAINT users_names_not_blank CHECK (LENGTH(TRIM(first_name)) > 0 AND LENGTH(TRIM(last_name)) > 0)
);
