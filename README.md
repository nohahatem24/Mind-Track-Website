# 🧠 MindTrack – A Mental Health Companion

**MindTrack** is a digital mental health companion designed to provide users with a safe space for self-reflection, mood tracking, and emotional support. Whether you're dealing with anxiety, stress, depression, or simply want to monitor your emotional well-being, MindTrack helps you understand and care for your mental health through interactive features, mood journaling, coping resources, and AI-powered insights.

## MindTrack Project Link

**URL**: https://mind-track-website-lcl4m147m-nohas-projects-cf33771a.vercel.app/
---

## 🌟 Key Features

### ✅ Core Functionalities:
- **Digital SafeBox**  
  A secure space where users can store thoughts, emotions, or memories. Encrypted and protected by user-defined passwords.

- **Mood Tracker with History**
  Users log their emotions daily, see patterns, and reflect on emotional trends through data visualization.

- **Coping Suggestions Engine**  
  Based on the current mood, the app offers personalized advice, CBT/DBT tips, calming activities, and journaling prompts.

- **Interactive Mind Maps**
  Visual, intuitive navigation to help users explore resources based on feelings, topics, or thought patterns.

- **AI-Powered Self-Help Assistant** *(Optional)*  
  An optional assistant that uses natural language processing to respond supportively to journal entries or distress signals.

### 🌍 Accessibility & Usability:
- **Multi-language Support**  
  Currently supports English and Arabic with RTL compatibility. Future support for additional languages planned.

- **Search & Filter System**  
  Users can search entries or resources by:
  - Emotion
  - Thought pattern
  - Age group
  - Geographical trends (based on common disorders in the area)

- **User Emotion Dashboard**
  - Timeline of all past moods and reflections.
  - Visualizations like mood graphs and word clouds.

- **Lightweight & Fast**  
  Optimized for performance using lightweight frameworks to ensure accessibility on low-bandwidth networks.

---



