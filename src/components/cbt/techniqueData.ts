
import { Technique } from "./types";

export const techniquesData: Technique[] = [
  {
    id: "cog-restructuring",
    title: "Cognitive Restructuring",
    description: "Challenge and change negative thought patterns that contribute to emotional distress.",
    category: "cognitive",
    steps: [
      "Identify the negative thought or belief",
      "Recognize the cognitive distortion (e.g., all-or-nothing thinking, catastrophizing)",
      "Challenge the thought with evidence",
      "Replace with a more balanced, realistic thought"
    ],
    isFavorite: false
  },
  {
    id: "behav-activation",
    title: "Behavioral Activation",
    description: "Increase engagement in positive activities to improve mood and break negative cycles.",
    category: "behavioral",
    steps: [
      "Identify activities that bring you joy or a sense of accomplishment",
      "Schedule these activities into your weekly routine",
      "Start with small, manageable tasks",
      "Track your mood before and after the activity"
    ],
    isFavorite: false
  },
  {
    id: "thought-record",
    title: "Thought Record",
    description: "Document and analyze negative thoughts to develop a more balanced perspective.",
    category: "cognitive",
    steps: [
      "Write down the situation that triggered negative feelings",
      "Note your automatic thoughts and emotional response",
      "Identify evidence that supports and contradicts these thoughts",
      "Develop a balanced alternative perspective",
      "Rate how you feel after considering the balanced view"
    ],
    isFavorite: false
  },
  {
    id: "grounding",
    title: "5-4-3-2-1 Grounding Technique",
    description: "A mindfulness exercise to manage anxiety by engaging your five senses.",
    category: "mindfulness",
    steps: [
      "Acknowledge 5 things you can see",
      "Acknowledge 4 things you can touch/feel",
      "Acknowledge 3 things you can hear",
      "Acknowledge 2 things you can smell",
      "Acknowledge 1 thing you can taste"
    ],
    isFavorite: false
  },
  {
    id: "deep-breathing",
    title: "Deep Breathing Exercise",
    description: "A simple technique to reduce stress and anxiety through controlled breathing.",
    category: "mindfulness",
    steps: [
      "Find a comfortable position",
      "Breathe in slowly through your nose for 4 counts",
      "Hold your breath for 1-2 counts",
      "Exhale slowly through your mouth for 6 counts",
      "Repeat 5-10 times or until you feel calmer"
    ],
    isFavorite: false
  },
  {
    id: "progressive-relaxation",
    title: "Progressive Muscle Relaxation",
    description: "Reduce physical tension by systematically tensing and relaxing muscle groups.",
    category: "behavioral",
    steps: [
      "Start in a comfortable position",
      "Tense a muscle group (e.g., fists) for 5-10 seconds",
      "Release the tension and notice the feeling of relaxation",
      "Wait 10-20 seconds before moving to the next muscle group",
      "Progress through major muscle groups from feet to head"
    ],
    isFavorite: false
  }
];
