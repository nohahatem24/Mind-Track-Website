
import React from "react";

interface DashboardTabsProps {
  activeTab: string;
  handleTabChange: (tabId: string) => void;
}

const DashboardTabs = ({ activeTab, handleTabChange }: DashboardTabsProps) => {
  return (
    <div className="mindtrack-container mb-8">
      <div className="border-b border-mindtrack-sage/10">
        <div className="flex overflow-x-auto no-scrollbar">
          <button
            onClick={() => handleTabChange("mood")}
            className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${
              activeTab === "mood"
                ? "border-mindtrack-sage text-mindtrack-sage"
                : "border-transparent text-mindtrack-stone/70 hover:text-mindtrack-stone"
            }`}
          >
            Mood Tracking
          </button>
          <button
            onClick={() => handleTabChange("trigger")}
            className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${
              activeTab === "trigger"
                ? "border-mindtrack-sage text-mindtrack-sage"
                : "border-transparent text-mindtrack-stone/70 hover:text-mindtrack-stone"
            }`}
          >
            Trigger Tracking
          </button>
          <button
            onClick={() => handleTabChange("gratitude")}
            className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${
              activeTab === "gratitude"
                ? "border-mindtrack-sage text-mindtrack-sage"
                : "border-transparent text-mindtrack-stone/70 hover:text-mindtrack-stone"
            }`}
          >
            Gratitude Journal
          </button>
          <button
            onClick={() => handleTabChange("cbt")}
            className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${
              activeTab === "cbt"
                ? "border-mindtrack-sage text-mindtrack-sage"
                : "border-transparent text-mindtrack-stone/70 hover:text-mindtrack-stone"
            }`}
          >
            CBT Techniques
          </button>
          <button
            onClick={() => handleTabChange("dbt")}
            className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${
              activeTab === "dbt"
                ? "border-mindtrack-sage text-mindtrack-sage"
                : "border-transparent text-mindtrack-stone/70 hover:text-mindtrack-stone"
            }`}
          >
            DBT Techniques
          </button>
          <button
            onClick={() => handleTabChange("goals")}
            className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${
              activeTab === "goals"
                ? "border-mindtrack-sage text-mindtrack-sage"
                : "border-transparent text-mindtrack-stone/70 hover:text-mindtrack-stone"
            }`}
          >
            Goal Tracker
          </button>
          <button
            onClick={() => handleTabChange("relationships")}
            className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${
              activeTab === "relationships"
                ? "border-mindtrack-sage text-mindtrack-sage"
                : "border-transparent text-mindtrack-stone/70 hover:text-mindtrack-stone"
            }`}
          >
            Relationships
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardTabs;
