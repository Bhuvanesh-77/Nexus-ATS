import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');
import natural from 'natural';

const TfIdf = natural.TfIdf;
const tokenizer = new natural.WordTokenizer();

/**
 * Extract text from a PDF file
 */
export const extractTextFromPDF = async (filePath) => {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const parser = new PDFParse({ data: dataBuffer });
        const result = await parser.getText();
        await parser.destroy();
        return result.text || '';
    } catch (error) {
        console.error('Error extracting PDF text:', error);
        return '';
    }
};

const SKILL_KEYWORDS = [
    'react', 'node', 'mongodb', 'express', 'javascript', 'typescript', 'python', 'java', 'aws', 'docker',
    'kubernetes', 'react native', 'swift', 'kotlin', 'flutter', 'sql', 'nosql', 'graphql', 'rest',
    'terraform', 'jenkins', 'git', 'ci/cd', 'machine learning', 'pytorch', 'tensorflow', 'tailwins',
    'figma', 'agile', 'scrum', 'backend', 'frontend', 'fullstack', 'devops', 'testing', 'cypress'
];

const RESUME_POINTERS = [
    'experience', 'education', 'skills', 'projects', 'summary', 'objective', 'contact',
    'profile', 'languages', 'achievements', 'volunteer', 'internship', 'certification',
    'awards', 'curriculum vitae', 'resume', 'cv', 'work history', 'professional background'
];

/**
 * Validate if the text content looks like a resume
 */
export const checkIsResume = (text) => {
    if (!text || text.length < 50) return false;

    const textLower = text.toLowerCase();
    let matches = 0;

    RESUME_POINTERS.forEach(ptr => {
        if (textLower.includes(ptr)) {
            matches++;
        }
    });

    // If at least 2 common resume keywords are found, we'll consider it a resume
    // This is a balance between strictness and usability
    return matches >= 2;
};

/**
 * Calculate similarity score between resume text and job description
 */
export const calculateScore = (resumeText, jobDescription) => {
    if (!resumeText || !jobDescription) return 0;

    const resumeTokens = tokenizer.tokenize(resumeText.toLowerCase());
    const jobTokens = tokenizer.tokenize(jobDescription.toLowerCase());
    const resumeTextLower = resumeText.toLowerCase();

    // Built-in list of common English stop words to ignore (the, and, is, etc.)
    const stopWords = new Set(natural.stopwords);
    
    // 1. Extract genuine meaningful keywords from the Job Description
    const tfidf = new TfIdf();
    tfidf.addDocument(jobTokens.filter(token => !stopWords.has(token)));
    
    // Take the top 30 most important, unique words from the job description
    const keyJobTerms = tfidf.listTerms(0)
        .slice(0, 30)
        .map(item => item.term);

    // 2. Base Match: How many of those key job terms are in the resume?
    let termMatches = 0;
    keyJobTerms.forEach(term => {
        if (resumeTokens.includes(term)) {
            termMatches++;
        }
    });
    
    // Base score is strictly proportional to how much of the JD is covered
    const baseScore = keyJobTerms.length > 0 
        ? (termMatches / keyJobTerms.length) * 80 
        : 0;

    // 3. Technical Skill Bonus (Reward matching explicit tech stacks)
    const jobSkills = SKILL_KEYWORDS.filter(skill =>
        jobDescription.toLowerCase().includes(skill)
    );

    let skillMatches = 0;
    jobSkills.forEach(skill => {
        if (resumeTextLower.includes(skill)) {
            skillMatches++;
        }
    });

    // Up to 20 bonus points for explicit technical skills mentioned in the JD
    const skillBonus = jobSkills.length > 0 
        ? (skillMatches / jobSkills.length) * 20 
        : 0;

    // 4. Final Deterministic Score
    let finalScore = baseScore + skillBonus;

    // Boundary check (Strictly between 0 and 100, no random jitter)
    finalScore = Math.max(0, Math.min(Math.round(finalScore), 100));

    return finalScore;
};
