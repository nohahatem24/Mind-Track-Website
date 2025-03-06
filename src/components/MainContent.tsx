
import React from "react";
import MoodTracker from "./mood-tracker/MoodTracker";
import TriggerTracker from "./TriggerTracker";
import GratitudeJournal from "./GratitudeJournal";
import CBTTechniques from "./CBTTechniques";
import GoalTracker from "./GoalTracker";

interface MainContentProps {
  activeTab: string;
  showFavorites: boolean;
  moodRef: React.RefObject<HTMLDivElement>;
  triggerRef: React.RefObject<HTMLDivElement>;
  gratitudeRef: React.RefObject<HTMLDivElement>;
  cbtRef: React.RefObject<HTMLDivElement>;
  goalsRef: React.RefObject<HTMLDivElement>;
}

const MainContent = ({ 
  activeTab, 
  showFavorites, 
  moodRef, 
  triggerRef, 
  gratitudeRef, 
  cbtRef, 
  goalsRef 
}: MainContentProps) => {
  return (
    <>
      <div id="mood" ref={moodRef}>
        {activeTab === "mood" && <MoodTracker showOnlyFavorites={showFavorites} />}
      </div>
      <div id="trigger" ref={triggerRef}>
        {activeTab === "trigger" && <TriggerTracker showOnlyFavorites={showFavorites} />}
      </div>
      <div id="gratitude" ref={gratitudeRef}>
        {activeTab === "gratitude" && <GratitudeJournal showOnlyFavorites={showFavorites} />}
      </div>
      <div id="cbt" ref={cbtRef}>
        {activeTab === "cbt" && <CBTTechniques showOnlyFavorites={showFavorites} />}
      </div>
      <div id="goals" ref={goalsRef}>
        {activeTab === "goals" && <GoalTracker showOnlyFavorites={showFavorites} />}
      </div>
    </>
  );
};

export default MainContent;
