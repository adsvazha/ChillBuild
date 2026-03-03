import { useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Grid3x3, Palette, ChevronUp, ChevronDown, Maximize2 } from 'lucide-react';
import { Component } from '../types';
import { createComponent } from '../utils/componentDefaults';
import { useWorkspace } from './WorkspaceProvider';

interface CanvasProps {
  components: Component[];
  onComponentsChange: (components: Component[]) => void;
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  canvasBg?: string;
  onCanvasBgChange?: (bg: string) => void;
  onContextMenu?: (e: React.MouseEvent, componentId: string | null) => void;
  onSwitchPage?: (pageId: string) => void;
}

export default function Canvas({
  components,
  onComponentsChange,
  selectedComponentId,
  onSelectComponent,
  canvasBg: canvasBgProp,
  onCanvasBgChange,
  onContextMenu,
  onSwitchPage,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { state: workspaceState } = useWorkspace();
  const { activeBreakpoint } = workspaceState;

  const canvasWidth = activeBreakpoint === 'mobile' ? 375 : activeBreakpoint === 'tablet' ? 768 : 1200;
  const canvasHeight = Math.max(800, activeBreakpoint === 'mobile' ? 667 : activeBreakpoint === 'tablet' ? 1024 : 800);

  const [draggedComponent, setDraggedComponent] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizing, setResizing] = useState<{ id: string; direction: string } | null>(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);

  const canvasBg = canvasBgProp || '#ffffff';
  const setCanvasBg = (bg: string) => {
    if (onCanvasBgChange) {
      onCanvasBgChange(bg);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const componentType = e.dataTransfer.getData('componentType') as Component['type'];

    if (componentType && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / (zoom / 100);
      const y = (e.clientY - rect.top) / (zoom / 100);

      const newComponent = createComponent(componentType);
      newComponent.position = { x, y };
      newComponent.size = { width: 200, height: 100 };
      onComponentsChange([...components, newComponent]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleComponentMouseDown = (e: React.MouseEvent, component: Component) => {
    e.stopPropagation();
    onSelectComponent(component.id);

    if (component.position) {
      setDraggedComponent(component.id);
      setDragOffset({
        x: e.clientX - (component.position.x * zoom / 100),
        y: e.clientY - (component.position.y * zoom / 100),
      });
    }
  };

  const GRID_SIZE = 16;
  const SNAP_THRESHOLD = 8;

  const snapToGrid = (value: number): number => {
    if (!showGrid) return value;
    const rounded = Math.round(value / GRID_SIZE) * GRID_SIZE;
    return Math.abs(rounded - value) < SNAP_THRESHOLD ? rounded : value;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedComponent && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const rawX = ((e.clientX - rect.left) / (zoom / 100)) - (dragOffset.x / (zoom / 100));
      const rawY = ((e.clientY - rect.top) / (zoom / 100)) - (dragOffset.y / (zoom / 100));

      const component = components.find((c) => c.id === draggedComponent);
      if (!component?.size) return;

      if (!component?.size) return;

      let newX = snapToGrid(rawX);
      let newY = snapToGrid(rawY);

      newX = Math.max(0, Math.min(newX, canvasWidth - component.size.width));
      newY = Math.max(0, Math.min(newY, canvasHeight - component.size.height));

      const updatedComponents = components.map((c) =>
        c.id === draggedComponent
          ? { ...c, position: { x: newX, y: newY } }
          : c
      );
      onComponentsChange(updatedComponents);
    }

    if (resizing && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const deltaX = ((e.clientX - rect.left) - resizeStart.x) / (zoom / 100);
      const deltaY = ((e.clientY - rect.top) - resizeStart.y) / (zoom / 100);

      const updatedComponents = components.map((c) => {
        if (c.id === resizing.id) {
          const newSize = { ...c.size! };

          if (resizing.direction.includes('e')) {
            newSize.width = Math.max(50, resizeStart.width + deltaX);
          }
          if (resizing.direction.includes('s')) {
            newSize.height = Math.max(50, resizeStart.height + deltaY);
          }

          return { ...c, size: newSize };
        }
        return c;
      });
      onComponentsChange(updatedComponents);
    }
  };

  const handleMouseUp = () => {
    setDraggedComponent(null);
    setResizing(null);
  };

  const handleResizeMouseDown = (e: React.MouseEvent, componentId: string, direction: string) => {
    e.stopPropagation();
    const component = components.find((c) => c.id === componentId);
    if (component?.size && component.position && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setResizing({ id: componentId, direction });
      setResizeStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        width: component.size.width,
        height: component.size.height,
      });
    }
  };

  const moveComponentLayer = (componentId: string, direction: 'up' | 'down') => {
    const index = components.findIndex((c) => c.id === componentId);
    if (index === -1) return;

    const newComponents = [...components];
    if (direction === 'up' && index < components.length - 1) {
      [newComponents[index], newComponents[index + 1]] = [newComponents[index + 1], newComponents[index]];
    } else if (direction === 'down' && index > 0) {
      [newComponents[index], newComponents[index - 1]] = [newComponents[index - 1], newComponents[index]];
    }
    onComponentsChange(newComponents);
  };

  const renderComponent = (component: Component) => {
    const isSelected = component.id === selectedComponentId;
    const isDragging = draggedComponent === component.id;
    const className = `canvas-component ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`;

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();

      // Handle navigation in preview mode
      if (workspaceState.activePreset === 'preview' && component.navigation?.type === 'page') {
        if (onSwitchPage) {
          onSwitchPage(component.navigation.targetPageId);
        }
        return;
      }

      onSelectComponent(component.id);
    };

    const position = component.position || { x: 0, y: 0 };
    const size = component.size || { width: 200, height: 100 };

    const wrapperStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: `${size.width}px`,
      height: `${size.height}px`,
      userSelect: 'none',
    };

    // Merge styles based on breakpoint cascade
    const mergedStyles = {
      ...component.styles.base,
      ...(activeBreakpoint === 'tablet' || activeBreakpoint === 'mobile' ? component.styles.tablet : {}),
      ...(activeBreakpoint === 'mobile' ? component.styles.mobile : {})
    } as React.CSSProperties;

    const componentStyle: React.CSSProperties = {
      ...mergedStyles,
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
    };

    let content;
    switch (component.type) {
      case 'button':
        content = <button style={componentStyle} onClick={handleClick}>{component.content}</button>;
        break;
      case 'text':
        content = <p style={componentStyle} onClick={handleClick}>{component.content}</p>;
        break;
      case 'heading':
        content = <h1 style={componentStyle} onClick={handleClick}>{component.content}</h1>;
        break;
      case 'image':
        content = <img style={componentStyle} src={component.content} alt="Component" onClick={handleClick} />;
        break;
      case 'input':
        content = (
          <input
            style={componentStyle}
            type="text"
            placeholder={component.content || 'Enter text...'}
            onClick={handleClick}
          />
        );
        break;
      case 'textarea':
        content = (
          <textarea
            style={componentStyle}
            placeholder={component.content || 'Enter text...'}
            onClick={handleClick}
          />
        );
        break;
      case 'container':
        content = (
          <div style={componentStyle} onClick={handleClick}>
            {component.children?.map(renderComponent)}
          </div>
        );
        break;
      case 'card':
        content = <div style={componentStyle} onClick={handleClick}>{component.content}</div>;
        break;
      case 'navbar':
        content = (
          <nav style={componentStyle} onClick={handleClick}>
            {component.children?.map(renderComponent)}
          </nav>
        );
        break;
      case 'footer':
        content = <footer style={componentStyle} onClick={handleClick}>{component.content}</footer>;
        break;
      case 'form':
        content = (
          <form style={componentStyle} onClick={handleClick}>
            {component.children?.map(renderComponent)}
          </form>
        );
        break;
      case 'video':
        content = (
          <video style={componentStyle} controls onClick={handleClick}>
            <source src={component.content} type="video/mp4" />
          </video>
        );
        break;
      case 'grid':
        content = (
          <div style={componentStyle} onClick={handleClick}>
            {component.children?.map(renderComponent)}
          </div>
        );
        break;
      case 'list':
        const items = component.content.split('\n').filter(item => item.trim());
        content = (
          <ul style={componentStyle} onClick={handleClick}>
            {items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        );
        break;
      case 'badge':
        content = <span style={componentStyle} onClick={handleClick}>{component.content}</span>;
        break;
      case 'divider':
        content = <hr style={componentStyle} onClick={handleClick} />;
        break;
      case 'link':
        content = <a href="#" style={componentStyle} onClick={handleClick}>{component.content}</a>;
        break;
      default:
        content = null;
    }

    return (
      <div
        key={component.id}
        className={className}
        style={wrapperStyle}
        onMouseDown={(e) => handleComponentMouseDown(e, component)}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onContextMenu?.(e, component.id);
        }}
      >
        {content}
        <div className="component-label">
          {component.type.charAt(0).toUpperCase() + component.type.slice(1)}
        </div>
        {isSelected && (
          <>
            <div className="selection-outline" />
            <div className="component-info">
              {size.width.toFixed(0)} × {size.height.toFixed(0)}
            </div>
            <div
              className="resize-handle resize-nw"
              onMouseDown={(e) => handleResizeMouseDown(e, component.id, 'nw')}
            />
            <div
              className="resize-handle resize-ne"
              onMouseDown={(e) => handleResizeMouseDown(e, component.id, 'ne')}
            />
            <div
              className="resize-handle resize-sw"
              onMouseDown={(e) => handleResizeMouseDown(e, component.id, 'sw')}
            />
            <div
              className="resize-handle resize-se"
              onMouseDown={(e) => handleResizeMouseDown(e, component.id, 'se')}
            />
            <div
              className="resize-handle resize-n"
              onMouseDown={(e) => handleResizeMouseDown(e, component.id, 'n')}
            />
            <div
              className="resize-handle resize-e"
              onMouseDown={(e) => handleResizeMouseDown(e, component.id, 'e')}
            />
            <div
              className="resize-handle resize-s"
              onMouseDown={(e) => handleResizeMouseDown(e, component.id, 's')}
            />
            <div
              className="resize-handle resize-w"
              onMouseDown={(e) => handleResizeMouseDown(e, component.id, 'w')}
            />
            <div className="layer-controls">
              <button
                className="layer-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  moveComponentLayer(component.id, 'up');
                }}
                title="Bring forward"
              >
                <ChevronUp size={14} />
              </button>
              <button
                className="layer-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  moveComponentLayer(component.id, 'down');
                }}
                title="Send backward"
              >
                <ChevronDown size={14} />
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="canvas-wrapper">
      <div className="canvas-toolbar">
        <div className="toolbar-section">
          <button
            className={`toolbar-btn ${showGrid ? 'active' : ''}`}
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle grid"
          >
            <Grid3x3 size={18} />
          </button>
          <div className="color-picker-wrapper">
            <input
              type="color"
              value={canvasBg}
              onChange={(e) => setCanvasBg(e.target.value)}
              title="Canvas background"
              style={{ display: 'none' }}
              id="canvas-bg-picker"
            />
            <label htmlFor="canvas-bg-picker" className="toolbar-btn" title="Canvas background">
              <Palette size={18} />
            </label>
          </div>
        </div>
        <div className="toolbar-section">
          <span className="zoom-label">{zoom}%</span>
          <button
            className="toolbar-btn"
            onClick={() => setZoom(Math.max(25, zoom - 25))}
            disabled={zoom <= 25}
            title="Zoom out"
          >
            <ZoomOut size={18} />
          </button>
          <button
            className="toolbar-btn"
            onClick={() => setZoom(Math.min(200, zoom + 25))}
            disabled={zoom >= 200}
            title="Zoom in"
          >
            <ZoomIn size={18} />
          </button>
          <button
            className="toolbar-btn"
            onClick={() => setZoom(100)}
            title="Reset zoom"
          >
            <Maximize2 size={18} />
          </button>
        </div>
        <div className="toolbar-section">
          <button
            className="toolbar-btn"
            onClick={() => {
              onComponentsChange([]);
              onSelectComponent(null);
            }}
            disabled={components.length === 0}
          >
            Clear All
          </button>
        </div>
      </div>
      <div className="canvas-viewport">
        <div
          className="canvas-container"
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top left',
          }}
        >
          <div
            ref={canvasRef}
            className={`canvas ${showGrid ? 'show-grid' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={() => onSelectComponent(null)}
            onContextMenu={(e) => {
              e.preventDefault();
              onContextMenu?.(e, null);
            }}
            style={{
              backgroundColor: canvasBg,
              minWidth: `${canvasWidth}px`,
              minHeight: `${canvasHeight}px`,
              margin: '0 auto', /* center it when smaller */
              width: `${canvasWidth}px`,
              overflow: 'hidden',
              position: 'relative',
              boxShadow: activeBreakpoint !== 'desktop' ? '0 0 0 1px #e5e7eb, 0 10px 15px -3px rgba(0,0,0,0.1)' : 'none',
              borderRadius: activeBreakpoint !== 'desktop' ? '12px' : '0',
              transition: 'all 0.3s ease-in-out'
            }}
          >
            {components.length === 0 ? (
              <div className="canvas-empty">
                <p>Drop components here or use AI to generate</p>
              </div>
            ) : (
              components.map(renderComponent)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
