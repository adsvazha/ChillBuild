import { useState } from 'react';
import LandingPage from './components/LandingPage';
import ModeSelection from './components/ModeSelection';
import APIConfig from './components/APIConfig';
import AIBuilderMode from './components/AIBuilderMode';
import Builder from './components/Builder';
import { AIConfig } from './services/aiService';
import './App.css';

type AppView = 'landing' | 'mode-selection' | 'api-config' | 'ai-builder' | 'builder';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [aiConfig, setAiConfig] = useState<AIConfig | null>(null);

  const handleGetStarted = () => {
    setCurrentView('mode-selection');
  };

  const handleModeSelect = (mode: 'ai' | 'scratch') => {
    if (mode === 'ai') {
      setCurrentView('api-config');
    } else {
      setCurrentView('builder');
    }
  };

  const handleAPIConfigured = (config: AIConfig) => {
    setAiConfig(config);
    setCurrentView('ai-builder');
  };

  const handleBack = () => {
    setCurrentView('landing');
  };

  return (
    <div className="app">
      {currentView === 'landing' && (
        <LandingPage onGetStarted={handleGetStarted} />
      )}
      {currentView === 'mode-selection' && (
        <ModeSelection onSelectMode={handleModeSelect} onBack={handleBack} />
      )}
      {currentView === 'api-config' && (
        <APIConfig onConfigured={handleAPIConfigured} />
      )}
      {currentView === 'ai-builder' && aiConfig && (
        <AIBuilderMode aiConfig={aiConfig} />
      )}
      {currentView === 'builder' && (
        <Builder />
      )}
    </div>
  );
}

export default App;
