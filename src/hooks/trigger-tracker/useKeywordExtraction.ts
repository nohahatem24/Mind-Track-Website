import { useMemo } from 'react';

interface KeywordMatch {
  category: string;
  keywords: string[];
  confidence: number;
}

const DEFAULT_KEYWORDS = {
  'Work': ['work', 'job', 'boss', 'colleague', 'meeting', 'deadline', 'project', 'office', 'presentation', 'performance', 'review', 'promotion', 'workload', 'stress', 'difficult', 'boss', 'coworker'],
  'Relationships': ['friend', 'partner', 'spouse', 'boyfriend', 'girlfriend', 'husband', 'wife', 'family', 'relationship', 'date', 'dating', 'mother', 'father', 'sister', 'brother', 'parent', 'conflict', 'argument', 'breakup', 'divorce', 'lonely', 'rejection'],
  'Health': ['health', 'sick', 'illness', 'pain', 'doctor', 'workout', 'exercise', 'diet', 'sleep', 'anxiety', 'depression', 'mental health', 'medication', 'treatment', 'weight', 'fitness', 'tired', 'fatigue', 'headache', 'body'],
  'Finances': ['money', 'finance', 'bill', 'debt', 'afford', 'expensive', 'budget', 'cost', 'pay', 'income', 'loan', 'credit', 'payment', 'poor', 'struggling', 'financial', 'investment'],
  'Self-image': ['appearance', 'weight', 'ugly', 'attractive', 'body', 'self-esteem', 'confidence', 'self-worth', 'embarrassment', 'shame', 'embarrassed', 'inadequate', 'fat', 'thin', 'look', 'appearance', 'identity'],
  'Education': ['school', 'university', 'exam', 'test', 'grade', 'study', 'homework', 'assignment', 'class', 'learning', 'failing', 'professor', 'student', 'academic', 'course'],
  'Social': ['social', 'party', 'crowd', 'people', 'public', 'speaking', 'presentation', 'embarrassed', 'awkward', 'lonely', 'isolated', 'friendship', 'group'],
  'Avoidance': ['avoiding', 'procrastinating', 'procrastination', 'escape', 'avoidance', 'ignore', 'ignore', 'distract'],
  'Self-talk': ['thought', 'thinking', 'inner voice', 'voice', 'self-critical', 'negative', 'doubt', 'worry', 'anxious', 'ruminating', 'rumination'],
  'Distraction': ['distracted', 'distraction', 'focus', 'concentration', 'scattered', 'scattered mind'],
  'Grounding': ['present', 'ground', 'grounding', 'awareness', 'mindful', 'breathing', 'calm'],
  'Physical': ['exercise', 'walk', 'run', 'sports', 'yoga', 'stretch', 'movement', 'physical activity', 'workout'],
  'Support': ['talk', 'friend', 'family', 'support', 'help', 'therapy', 'therapist', 'counselor', 'advice'],
};

export const useKeywordExtraction = (text: string, userCategories: string[] = []): KeywordMatch[] => {
  return useMemo(() => {
    if (!text || text.trim().length === 0) return [];

    const lowercaseText = text.toLowerCase();
    const allCategories = { ...DEFAULT_KEYWORDS };
    
    // Add user-defined categories (we'll assume they provide keywords)
    userCategories.forEach(cat => {
      if (!allCategories[cat]) {
        allCategories[cat] = [cat.toLowerCase()];
      }
    });

    const matches: KeywordMatch[] = [];

    Object.entries(allCategories).forEach(([category, keywords]) => {
      let matchCount = 0;
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches_ = text.match(regex);
        if (matches_) {
          matchCount += matches_.length;
        }
      });

      if (matchCount > 0) {
        const confidence = Math.min((matchCount / keywords.length) * 100, 100);
        matches.push({
          category,
          keywords: keywords.filter(kw => 
            new RegExp(`\\b${kw}\\b`, 'i').test(lowercaseText)
          ),
          confidence,
        });
      }
    });

    // Sort by confidence (highest first)
    return matches.sort((a, b) => b.confidence - a.confidence);
  }, [text, userCategories]);
};

export const extractSuggestedCategories = (
  triggerText: string,
  thoughtsText: string,
  copingText: string,
  userCategories: string[] = [],
  keywordMatcher: (text: string, categories: string[]) => KeywordMatch[] = useKeywordExtraction
): string[] => {
  const combinedText = [triggerText, thoughtsText, copingText].filter(Boolean).join(' ');
  const matches = keywordMatcher(combinedText, userCategories);
  
  return matches
    .slice(0, 3) // Top 3 suggestions
    .filter(m => m.confidence >= 20) // At least 20% confidence
    .map(m => m.category);
};
