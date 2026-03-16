export const calculateATSScore = (resume, jobDescription) => {
    // Convert both texts to lowercase for better comparison
    const resumeText = resume.toLowerCase();
    const jobText = jobDescription.toLowerCase();

    // Extract important keywords from job description
    const commonWords = new Set(['and', 'the', 'for', 'with', 'in', 'on', 'at', 'to', 'of', 'a', 'an']);
    const keywords = jobText.split(/\s+/)
        .filter(word => word.length > 3)  // Filter out small words
        .filter(word => !commonWords.has(word)) // Filter common words
        .filter(word => /^[a-zA-Z]+$/.test(word)); // Only keep word characters

    // Count matching keywords
    let matches = 0;
    let matchedKeywords = new Set();

    keywords.forEach(keyword => {
        if (resumeText.includes(keyword) && !matchedKeywords.has(keyword)) {
            matches++;
            matchedKeywords.add(keyword);
        }
    });

    // Calculate score (0-100)
    const score = (matches / keywords.length) * 100;
    return {
        score: Math.round(score),
        matchedKeywords: Array.from(matchedKeywords),
        missingKeywords: keywords.filter(keyword => !matchedKeywords.has(keyword))
    };
}; 