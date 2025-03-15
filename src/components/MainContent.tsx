
import React from "react";
import MoodTracker from "./mood-tracker/MoodTracker";
import TriggerTracker from "./TriggerTracker";
import GratitudeJournal from "./GratitudeJournal";
import CBTTechniques from "./cbt/CBTTechniques";
import DBTTechniques from "./dbt/DBTTechniques";
import GoalTracker from "./goal-tracker/GoalTracker";
import RelationshipTracker from "./RelationshipTracker";

interface MainContentProps {
  activeTab: string;
  showFavorites: boolean;
  moodRef: React.RefObject<HTMLDivElement>;
  triggerRef: React.RefObject<HTMLDivElement>;
  gratitudeRef: React.RefObject<HTMLDivElement>;
  cbtRef: React.RefObject<HTMLDivElement>;
  dbtRef: React.RefObject<HTMLDivElement>;
  goalsRef: React.RefObject<HTMLDivElement>;
  relationshipsRef: React.RefObject<HTMLDivElement>;
}

const MainContent = ({ 
  activeTab, 
  showFavorites, 
  moodRef, 
  triggerRef, 
  gratitudeRef, 
  cbtRef, 
  dbtRef,
  goalsRef,
  relationshipsRef
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
      <div id="dbt" ref={dbtRef}>
        {activeTab === "dbt" && <DBTTechniques showOnlyFavorites={showFavorites} />}
      </div>
      <div id="goals" ref={goalsRef}>
        {activeTab === "goals" && <GoalTracker showOnlyFavorites={showFavorites} />}
      </div>
      <div id="relationships" ref={relationshipsRef}>
        {activeTab === "relationships" && <RelationshipTracker showOnlyFavorites={showFavorites} />}
      </div>
    </>
  );
};

export default MainContent;
