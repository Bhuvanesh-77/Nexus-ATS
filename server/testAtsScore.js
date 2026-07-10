import { calculateScore } from './services/nlpService.js';

const mockResume = `
John Doe
Software Engineer
Experience:
- Built scalable web applications using React, Node.js, and MongoDB.
- Implemented RESTful APIs and optimized database queries.
- Strong knowledge of Java and Spring Boot from university projects.
Education:
- Bachelor of Science in Computer Science
Skills: JavaScript, HTML, CSS, React, Express, MongoDB, Java.
`;

const job1_MERN = `
Title: Full Stack Core Developer
We are looking for an experienced developer to join our core engineering team. 
You will work on high-availability web services using the MERN stack.
Requirements:
3+ years experience with React, TypeScript, Node.js, and MongoDB.
Experience building robust REST APIs and maintaining cloud infrastructure on AWS.
`;

const job2_Finance = `
Title: Financial Analyst
We need a detail-oriented Financial Analyst to manage our portfolio.
Requirements:
Expert in Excel, financial modeling, and data forecasting.
Experience with corporate finance and budget optimization.
A background in accounting is a strong plus.
`;

const job3_Java = `
Title: Java Backend Developer
Seeking a strong Java developer to maintain legacy systems and build new microservices.
Requirements:
Expert in Java, Spring Boot, and SQL databases.
Knowledge of enterprise patterns and Hibernate.
`;

console.log('--- ATS SCORING TEST ---');

console.log('\nApplicant: John Doe (MERN/Java Engineer)');
console.log('-----------------------------------');

const score1 = calculateScore(mockResume, job1_MERN);
console.log(`Job: Full Stack MERN Developer => Score: ${score1}%`);

const score2 = calculateScore(mockResume, job2_Finance);
console.log(`Job: Financial Analyst         => Score: ${score2}%`);

const score3 = calculateScore(mockResume, job3_Java);
console.log(`Job: Java Backend Developer    => Score: ${score3}%`);
