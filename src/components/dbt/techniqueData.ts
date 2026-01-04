
import { Technique } from "./types";

const techniqueData: Technique[] = [
  {
    id: "wise-mind",
    title: "Wise Mind",
    description: "Learn to balance emotional and rational thinking to make wiser decisions.",
    steps: [
      "Identify situations where you're making decisions based purely on emotions or purely on logic",
      "Practice finding the middle ground where both are integrated",
      "Notice how decisions feel different when made from this 'wise mind' state"
    ],
    benefits: [
      "Improved decision-making",
      "Better emotional regulation",
      "Reduced impulsivity"
    ],
    category: "mindfulness",
    interactive: true
  },
  {
    id: "stop-skill",
    title: "STOP Skill",
    description: "A crisis survival strategy to prevent acting on impulses during emotional distress.",
    steps: [
      "Stop - physically stop what you're doing",
      "Take a step back - remove yourself from the situation",
      "Observe - notice what's happening inside and outside",
      "Proceed mindfully - act with awareness of your goals"
    ],
    benefits: [
      "Prevents impulsive reactions",
      "Creates space for thoughtful responses",
      "Reduces regrettable actions"
    ],
    category: "distress-tolerance",
    interactive: true
  },
  {
    id: "emotion-regulation",
    title: "Emotional Regulation Skills",
    description: "Techniques to identify, understand, and change emotional responses.",
    steps: [
      "Identify and label emotions",
      "Identify triggers for emotional responses",
      "Reduce vulnerability to negative emotions",
      "Increase positive emotional events"
    ],
    benefits: [
      "Reduced emotional suffering",
      "Increased positive emotions",
      "Better interpersonal relationships"
    ],
    category: "emotion-regulation",
    interactive: true
  },
  {
    id: "interpersonal-effectiveness",
    title: "DEAR MAN Technique",
    description: "A structured approach for effective interpersonal communication and assertiveness.",
    steps: [
      "Describe the situation factually",
      "Express feelings and opinions clearly",
      "Assert wishes directly",
      "Reinforce the other person by explaining positive effects",
      "Mindful of the objective",
      "Appear confident",
      "Negotiate to find common ground"
    ],
    benefits: [
      "Improved communication skills",
      "Better relationship outcomes",
      "Increased assertiveness",
      "Reduced conflict"
    ],
    category: "interpersonal",
    interactive: true
  },
  {
    id: "self-soothe",
    title: "Self-Soothe with Senses",
    description: "Using your five senses to calm and comfort yourself during distress.",
    steps: [
      "Vision: Look at beautiful or calming images",
      "Hearing: Listen to soothing sounds or music",
      "Smell: Use pleasant scents like candles or essential oils",
      "Taste: Enjoy a small treat mindfully",
      "Touch: Feel comfortable textures or take a warm bath"
    ],
    benefits: [
      "Immediate distress reduction",
      "Self-comfort without harmful behaviors",
      "Increased mindfulness"
    ],
    category: "distress-tolerance",
    interactive: false
  },
  {
    id: "radical-acceptance",
    title: "Radical Acceptance",
    description: "Ending the fight with reality as it is — not approval, but acknowledgment. A guided body + mind practice.",
    steps: [
      "Name the reality you're struggling with",
      "Notice how you're fighting or resisting it",
      "Practice acceptance with your body (grounding practice)",
      "Choose an acceptance statement that feels true for you",
      "Allow the emotions that come"
    ],
    benefits: [
      "Reduces suffering caused by fighting reality",
      "Loosens the grip of rumination and anger",
      "Builds resilience through acceptance, not avoidance"
    ],
    category: "distress-tolerance",
    interactive: true
  },
  {
    id: "mindfulness-practice",
    title: "One-Minute Mindfulness",
    description: "A timed one-minute mindfulness practice to center yourself. Focus on your breath with guided pacing.",
    steps: [
      "Start the timer (1 minute)",
      "Focus completely on your breath",
      "Notice when your mind wanders",
      "Gently bring attention back to breath",
      "You can pause, resume, or mark as interrupted anytime"
    ],
    benefits: [
      "Increased present-moment awareness",
      "Reduced stress and anxiety",
      "Improved focus and concentration"
    ],
    category: "mindfulness",
    interactive: true
  },
  {
    id: "opposite-action",
    title: "Opposite Action",
    description: "Act opposite to emotional urges to change unwanted emotions. Identify if your emotion fits the facts.",
    steps: [
      "Identify the emotion and action urge",
      "Determine if the emotion fits the facts",
      "If not, identify an opposite action",
      "Practice the opposite action wholeheartedly",
      "Partial practice still counts as progress"
    ],
    benefits: [
      "Changes emotional patterns",
      "Builds new behavioral responses",
      "Increases behavioral flexibility"
    ],
    category: "emotion-regulation",
    interactive: true
  }
];

export default techniqueData;
