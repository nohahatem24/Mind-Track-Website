
import { motion } from "framer-motion";
import { AlertCircle, Heart, MessageCircle, Pencil, Plus, Trash2, Users, ChevronDown, ChevronUp, TrendingUp } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import ApexCharts from 'react-apexcharts';

interface RelationshipEntry {
  id: number;
  emotionalScore: number; // -10 to +10
  description: string;
  date: string;
  isFavorite?: boolean;
}

// Helper to get tone from score
const getToneFromScore = (score: number): 'positive' | 'challenging' | 'neutral' => {
  if (score > 0) return 'positive';
  if (score < 0) return 'challenging';
  return 'neutral';
};

interface Relationship {
  id: number;
  name: string;
  type: string; // Allow any string for custom types
  description?: string;
  entries: RelationshipEntry[];
  createdAt: string;
  lastInteraction?: string;
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

const STORAGE_KEY = 'mindtrack_relationships_v2';

const RelationshipTracker = ({ showOnlyFavorites = false }: RelationshipTrackerProps) => {
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [addingEntryId, setAddingEntryId] = useState<number | null>(null);
  
  // Filter states
  const [filterType, setFilterType] = useState<string>('all');
  const [filterTone, setFilterTone] = useState<string>('all');
  const [filterName, setFilterName] = useState<string>('');
  const [dateStart, setDateStart] = useState<string>('');
  const [dateEnd, setDateEnd] = useState<string>('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(showOnlyFavorites);

  // Load relationships from localStorage
  useEffect(() => {
    const savedRelationships = localStorage.getItem(STORAGE_KEY);
    if (savedRelationships) {
      try {
        setRelationships(JSON.parse(savedRelationships));
      } catch (e) {
        console.error("Error parsing saved relationships:", e);
      }
    }
  }, []);

  // Save relationships to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(relationships));
  }, [relationships]);

  // Composable filtering logic
  const filteredRelationships = useMemo(() => {
    return relationships
      .map(rel => {
        // Filter and map entries based on criteria
        let filteredEntries = rel.entries;
        
        // Favorites filter for entries (only if looking at individual entries)
        if (showFavoritesOnly && !rel.isFavorite) {
          filteredEntries = filteredEntries.filter(entry => entry.isFavorite);
        }
        
        // Tone filter
        if (filterTone !== 'all') {
          filteredEntries = filteredEntries.filter(entry => getToneFromScore(entry.emotionalScore) === filterTone);
        }
        
        // Date range filter
        if (dateStart || dateEnd) {
          filteredEntries = filteredEntries.filter(entry => {
            const entryDate = new Date(entry.date);
            if (dateStart && entryDate < new Date(dateStart)) return false;
            if (dateEnd) {
              const endDate = new Date(dateEnd);
              endDate.setHours(23, 59, 59, 999);
              if (entryDate > endDate) return false;
            }
            return true;
          });
        }
        
        // Return relationship with filtered entries
        return { ...rel, entries: filteredEntries };
      })
      .filter(rel => {
        // Skip if no matching entries when filters are active (but not when showing favorites)
        if ((filterTone !== 'all' || dateStart || dateEnd) && rel.entries.length === 0 && !rel.isFavorite) {
          return false;
        }
        
        // If showing favorites only, show favorite relationships
        if (showFavoritesOnly && !rel.isFavorite) {
          return false;
        }
        
        // Type filter
        if (filterType !== 'all' && rel.type !== filterType) return false;
        
        // Name search
        if (filterName && !rel.name.toLowerCase().includes(filterName.toLowerCase())) return false;
        
        return true;
      })
      .sort((a, b) => {
        // Sort by most recent interaction
        const aDate = a.lastInteraction ? new Date(a.lastInteraction) : new Date(a.createdAt);
        const bDate = b.lastInteraction ? new Date(b.lastInteraction) : new Date(b.createdAt);
        return bDate.getTime() - aDate.getTime();
      });
  }, [relationships, showFavoritesOnly, filterType, filterTone, filterName, dateStart, dateEnd]);

  const addRelationship = (relationship: Relationship) => {
    setRelationships([relationship, ...relationships]);
    setIsAdding(false);
  };

  const updateRelationship = (updated: Relationship) => {
    setRelationships(relationships.map(r => r.id === updated.id ? updated : r));
    setEditingId(null);
  };

