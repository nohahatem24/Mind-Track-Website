
import { useState } from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface ThoughtRecordProps {
  onComplete: (data: Record<string, any>) => void;
  onCancel: () => void;
  initialData?: Record<string, any>;
  isEditing?: boolean;
}

const ThoughtRecord = ({ 
  onComplete, 
  onCancel, 
  initialData,
  isEditing = false
}: ThoughtRecordProps) => {
  const [formData, setFormData] = useState({
    situation: initialData?.situation || "",
    automaticThoughts: initialData?.automaticThoughts || "",
    emotions: initialData?.emotions || "",
    supportingEvidence: initialData?.supportingEvidence || "",
    contradictingEvidence: initialData?.contradictingEvidence || "",
    balancedPerspective: initialData?.balancedPerspective || "",
    beforeRating: initialData?.beforeRating || "5",
    afterRating: initialData?.afterRating || "5"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      ...formData,
      date: new Date().toISOString()
    });
  };

  const isFormValid = () => {
    const requiredFields = [
      "situation", 
      "automaticThoughts", 
      "emotions", 
      "balancedPerspective"
    ];
    
    return requiredFields.every(field => formData[field as keyof typeof formData].trim() !== "");
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
      onSubmit={handleSubmit}
    >
      <div>
        <label className="block text-sm font-medium text-mindtrack-stone mb-1">
          Situation
        </label>
        <textarea
          name="situation"
          value={formData.situation}
          onChange={handleChange}
          placeholder="Describe the situation that triggered negative feelings..."
          className="w-full p-3 min-h-[80px] rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20 resize-none"
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-mindtrack-stone mb-1">
            Automatic Thoughts
          </label>
          <textarea
            name="automaticThoughts"
            value={formData.automaticThoughts}
            onChange={handleChange}
            placeholder="What thoughts automatically came to mind?"
            className="w-full p-3 min-h-[100px] rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20 resize-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-mindtrack-stone mb-1">
            Emotions
          </label>
          <textarea
            name="emotions"
            value={formData.emotions}
            onChange={handleChange}
            placeholder="What emotions did you feel? How intense were they (0-100%)?"
            className="w-full p-3 min-h-[100px] rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20 resize-none"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-mindtrack-stone mb-1">
            Evidence Supporting Thoughts
          </label>
          <textarea
            name="supportingEvidence"
            value={formData.supportingEvidence}
            onChange={handleChange}
            placeholder="What evidence supports your automatic thoughts?"
            className="w-full p-3 min-h-[100px] rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20 resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-mindtrack-stone mb-1">
            Evidence Contradicting Thoughts (optional)
          </label>
          <textarea
            name="contradictingEvidence"
            value={formData.contradictingEvidence}
            onChange={handleChange}
            placeholder="What evidence contradicts your automatic thoughts?"
            className="w-full p-3 min-h-[100px] rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20 resize-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-mindtrack-stone mb-1">
          Balanced Alternative Perspective
        </label>
        <textarea
          name="balancedPerspective"
          value={formData.balancedPerspective}
          onChange={handleChange}
          placeholder="What's a more balanced and realistic view of the situation?"
          className="w-full p-3 min-h-[100px] rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20 resize-none"
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-mindtrack-stone mb-1">
            Emotional Intensity Before (0-10)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              name="beforeRating"
              min="0"
              max="10"
              value={formData.beforeRating}
              onChange={handleChange}
              className="w-full h-2 bg-mindtrack-sage/20 rounded-lg appearance-none cursor-pointer"
            />
            <span className="w-8 text-center font-medium">{formData.beforeRating}</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-mindtrack-stone mb-1">
            Emotional Intensity After (0-10)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              name="afterRating"
              min="0"
              max="10"
              value={formData.afterRating}
              onChange={handleChange}
              className="w-full h-2 bg-mindtrack-sage/20 rounded-lg appearance-none cursor-pointer"
            />
            <span className="w-8 text-center font-medium">{formData.afterRating}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-mindtrack-stone hover:bg-mindtrack-sage/5 rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors disabled:opacity-50"
          disabled={!isFormValid()}
        >
          {isEditing ? "Save Changes" : "Complete Exercise"}
        </button>
      </div>
    </motion.form>
  );
};

export default ThoughtRecord;
