import { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, FolderOpen, Download, Layout, Code2, Eye, Maximize, PanelLeft, PanelRight } from 'lucide-react';
import WorkspaceProvider, { useWorkspace } from './WorkspaceProvider';
import ResizablePanel from './ResizablePanel';
import ComponentLibrary from './ComponentLibrary';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';
import CSSEditor from './CSSEditor';
import HTMLEditor from './HTMLEditor';
import PageTabs from './PageTabs';
import AIModal from './AIModal';
import Tooltip from './Tooltip';
import OnboardingTips from './OnboardingTips';
import { Component, Page, OnboardingTip, LayoutPreset } from '../types';
import { generateCSSFromComponents, generateBodyHTML } from '../utils/codeGenerator';
import { parseHTMLToComponents } from '../utils/htmlParser';
import { applyCSSToComponents } from '../utils/cssManager';
import { AIService, AIConfig } from '../services/aiService';

interface BuilderProps {
  initialComponents?: Component[];
}

// Helper to create a default page
const createPage = (name: string, components: Component[] = []): Page => ({
  id: `page-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
  name,
  components,
  cssCode: generateCSSFromComponents(components),
  canvasBg: '#ffffff',
});

function BuilderInner({ initialComponents = [] }: BuilderProps) {
  const { state, setPreset, toggleFocusMode, togglePanel, isPanelVisible } = useWorkspace();

  // Multi-page state
  const [pages, setPages] = useState<Page[]>([createPage('index', initialComponents)]);
  const [activePageId, setActivePageId] = useState(pages[0].id);
  const activePage = pages.find(p => p.id === activePageId) || pages[0];

  // Component state for active page
  const [components, setComponents] = useState<Component[]>(activePage.components);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [customCSS, setCustomCSS] = useState(activePage.cssCode);
  const [htmlCode, setHtmlCode] = useState('');
  const [canvasBg, setCanvasBg] = useState(activePage.canvasBg);

  // UI state
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync flags to prevent circular updates
  const syncSourceRef = useRef<'canvas' | 'html' | 'css' | null>(null);

  const [onboardingTips, setOnboardingTips] = useState<Record<OnboardingTip['trigger'], boolean>>({
    'first-component': false,
    'first-css-edit': false,
    'first-class-create': false,
    'first-export': false,
  });

  const selectedComponent = components.find((c) => c.id === selectedComponentId) || null;

  // === SYNC: Generate HTML/CSS when components change (from canvas) ===
  useEffect(() => {
    if (syncSourceRef.current === 'html' || syncSourceRef.current === 'css') {
      syncSourceRef.current = null;
      return;
    }
    const html = generateBodyHTML(components);
    const css = generateCSSFromComponents(components);
    setHtmlCode(html);
    setCustomCSS(css);
  }, [components]);

  // === Save active page state whenever it changes ===
  useEffect(() => {
    setPages(prev => prev.map(p =>
      p.id === activePageId
        ? { ...p, components, cssCode: customCSS, canvasBg }
        : p
    ));
  }, [components, customCSS, canvasBg, activePageId]);

  // === Page switching ===
  const handleSwitchPage = useCallback((pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (page) {
      setActivePageId(pageId);
      setComponents(page.components);
      setCustomCSS(page.cssCode);
      setCanvasBg(page.canvasBg);
      setSelectedComponentId(null);
      syncSourceRef.current = null;
    }
  }, [pages]);

  const handleAddPage = useCallback(() => {
    const newPage = createPage(`page-${pages.length + 1}`);
    setPages(prev => [...prev, newPage]);
    handleSwitchPage(newPage.id);
  }, [pages.length, handleSwitchPage]);

  const handleDeletePage = useCallback((pageId: string) => {
    if (pages.length <= 1) return;
    setPages(prev => {
      const next = prev.filter(p => p.id !== pageId);
      if (pageId === activePageId) {
        const switchTo = next[0];
        setActivePageId(switchTo.id);
        setComponents(switchTo.components);
        setCustomCSS(switchTo.cssCode);
        setCanvasBg(switchTo.canvasBg);
        setSelectedComponentId(null);
      }
      return next;
    });
  }, [pages.length, activePageId]);

  const handleRenamePage = useCallback((pageId: string, name: string) => {
    setPages(prev => prev.map(p => p.id === pageId ? { ...p, name } : p));
  }, []);

  // === Component handlers ===
  const handleAddComponent = (component: Component) => {
    setComponents(prev => [...prev, component]);
    syncSourceRef.current = 'canvas';
  };

  const handleUpdateComponent = (updatedComponent: Component) => {
    syncSourceRef.current = 'canvas';
    setComponents(prev =>
      prev.map((c) => (c.id === updatedComponent.id ? updatedComponent : c))
    );
  };

  const handleDeleteComponent = () => {
    if (selectedComponentId) {
      syncSourceRef.current = 'canvas';
      setComponents(prev => prev.filter((c) => c.id !== selectedComponentId));
      setSelectedComponentId(null);
    }
  };

  // === HTML Editor → Canvas sync ===
  const handleHTMLChange = useCallback((newHtml: string) => {
    syncSourceRef.current = 'html';
    setHtmlCode(newHtml);
    try {
      const wrapperHtml = `<div class="canvas-container">${newHtml}</div>`;
      const parsed = parseHTMLToComponents(wrapperHtml);
      if (parsed.length > 0) {
        // Apply existing CSS to the parsed components
        const withStyles = applyCSSToComponents(customCSS, parsed);
        setComponents(withStyles);
      }
    } catch {
      // Parsing may fail while user is typing; ignore silently
    }
  }, [customCSS]);

  // === CSS Editor → Canvas sync ===
  const handleCSSChange = useCallback((newCSS: string) => {
    syncSourceRef.current = 'css';
    setCustomCSS(newCSS);
    try {
      const updated = applyCSSToComponents(newCSS, components);
      setComponents(updated);
    } catch {
      // Parse error while typing; ignore
    }
  }, [components]);

  const handleCreateClass = () => {
    const className = prompt('Enter new class name (without dot):');
    if (className) {
      const newRule = `.${className} {\n  \n}\n\n`;
      setCustomCSS(prev => prev + newRule);
    }
  };

  // === AI ===
  const handleAIGenerate = async (prompt: string, config: AIConfig) => {
    setIsGenerating(true);
    setError(null);
    try {
      const aiService = new AIService(config);
      const response = await aiService.generateComponents(prompt);
      if (response.error) {
        setError(response.error);
      } else if (response.components.length > 0) {
        syncSourceRef.current = 'canvas';
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

  // === Export / Save / Load ===
  const handleExport = () => {
    const exportData: Record<string, string> = {};
    pages.forEach(page => {
      const savePage = page.id === activePageId
        ? { ...page, components, cssCode: customCSS, canvasBg }
        : page;
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${savePage.name} - ChillBuild</title>
  <link rel="stylesheet" href="${savePage.name}.css">
</head>
<body>
<div class="canvas-container" style="background-color: ${savePage.canvasBg}; position: relative; min-width: 1200px; min-height: 800px;">
${generateBodyHTML(savePage.components)}
</div>
</body>
</html>`;
      exportData[`${savePage.name}.html`] = html;
      exportData[`${savePage.name}.css`] = savePage.cssCode;
    });

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
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
      pages: pages.map(p => p.id === activePageId
        ? { ...p, components, cssCode: customCSS, canvasBg }
        : p
      ),
      activePageId,
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

          if (project.pages) {
            // New multi-page format
            setPages(project.pages);
            const firstPage = project.pages[0];
            setActivePageId(project.activePageId || firstPage.id);
            const active = project.pages.find((p: Page) => p.id === project.activePageId) || firstPage;
            setComponents(active.components);
            setCustomCSS(active.cssCode);
            setCanvasBg(active.canvasBg);
          } else if (project.components) {
            // Legacy single-page format → migrate
            const migrated = createPage('index', project.components);
            migrated.cssCode = project.customCSS || generateCSSFromComponents(project.components);
            migrated.canvasBg = project.canvasBg || '#ffffff';
            setPages([migrated]);
            setActivePageId(migrated.id);
            setComponents(migrated.components);
            setCustomCSS(migrated.cssCode);
            setCanvasBg(migrated.canvasBg);
          } else {
            setError('Invalid project file');
            return;
          }

          if (project.onboardingTips) setOnboardingTips(project.onboardingTips);
          setError(null);
          setSelectedComponentId(null);
        } catch {
          setError('Failed to load project file');
        }
      };
      reader.readAsText(file);
    }
  };

  const dismissTip = (trigger: OnboardingTip['trigger']) => {
    setOnboardingTips({ ...onboardingTips, [trigger]: true });
  };

  const presetButtons: { preset: LayoutPreset; icon: typeof Layout; label: string }[] = [
    { preset: 'design', icon: Layout, label: 'Design' },
    { preset: 'code', icon: Code2, label: 'Code' },
    { preset: 'preview', icon: Eye, label: 'Preview' },
  ];

  return (
    <div className={`builder ${state.focusMode ? 'focus-mode' : ''}`}>
      {/* Header */}
      <header className="builder-header">
        <div className="builder-logo">
          <Sparkles size={24} />
          <h1>CHILLBUILD</h1>
        </div>

        <div className="builder-presets">
          {presetButtons.map(({ preset, icon: Icon, label }) => (
            <button
              key={preset}
              className={`preset-btn ${state.activePreset === preset ? 'active' : ''}`}
              onClick={() => setPreset(preset)}
              title={`${label} Mode`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
          <div className="preset-divider" />
          <Tooltip content="Toggle focus mode — full canvas view">
            <button
              className={`preset-btn ${state.focusMode ? 'active' : ''}`}
              onClick={toggleFocusMode}
            >
              <Maximize size={16} />
            </button>
          </Tooltip>
        </div>

        <div className="builder-actions">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <Tooltip content="Toggle Components Panel">
            <button
              className={`action-btn ${isPanelVisible('components') ? 'active' : ''}`}
              onClick={() => togglePanel('components')}
            >
              <PanelLeft size={18} />
            </button>
          </Tooltip>
          <Tooltip content="Toggle Properties Panel">
            <button
              className={`action-btn ${isPanelVisible('properties') ? 'active' : ''}`}
              onClick={() => togglePanel('properties')}
            >
              <PanelRight size={18} />
            </button>
          </Tooltip>
          <Tooltip content="Save project">
            <button className="action-btn" onClick={handleSaveProject}>
              <FolderOpen size={18} />
              Save
            </button>
          </Tooltip>
          <Tooltip content="Load project">
            <button className="action-btn" onClick={handleLoadProject}>
              <FolderOpen size={18} />
              Load
            </button>
          </Tooltip>
          <Tooltip content="Export as HTML/CSS">
            <button className="action-btn" onClick={handleExport}>
              <Download size={18} />
              Export
            </button>
          </Tooltip>
          <Tooltip content="Generate with AI">
            <button className="action-btn ai-btn" onClick={() => setIsAIModalOpen(true)}>
              <Sparkles size={18} />
              AI
            </button>
          </Tooltip>
        </div>
      </header>

      {/* Page Tabs */}
      <PageTabs
        pages={pages}
        activePageId={activePageId}
        onSwitchPage={handleSwitchPage}
        onAddPage={handleAddPage}
        onDeletePage={handleDeletePage}
        onRenamePage={handleRenamePage}
      />

      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Workspace */}
      <div className="builder-workspace">
        {/* Left: Components Panel */}
        {isPanelVisible('components') && (
          <ResizablePanel
            defaultWidth={220}
            minWidth={180}
            maxWidth={350}
            direction="right"
            className="panel-components"
          >
            <ComponentLibrary onAddComponent={handleAddComponent} />
          </ResizablePanel>
        )}

        {/* Center: Canvas (always visible) */}
        <main className="builder-main">
          <Canvas
            components={components}
            onComponentsChange={(newComponents) => {
              syncSourceRef.current = 'canvas';
              setComponents(newComponents);
            }}
            selectedComponentId={selectedComponentId}
            onSelectComponent={setSelectedComponentId}
            canvasBg={canvasBg}
            onCanvasBgChange={setCanvasBg}
          />
        </main>

        {/* Right side: Editors + Properties */}
        <div className="builder-right-panels">
          {isPanelVisible('html-editor') && (
            <ResizablePanel
              defaultWidth={400}
              minWidth={250}
              maxWidth={700}
              direction="left"
              className="panel-editor"
            >
              <HTMLEditor
                html={htmlCode}
                onChange={handleHTMLChange}
                onClose={() => togglePanel('html-editor')}
              />
            </ResizablePanel>
          )}

          {isPanelVisible('css-editor') && (
            <ResizablePanel
              defaultWidth={400}
              minWidth={250}
              maxWidth={700}
              direction="left"
              className="panel-editor"
            >
              <CSSEditor
                css={customCSS}
                onChange={handleCSSChange}
                selectedComponent={selectedComponent}
                onCreateClass={handleCreateClass}
                onClose={() => togglePanel('css-editor')}
              />
            </ResizablePanel>
          )}

          {isPanelVisible('properties') && (
            <ResizablePanel
              defaultWidth={280}
              minWidth={220}
              maxWidth={450}
              direction="left"
              className="panel-properties"
            >
              <PropertiesPanel
                component={selectedComponent}
                onUpdateComponent={handleUpdateComponent}
                onDeleteComponent={handleDeleteComponent}
              />
            </ResizablePanel>
          )}
        </div>
      </div>

      {/* AI Modal */}
      <AIModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onGenerate={handleAIGenerate}
        isGenerating={isGenerating}
      />

      {/* Onboarding */}
      {components.length === 1 && (
        <OnboardingTips
          trigger="first-component"
          onDismiss={dismissTip}
          shown={onboardingTips['first-component']}
        />
      )}
    </div>
  );
}

export default function Builder(props: BuilderProps) {
  return (
    <WorkspaceProvider>
      <BuilderInner {...props} />
    </WorkspaceProvider>
  );
}
