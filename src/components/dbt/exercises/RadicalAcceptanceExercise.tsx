import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";

interface RadicalAcceptanceExerciseProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onComplete: (data: Record<string, any>) => void;
  onCancel: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: Record<string, any>;
  isEditing: boolean;
}

const RadicalAcceptanceExercise: React.FC<RadicalAcceptanceExerciseProps> = ({
  onComplete,
  onCancel,
  initialData,
  isEditing
}) => {
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(initialData?.phase || 1);
  const [situation, setSituation] = useState(initialData?.situation || "");
  const [resistancePatterns, setResistancePatterns] = useState<string[]>(
    initialData?.resistancePatterns || []
  );
  const [resistanceOther, setResistanceOther] = useState(initialData?.resistanceOther || "");
  const [bodyPracticeAttempted, setBodyPracticeAttempted] = useState(
    initialData?.bodyPracticeAttempted || false
  );
  const [acceptanceStatement, setAcceptanceStatement] = useState(
    initialData?.acceptanceStatement || ""
  );
  const [acceptanceStatementType, setAcceptanceStatementType] = useState<"preset" | "custom">(
    initialData?.acceptanceStatementType || "preset"
  );

  const resistanceOptions = [
    "Replaying it over and over",
    "Saying 'this shouldn't be happening'",
    "Anger or resentment",
    "Avoidance or numbing",
    "Self-blame",
    "Physical tension"
  ];

  const acceptanceStatements = [
    "This is what is happening right now.",
    "I don't like this, but I can stop fighting it.",
    "I can't change this moment, but I can change how I meet it.",
    "Fighting reality is adding pain.",
    "This is hard, and it's here."
  ];

  const toggleResistancePattern = (pattern: string) => {
    setResistancePatterns((prev) =>
      prev.includes(pattern) ? prev.filter((p) => p !== pattern) : [...prev, pattern]
    );
  };

  const handleSelectStatement = (statement: string) => {
    setAcceptanceStatement(statement);
    setAcceptanceStatementType("preset");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Allow progression even if some fields are empty (non-judgmental)
    // Only require that user has moved through the phases

    onComplete({
      situation,
      resistancePatterns,
      resistanceOther,
      bodyPracticeAttempted,
      acceptanceStatement,
      acceptanceStatementType,
      phase,
      completedAt: new Date().toISOString()
    });
  };

  const canProceed = () => {
    if (phase === 1) return situation.trim().length > 0;
    if (phase === 2) return resistancePatterns.length > 0 || resistanceOther.trim().length > 0;
    if (phase === 3) return true; // Body practice is always valid
    if (phase === 4) return acceptanceStatement.trim().length > 0;
    return false;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Header with clinical context */}
        <div className="mb-6 p-4 bg-mindtrack-sage/5 rounded-lg border border-mindtrack-sage/10">
          <p className="text-sm text-mindtrack-stone/80">
            Radical Acceptance is about <span className="font-semibold">ending the fight with reality</span> — not approval, not giving up, but acknowledging what is.
            This is a body and mind practice. Take your time.
          </p>
        </div>

        {/* Phase Indicator */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {[1, 2, 3, 4].map((p) => (
            <div key={p} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  p <= phase
                    ? "bg-mindtrack-sage text-white"
                    : "bg-mindtrack-sage/10 text-mindtrack-stone/50"
                }`}
              >
                {p}
              </div>
              {p < 4 && <div className="w-6 h-0.5 bg-mindtrack-sage/20" />}
            </div>
          ))}
        </div>

        {/* PHASE 1: Name the Reality */}
        {phase === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 p-4 border border-mindtrack-sage/20 rounded-lg bg-mindtrack-sage/2"
          >
            <div>
              <Label htmlFor="situation" className="text-mindtrack-stone font-semibold">
                What situation or reality are you struggling to accept right now?
              </Label>
              <p className="text-xs text-mindtrack-stone/60 mt-1 mb-3">
                Something that already happened, is happening, or cannot be changed right now.
              </p>
              <Textarea
                id="situation"
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder="Describe the reality you're fighting..."
                className="min-h-[100px]"
              />
            </div>

            <div className="text-xs text-mindtrack-stone/70 p-2 bg-mindtrack-stone/5 rounded">
              <p>
                <span className="font-semibold">Tip:</span> Naming what happened or is happening is the first step to accepting it.
              </p>
            </div>
          </motion.div>
        )}

        {/* PHASE 2: Notice Resistance */}
        {phase === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 p-4 border border-mindtrack-sage/20 rounded-lg bg-mindtrack-sage/2"
          >
            <div>
              <Label className="text-mindtrack-stone font-semibold mb-3 block">
                How do you notice yourself fighting this reality?
              </Label>
              <p className="text-xs text-mindtrack-stone/60 mb-4">
                Select what applies. Resistance is normal—not a failure.
              </p>

              <div className="space-y-3">
                {resistanceOptions.map((option) => (
                  <div key={option} className="flex items-center gap-3">
                    <Checkbox
                      id={option}
                      checked={resistancePatterns.includes(option)}
                      onCheckedChange={() => toggleResistancePattern(option)}
                      className="w-5 h-5"
                    />
                    <Label htmlFor={option} className="text-mindtrack-stone cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-mindtrack-sage/10">
                <Label htmlFor="resistanceOther" className="text-mindtrack-stone font-semibold text-sm mb-2 block">
                  Anything else you notice?
                </Label>
                <Textarea
                  id="resistanceOther"
                  value={resistanceOther}
                  onChange={(e) => setResistanceOther(e.target.value)}
                  placeholder="Optional—other ways you're resisting..."
                  className="min-h-[60px]"
                />
              </div>
            </div>

            <div className="text-xs text-mindtrack-stone/70 p-2 bg-mindtrack-stone/5 rounded">
              <p>
                <span className="font-semibold">Reflection:</span> Notice without judgment. Resistance is how we're wired to protect ourselves.
              </p>
            </div>
          </motion.div>
        )}

        {/* PHASE 3: Acceptance in the Body */}
        {phase === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 p-4 border border-mindtrack-sage/20 rounded-lg bg-mindtrack-sage/2"
          >
            <div>
              <Label className="text-mindtrack-stone font-semibold mb-3 block">
                Let's practice accepting this with your body.
              </Label>
              <p className="text-xs text-mindtrack-stone/60 mb-4">
                This takes about 1 minute. Follow each step at your own pace. There's no rush.
              </p>

              <div className="space-y-4 p-3 bg-white/50 rounded-lg">
                <div className="text-sm text-mindtrack-stone/80">
                  <p className="font-semibold mb-2">✓ Drop your shoulders</p>
                  <p className="text-xs text-mindtrack-stone/70 mb-3">Let them relax down, away from your ears.</p>
                </div>

                <div className="text-sm text-mindtrack-stone/80">
                  <p className="font-semibold mb-2">✓ Unclench your jaw</p>
                  <p className="text-xs text-mindtrack-stone/70 mb-3">Let your jaw soften. It's okay if your teeth don't touch.</p>
                </div>

                <div className="text-sm text-mindtrack-stone/80">
                  <p className="font-semibold mb-2">✓ Take one slow breath</p>
                  <p className="text-xs text-mindtrack-stone/70 mb-3">In through your nose (or mouth), out through your mouth. Just one.</p>
                </div>

                <div className="text-sm text-mindtrack-stone/80">
                  <p className="font-semibold mb-2">✓ Place a hand on your chest or stomach</p>
                  <p className="text-xs text-mindtrack-stone/70">Feel the warmth. You're here, right now.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
              <Checkbox
                id="bodyPractice"
                checked={bodyPracticeAttempted}
                onCheckedChange={(checked) => setBodyPracticeAttempted(checked as boolean)}
                className="w-5 h-5"
              />
              <Label htmlFor="bodyPractice" className="text-mindtrack-stone cursor-pointer">
                I did this practice (or I tried)
              </Label>
            </div>

            <div className="text-xs text-mindtrack-stone/70 p-2 bg-mindtrack-stone/5 rounded">
              <p>
                <span className="font-semibold">Why this matters:</span> Acceptance isn't just thinking. It lives in your body.
              </p>
            </div>
          </motion.div>
        )}

        {/* PHASE 4: Acceptance Statement */}
        {phase === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 p-4 border border-mindtrack-sage/20 rounded-lg bg-mindtrack-sage/2"
          >
            <div>
              <Label className="text-mindtrack-stone font-semibold mb-3 block">
                Choose or write an acceptance statement.
              </Label>
              <p className="text-xs text-mindtrack-stone/60 mb-4">
                Not approval. Not resignation. Just acknowledgment of what is.
              </p>

              <div className="space-y-2 mb-6">
                {acceptanceStatements.map((statement) => (
                  <button
                    key={statement}
                    type="button"
                    onClick={() => handleSelectStatement(statement)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      acceptanceStatement === statement && acceptanceStatementType === "preset"
                        ? "border-mindtrack-sage bg-mindtrack-sage/10"
                        : "border-mindtrack-sage/20 bg-white hover:border-mindtrack-sage/40"
                    }`}
                  >
                    <p className="text-sm text-mindtrack-stone">{statement}</p>
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-mindtrack-sage/10">
                <Label htmlFor="customStatement" className="text-mindtrack-stone font-semibold text-sm mb-2 block">
                  Or write your own:
                </Label>
                <Textarea
                  id="customStatement"
                  value={acceptanceStatementType === "custom" ? acceptanceStatement : ""}
                  onChange={(e) => {
                    setAcceptanceStatement(e.target.value);
                    setAcceptanceStatementType("custom");
                  }}
                  placeholder="Your acceptance statement..."
                  className="min-h-[60px]"
                />
              </div>
            </div>

            <div className="text-xs text-mindtrack-stone/70 p-2 bg-mindtrack-stone/5 rounded">
              <p>
                <span className="font-semibold">Remember:</span> This statement is for you, in this moment. It may change tomorrow, and that's okay.
              </p>
            </div>
          </motion.div>
        )}

        {/* Summary before final submit */}
        {phase === 4 && acceptanceStatement && (
          <div className="p-4 border border-mindtrack-sage/20 rounded-lg bg-mindtrack-stone/5">
            <p className="text-xs font-semibold text-mindtrack-stone mb-2">Your acceptance statement:</p>
            <p className="text-sm text-mindtrack-stone italic">"{acceptanceStatement}"</p>
          </div>
        )}
      </div>

      {/* Navigation & Actions */}
      <div className="flex justify-between gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-mindtrack-stone hover:bg-mindtrack-sage/5 rounded-md transition-colors"
        >
          Cancel
        </button>

        <div className="flex gap-2">
          {phase > 1 && (
            <button
              type="button"
              onClick={() => setPhase((p) => (p - 1) as 1 | 2 | 3 | 4)}
              className="px-4 py-2 bg-mindtrack-stone/10 text-mindtrack-stone hover:bg-mindtrack-stone/20 rounded-md transition-colors"
            >
              Back
            </button>
          )}

          {phase < 4 ? (
            <button
              type="button"
              onClick={() => {
                if (canProceed()) {
                  setPhase((p) => (p + 1) as 1 | 2 | 3 | 4);
                }
              }}
              disabled={!canProceed()}
              className="px-4 py-2 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={!canProceed()}
              className="px-4 py-2 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isEditing ? "Update" : "Save"} Practice
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default RadicalAcceptanceExercise;
