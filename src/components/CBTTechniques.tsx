
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Lightbulb, Moon, Sun, Waves } from "lucide-react";
import CognitiveRestructuringExercise from "./cbt/CognitiveRestructuringExercise";
import BreathingExercise from "./cbt/BreathingExercise";
import GroundingExercise from "./cbt/GroundingExercise";
import BehavioralActivation from "./BehavioralActivation";

interface Exercise {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<any>;
  icon: React.ComponentType<any>;
}

const exercises: Exercise[] = [
  {
    id: "cognitive-restructuring",
    name: "Cognitive Restructuring",
    description: "Identify and challenge negative thought patterns.",
    component: CognitiveRestructuringExercise,
    icon: Lightbulb,
  },
  {
    id: "breathing-exercise",
    name: "Breathing Exercise",
    description: "Practice deep breathing to reduce anxiety.",
    component: BreathingExercise,
    icon: Waves,
  },
  {
    id: "grounding-exercise",
    name: "Grounding Exercise",
    description: "Use your senses to connect with the present moment.",
    component: GroundingExercise,
    icon: Sun,
  },
  {
    id: "behavioral-activation",
    name: "Behavioral Activation",
    description: "Increase engagement in rewarding activities.",
    component: BehavioralActivation,
    icon: Moon,
  },
];

const CBTTechniques = () => {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  const handleExerciseSelect = (exerciseId: string) => {
    setSelectedExercise(exerciseId);
  };

  const handleBack = () => {
    setSelectedExercise(null);
  };

  return (
    <motion.div
      className="container mx-auto p-8 flex flex-col h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {!selectedExercise ? (
        <>
          <h1 className="text-2xl font-bold text-mindtrack-stone mb-6">
            CBT Techniques
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises.map((exercise) => (
              <motion.div
                key={exercise.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col justify-between"
                onClick={() => handleExerciseSelect(exercise.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <exercise.icon className="w-6 h-6 text-mindtrack-sage" />
                    <h2 className="text-xl font-semibold text-mindtrack-stone">
                      {exercise.name}
                    </h2>
                  </div>
                  <p className="text-mindtrack-fog">{exercise.description}</p>
                </div>
                <span className="text-sm text-mindtrack-sage mt-4 self-end">
                  Learn More
                </span>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="mb-4">
            <button
              className="inline-flex items-center gap-2 text-mindtrack-stone hover:text-mindtrack-sage transition-colors"
              onClick={handleBack}
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Techniques
            </button>
          </div>
          <div className="flex-grow">
            {exercises.find((exercise) => exercise.id === selectedExercise)
              ?.component ? (
              React.createElement(
                exercises.find((exercise) => exercise.id === selectedExercise)
                  ?.component as React.ComponentType
              )
            ) : (
              <p className="text-red-500">
                Exercise component not found. Please check the configuration.
              </p>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default CBTTechniques;