```
gratitude-trigger-map
├─ .hintrc
├─ bun.lockb
├─ components.json
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ public
│  ├─ logo.png
│  └─ placeholder.svg
├─ README.md
├─ src
│  ├─ App.css
│  ├─ App.tsx
│  ├─ components
│  │  ├─ auth
│  │  │  ├─ AuthButton.tsx
│  │  │  └─ AuthComponent.tsx
│  │  ├─ behavioral-activation
│  │  │  ├─ ActivityItem.tsx
│  │  │  ├─ AddActivityForm.tsx
│  │  │  ├─ BehavioralActivation.tsx
│  │  │  └─ types.ts
│  │  ├─ BehavioralActivation.tsx
│  │  ├─ cbt
│  │  │  ├─ BreathingExercise.tsx
│  │  │  ├─ CategoryFilter.tsx
│  │  │  ├─ CBTTechniqueHeader.tsx
│  │  │  ├─ CBTTechniques.tsx
│  │  │  ├─ CognitiveRestructuringExercise.tsx
│  │  │  ├─ ExerciseHistory.tsx
│  │  │  ├─ ExerciseRenderer.tsx
│  │  │  ├─ GroundingExercise.tsx
│  │  │  ├─ HistoryRenderer.tsx
│  │  │  ├─ hooks
│  │  │  │  └─ useCBTTechniques.tsx
│  │  │  ├─ progressive-relaxation
│  │  │  │  ├─ ControlButtons.tsx
│  │  │  │  ├─ ExerciseCompleted.tsx
│  │  │  │  ├─ Instructions.tsx
│  │  │  │  ├─ MuscleGroupItem.tsx
│  │  │  │  ├─ MuscleGroupsList.tsx
│  │  │  │  ├─ ProgressiveMuscleRelaxation.tsx
│  │  │  │  ├─ TimerDisplay.tsx
│  │  │  │  ├─ types.ts
│  │  │  │  └─ utils.ts
│  │  │  ├─ ProgressiveMuscleRelaxation.tsx
│  │  │  ├─ techniqueData.ts
│  │  │  ├─ TechniquesList.tsx
│  │  │  └─ types.ts
│  │  ├─ CBTTechniques.tsx
│  │  ├─ CustomTooltip.tsx
│  │  ├─ DashboardTabs.tsx
│  │  ├─ dbt
│  │  │  ├─ DBTTechniqueHeader.tsx
│  │  │  ├─ DBTTechniques.tsx
│  │  │  ├─ ExerciseHistory.tsx
│  │  │  ├─ ExerciseRenderer.tsx
│  │  │  ├─ exercises
│  │  │  │  ├─ EmotionRegulationExercise.tsx
│  │  │  │  ├─ InterpersonalEffectivenessExercise.tsx
│  │  │  │  ├─ StopSkillExercise.tsx
│  │  │  │  └─ WiseMindExercise.tsx
│  │  │  ├─ hooks
│  │  │  │  └─ useDBTTechniques.tsx
│  │  │  ├─ techniqueData.ts
│  │  │  ├─ TechniquesList.tsx
│  │  │  └─ types.ts
│  │  ├─ FavoritesButton.tsx
│  │  ├─ FeatureCard.tsx
│  │  ├─ Footer.tsx
│  │  ├─ goal-tracker
│  │  │  ├─ GoalData.tsx
│  │  │  ├─ GoalForm.tsx
│  │  │  ├─ GoalItem.tsx
│  │  │  ├─ GoalProgress.tsx
│  │  │  └─ GoalTracker.tsx
│  │  ├─ GoalTracker.tsx
│  │  ├─ gratitude
│  │  │  ├─ FavoritesToggle.tsx
│  │  │  ├─ GratitudeEntryItem.tsx
│  │  │  ├─ GratitudeEntryList.tsx
│  │  │  ├─ GratitudeForm.tsx
│  │  │  ├─ GratitudeHeader.tsx
│  │  │  └─ types.ts
│  │  ├─ GratitudeJournal.tsx
│  │  ├─ HeroSection.tsx
│  │  ├─ MainContent.tsx
│  │  ├─ mood-tracker
│  │  │  ├─ AddMoodButton.tsx
│  │  │  ├─ CalendarView.tsx
│  │  │  ├─ DateFilter.tsx
│  │  │  ├─ EmptyState.tsx
│  │  │  ├─ FavoritesToggle.tsx
│  │  │  ├─ MoodChart.tsx
│  │  │  ├─ MoodData.tsx
│  │  │  ├─ MoodEntry.tsx
│  │  │  ├─ MoodForm.tsx
│  │  │  ├─ MoodInsights.tsx
│  │  │  ├─ MoodTracker.tsx
│  │  │  ├─ TimeframeSelector.tsx
│  │  │  ├─ types.ts
│  │  │  └─ ViewToggle.tsx
│  │  ├─ Navigation.tsx
│  │  ├─ RelationshipTracker.tsx
│  │  ├─ ThoughtRecord.tsx
│  │  ├─ trigger-tracker
│  │  │  └─ TriggerCategoryAnalysis.tsx
│  │  ├─ TriggerTracker.tsx
│  │  └─ ui
│  │     ├─ accordion.tsx
│  │     ├─ alert-dialog.tsx
│  │     ├─ alert.tsx
│  │     ├─ aspect-ratio.tsx
│  │     ├─ avatar.tsx
│  │     ├─ badge.tsx
│  │     ├─ breadcrumb.tsx
│  │     ├─ button.tsx
│  │     ├─ calendar.tsx
│  │     ├─ card.tsx
│  │     ├─ carousel.tsx
│  │     ├─ chart.tsx
│  │     ├─ checkbox.tsx
│  │     ├─ collapsible.tsx
│  │     ├─ command.tsx
│  │     ├─ context-menu.tsx
│  │     ├─ dialog.tsx
│  │     ├─ drawer.tsx
│  │     ├─ dropdown-menu.tsx
│  │     ├─ form.tsx
│  │     ├─ hover-card.tsx
│  │     ├─ input-otp.tsx
│  │     ├─ input.tsx
│  │     ├─ label.tsx
│  │     ├─ menubar.tsx
│  │     ├─ navigation-menu.tsx
│  │     ├─ pagination.tsx
│  │     ├─ popover.tsx
│  │     ├─ progress.tsx
│  │     ├─ radio-group.tsx
│  │     ├─ resizable.tsx
│  │     ├─ scroll-area.tsx
│  │     ├─ select.tsx
│  │     ├─ separator.tsx
│  │     ├─ sheet.tsx
│  │     ├─ sidebar.tsx
│  │     ├─ skeleton.tsx
│  │     ├─ slider.tsx
│  │     ├─ sonner.tsx
│  │     ├─ switch.tsx
│  │     ├─ table.tsx
│  │     ├─ tabs.tsx
│  │     ├─ textarea.tsx
│  │     ├─ toast.tsx
│  │     ├─ toaster.tsx
│  │     ├─ toggle-group.tsx
│  │     ├─ toggle.tsx
│  │     ├─ tooltip.tsx
│  │     └─ use-toast.ts
│  ├─ hooks
│  │  ├─ use-mobile.tsx
│  │  ├─ use-toast.ts
│  │  └─ useGratitudeJournal.ts
│  ├─ index.css
│  ├─ integrations
│  │  └─ supabase
│  │     ├─ client.ts
│  │     └─ types.ts
│  ├─ lib
│  │  └─ utils.ts
│  ├─ main.tsx
│  ├─ pages
│  │  ├─ Index.tsx
│  │  └─ NotFound.tsx
│  └─ vite-env.d.ts
├─ supabase
│  └─ config.toml
├─ tailwind.config.ts
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts

```