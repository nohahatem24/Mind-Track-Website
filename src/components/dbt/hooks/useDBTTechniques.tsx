
import { useState, useEffect, useMemo } from "react";
import techniqueData from "../techniqueData";
import { Technique, ExerciseEntry } from "../types";

const STORAGE_KEY = "mindtrack_dbt_data";

interface DBTData {
  favorites: string[];
  completedExercises: Record<string, number>;
  history: ExerciseEntry[];
}

const getInitialData = (): DBTData => {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (savedData) {
    try {
      return JSON.parse(savedData);
    } catch (e) {
      console.error("Error parsing saved DBT data:", e);
    }
  }
  return {
    favorites: [],
    completedExercises: {},
    history: []
  };
};

const useDBTTechniques = (showOnlyFavorites: boolean = false) => {
  const [data, setData] = useState<DBTData>(getInitialData);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [editingHistoryEntry, setEditingHistoryEntry] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Extract data for easier access
  const { favorites, completedExercises, history } = data;

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Filter techniques based on selected category and favorites
  const filteredTechniques = useMemo(() => {
    return techniqueData.filter((technique) => {
      // Filter by category
      const categoryMatch = selectedCategory === "all" || technique.category === selectedCategory;
      
      // Filter by favorites if needed
      const favoriteMatch = !showOnlyFavorites || favorites.includes(technique.id);
      
      return categoryMatch && favoriteMatch;
    });
  }, [selectedCategory, favorites, showOnlyFavorites]);

  // Filter history based on search query
  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history;
    
    const query = searchQuery.toLowerCase();
    return history.filter((entry) => {
      const technique = techniqueData.find((t) => t.id === entry.techniqueId);
      return technique?.title.toLowerCase().includes(query);
    });
  }, [history, searchQuery]);

  // Toggle a technique as favorite
  const toggleFavorite = (techniqueId: string) => {
    setData((prevData) => {
      const isFavorite = prevData.favorites.includes(techniqueId);
      return {
        ...prevData,
        favorites: isFavorite
          ? prevData.favorites.filter((id) => id !== techniqueId)
          : [...prevData.favorites, techniqueId]
      };
    });
  };

  // Mark a technique as completed
  const markAsCompleted = (techniqueId: string) => {
    const now = new Date();
    const formattedDate = now.toLocaleString();
    const timestamp = now.getTime();
    
    setData((prevData) => {
      // Update completed count
      const prevCount = prevData.completedExercises[techniqueId] || 0;
      
      // Add to history
      const newEntry: ExerciseEntry = {
        id: `history_${timestamp}`,
        techniqueId,
        date: formattedDate,
        timestamp,
        data: { completed: true }
      };
      
      return {
        ...prevData,
        completedExercises: {
          ...prevData.completedExercises,
          [techniqueId]: prevCount + 1
        },
        history: [newEntry, ...prevData.history]
      };
    });
  };

  // Unmark a technique as completed (decrement counter)
  const unmarkAsCompleted = (techniqueId: string) => {
    setData((prevData) => {
      const prevCount = prevData.completedExercises[techniqueId] || 0;
      if (prevCount <= 0) return prevData;
      
      // Find the latest history entry for this technique
      const historyIndex = prevData.history.findIndex(
        (entry) => entry.techniqueId === techniqueId
      );
      
      if (historyIndex === -1) {
        // No history entry found, just decrement counter
        return {
          ...prevData,
          completedExercises: {
            ...prevData.completedExercises,
            [techniqueId]: prevCount - 1
          }
        };
      }
      
      // Remove the latest history entry
      const updatedHistory = [...prevData.history];
      updatedHistory.splice(historyIndex, 1);
      
      return {
        ...prevData,
        completedExercises: {
          ...prevData.completedExercises,
          [techniqueId]: prevCount - 1
        },
        history: updatedHistory
      };
    });
  };

  // Start an interactive exercise
  const startExercise = (techniqueId: string) => {
    setActiveExercise(techniqueId);
    setExpandedId(null);
  };

  // Complete an exercise
  const completeExercise = (techniqueId: string, exerciseData: Record<string, any>) => {
    const now = new Date();
    const formattedDate = now.toLocaleString();
    const timestamp = now.getTime();
    
    setData((prevData) => {
      // Update completed count
      const prevCount = prevData.completedExercises[techniqueId] || 0;
      
      // Add to history
      const newEntry: ExerciseEntry = {
        id: `history_${timestamp}`,
        techniqueId,
        date: formattedDate,
        timestamp,
        data: exerciseData
      };
      
      return {
        ...prevData,
        completedExercises: {
          ...prevData.completedExercises,
          [techniqueId]: prevCount + 1
        },
        history: [newEntry, ...prevData.history]
      };
    });
    
    setActiveExercise(null);
  };

  // Update an existing exercise
  const updateExercise = (entryId: string, exerciseData: Record<string, any>) => {
    setData((prevData) => {
      return {
        ...prevData,
        history: prevData.history.map((entry) =>
          entry.id === entryId
            ? { ...entry, data: exerciseData }
            : entry
        )
      };
    });
    
    setActiveExercise(null);
    setEditingHistoryEntry(null);
  };

  // Cancel the current exercise
  const cancelExercise = () => {
    setActiveExercise(null);
    setEditingHistoryEntry(null);
  };

  // Edit a history entry
  const editHistoryEntry = (entryId: string) => {
    const entry = history.find((e) => e.id === entryId);
    if (entry) {
      setActiveExercise(entry.techniqueId);
      setEditingHistoryEntry(entryId);
    }
  };

  // Delete a history entry
  const deleteHistoryEntry = (entryId: string) => {
    setData((prevData) => {
      const entryIndex = prevData.history.findIndex((e) => e.id === entryId);
      if (entryIndex === -1) return prevData;
      
      const entry = prevData.history[entryIndex];
      const techniqueId = entry.techniqueId;
      const prevCount = prevData.completedExercises[techniqueId] || 0;
      
      // Remove the entry from history
      const updatedHistory = [...prevData.history];
      updatedHistory.splice(entryIndex, 1);
      
      return {
        ...prevData,
        completedExercises: {
          ...prevData.completedExercises,
          [techniqueId]: prevCount > 0 ? prevCount - 1 : 0
        },
        history: updatedHistory
      };
    });
  };

  // Get the number of times a technique was completed today
  const getTodayCompletionCount = (techniqueId: string) => {
    const today = new Date().setHours(0, 0, 0, 0);
    return history.filter(
      (entry) => entry.techniqueId === techniqueId && new Date(entry.timestamp).setHours(0, 0, 0, 0) === today
    ).length;
  };

  return {
    expandedId,
    setExpandedId,
    favorites,
    completedExercises,
    activeExercise,
    showHistory,
    setShowHistory,
    editingHistoryEntry,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredTechniques,
    filteredHistory,
    toggleFavorite,
    markAsCompleted,
    unmarkAsCompleted,
    startExercise,
    completeExercise,
    updateExercise,
    cancelExercise,
    deleteHistoryEntry,
    editHistoryEntry,
    getTodayCompletionCount,
    techniques: techniqueData
  };
};

export default useDBTTechniques;
