CREATE DATABASE IF NOT EXISTS learnhire_db;
USE learnhire_db;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    avatar VARCHAR(255) DEFAULT 'default-avatar.png',
    bio TEXT,
    skills TEXT,
    cv_url VARCHAR(255),
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS companies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    logo VARCHAR(255) DEFAULT 'default-company.png',
    description TEXT,
    location VARCHAR(100),
    website VARCHAR(255),
    industry VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(50) DEFAULT 'fa-briefcase',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jobs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_id INT NOT NULL,
    category_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    requirements TEXT,
    salary_min DECIMAL(15,2),
    salary_max DECIMAL(15,2),
    location VARCHAR(100),
    type ENUM('Full-time','Part-time','Contract','Internship') DEFAULT 'Full-time',
    status ENUM('active','closed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (category_id) REFERENCES job_categories(id),
    INDEX (company_id),
    INDEX (category_id),
    INDEX (status)
);

CREATE TABLE IF NOT EXISTS job_applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    job_id INT NOT NULL,
    cover_letter TEXT,
    cv_url VARCHAR(255),
    status ENUM('pending','reviewed','accepted','rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    UNIQUE KEY unique_application (user_id, job_id)
);

CREATE TABLE IF NOT EXISTS course_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(50) DEFAULT 'fa-book',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    instructor VARCHAR(100),
    duration VARCHAR(50),
    level ENUM('Beginner','Intermediate','Advanced') DEFAULT 'Beginner',
    price DECIMAL(15,2) DEFAULT 0,
    image VARCHAR(255) DEFAULT 'default-course.png',
    rating DECIMAL(3,2) DEFAULT 0,
    total_students INT DEFAULT 0,
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES course_categories(id)
);

CREATE TABLE IF NOT EXISTS course_enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    progress INT DEFAULT 0,
    status ENUM('enrolled','completed','dropped') DEFAULT 'enrolled',
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    UNIQUE KEY unique_enrollment (user_id, course_id)
);

CREATE TABLE IF NOT EXISTS support_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    subject VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    reply TEXT,
    status ENUM('open','in_progress','resolved') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert Dummy Data
INSERT INTO users (name, email, password, phone, role) VALUES
('Admin LearnHire', 'admin@learnhire.com', '$2a$10$rAjnZphfXuqsSt8dEgrXWuNx/W0eLGc1rbplrdG8OxDJcEbF4Excm', '081200000001', 'admin'),
('Admin Dua', 'admin2@learnhire.com', '$2a$10$rAjnZphfXuqsSt8dEgrXWuNx/W0eLGc1rbplrdG8OxDJcEbF4Excm', '081200000002', 'admin'),
('Budi Santoso', 'budi@example.com', '$2a$10$5NKumLFknEcQSc5Etn0NeelrGs4YeffC9x91rUpRbqytploUekSv.', '081234567890', 'user'),
('Sari Dewi', 'sari@example.com', '$2a$10$5NKumLFknEcQSc5Etn0NeelrGs4YeffC9x91rUpRbqytploUekSv.', '081234567891', 'user'),
('Andi Pratama', 'andi@example.com', '$2a$10$5NKumLFknEcQSc5Etn0NeelrGs4YeffC9x91rUpRbqytploUekSv.', '081234567892', 'user'),
('Rina Wati', 'rina@example.com', '$2a$10$5NKumLFknEcQSc5Etn0NeelrGs4YeffC9x91rUpRbqytploUekSv.', '081234567893', 'user'),
('Dimas Putra', 'dimas@example.com', '$2a$10$5NKumLFknEcQSc5Etn0NeelrGs4YeffC9x91rUpRbqytploUekSv.', '081234567894', 'user');

INSERT INTO companies (name, industry, location) VALUES
('Tokopedia', 'Technology', 'Jakarta'),
('Gojek', 'Technology', 'Jakarta'),
('Traveloka', 'Technology', 'Jakarta'),
('Shopee', 'E-commerce', 'Jakarta'),
('Bukalapak', 'E-commerce', 'Jakarta'),
('Telkom Indonesia', 'Telecommunications', 'Bandung');