  const deleteRelationship = (relationshipId: number) => {
    setRelationships(relationships.filter(r => r.id !== relationshipId));
    if (expandedId === relationshipId) setExpandedId(null);
  };

  const toggleFavorite = (relationshipId: number) => {
    setRelationships(relationships.map(r =>
      r.id === relationshipId ? { ...r, isFavorite: !r.isFavorite } : r
    ));
  };

  const addEntryToRelationship = (relationshipId: number, entry: RelationshipEntry) => {
    setRelationships(relationships.map(r => {
      if (r.id !== relationshipId) return r;
      return {
        ...r,
        entries: [entry, ...r.entries],
        lastInteraction: new Date().toISOString()
      };
    }));
    setAddingEntryId(null);
  };

  const updateEntry = (relationshipId: number, updatedEntry: RelationshipEntry) => {
    setRelationships(relationships.map(r => {
      if (r.id !== relationshipId) return r;
      return {
        ...r,
        entries: r.entries.map(e => e.id === updatedEntry.id ? updatedEntry : e),
        lastInteraction: new Date().toISOString()
      };
    }));
  };

  const deleteEntry = (relationshipId: number, entryId: number) => {
    setRelationships(relationships.map(r => {
      if (r.id !== relationshipId) return r;
      return {
        ...r,
        entries: r.entries.filter(e => e.id !== entryId),
        lastInteraction: new Date().toISOString()
      };
    }));
  };

  const toggleEntryFavorite = (relationshipId: number, entryId: number) => {
    setRelationships(relationships.map(r => {
      if (r.id !== relationshipId) return r;
      return {
        ...r,
        entries: r.entries.map(e =>
          e.id === entryId ? { ...e, isFavorite: !e.isFavorite } : e
        )
      };
    }));
  };

  // Calculate average emotional score per relationship (weighted by recency)
  const getAverageScore = (relationship: Relationship): number => {
    if (relationship.entries.length === 0) return 0;
    
    const now = new Date().getTime();
    let totalWeight = 0;
    let weightedSum = 0;
    
    relationship.entries.forEach((entry, index) => {
      const entryDate = new Date(entry.date).getTime();
      const ageInDays = (now - entryDate) / (1000 * 60 * 60 * 24);
      
      // Recency weight: recent entries have more influence
      // Weight decays over time but never goes to zero
      const recencyWeight = Math.max(0.5, Math.exp(-ageInDays / 30));
      
      weightedSum += entry.emotionalScore * recencyWeight;
      totalWeight += recencyWeight;
    });
    
    return totalWeight > 0 ? Math.round(weightedSum / totalWeight * 10) / 10 : 0;
  };

  // Get emotional trend direction
  const getTrendDirection = (relationship: Relationship): 'improving' | 'declining' | 'stable' => {
    if (relationship.entries.length < 3) return 'stable';
    
    const recent = relationship.entries.slice(0, Math.floor(relationship.entries.length / 3));
    const older = relationship.entries.slice(-Math.floor(relationship.entries.length / 3));
    
    const recentAvg = recent.reduce((sum, e) => sum + e.emotionalScore, 0) / recent.length;
    const olderAvg = older.reduce((sum, e) => sum + e.emotionalScore, 0) / older.length;
    
    const diff = recentAvg - olderAvg;
    if (diff > 1) return 'improving';
    if (diff < -1) return 'declining';
    return 'stable';
  };

