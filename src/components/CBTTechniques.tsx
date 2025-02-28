
import { motion } from "framer-motion";
import { AlertCircle, BookmarkPlus, Brain, Check, ChevronDown, Heart, MessageSquare, MoreHorizontal, X } from "lucide-react";
import { useState } from "react";

interface Technique {
  id: string;
  title: string;
  description: string;
  steps: string[];
  category: "cognitive" | "behavioral" | "mindfulness";
  isFavorite?: boolean;
}

interface CBTTechniquesProps {
  showOnlyFavorites?: boolean;
}

const CBTTechniques = ({ showOnlyFavorites = false }: CBTTechniquesProps) => {
  const [techniques] = useState<Technique[]>([
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
  ]);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const markAsCompleted = (id: string) => {
    if (!completedExercises.includes(id)) {
      setCompletedExercises([...completedExercises, id]);
    }
  };

  const unmarkAsCompleted = (id: string) => {
    setCompletedExercises(completedExercises.filter(exerciseId => exerciseId !== id));
  };

  const filteredTechniques = techniques
    .filter(technique => showOnlyFavorites ? favorites.includes(technique.id) : true)
    .filter(technique => selectedCategory === "all" ? true : technique.category === selectedCategory);

  return (
    <section id="cbt" className="py-16 bg-mindtrack-cream/30">
      <div className="mindtrack-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="section-title">CBT Techniques & Exercises</h2>
          <p className="text-mindtrack-stone/80 max-w-2xl mb-6">
            Evidence-based cognitive behavioral therapy exercises to help manage emotions, change unhelpful thinking patterns, and develop healthier behaviors.
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <CategoryButton 
              active={selectedCategory === "all"}
              onClick={() => setSelectedCategory("all")}
            >
              All Techniques
            </CategoryButton>
            <CategoryButton 
              active={selectedCategory === "cognitive"}
              onClick={() => setSelectedCategory("cognitive")}
            >
              Cognitive
            </CategoryButton>
            <CategoryButton 
              active={selectedCategory === "behavioral"}
              onClick={() => setSelectedCategory("behavioral")}
            >
              Behavioral
            </CategoryButton>
            <CategoryButton 
              active={selectedCategory === "mindfulness"}
              onClick={() => setSelectedCategory("mindfulness")}
            >
              Mindfulness
            </CategoryButton>
          </div>
        </motion.div>

        <div className="space-y-4">
          {filteredTechniques.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mindtrack-card flex items-center gap-3 text-mindtrack-stone/70"
            >
              <AlertCircle className="w-5 h-5" />
              <p>No techniques match your current filter.</p>
            </motion.div>
          ) : (
            filteredTechniques.map((technique, index) => (
              <motion.div
                key={technique.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`mindtrack-card ${
                  completedExercises.includes(technique.id) ? "border-l-4 border-l-mindtrack-sage" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <Brain className="w-5 h-5 text-mindtrack-sage flex-shrink-0" />
                    <h3 className="text-lg font-semibold text-mindtrack-stone">{technique.title}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleFavorite(technique.id)}
                      className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                    >
                      <Heart 
                        className={`w-4 h-4 ${favorites.includes(technique.id) ? 'fill-mindtrack-sage text-mindtrack-sage' : 'text-mindtrack-sage'}`} 
                      />
                    </button>
                    <button
                      onClick={() => setExpandedId(expandedId === technique.id ? null : technique.id)}
                      className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                    >
                      <ChevronDown 
                        className={`w-4 h-4 text-mindtrack-sage transform transition-transform ${expandedId === technique.id ? 'rotate-180' : ''}`} 
                      />
                    </button>
                  </div>
                </div>
                <p className="text-mindtrack-stone/80 mb-2">{technique.description}</p>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 bg-mindtrack-sage/10 text-mindtrack-sage rounded-full">
                    {technique.category}
                  </span>
                  {completedExercises.includes(technique.id) && (
                    <span className="px-2 py-1 bg-mindtrack-sage/10 text-mindtrack-sage rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> Completed
                    </span>
                  )}
                </div>
                
                {expandedId === technique.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 pt-4 border-t border-mindtrack-sage/10"
                  >
                    <h4 className="font-medium text-mindtrack-stone mb-2">Steps:</h4>
                    <ol className="list-decimal pl-5 space-y-2 mb-4">
                      {technique.steps.map((step, i) => (
                        <li key={i} className="text-mindtrack-stone/80">{step}</li>
                      ))}
                    </ol>
                    {!completedExercises.includes(technique.id) ? (
                      <button
                        onClick={() => markAsCompleted(technique.id)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Mark as Completed
                      </button>
                    ) : (
                      <button
                        onClick={() => unmarkAsCompleted(technique.id)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-mindtrack-sage text-mindtrack-sage rounded-md hover:bg-mindtrack-sage/5 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Unmark as Completed
                      </button>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

const CategoryButton = ({ 
  children, 
  active, 
  onClick 
}: { 
  children: React.ReactNode; 
  active: boolean; 
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
      active 
        ? "bg-mindtrack-sage text-white" 
        : "bg-white text-mindtrack-stone hover:bg-mindtrack-sage/5"
    }`}
  >
    {children}
  </button>
);

export default CBTTechniques;
