export const subjects = [
  "maths",
  "language",
  "science",
  "history",
  "coding",
  "economics",
];

export const subjectsColors = {
  science: "#6366f1",
  maths: "#f59e0b",
  language: "#3b82f6",
  coding: "#ec4899",
  history: "#ef4444",
  economics: "#10b981",
};

export const voices = {
  male: { casual: "2BJW5coyhAzSr8STdHbE", formal: "c6SfcYrb2t09NHXiT80T" },
  female: { casual: "ZIlrSGI4jZqobxRKprJz", formal: "sarah" },
};

export const teachingStyles = {
  quick: {
    id: "quick",
    name: "Quick & Focused",
    description: "Rapid-fire Q&A, essential concepts only",
    icon: "⚡",
    color: "#f59e0b",
    duration: 5, // Keep for backward compatibility mapping
  },
  balanced: {
    id: "balanced", 
    name: "Balanced & Interactive",
    description: "Mixed explanations with practice exercises",
    icon: "⚖️",
    color: "#3b82f6",
    duration: 15, // Keep for backward compatibility mapping
  },
  deep: {
    id: "deep",
    name: "Deep & Comprehensive", 
    description: "Detailed explanations with examples and context",
    icon: "🧠",
    color: "#6366f1",
    duration: 30, // Keep for backward compatibility mapping
  },
} as const;

export type TeachingStyleId = keyof typeof teachingStyles;

export const recentSessions = [
  {
    id: "1",
    subject: "science",
    name: "Neura the Brainy Explorer",
    topic: "Neural Network of the Brain",
    teachingStyle: "deep",
    color: "#E5D0FF",
  },
  {
    id: "2",
    subject: "maths",
    name: "Countsy the Number Wizard",
    topic: "Derivatives & Integrals",
    teachingStyle: "deep",
    color: "#FFDA6E",
  },
  {
    id: "3",
    subject: "language",
    name: "Verba the Vocabulary Builder",
    topic: "English Literature",
    teachingStyle: "balanced",
    color: "#BDE7FF",
  },
  {
    id: "4",
    subject: "coding",
    name: "Codey the Logic Hacker",
    topic: "Intro to If-Else Statements",
    teachingStyle: "deep",
    color: "#FFC8E4",
  },
  {
    id: "5",
    subject: "history",
    name: "Memo, the Memory Keeper",
    topic: "World Wars: Causes & Consequences",
    teachingStyle: "balanced",
    color: "#FFECC8",
  },
  {
    id: "6",
    subject: "economics",
    name: "The Market Maestro",
    topic: "The Basics of Supply & Demand",
    teachingStyle: "quick",
    color: "#C8FFDF",
  },
];