  // Generate smart insights
  const generateInsights = (relationship: Relationship): string[] => {
    if (relationship.entries.length === 0) {
      return ["Start adding entries to understand this relationship's patterns."];
    }

    const insights: string[] = [];
    const positiveCount = relationship.entries.filter(e => getToneFromScore(e.emotionalScore) === 'positive').length;
    const challengingCount = relationship.entries.filter(e => getToneFromScore(e.emotionalScore) === 'challenging').length;
    const neutralCount = relationship.entries.filter(e => getToneFromScore(e.emotionalScore) === 'neutral').length;
    const total = relationship.entries.length;

    const positivePercentage = (positiveCount / total) * 100;
    const averageScore = getAverageScore(relationship);
    const trend = getTrendDirection(relationship);

    // Trend insight
    if (trend === 'improving') {
      insights.push(`✨ This relationship is improving — recent interactions lean positive.`);
    } else if (trend === 'declining') {
      insights.push(`📉 Recent patterns suggest this relationship needs attention and care.`);
    } else {
      insights.push(`⏸️ This relationship is stable — consistent patterns over time.`);
    }

    // Tone balance insight
    if (positivePercentage > 60) {
      insights.push("This relationship has had more positive moments recently.");
    } else if (positivePercentage < 30) {
      insights.push("There have been several challenging interactions. Worth reflecting on what patterns emerge.");
    } else {
      insights.push("There's a mix of interactions — a balanced, realistic perspective.");
    }

    // Consistency insight
    if (neutralCount > positiveCount + challengingCount) {
      insights.push("Many neutral interactions suggest a stable, steady connection.");
    }

    // Score-based insight
    if (averageScore > 5) {
      insights.push("Overall emotional tone trends positive with this relationship.");
    } else if (averageScore < -5) {
      insights.push("The emotional tenor leans challenging. Consider what support might help.");
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
          <h2 className="section-title">Relationships</h2>
          <p className="text-mindtrack-stone/80 max-w-2xl">
            Reflect on your relationships with emotional honesty. Track interactions, notice patterns, and understand the dynamics without judgment.
          </p>
        </motion.div>

        {/* OVERVIEW GRAPH */}
        {relationships.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mindtrack-card mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-mindtrack-sage" />
              <h3 className="text-lg font-semibold text-mindtrack-stone">Relationship Trends</h3>
            </div>
            <div className="w-full overflow-x-auto">
              <ApexCharts
                type="bar"
                height={500}
                options={{
                  chart: {
                    id: 'relationship-bar',
                    toolbar: { show: false },
                    animations: { enabled: true, speed: 700 },
                    type: 'bar'
                  },
                  plotOptions: {
                    bar: {
                      horizontal: false,
                      columnWidth: '65%',
                      borderRadius: 8,
                      distributed: true,
                      barHeight: '85%'
                    }
                  },
                  dataLabels: { 
                    enabled: true,
                    formatter: function(val) {
                      return typeof val === 'number' ? val.toFixed(1) : String(val);
                    },
                    style: {
                      fontSize: '14px',
                      fontWeight: '600',
                      colors: ['#2d3728']
                    }
                  },
                  xaxis: {
                    categories: relationships
                      .slice()
                      .sort((a, b) => getAverageScore(b) - getAverageScore(a))
                      .map(r => r.name),
                    labels: { 
                      style: { 
                        colors: '#8a9a5b', 
                        fontSize: '14px',
                        fontWeight: '500'
                      },
                      offsetY: 5,
                      hideOverlappingLabels: false
                    }
                  },
                  yaxis: {
                    min: -10,
                    max: 10,
                    tickAmount: 20,
                    labels: { 
                      style: { 
                        colors: '#8a9a5b', 
                        fontSize: '12px'
                      },
                      formatter: (val) => {
                        return val.toFixed(0);
                      }
                    }
                  },
                  grid: {
                    show: true,
                    borderColor: '#e8ede3',
                    xaxis: { lines: { show: false } },
                    yaxis: {
                      lines: { 
                        show: true
                      }
                    },
                    padding: { top: 20, right: 20, bottom: 20, left: 10 }
                  },
                  tooltip: {
                    custom: ({ series, seriesIndex, dataPointIndex, w }) => {
                      const rel = relationships
                        .slice()
                        .sort((a, b) => getAverageScore(b) - getAverageScore(a))[dataPointIndex];
                      return `<div style="padding:8px 12px;"><div style="font-weight:600; color:#8a9a5b;">${rel.name}</div><div>Avg Score: <b>${getAverageScore(rel)}</b></div><div>Entries: <b>${rel.entries.length}</b></div><div>Last Entry: <b>${rel.entries[0] ? new Date(rel.entries[0].date).toLocaleDateString() : '-'}</b></div></div>`;
                    }
                  },
                  colors: relationships
                    .slice()
                    .sort((a, b) => getAverageScore(b) - getAverageScore(a))
                    .map((r) => {
                      const score = getAverageScore(r);
                      if (score > 0) {
                        // Green for positive: lighter at low values, darker at high values
                        const intensity = score / 10; // 0.1 to 1.0
                        const greenValues = [144, 238, 144, 34, 139, 34, 0, 100, 0]; // Light green to dark green
                        const lightGreen = Math.floor(144 + (34 - 144) * intensity);
                        const darkGreen = Math.floor(238 + (139 - 238) * intensity);
                        return `rgb(${lightGreen}, ${darkGreen}, ${lightGreen})`;
                      } else {
                        // Red for negative: lighter at values near 0, darker at -10
                        const intensity = Math.abs(score) / 10; // 0 to 1.0
                        const redValue = Math.floor(255 - (255 - 139) * intensity);
                        const greenBlueValue = Math.floor(182 * (1 - intensity));
                        return `rgb(${redValue}, ${greenBlueValue}, ${greenBlueValue})`;
                      }
                    })
                }}
                series={[{
                  name: 'Score',
                  data: relationships
                    .slice()
                    .sort((a, b) => getAverageScore(b) - getAverageScore(a))
                    .map(r => getAverageScore(r))
                }]}
              />
            </div>
          </motion.div>
        )}

        <div className="space-y-6">
          {/* FILTERS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mindtrack-card p-6"
          >
            <h3 className="text-lg font-semibold text-mindtrack-stone mb-4">Filters & Search</h3>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-mindtrack-stone mb-2">Search by Name</label>
              <input
                type="text"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="Search relationships..."
                aria-label="Search relationships by name"
                className="w-full px-3 py-2 border border-mindtrack-sage/20 rounded-md focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
              />
            </div>

            {/* Relationship Type Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-mindtrack-stone mb-2">Relationship Type</label>
              <div className="flex flex-wrap gap-2">
                {['all', 'Partner', 'Friend', 'Family', 'Colleague', 'Work', 'Self', 'Other'].map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      filterType === type
                        ? 'bg-mindtrack-sage text-white'
                        : 'bg-white text-mindtrack-stone hover:bg-mindtrack-sage/5 border border-mindtrack-sage/20'
                    }`}
                  >
                    {type === 'all' ? 'All Types' : type}
                  </button>
                ))}
              </div>
            </div>

            {/* Emotional Tone Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-mindtrack-stone mb-2">Emotional Tone</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterTone('all')}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    filterTone === 'all'
                      ? 'bg-mindtrack-sage text-white'
                      : 'bg-white text-mindtrack-stone hover:bg-mindtrack-sage/5 border border-mindtrack-sage/20'
                  }`}
                >
                  All Tones
                </button>
                <button
                  onClick={() => setFilterTone('positive')}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    filterTone === 'positive'
                      ? 'bg-green-500 text-white'
                      : 'bg-white text-mindtrack-stone hover:bg-green-50 border border-green-200'
                  }`}
                >
                  Positive
                </button>
                <button
                  onClick={() => setFilterTone('neutral')}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    filterTone === 'neutral'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-mindtrack-stone hover:bg-blue-50 border border-blue-200'
                  }`}
                >
                  Neutral
                </button>
                <button
                  onClick={() => setFilterTone('challenging')}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    filterTone === 'challenging'
                      ? 'bg-amber-500 text-white'
                      : 'bg-white text-mindtrack-stone hover:bg-amber-50 border border-amber-200'
                  }`}
                >
                  Challenging
                </button>
              </div>
            </div>

            {/* Date Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-mindtrack-stone mb-2">Date Range</label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs text-mindtrack-stone/70">Start Date</label>
                  <input
                    type="date"
                    value={dateStart}
                    onChange={(e) => setDateStart(e.target.value)}
                    aria-label="Filter by start date"
                    className="w-full mt-1 px-3 py-2 border border-mindtrack-sage/20 rounded-md focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-mindtrack-stone/70">End Date</label>
                  <input
                    type="date"
                    value={dateEnd}
                    onChange={(e) => setDateEnd(e.target.value)}
                    aria-label="Filter by end date"
                    className="w-full mt-1 px-3 py-2 border border-mindtrack-sage/20 rounded-md focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
                  />
                </div>
              </div>
            </div>

            {/* Favorites Toggle & Reset */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
                  showFavoritesOnly
                    ? 'bg-mindtrack-sage text-white'
                    : 'text-mindtrack-sage hover:bg-mindtrack-sage/5 border border-mindtrack-sage/20'
                }`}
                aria-label={showFavoritesOnly ? "Show all relationships" : "Show only favorites"}
                title={showFavoritesOnly ? "Show all relationships" : "Show only favorites"}
              >
                <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-white' : ''}`} />
                <span className="text-sm">Favorites Only</span>
              </button>

