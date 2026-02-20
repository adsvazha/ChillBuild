import { useState } from 'react';
import AIChat from './AIChat';
import Builder from './Builder';
import { Component } from '../types';
import { AIConfig } from '../services/aiService';

interface AIBuilderModeProps {
  aiConfig: AIConfig;
}

export default function AIBuilderMode({ aiConfig }: AIBuilderModeProps) {
  const [showCanvas, setShowCanvas] = useState(false);
  const [initialComponents, setInitialComponents] = useState<Component[]>([]);

  const handleComponentsGenerated = (components: Component[]) => {
    setInitialComponents(components);
  };

  const handleProceedToCanvas = () => {
    setShowCanvas(true);
  };

  if (showCanvas) {
    return <Builder initialComponents={initialComponents} />;
  }

  return (
    <AIChat
      onComponentsGenerated={handleComponentsGenerated}
      onProceedToCanvas={handleProceedToCanvas}
      aiConfig={aiConfig}
    />
  );
}
