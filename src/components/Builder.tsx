import { useState, useRef, useEffect } from 'react';
import { Sparkles, FileCode, Eye, FolderOpen, Download } from 'lucide-react';
import ComponentLibrary from './ComponentLibrary';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';
import CSSEditor from './CSSEditor';
import AIModal from './AIModal';
import Tooltip from './Tooltip';
import OnboardingTips from './OnboardingTips';
import { Component, OnboardingTip } from '../types';
import { generateHTMLFromComponents, generateCSSFromComponents, generateSeparateCSS } from '../utils/codeGenerator';
import { AIService, AIConfig } from '../services/aiService';

interface BuilderProps {
  initialComponents?: Component[];
}

export default function Builder({ initialComponents = [] }: BuilderProps) {
  const [components, setComponents] = useState<Component[]>(initialComponents);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [showCSS, setShowCSS] = useState(false);
  const [customCSS, setCustomCSS] = useState<string>('');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canvasBg, setCanvasBg] = useState('#ffffff');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [onboardingTips, setOnboardingTips] = useState<Record<OnboardingTip['trigger'], boolean>>({
    'first-component': false,
    'first-css-edit': false,
    'first-class-create': false,
    'first-export': false,
  });

  const selectedComponent = components.find((c) => c.id === selectedComponentId) || null;

  useEffect(() => {
    if (components.length > 0 && !onboardingTips['first-component']) {
      setTimeout(() => {}, 500);
    }
  }, [components.length]);

  useEffect(() => {
    const generatedCSS = generateCSSFromComponents(components);
    if (!customCSS) {
      setCustomCSS(generatedCSS);
    }
  }, [components]);

  const handleAddComponent = (component: Component) => {
    setComponents([...components, component]);
    if (components.length === 0) {
    }
  };

  const handleUpdateComponent = (updatedComponent: Component) => {
    setComponents(
      components.map((c) => (c.id === updatedComponent.id ? updatedComponent : c))
    );
    const newCSS = generateCSSFromComponents(
      components.map((c) => (c.id === updatedComponent.id ? updatedComponent : c))
    );
    setCustomCSS(newCSS);
  };

  const handleDeleteComponent = () => {
    if (selectedComponentId) {
      setComponents(components.filter((c) => c.id !== selectedComponentId));
      setSelectedComponentId(null);
    }
  };

  const handleAIGenerate = async (prompt: string, config: AIConfig) => {
    setIsGenerating(true);
    setError(null);

    try {
      const aiService = new AIService(config);
      const response = await aiService.generateComponents(prompt);

      if (response.error) {
        setError(response.error);
      } else if (response.components.length > 0) {
        setComponents(response.components);
        setIsAIModalOpen(false);
      } else {
        setError('No components generated. Try a different prompt.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate components');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCSSChange = (newCSS: string) => {
    setCustomCSS(newCSS);
    if (!onboardingTips['first-css-edit']) {
    }
  };

  const handleCreateClass = () => {
    const className = prompt('Enter new class name (without dot):');
    if (className) {
      const newRule = `.${className} {\n  \n}\n\n`;
      setCustomCSS(customCSS + newRule);
    }
  };

  const handleExport = () => {
    const html = generateHTMLFromComponents(components, canvasBg, customCSS);
    const css = generateSeparateCSS(components, canvasBg, customCSS);

    const zip = {
      'index.html': html,
      'styles.css': css,
    };

    const zipContent = JSON.stringify(zip, null, 2);
    const blob = new Blob([zipContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chillbuild-export-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveProject = () => {
    const project = {
      name: 'ChillBuild Project',
      components,
      customCSS,
      canvasBg,
      onboardingTips,
      savedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chillbuild-project-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoadProject = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const project = JSON.parse(content);
          if (project.components) {
            setComponents(project.components);
            setCustomCSS(project.customCSS || '');
            setCanvasBg(project.canvasBg || '#ffffff');
            if (project.onboardingTips) {
              setOnboardingTips(project.onboardingTips);
            }
            setError(null);
          } else {
            setError('Invalid project file');
          }
        } catch (err) {
          setError('Failed to load project file');
        }
      };
      reader.readAsText(file);
    }
  };

  const dismissTip = (trigger: OnboardingTip['trigger']) => {
    setOnboardingTips({ ...onboardingTips, [trigger]: true });
  };

  return (
    <div className="builder">
      <header className="builder-header">
        <div className="builder-logo">
          <Sparkles size={24} />
          <h1>CHILLBUILD</h1>
        </div>

        <div className="builder-actions">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <Tooltip content="Save your project as JSON to continue editing later">
            <button className="action-btn" onClick={handleSaveProject}>
              <FolderOpen size={18} />
              Save
            </button>
          </Tooltip>
          <Tooltip content="Load a previously saved project">
            <button className="action-btn" onClick={handleLoadProject}>
              <FolderOpen size={18} />
              Load
            </button>
          </Tooltip>
          <Tooltip content="Export your design as HTML and CSS files">
            <button className="action-btn" onClick={handleExport}>
              <Download size={18} />
              Export
            </button>
          </Tooltip>
          <Tooltip content="Generate a website design using AI">
            <button className="action-btn ai-btn" onClick={() => setIsAIModalOpen(true)}>
              <Sparkles size={18} />
              AI Generate
            </button>
          </Tooltip>
          <Tooltip content={showCSS ? 'Switch back to visual canvas' : 'Edit CSS styles directly'}>
            <button
              className={`action-btn ${showCSS ? 'active' : ''}`}
              onClick={() => setShowCSS(!showCSS)}
            >
              {showCSS ? <Eye size={18} /> : <FileCode size={18} />}
              {showCSS ? 'Canvas' : 'CSS'}
            </button>
          </Tooltip>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="builder-workspace">
        <aside className="builder-sidebar left">
          <ComponentLibrary onAddComponent={handleAddComponent} />
        </aside>

        <main className="builder-main">
          {showCSS ? (
            <CSSEditor
              css={customCSS}
              onChange={handleCSSChange}
              selectedComponent={selectedComponent}
              onCreateClass={handleCreateClass}
            />
          ) : (
            <Canvas
              components={components}
              onComponentsChange={setComponents}
              selectedComponentId={selectedComponentId}
              onSelectComponent={setSelectedComponentId}
              canvasBg={canvasBg}
              onCanvasBgChange={setCanvasBg}
            />
          )}
        </main>

        <aside className="builder-sidebar right">
          <PropertiesPanel
            component={selectedComponent}
            onUpdateComponent={handleUpdateComponent}
            onDeleteComponent={handleDeleteComponent}
          />
        </aside>
      </div>

      <AIModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onGenerate={handleAIGenerate}
        isGenerating={isGenerating}
      />

      {components.length === 1 && (
        <OnboardingTips
          trigger="first-component"
          onDismiss={dismissTip}
          shown={onboardingTips['first-component']}
        />
      )}

      {showCSS && customCSS && (
        <OnboardingTips
          trigger="first-css-edit"
          onDismiss={dismissTip}
          shown={onboardingTips['first-css-edit']}
        />
      )}
    </div>
  );
}
