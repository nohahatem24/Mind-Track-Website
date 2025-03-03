
import CBTTechniques from "@/components/CBTTechniques";
import GratitudeJournal from "@/components/GratitudeJournal";
import MoodTracker from "@/components/mood-tracker/MoodTracker";
import Navigation from "@/components/Navigation";
import TriggerTracker from "@/components/TriggerTracker";
import GoalTracker from "@/components/GoalTracker";
import DigitalSafeBox from "@/components/DigitalSafeBox";

const Index = () => (
  <div className="min-h-screen bg-white">
    <Navigation />
    <MoodTracker />
    <CBTTechniques />
    <DigitalSafeBox />
    <GratitudeJournal />
    <TriggerTracker />
    <GoalTracker />
  </div>
);

export default Index;
