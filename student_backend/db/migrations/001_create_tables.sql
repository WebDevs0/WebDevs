CREATE TABLE IF NOT EXISTS users (
    id         SERIAL PRIMARY KEY,
    email      VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name  VARCHAR(100) NOT NULL,
    role       VARCHAR(20)  NOT NULL DEFAULT 'student'
               CHECK (role IN ('student', 'technician', 'admin'))
);

CREATE TABLE IF NOT EXISTS tickets (
    id          SERIAL PRIMARY KEY,
    student_id  INTEGER NOT NULL REFERENCES users(id),
    title       VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category    VARCHAR(30) NOT NULL DEFAULT 'other'
                CHECK (category IN ('account', 'network', 'hardware', 'software', 'other')),
    priority    VARCHAR(10) NOT NULL DEFAULT 'medium'
                CHECK (priority IN ('low', 'medium', 'high')),
    status      VARCHAR(20) NOT NULL DEFAULT 'open'
                CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Test student so tickets have someone to belong to
INSERT INTO users (email, first_name, last_name, role)
VALUES ('student1@example.edu', 'Test', 'Student', 'student')
ON CONFLICT (email) DO NOTHING;