INSERT INTO job_categories (name) VALUES
('Technology'), ('Design'), ('Marketing'), ('Finance'), ('Engineering'), ('Data Science');

INSERT INTO jobs (company_id, category_id, title, description, location, type, salary_min, salary_max) VALUES
(1, 1, 'Frontend Developer', 'Looking for experienced frontend developer.', 'Jakarta', 'Full-time', 10000000, 15000000),
(2, 6, 'Data Analyst', 'Data analyst role.', 'Jakarta', 'Full-time', 8000000, 12000000),
(3, 2, 'UI/UX Designer', 'Designer needed.', 'Bali', 'Full-time', 9000000, 14000000),
(4, 3, 'Marketing Specialist', 'Marketing pro needed.', 'Jakarta', 'Part-time', 5000000, 8000000),
(5, 1, 'Backend Engineer', 'Node.js developer.', 'Bandung', 'Full-time', 12000000, 18000000),
(6, 5, 'Network Engineer', 'Network maintenance.', 'Jakarta', 'Contract', 7000000, 10000000),
(1, 4, 'Finance Manager', 'Manage company finances.', 'Jakarta', 'Full-time', 15000000, 25000000),
(2, 1, 'Mobile Developer', 'Flutter/React Native dev.', 'Remote', 'Full-time', 10000000, 16000000),
(3, 3, 'SEO Specialist', 'Improve our rankings.', 'Jakarta', 'Full-time', 6000000, 9000000),
(4, 6, 'Data Scientist', 'Machine learning focus.', 'Singapore', 'Full-time', 20000000, 30000000),
(5, 1, 'DevOps Engineer', 'Manage our infrastructure.', 'Remote', 'Full-time', 15000000, 22000000),
(6, 1, 'System Administrator', 'System upkeep.', 'Bandung', 'Full-time', 8000000, 12000000);

INSERT INTO course_categories (name) VALUES
('Programming'), ('UI/UX Design'), ('Data Science'), ('Digital Marketing'), ('Business'), ('Language');

INSERT INTO courses (category_id, title, description, instructor, duration, level, price) VALUES
(1, 'Complete Web Development', 'Learn HTML, CSS, JS, Node.', 'John Doe', '20 hours', 'Beginner', 500000),
(2, 'Figma for Beginners', 'Master Figma for UI design.', 'Jane Smith', '10 hours', 'Beginner', 300000),
(3, 'Python for Data Science', 'Data analysis with Pandas.', 'Alan Turing', '15 hours', 'Intermediate', 600000),
(4, 'Digital Marketing 101', 'SEO, SEM, and Social Media.', 'Mark Johnson', '12 hours', 'Beginner', 400000),
(1, 'Advanced React.js', 'Hooks, Context, Redux.', 'Sara Conor', '18 hours', 'Advanced', 700000),
(5, 'Business Management', 'Manage your team.', 'Michael Scott', '8 hours', 'Beginner', 450000),
(6, 'English for Professionals', 'Improve your business English.', 'Emma Watson', '25 hours', 'Intermediate', 550000),
(1, 'Node.js Backend Masterclass', 'Express, MongoDB, SQL.', 'Ryan Dahl', '22 hours', 'Advanced', 800000),
(3, 'Machine Learning Basics', 'Intro to ML models.', 'Andrew Ng', '30 hours', 'Beginner', 900000),
(2, 'Advanced UX Research', 'User testing and interviews.', 'Don Norman', '15 hours', 'Advanced', 650000);

INSERT INTO course_enrollments (user_id, course_id, status) VALUES
(3, 1, 'enrolled'), (3, 2, 'completed'),
(4, 3, 'enrolled'), (5, 4, 'enrolled'), (6, 5, 'enrolled');

INSERT INTO job_applications (user_id, job_id, cover_letter) VALUES
(3, 1, 'I am a good fit.'), (4, 2, 'I love data.'),
(5, 3, 'Here is my portfolio.'), (6, 4, 'Hire me.'), (7, 5, 'I know Node.js.');

INSERT INTO support_messages (user_id, subject, message) VALUES
(3, 'Cannot login', 'I forgot my password.'),
(4, 'Course refund', 'I want a refund for course ID 3.'),
(5, 'Job application status', 'When will I hear back?');