              <button
                onClick={() => {
                  setFilterType('all');
                  setFilterTone('all');
                  setFilterName('');
                  setDateStart('');
                  setDateEnd('');
                  setShowFavoritesOnly(false);
                }}
                className="ml-auto px-3 py-1.5 rounded-md text-mindtrack-sage hover:bg-mindtrack-sage/5 border border-mindtrack-sage/20 transition-colors text-sm font-medium"
                aria-label="Reset all filters"
                title="Reset all filters"
              >
                Reset Filters
              </button>
            </div>
          </motion.div>

          {/* ADD NEW RELATIONSHIP */}
          {!isAdding && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAdding(true)}
              className="w-full mindtrack-card flex items-center justify-center gap-2 text-mindtrack-sage hover:text-mindtrack-sage/80"
            >
              <Plus className="w-5 h-5" />
              Add Relationship
            </motion.button>
          )}

          {isAdding && (
            <RelationshipForm
              onSubmit={addRelationship}
              onCancel={() => setIsAdding(false)}
            />
          )}

          {/* RELATIONSHIP CARDS */}
          <div className="space-y-4 max-h-[800px] overflow-y-auto">
            {filteredRelationships.map((relationship, index) => (
              <motion.div
                key={relationship.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
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
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <Users className="w-5 h-5 text-mindtrack-sage flex-shrink-0" />
                        <div>
                          <h3 className="text-lg font-semibold text-mindtrack-stone">{relationship.name}</h3>
                          <p className="text-sm text-mindtrack-stone/70">{relationship.type}</p>
                          {relationship.description && (
                            <p className="text-sm text-mindtrack-stone/60 mt-1">{relationship.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleFavorite(relationship.id)}
                          className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                          aria-label={relationship.isFavorite ? "Remove from favorites" : "Add to favorites"}
                          title={relationship.isFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                          <Heart
                            className={`w-4 h-4 ${relationship.isFavorite ? 'fill-mindtrack-sage text-mindtrack-sage' : 'text-mindtrack-sage'}`}
                          />
                        </button>
                        <button
                          onClick={() => setEditingId(relationship.id)}
                          className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                          aria-label="Edit relationship"
                          title="Edit relationship"
                        >
                          <Pencil className="w-4 h-4 text-mindtrack-sage" />
                        </button>
                        <button
                          onClick={() => deleteRelationship(relationship.id)}
                          className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                          aria-label="Delete relationship"
                          title="Delete relationship"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                        <button
                          onClick={() => setExpandedId(expandedId === relationship.id ? null : relationship.id)}
                          className="p-1 hover:bg-mindtrack-sage/5 rounded-full transition-colors"
                          aria-label={expandedId === relationship.id ? "Collapse details" : "Expand details"}
                          title={expandedId === relationship.id ? "Collapse details" : "Expand details"}
                        >
                          {expandedId === relationship.id ? (
                            <ChevronUp className="w-4 h-4 text-mindtrack-sage" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-mindtrack-sage" />
                          )}
                        </button>
                      </div>
                    </div>
                    {/* Mini Trend Curve - Always Visible */}
                    {relationship.entries.length > 0 && (
                      <div className="mb-4 h-40 w-full border border-mindtrack-sage/20 rounded-md p-2 bg-white">
                        <ApexCharts
                          type="area"
                          height={140}
                          options={{
                            chart: {
                              id: `trend-${relationship.id}`,
                              toolbar: { show: false },
                              animations: { enabled: true, speed: 700 },
                              background: 'transparent',
                              sparkline: { enabled: false },
                              parentHeightOffset: 0,
                              zoom: { enabled: false },
                              selection: { enabled: false }
                            },
                            stroke: { 
                              curve: 'smooth', 
                              width: 1.5,
                              colors: ['#8a9a5b']
                            },
                            fill: {
                              type: 'gradient',
                              gradient: {
                                shadeIntensity: 0.9,
                                opacityFrom: 0.8,
                                opacityTo: 0.8,
                                stops: [0, 100]
                              },
                              colors: ['#4a9d6f']
                            },
                            markers: {
                              size: 5,
                              colors: relationship.entries.map(e => {
                                const t = getToneFromScore(e.emotionalScore);
                                if (t === 'positive') return '#6fcf97';
                                if (t === 'challenging') return '#eb5757';
                                return '#f2c94c';
                              }),
                              strokeColors: '#fff',
                              strokeWidth: 2,
                              hover: { size: 5 }
                            },
                            xaxis: {
                              type: 'category',
                              categories: relationship.entries.map((_, i) => ''),
                              axisBorder: { show: false },
                              axisTicks: { show: false },
                              labels: { show: false },
                              crosshairs: { show: false },
                              tooltip: { enabled: false }
                            },
                            yaxis: {
                              min: -10,
                              max: 10,
                              tickAmount: 5,
                              labels: { 
                                style: { colors: '#8a9a5b', fontSize: '11px' },
                                offsetX: -5
                              },
                              axisBorder: { show: false },
                              axisTicks: { show: false },
                              crosshairs: { show: false }
                            },
                            tooltip: {
                              theme: 'light',
                              custom: ({ series, seriesIndex, dataPointIndex, w }) => {
                                const entry = relationship.entries.slice().reverse()[dataPointIndex];
                                if (!entry) return '';
                                const toneLabel = getToneFromScore(entry.emotionalScore) === 'positive' ? 'Positive' : getToneFromScore(entry.emotionalScore) === 'challenging' ? 'Challenging' : 'Neutral';
                                return `<div style="padding:8px 12px; background:#fff8f3; border:1px solid #ddd; border-radius:4px; font-size:12px;"><div style="font-weight:600; color:#8a9a5b;">${entry.description}</div><div style="color:#666; margin-top:4px; font-size:11px;">Score: <b>${entry.emotionalScore}</b> (${toneLabel})</div><div style="color:#666; font-size:11px;">${new Date(entry.date).toLocaleDateString()}</div></div>`;
                              }
                            },
                            grid: {
                              show: true,
                              borderColor: '#f0f0f0',
                              strokeDashArray: 0,
                              xaxis: { lines: { show: false } },
                              yaxis: { 
                                lines: { 
                                  show: true
                                }
                              },
                              padding: { top: 10, right: 10, bottom: 10, left: 0 }
                            }
                          }}
                          series={[{
                            name: 'Score',
                            data: relationship.entries.map(e => e.emotionalScore).reverse()
                          }]}
                        />
                      </div>
                    )}

                    {/* Summary Stats & Show More Button */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-4 text-sm">
                        <div>
                          <span className="text-mindtrack-stone/70">Avg Score: </span>
                          <span className="font-semibold text-mindtrack-stone">{getAverageScore(relationship).toFixed(1)}</span>
                        </div>
                        <div>
                          <span className="text-mindtrack-stone/70">Entries: </span>
                          <span className="font-semibold text-mindtrack-stone">{relationship.entries.length}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setExpandedId(expandedId === relationship.id ? null : relationship.id)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-mindtrack-sage/10 text-mindtrack-sage rounded-md hover:bg-mindtrack-sage/20 transition-colors font-medium"
                        aria-label={expandedId === relationship.id ? "Show less" : "Show more"}
                        title={expandedId === relationship.id ? "Collapse" : "Expand"}
                      >
                        {expandedId === relationship.id ? 'Show Less' : 'Show More'}
                        {expandedId === relationship.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Expanded Details */}
                    {expandedId === relationship.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-mindtrack-sage/10 pt-4 mt-4"
                      >
                        {/* Insights */}
                        <div className="mb-4">
                          <h4 className="font-medium text-mindtrack-stone mb-2">Reflections</h4>
                          <ul className="space-y-1">
                            {generateInsights(relationship).map((insight, i) => (
                              <li key={i} className="text-sm text-mindtrack-stone/80 flex gap-2">
                                <span className="text-mindtrack-sage">•</span>
                                <span>{insight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Entries List */}
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-medium text-mindtrack-stone">Entries</h4>
                            {addingEntryId !== relationship.id && (
                              <button
                                onClick={() => setAddingEntryId(relationship.id)}
                                className="flex items-center gap-1 text-sm text-mindtrack-sage hover:underline"
                              >
                                <Plus className="w-3 h-3" />
                                Add Entry
                              </button>
                            )}
                          </div>

                          {addingEntryId === relationship.id && (
                            <EntryForm
                              onSubmit={(entry) => addEntryToRelationship(relationship.id, entry)}
                              onCancel={() => setAddingEntryId(null)}
                            />
                          )}

                          <div className="space-y-3 max-h-[400px] overflow-y-auto">
                            {relationship.entries.length === 0 ? (
                              <p className="text-sm text-mindtrack-stone/60 italic">No entries yet. Add one to start reflecting.</p>
                            ) : (
                              relationship.entries.map((entry) => (
                                <RelationshipEntryCard
                                  key={entry.id}
                                  entry={entry}
                                  onUpdate={(updated) => updateEntry(relationship.id, updated)}
                                  onDelete={() => deleteEntry(relationship.id, entry.id)}
                                  onToggleFavorite={() => toggleEntryFavorite(relationship.id, entry.id)}
                                />
                              ))
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </motion.div>
            ))}
          </div>

          {/* EMPTY STATES */}
          {relationships.length === 0 && !isAdding && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mindtrack-card flex items-center gap-3 text-mindtrack-stone/70"
            >
              <AlertCircle className="w-5 h-5" />
              <p>No relationships yet. Add one to start reflecting on your connections.</p>
            </motion.div>
          )}

          {relationships.length > 0 && filteredRelationships.length === 0 && !isAdding && (
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

export default RelationshipTracker;

// RELATIONSHIP FORM
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
  const [useCustomType, setUseCustomType] = useState(
    initialData?.type && !['Partner', 'Friend', 'Family', 'Colleague', 'Work', 'Self', 'Other'].includes(initialData.type)
  );

  const defaultTypes = ['Partner', 'Friend', 'Family', 'Colleague', 'Work', 'Self', 'Other'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.type) return;

    const capitalizedType = formData.type.charAt(0).toUpperCase() + formData.type.slice(1);

    const relationship: Relationship = {
      id: initialData?.id || Date.now(),
      name: formData.name.trim(),
      type: capitalizedType,
      description: formData.description.trim() || undefined,
      entries: initialData?.entries || [],
      createdAt: initialData?.createdAt || new Date().toISOString(),
      lastInteraction: initialData?.lastInteraction,
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
          Name (required)
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
          placeholder="Name or relationship identifier"
          required
          id="relationship-name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-mindtrack-stone mb-2" htmlFor="relationship-type">
          Relationship Type (required)
        </label>
        {!useCustomType ? (
          <div className="space-y-2">
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
              required
              id="relationship-type"
              title="Select relationship type"
            >
              <option value="">Select type</option>
              {defaultTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                setUseCustomType(true);
                setFormData({ ...formData, type: '' });
              }}
              className="text-xs text-mindtrack-sage hover:underline"
            >
              + Add custom type
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20"
              placeholder="Enter custom type (e.g., Mentor, Coach, Therapist)"
              required
              id="custom-relationship-type"
              title="Enter a custom relationship type"
            />
            <button
              type="button"
              onClick={() => {
                setUseCustomType(false);
                setFormData({ ...formData, type: '' });
              }}
              className="text-xs text-mindtrack-sage hover:underline"
            >
              ← Back to predefined types
            </button>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-mindtrack-stone mb-1">
          Description (optional)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20 resize-none min-h-[80px]"
          placeholder="Add context about this relationship..."
          id="relationship-description"
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
          disabled={!formData.name.trim() || !formData.type}
        >
          {initialData ? 'Update' : 'Add'} Relationship
        </button>
      </div>
    </motion.form>
  );
};

// ENTRY FORM
const EntryForm = ({
  onSubmit,
  onCancel
}: {
  onSubmit: (entry: RelationshipEntry) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    emotionalScore: 0,
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim()) return;

    const entry: RelationshipEntry = {
      id: Date.now(),
      emotionalScore: formData.emotionalScore,
      description: formData.description.trim(),
      date: new Date().toISOString(),
      isFavorite: false
    };

    onSubmit(entry);
    setFormData({ emotionalScore: 0, description: '' });
  };

  const tone = getToneFromScore(formData.emotionalScore);
  const toneColor = {
    positive: 'text-green-600',
    neutral: 'text-blue-600',
    challenging: 'text-amber-600'
  };
  const toneLabel = {
    positive: 'Positive',
    neutral: 'Neutral',
    challenging: 'Challenging'
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 p-4 bg-mindtrack-sage/5 rounded-md mb-4 border border-mindtrack-sage/10"
      onSubmit={handleSubmit}
    >
      <div>
        <label className="block text-sm font-medium text-mindtrack-stone mb-2" htmlFor="entry-description">
          What happened? (required)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20 resize-none min-h-[80px]"
          placeholder="Describe this interaction or moment..."
          required
          id="entry-description"
          title="Describe your experience"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-mindtrack-stone">
            How did it feel emotionally?
          </label>
          <span className={`text-sm font-semibold ${toneColor[tone]}`}>
            {toneLabel[tone]} ({formData.emotionalScore})
          </span>
        </div>
        <input
          type="range"
          min="-10"
          max="10"
          step="1"
          value={formData.emotionalScore}
          onChange={(e) => setFormData({ ...formData, emotionalScore: parseInt(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          id="emotional-score"
          aria-label="Rate emotional state from -10 to +10"
        />
        <div className="flex justify-between text-xs text-mindtrack-stone/60 mt-1">
          <span>-10 (Very Challenging)</span>
          <span>0 (Neutral)</span>
          <span>+10 (Very Positive)</span>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-sm text-mindtrack-stone hover:bg-mindtrack-sage/5 rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-1.5 text-sm bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors disabled:opacity-50"
          disabled={!formData.description.trim()}
        >
          Add Entry
        </button>
      </div>
    </motion.form>
  );
};

// RELATIONSHIP ENTRY CARD
const RelationshipEntryCard = ({
  entry,
  onUpdate,
  onDelete,
  onToggleFavorite
}: {
  entry: RelationshipEntry;
  onUpdate: (entry: RelationshipEntry) => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(entry);

  const tone = getToneFromScore(entry.emotionalScore);

  const toneColor = {
    positive: 'bg-green-50 border-green-200',
    neutral: 'bg-blue-50 border-blue-200',
    challenging: 'bg-amber-50 border-amber-200'
  };

  const toneLabelColor = {
    positive: 'bg-green-100 text-green-800',
    neutral: 'bg-blue-100 text-blue-800',
    challenging: 'bg-amber-100 text-amber-800'
  };

  const handleUpdate = () => {
    onUpdate({ ...editData, date: entry.date });
    setIsEditing(false);
  };

  const editTone = getToneFromScore(editData.emotionalScore);
  const editToneColor = {
    positive: 'text-green-600',
    neutral: 'text-blue-600',
    challenging: 'text-amber-600'
  };
  const editToneLabel = {
    positive: 'Positive',
    neutral: 'Neutral',
    challenging: 'Challenging'
  };

  if (isEditing) {
    return (
      <div className={`p-3 rounded-md border ${toneColor[editTone]}`}>
        <div className="space-y-2 mb-2">
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="w-full p-2 rounded-md border border-mindtrack-sage/20 focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/20 resize-none min-h-[60px]"
            placeholder="Edit entry"
            title="Edit entry description"
          />
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-mindtrack-stone">
                How did it feel emotionally?
              </label>
              <span className={`text-xs font-semibold ${editToneColor[editTone]}`}>
                {editToneLabel[editTone]} ({editData.emotionalScore})
              </span>
            </div>
            <input
              type="range"
              min="-10"
              max="10"
              step="1"
              value={editData.emotionalScore}
              onChange={(e) => setEditData({ ...editData, emotionalScore: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              aria-label="Rate emotional state from -10 to +10"
            />
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setIsEditing(false)}
            className="px-2 py-1 text-xs text-mindtrack-stone hover:bg-white/50 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-2 py-1 text-xs bg-mindtrack-sage text-white rounded hover:bg-mindtrack-sage/90 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-3 rounded-md border ${toneColor[tone]}`}
    >
      <div className="flex justify-between items-start gap-2 mb-2">
        <p className="text-sm text-mindtrack-stone flex-1">{entry.description}</p>
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={onToggleFavorite}
            className="p-0.5 hover:bg-white/50 rounded transition-colors"
            aria-label={entry.isFavorite ? "Remove from favorites" : "Add to favorites"}
            title={entry.isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`w-3 h-3 ${entry.isFavorite ? 'fill-red-500 text-red-500' : 'text-mindtrack-stone/40'}`}
            />
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="p-0.5 hover:bg-white/50 rounded transition-colors"
            aria-label="Edit entry"
            title="Edit entry"
          >
            <Pencil className="w-3 h-3 text-mindtrack-stone/40 hover:text-mindtrack-sage" />
          </button>
          <button
            onClick={onDelete}
            className="p-0.5 hover:bg-white/50 rounded transition-colors"
            aria-label="Delete entry"
            title="Delete entry"
          >
            <Trash2 className="w-3 h-3 text-red-400 hover:text-red-600" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <span className={`px-2 py-0.5 rounded-full ${toneLabelColor[tone]}`}>
          {tone}
        </span>
        <span className="text-mindtrack-stone/60">
          Score: <span className="font-semibold">{entry.emotionalScore}</span>
        </span>
        <span className="text-mindtrack-stone/60">
          {new Date(entry.date).toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );
};
