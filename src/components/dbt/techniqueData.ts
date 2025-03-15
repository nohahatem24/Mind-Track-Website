
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
    description: "Fully accepting reality as it is, without fighting against it.",
    steps: [
      "Observe when you're fighting reality",
      "Remind yourself that reality can't be changed",
      "Consider the causes of the current reality",
      "Practice accepting with mind, body, and spirit",
      "Allow yourself to feel the natural emotions"
    ],
    benefits: [
      "Reduced suffering",
      "More effective problem-solving",
      "Freedom from being stuck in denial or anger"
    ],
    category: "distress-tolerance",
    interactive: false
  },
  {
    id: "mindfulness-practice",
    title: "One-Minute Mindfulness",
    description: "Brief mindfulness practices to center yourself throughout the day.",
    steps: [
      "Set a timer for one minute",
      "Focus completely on your breath",
      "Notice when your mind wanders",
      "Gently bring attention back to breath",
      "Repeat throughout the day"
    ],
    benefits: [
      "Increased present-moment awareness",
      "Reduced stress and anxiety",
      "Improved focus and concentration"
    ],
    category: "mindfulness",
    interactive: false
  },
  {
    id: "opposite-action",
    title: "Opposite Action",
    description: "Acting opposite to emotional urges to change unwanted emotions.",
    steps: [
      "Identify the emotion and action urge",
      "Determine if the emotion fits the facts",
      "If not, identify an opposite action",
      "Practice the opposite action wholeheartedly"
    ],
    benefits: [
      "Changes emotional patterns",
      "Builds new behavioral responses",
      "Increases behavioral flexibility"
    ],
    category: "emotion-regulation",
    interactive: false
  }
];

export default techniqueData;
