import axios from 'axios';

// AI Service Configuration
const AI_API_BASE = import.meta.env.VITE_AI_API_URL || 'http://localhost:8000/api/v1/ai';

// Enhanced ATS Scanner with AI
export const analyzeResumeWithAI = async (resumeText, jobDescription) => {
    try {
        const response = await axios.post(`${AI_API_BASE}/analyze-resume`, {
            resume: resumeText,
            jobDescription: jobDescription
        });
        return response.data;
    } catch (error) {
        console.error('AI Resume Analysis Error:', error);
        // Fallback to basic ATS scanner
        return calculateATSScore(resumeText, jobDescription);
    }
};

// AI Job Recommendations
export const getAIJobRecommendations = async (userProfile, userSkills, preferences) => {
    try {
        const response = await axios.post(`${AI_API_BASE}/job-recommendations`, {
            profile: userProfile,
            skills: userSkills,
            preferences: preferences
        });
        return response.data;
    } catch (error) {
        console.error('AI Job Recommendations Error:', error);
        return { recommendations: [], confidence: 0 };
    }
};

// AI Resume Builder
export const generateResumeWithAI = async (userData, jobDescription) => {
    try {
        const response = await axios.post(`${AI_API_BASE}/generate-resume`, {
            userData: userData,
            jobDescription: jobDescription
        });
        return response.data;
    } catch (error) {
        console.error('AI Resume Generation Error:', error);
        return { resume: null, error: 'Failed to generate resume' };
    }
};

// AI Interview Preparation
export const getInterviewQuestions = async (jobDescription, userProfile) => {
    try {
        const response = await axios.post(`${AI_API_BASE}/interview-questions`, {
            jobDescription: jobDescription,
            userProfile: userProfile
        });
        return response.data;
    } catch (error) {
        console.error('AI Interview Questions Error:', error);
        return { questions: [], tips: [] };
    }
};

// AI Job Description Generator
export const generateJobDescription = async (jobTitle, companyInfo, requirements) => {
    try {
        const response = await axios.post(`${AI_API_BASE}/generate-job-description`, {
            jobTitle: jobTitle,
            companyInfo: companyInfo,
            requirements: requirements
        });
        return response.data;
    } catch (error) {
        console.error('AI Job Description Generation Error:', error);
        return { description: null, error: 'Failed to generate job description' };
    }
};

// AI Skills Gap Analysis
export const analyzeSkillsGap = async (userSkills, targetJob) => {
    try {
        const response = await axios.post(`${AI_API_BASE}/skills-gap-analysis`, {
            userSkills: userSkills,
            targetJob: targetJob
        });
        return response.data;
    } catch (error) {
        console.error('AI Skills Gap Analysis Error:', error);
        return { missingSkills: [], recommendations: [] };
    }
};

// AI Cover Letter Generator
export const generateCoverLetter = async (userProfile, jobDescription, companyInfo) => {
    try {
        const response = await axios.post(`${AI_API_BASE}/generate-cover-letter`, {
            userProfile: userProfile,
            jobDescription: jobDescription,
            companyInfo: companyInfo
        });
        return response.data;
    } catch (error) {
        console.error('AI Cover Letter Generation Error:', error);
        return { coverLetter: null, error: 'Failed to generate cover letter' };
    }
};

// AI Salary Negotiation Assistant
export const getSalaryNegotiationTips = async (jobTitle, location, experience) => {
    try {
        const response = await axios.post(`${AI_API_BASE}/salary-negotiation`, {
            jobTitle: jobTitle,
            location: location,
            experience: experience
        });
        return response.data;
    } catch (error) {
        console.error('AI Salary Negotiation Error:', error);
        return { tips: [], salaryRange: null };
    }
};

// AI Career Path Analysis
export const analyzeCareerPath = async (currentRole, targetRole, userSkills) => {
    try {
        const response = await axios.post(`${AI_API_BASE}/career-path-analysis`, {
            currentRole: currentRole,
            targetRole: targetRole,
            userSkills: userSkills
        });
        return response.data;
    } catch (error) {
        console.error('AI Career Path Analysis Error:', error);
        return { path: [], timeline: null, recommendations: [] };
    }
};

// Basic ATS Scanner (fallback)
const calculateATSScore = (resume, jobDescription) => {
    const resumeText = resume.toLowerCase();
    const jobText = jobDescription.toLowerCase();

    const commonWords = new Set(['and', 'the', 'for', 'with', 'in', 'on', 'at', 'to', 'of', 'a', 'an']);
    const keywords = jobText.split(/\s+/)
        .filter(word => word.length > 3)
        .filter(word => !commonWords.has(word))
        .filter(word => /^[a-zA-Z]+$/.test(word));

    let matches = 0;
    let matchedKeywords = new Set();

    keywords.forEach(keyword => {
        if (resumeText.includes(keyword) && !matchedKeywords.has(keyword)) {
            matches++;
            matchedKeywords.add(keyword);
        }
    });

    const score = (matches / keywords.length) * 100;
    return {
        score: Math.round(score),
        matchedKeywords: Array.from(matchedKeywords),
        missingKeywords: keywords.filter(keyword => !matchedKeywords.has(keyword))
    };
};
