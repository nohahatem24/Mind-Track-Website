
import { motion } from "framer-motion";
import { AlertCircle, Heart, MessageCircle, Pencil, Plus, Trash2, Users } from "lucide-react";
import { useState, useEffect } from "react";

interface Relationship {
  id: number;
  name: string;
  type: string;
  description?: string;
  healthScore: number;
  insights: string[];
  notes: RelationshipNote[];
  timestamp: string;
  isFavorite?: boolean;
}

interface RelationshipNote {
  id: number;
  content: string;
  date: string;
  positive: boolean;
}

interface RelationshipTrackerProps {
  showOnlyFavorites?: boolean;
}

const STORAGE_KEY = 'mindtrack_relationship_entries';

const RelationshipTracker = ({ showOnlyFavorites = false }: RelationshipTrackerProps) => {
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewingId, setViewingId] = useState<number | null>(null);
  const [addingNoteId, setAddingNoteId] = useState<number | null>(null);
  
  // Load relationships from localStorage on component mount
  useEffect(() => {
    const savedRelationships = localStorage.getItem(STORAGE_KEY);
    if (savedRelationships) {
      try {
        setRelationships(JSON.parse(savedRelationships));
      } catch (e) {
        console.error("Error parsing saved relationship entries:", e);
      }
    }
  }, []);

  // Save relationships to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(relationships));
  }, [relationships]);

  const visibleRelationships = showOnlyFavorites
    ? relationships.filter(rel => rel.isFavorite)
    : relationships;

  const addRelationship = (relationship: Relationship) => {
    setRelationships([relationship, ...relationships]);
    setIsAdding(false);
  };

  const updateRelationship = (updatedRelationship: Relationship) => {
    setRelationships(relationships.map(r => r.id === updatedRelationship.id ? updatedRelationship : r));
    setEditingId(null);
  };

  const deleteRelationship = (relationshipId: number) => {
    setRelationships(relationships.filter(r => r.id !== relationshipId));
    if (viewingId === relationshipId) setViewingId(null);
  };

  const toggleFavorite = (relationshipId: number) => {
    setRelationships(relationships.map(r => 
      r.id === relationshipId 
        ? { ...r, isFavorite: !r.isFavorite } 
        : r
    ));
  };

  const addNoteToRelationship = (relationshipId: number, note: RelationshipNote) => {
    setRelationships(relationships.map(r => 
      r.id === relationshipId 
        ? { 
            ...r, 
            notes: [note, ...r.notes],
            // Recalculate health score based on notes
            healthScore: calculateHealthScore([note, ...r.notes])
          } 
        : r
    ));
    setAddingNoteId(null);
  };

  const calculateHealthScore = (notes: RelationshipNote[]): number => {
    if (notes.length === 0) return 5; // Neutral starting point
    
    const positiveCount = notes.filter(note => note.positive).length;
    const negativeCount = notes.length - positiveCount;
    
    // Calculate percentage of positive notes, scaled to -10 to 10
    const percentagePositive = (positiveCount / notes.length) * 100;
    return Math.round((percentagePositive / 5) - 10);
  };

  // Generate AI-like insights based on notes
  const generateInsights = (notes: RelationshipNote[]): string[] => {
    if (notes.length === 0) return ["Start adding notes to receive relationship insights."];
    
    const positiveCount = notes.filter(note => note.positive).length;
    const negativeCount = notes.length - positiveCount;
    const positivePercentage = (positiveCount / notes.length) * 100;
    
    const insights: string[] = [];
    
    if (positivePercentage > 75) {
      insights.push("This appears to be a healthy relationship with many positive aspects.");
    } else if (positivePercentage < 25) {
      insights.push("This relationship shows several concerning patterns that may need attention.");
    } else {
      insights.push("This relationship has both positive and challenging aspects to navigate.");
    }
    
    if (notes.length < 3) {
      insights.push("Add more notes to receive more detailed insights about this relationship.");
    }
    
    return insights;
  };

  return (
    <section id="relationships" className="py-16 bg-mindtrack-cream/30">
      <div className="mindtrack-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="section-title">Relationship Health</h2>
          <p className="text-mindtrack-stone/80 max-w-2xl">
            Track and improve your relationships by monitoring interactions, reflecting on patterns, and implementing strategies for healthier connections.
          </p>
        </motion.div>

        <div className="space-y-6">
          {!isAdding && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAdding(true)}
              className="w-full mindtrack-card flex items-center justify-center gap-2 text-mindtrack-sage hover:text-mindtrack-sage/80"
            >
              <Plus className="w-5 h-5" />
              Add New Relationship
            </motion.button>
          )}

          {isAdding && (
            <RelationshipForm 
              onSubmit={addRelationship} 
              onCancel={() => setIsAdding(false)} 
            />
          )}

          {visibleRelationships.map((relationship, index) => (
            <motion.div
              key={relationship.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="mindtrack-card"
            >
              {editingId === relationship.id ? (
                <RelationshipForm 
                  onSubmit={updateRelationship} 
                  onCancel={() => setEditingId(null)} 
                  initialData={relationship}
                />
              ) : (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-mindtrack-sage flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-mindtrack-stone">{relationship.name}</h3>
                        <span className="text-sm text-mindtrack-stone/70">{relationship.type}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleFavorite(relationship.id)}
                        className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                      >
                        <Heart 
                          className={`w-4 h-4 ${relationship.isFavorite ? 'fill-mindtrack-sage text-mindtrack-sage' : 'text-mindtrack-sage'}`} 
                        />
                      </button>
                      <button
                        onClick={() => setEditingId(relationship.id)}
                        className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                      >
                        <Pencil className="w-4 h-4 text-mindtrack-sage" />
                      </button>
                      <button
                        onClick={() => deleteRelationship(relationship.id)}
                        className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                  
                  {relationship.description && (
                    <p className="text-mindtrack-stone/80 mb-4">{relationship.description}</p>
                  )}
                  
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-sm font-medium text-mindtrack-stone">Health Score: </span>
                      <span 
                        className={`font-medium ${
                          relationship.healthScore > 5 ? 'text-green-500' : 
                          relationship.healthScore < -5 ? 'text-red-500' : 
                          'text-amber-500'
                        }`}
                      >
                        {relationship.healthScore}
                      </span>
                      <span className="text-sm text-mindtrack-stone/60 ml-1">
                        (-10 to 10)
                      </span>
                    </div>
                    
                    <button
                      onClick={() => setViewingId(viewingId === relationship.id ? null : relationship.id)}
                      className="text-sm text-mindtrack-sage hover:underline"
                    >
                      {viewingId === relationship.id ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>
                  
                  {viewingId === relationship.id && (
                    <div className="border-t border-mindtrack-sage/10 pt-4 mt-4">
                      <h4 className="font-medium text-mindtrack-stone mb-2">AI Insights</h4>
                      <ul className="list-disc pl-5 mb-4 space-y-1">
                        {generateInsights(relationship.notes).map((insight, i) => (
                          <li key={i} className="text-mindtrack-stone/80 text-sm">{insight}</li>
                        ))}
                      </ul>
                      
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-mindtrack-stone">Relationship Notes</h4>
                        {addingNoteId !== relationship.id && (
                          <button
                            onClick={() => setAddingNoteId(relationship.id)}
                            className="text-sm text-mindtrack-sage hover:underline flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            Add Note
                          </button>
                        )}
                      </div>
                      
                      {addingNoteId === relationship.id && (
                        <NoteForm 
                          onSubmit={(note) => addNoteToRelationship(relationship.id, note)} 
                          onCancel={() => setAddingNoteId(null)} 
                        />
                      )}
                      
                      <div className="space-y-3 mt-3">
                        {relationship.notes.length === 0 ? (
                          <p className="text-sm text-mindtrack-stone/60 italic">No notes yet. Add your first note about this relationship.</p>
                        ) : (
                          relationship.notes.map((note) => (
                            <div 
                              key={note.id}
                              className={`p-3 rounded-md ${note.positive ? 'bg-green-50 border border-green-100' : 'bg-amber-50 border border-amber-100'}`}
                            >
                              <p className="text-sm text-mindtrack-stone">{note.content}</p>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-xs text-mindtrack-stone/60">{note.date}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${note.positive ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                  {note.positive ? 'Positive' : 'Challenging'}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          ))}

          {relationships.length === 0 && !isAdding && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mindtrack-card flex items-center gap-3 text-mindtrack-stone/70"
            >
              <AlertCircle className="w-5 h-5" />
              <p>No relationship entries yet. Add your first relationship to start tracking.</p>
            </motion.div>
          )}
          
          {relationships.length > 0 && visibleRelationships.length === 0 && !isAdding && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mindtrack-card flex items-center gap-3 text-mindtrack-stone/70"
            >
              <AlertCircle className="w-5 h-5" />
              <p>No relationships match your current filters.</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

const RelationshipForm = ({ 
  onSubmit, 
  onCancel,
  initialData
}: { 
  onSubmit: (relationship: Relationship) => void;
  onCancel: () => void;
  initialData?: Relationship;
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    type: initialData?.type || "",
    description: initialData?.description || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.type.trim()) return;

    const now = new Date();
    const relationship: Relationship = {
      id: initialData?.id || Date.now(),
      name: formData.name.trim(),
      type: formData.type.trim(),
      description: formData.description.trim() || undefined,
      healthScore: initialData?.healthScore || 5, // Neutral starting point
      insights: initialData?.insights || ["Start adding notes to receive relationship insights."],
      notes: initialData?.notes || [],
      timestamp: initialData?.timestamp || now.toLocaleString(),
      isFavorite: initialData?.isFavorite || false
    };

    onSubmit(relationship);
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
      onSubmit={handleSubmit}
    >
      <div>
        <label className="block text-sm font-medium text-mindtrack-stone mb-1">
          Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
          placeholder="Person's name"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-mindtrack-stone mb-1">
          Relationship Type
        </label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
          required
        >
          <option value="">Select relationship type</option>
          <option value="Partner">Partner</option>
          <option value="Friend">Friend</option>
          <option value="Family">Family</option>
          <option value="Colleague">Colleague</option>
          <option value="Self">Self</option>
          <option value="Other">Other</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-mindtrack-stone mb-1">
          Description (optional)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20 resize-none min-h-[80px]"
          placeholder="Add some details about this relationship"
        />
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
          disabled={!formData.name.trim() || !formData.type.trim()}
        >
          {initialData ? 'Update' : 'Add'} Relationship
        </button>
      </div>
    </motion.form>
  );
};

const NoteForm = ({ 
  onSubmit, 
  onCancel 
}: { 
  onSubmit: (note: RelationshipNote) => void;
  onCancel: () => void;
}) => {
  const [content, setContent] = useState("");
  const [isPositive, setIsPositive] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const now = new Date();
    const note: RelationshipNote = {
      id: Date.now(),
      content: content.trim(),
      date: now.toLocaleString(),
      positive: isPositive
    };

    onSubmit(note);
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3 p-3 bg-mindtrack-sage/5 rounded-md mb-4"
      onSubmit={handleSubmit}
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20 resize-none min-h-[80px]"
        placeholder="Add a note about this relationship..."
        required
      />
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-mindtrack-stone">Note type:</span>
          <label className="inline-flex items-center">
            <input
              type="radio"
              checked={isPositive}
              onChange={() => setIsPositive(true)}
              className="form-radio h-4 w-4 text-mindtrack-sage"
            />
            <span className="ml-1 text-sm text-green-600">Positive</span>
          </label>
          <label className="inline-flex items-center ml-3">
            <input
              type="radio"
              checked={!isPositive}
              onChange={() => setIsPositive(false)}
              className="form-radio h-4 w-4 text-amber-500"
            />
            <span className="ml-1 text-sm text-amber-600">Challenging</span>
          </label>
        </div>
        
        <div className="flex ml-auto gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 text-sm text-mindtrack-stone hover:bg-mindtrack-sage/5 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1 text-sm bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors disabled:opacity-50"
            disabled={!content.trim()}
          >
            Add Note
          </button>
        </div>
      </div>
    </motion.form>
  );
};

export default RelationshipTracker;
