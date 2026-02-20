import { useState, useRef } from 'react';
import { Sparkles, Code as Code2, Eye, FolderOpen } from 'lucide-react';
import ComponentLibrary from './ComponentLibrary';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';
import CodePanel from './CodePanel';
import AIModal from './AIModal';
import { Component } from '../types';
import { generateHTMLFromComponents } from '../utils/codeGenerator';
import { AIService, AIConfig } from '../services/aiService';

interface BuilderProps {
  initialComponents?: Component[];
}

export default function Builder({ initialComponents = [] }: BuilderProps) {
  const [components, setComponents] = useState<Component[]>(initialComponents);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [customCode, setCustomCode] = useState<string>('');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canvasBg, setCanvasBg] = useState('#ffffff');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedComponent = components.find((c) => c.id === selectedComponentId) || null;

  const handleAddComponent = (component: Component) => {
    setComponents([...components, component]);
  };

  const handleUpdateComponent = (updatedComponent: Component) => {
    setComponents(
      components.map((c) => (c.id === updatedComponent.id ? updatedComponent : c))
    );
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

  const generatedCode = generateHTMLFromComponents(components, canvasBg);
  const displayCode = customCode || generatedCode;

  const handleCodeChange = (newCode: string) => {
    setCustomCode(newCode);
  };

  const handleSaveProject = () => {
    const project = {
      name: 'ChillBuild Project',
      components,
      customCode,
      canvasBg,
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
            setCustomCode(project.customCode || '');
            setCanvasBg(project.canvasBg || '#ffffff');
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
          <button className="action-btn" onClick={handleSaveProject}>
            <FolderOpen size={18} />
            Export
          </button>
          <button className="action-btn" onClick={handleLoadProject}>
            <FolderOpen size={18} />
            Import
          </button>
          <button className="action-btn ai-btn" onClick={() => setIsAIModalOpen(true)}>
            <Sparkles size={18} />
            AI Generate
          </button>
          <button
            className={`action-btn ${showCode ? 'active' : ''}`}
            onClick={() => setShowCode(!showCode)}
          >
            {showCode ? <Eye size={18} /> : <Code2 size={18} />}
            {showCode ? 'Preview' : 'Code'}
          </button>
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
          {showCode ? (
            <div style={{ display: 'flex', height: '100%', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <CodePanel code={displayCode} onChange={handleCodeChange} />
              </div>
              <div style={{ flex: 1, border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ background: '#1e1e1e', padding: '12px', borderBottom: '1px solid #333' }}>
                  <h3 style={{ margin: 0, color: '#fff', fontSize: '14px' }}>Live Preview</h3>
                </div>
                <iframe
                  style={{ width: '100%', height: 'calc(100% - 50px)', border: 'none', background: '#fff' }}
                  srcDoc={displayCode}
                  title="Preview"
                />
              </div>
            </div>
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
    </div>
  );
}
