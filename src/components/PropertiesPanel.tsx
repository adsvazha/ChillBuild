import { useState } from 'react';
import { Component } from '../types';
import { Trash2, Upload } from 'lucide-react';
import Slider from './Slider';
import { useWorkspace } from './WorkspaceProvider';

interface PropertiesPanelProps {
  component: Component | null;
  onUpdateComponent: (component: Component) => void;
  onDeleteComponent: () => void;
}

export default function PropertiesPanel({
  component,
  onUpdateComponent,
  onDeleteComponent,
}: PropertiesPanelProps) {
  const { state: workspaceState } = useWorkspace();
  const { activeBreakpoint } = workspaceState;
  const [pseudoState, setPseudoState] = useState<'base' | 'hover' | 'active'>('base');

  if (!component) {
    return (
      <div className="properties-panel">
        <div className="properties-header">
          <h3>Properties</h3>
        </div>
        <div className="properties-empty">
          <p>Select a component to edit its properties</p>
        </div>
      </div>
    );
  }

  // Determine which styles object we are editing
  const activeStyleKey = activeBreakpoint === 'desktop' ? pseudoState : activeBreakpoint;

  // Safe accessor bridging with fallback
  // The type of component.styles is { base: Record..., hover?: Record... }
  const currentStyles = (component.styles[activeStyleKey as keyof typeof component.styles] as Record<string, string>) || {};

  const handleContentChange = (content: string) => {
    onUpdateComponent({ ...component, content });
  };

  const handleStyleChange = (key: string, value: string) => {
    onUpdateComponent({
      ...component,
      styles: {
        ...component.styles,
        [activeStyleKey]: {
          ...currentStyles,
          [key]: value
        }
      },
    });
  };

  const renderStateToggle = () => {
    if (activeBreakpoint !== 'desktop') {
      return (
        <div className="property-section" style={{ paddingBottom: '8px', borderBottom: '1px solid #e5e7eb', marginBottom: '16px' }}>
          <h4>Editing {activeBreakpoint}</h4>
        </div>
      );
    }
    return (
      <div className="property-group state-toggle-group" style={{ paddingBottom: '16px', borderBottom: '1px solid #e5e7eb', marginBottom: '16px' }}>
        <label>State</label>
        <select
          value={pseudoState}
          onChange={(e) => setPseudoState(e.target.value as any)}
        >
          <option value="base">Normal</option>
          <option value="hover">Hover (:hover)</option>
          <option value="active">Active (:active)</option>
        </select>
      </div>
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        handleContentChange(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderButtonProperties = () => (
    <>
      <div className="property-section">
        <h4>Button Settings</h4>
      </div>
      <div className="property-group">
        <label>Button Text</label>
        <input
          type="text"
          value={component.content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Button text"
        />
      </div>
      <div className="property-group">
        <Slider
          label="Font Size"
          value={currentStyles.fontSize || '16px'}
          onChange={(value) => handleStyleChange('fontSize', value)}
          min={10}
          max={48}
          unit="px"
        />
      </div>
      <div className="property-group">
        <label>Font Weight</label>
        <select
          value={currentStyles.fontWeight || '600'}
          onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
        >
          <option value="400">Regular</option>
          <option value="500">Medium</option>
          <option value="600">Semibold</option>
          <option value="700">Bold</option>
          <option value="800">Extra Bold</option>
        </select>
      </div>
      <div className="property-group">
        <label>Background Color</label>
        <div className="color-input">
          <input
            type="color"
            value={currentStyles.backgroundColor || '#2563eb'}
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
          />
          <input
            type="text"
            value={currentStyles.backgroundColor || ''}
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
            placeholder="#2563eb"
          />
        </div>
      </div>
      <div className="property-group">
        <label>Text Color</label>
        <div className="color-input">
          <input
            type="color"
            value={currentStyles.color || '#ffffff'}
            onChange={(e) => handleStyleChange('color', e.target.value)}
          />
          <input
            type="text"
            value={currentStyles.color || ''}
            onChange={(e) => handleStyleChange('color', e.target.value)}
            placeholder="#ffffff"
          />
        </div>
      </div>
      <div className="property-group">
        <Slider
          label="Border Radius"
          value={currentStyles.borderRadius || '8px'}
          onChange={(value) => handleStyleChange('borderRadius', value)}
          min={0}
          max={50}
          unit="px"
        />
      </div>
      <div className="property-group">
        <Slider
          label="Padding"
          value={currentStyles.padding || '12px'}
          onChange={(value) => handleStyleChange('padding', value)}
          min={0}
          max={50}
          unit="px"
        />
      </div>
      <div className="property-group">
        <label>Hover Effect</label>
        <select
          value={currentStyles.transition || 'all 0.2s'}
          onChange={(e) => handleStyleChange('transition', e.target.value)}
        >
          <option value="all 0.2s">Smooth</option>
          <option value="all 0.3s ease">Ease</option>
          <option value="transform 0.2s">Transform</option>
          <option value="none">None</option>
        </select>
      </div>
      <div className="property-group">
        <label>Box Shadow</label>
        <input
          type="text"
          value={currentStyles.boxShadow || ''}
          onChange={(e) => handleStyleChange('boxShadow', e.target.value)}
          placeholder="0 2px 4px rgba(0,0,0,0.1)"
        />
      </div>
    </>
  );

  const renderTextProperties = () => (
    <>
      <div className="property-section">
        <h4>Text Settings</h4>
      </div>
      <div className="property-group">
        <label>Content</label>
        <textarea
          value={component.content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Enter text"
          rows={3}
        />
      </div>
      <div className="property-group">
        <Slider
          label="Font Size"
          value={currentStyles.fontSize || '16px'}
          onChange={(value) => handleStyleChange('fontSize', value)}
          min={8}
          max={72}
          unit="px"
        />
      </div>
      <div className="property-group">
        <label>Font Weight</label>
        <select
          value={currentStyles.fontWeight || '400'}
          onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
        >
          <option value="300">Light</option>
          <option value="400">Regular</option>
          <option value="500">Medium</option>
          <option value="600">Semibold</option>
          <option value="700">Bold</option>
        </select>
      </div>
      <div className="property-group">
        <label>Text Align</label>
        <select
          value={currentStyles.textAlign || 'left'}
          onChange={(e) => handleStyleChange('textAlign', e.target.value)}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
          <option value="justify">Justify</option>
        </select>
      </div>
      <div className="property-group">
        <label>Text Color</label>
        <div className="color-input">
          <input
            type="color"
            value={currentStyles.color || '#333333'}
            onChange={(e) => handleStyleChange('color', e.target.value)}
          />
          <input
            type="text"
            value={currentStyles.color || ''}
            onChange={(e) => handleStyleChange('color', e.target.value)}
            placeholder="#333333"
          />
        </div>
      </div>
      <div className="property-group">
        <Slider
          label="Line Height"
          value={currentStyles.lineHeight || '1.6'}
          onChange={(value) => handleStyleChange('lineHeight', value)}
          min={1}
          max={3}
          step={0.1}
          unit=""
        />
      </div>
      <div className="property-group">
        <label>Letter Spacing</label>
        <input
          type="text"
          value={currentStyles.letterSpacing || ''}
          onChange={(e) => handleStyleChange('letterSpacing', e.target.value)}
          placeholder="0.5px"
        />
      </div>
    </>
  );

  const renderImageProperties = () => (
    <>
      <div className="property-section">
        <h4>Image Settings</h4>
      </div>
      <div className="property-group">
        <label>Image Source</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px',
            background: '#f9fafb',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: 'pointer',
            color: '#374151',
            marginBottom: '8px',
          }}
        >
          <Upload size={16} />
          Upload Image
        </label>
        {component.content && (
          <img
            src={component.content}
            alt="Preview"
            style={{ width: '100%', borderRadius: '6px', marginBottom: '8px' }}
          />
        )}
        <input
          type="url"
          value={component.content.startsWith('data:') ? '' : component.content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Or paste image URL"
        />
      </div>
      <div className="property-group">
        <label>Object Fit</label>
        <select
          value={currentStyles.objectFit || 'cover'}
          onChange={(e) => handleStyleChange('objectFit', e.target.value)}
        >
          <option value="cover">Cover</option>
          <option value="contain">Contain</option>
          <option value="fill">Fill</option>
          <option value="none">None</option>
          <option value="scale-down">Scale Down</option>
        </select>
      </div>
      <div className="property-group">
        <Slider
          label="Border Radius"
          value={currentStyles.borderRadius || '8px'}
          onChange={(value) => handleStyleChange('borderRadius', value)}
          min={0}
          max={50}
          unit="px"
        />
      </div>
      <div className="property-group">
        <label>Filter Effects</label>
        <input
          type="text"
          value={currentStyles.filter || ''}
          onChange={(e) => handleStyleChange('filter', e.target.value)}
          placeholder="brightness(1.1) contrast(1.1)"
        />
      </div>
      <div className="property-group">
        <Slider
          label="Opacity"
          value={currentStyles.opacity || '1'}
          onChange={(value) => handleStyleChange('opacity', value)}
          min={0}
          max={1}
          step={0.1}
          unit=""
        />
      </div>
    </>
  );

  const renderContainerProperties = () => (
    <>
      <div className="property-section">
        <h4>Layout Settings</h4>
      </div>
      <div className="property-group">
        <label>Display</label>
        <select
          value={currentStyles.display || 'flex'}
          onChange={(e) => handleStyleChange('display', e.target.value)}
        >
          <option value="flex">Flex</option>
          <option value="grid">Grid</option>
          <option value="block">Block</option>
          <option value="inline-block">Inline Block</option>
        </select>
      </div>
      <div className="property-group">
        <label>Flex Direction</label>
        <select
          value={currentStyles.flexDirection || 'column'}
          onChange={(e) => handleStyleChange('flexDirection', e.target.value)}
        >
          <option value="row">Row</option>
          <option value="column">Column</option>
          <option value="row-reverse">Row Reverse</option>
          <option value="column-reverse">Column Reverse</option>
        </select>
      </div>
      <div className="property-group">
        <label>Justify Content</label>
        <select
          value={currentStyles.justifyContent || 'flex-start'}
          onChange={(e) => handleStyleChange('justifyContent', e.target.value)}
        >
          <option value="flex-start">Start</option>
          <option value="center">Center</option>
          <option value="flex-end">End</option>
          <option value="space-between">Space Between</option>
          <option value="space-around">Space Around</option>
          <option value="space-evenly">Space Evenly</option>
        </select>
      </div>
      <div className="property-group">
        <label>Align Items</label>
        <select
          value={currentStyles.alignItems || 'flex-start'}
          onChange={(e) => handleStyleChange('alignItems', e.target.value)}
        >
          <option value="flex-start">Start</option>
          <option value="center">Center</option>
          <option value="flex-end">End</option>
          <option value="stretch">Stretch</option>
          <option value="baseline">Baseline</option>
        </select>
      </div>
      <div className="property-group">
        <Slider
          label="Gap"
          value={currentStyles.gap || '16px'}
          onChange={(value) => handleStyleChange('gap', value)}
          min={0}
          max={50}
          unit="px"
        />
      </div>
      <div className="property-group">
        <Slider
          label="Padding"
          value={currentStyles.padding || '24px'}
          onChange={(value) => handleStyleChange('padding', value)}
          min={0}
          max={100}
          unit="px"
        />
      </div>
      <div className="property-group">
        <label>Background</label>
        <div className="color-input">
          <input
            type="color"
            value={currentStyles.backgroundColor || '#ffffff'}
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
          />
          <input
            type="text"
            value={currentStyles.backgroundColor || ''}
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
            placeholder="#ffffff"
          />
        </div>
      </div>
      <div className="property-group">
        <label>Border</label>
        <input
          type="text"
          value={currentStyles.border || ''}
          onChange={(e) => handleStyleChange('border', e.target.value)}
          placeholder="1px solid #e0e0e0"
        />
      </div>
    </>
  );

  const renderInputProperties = () => (
    <>
      <div className="property-section">
        <h4>Input Settings</h4>
      </div>
      <div className="property-group">
        <label>Placeholder</label>
        <input
          type="text"
          value={component.content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Enter placeholder text"
        />
      </div>
      <div className="property-group">
        <Slider
          label="Font Size"
          value={currentStyles.fontSize || '16px'}
          onChange={(value) => handleStyleChange('fontSize', value)}
          min={12}
          max={24}
          unit="px"
        />
      </div>
      <div className="property-group">
        <Slider
          label="Padding"
          value={currentStyles.padding || '12px'}
          onChange={(value) => handleStyleChange('padding', value)}
          min={4}
          max={32}
          unit="px"
        />
      </div>
      <div className="property-group">
        <label>Border</label>
        <input
          type="text"
          value={currentStyles.border || ''}
          onChange={(e) => handleStyleChange('border', e.target.value)}
          placeholder="2px solid #e0e0e0"
        />
      </div>
      <div className="property-group">
        <Slider
          label="Border Radius"
          value={currentStyles.borderRadius || '8px'}
          onChange={(value) => handleStyleChange('borderRadius', value)}
          min={0}
          max={24}
          unit="px"
        />
      </div>
      <div className="property-group">
        <label>Focus Border Color</label>
        <div className="color-input">
          <input
            type="color"
            value={currentStyles.outlineColor || '#2563eb'}
            onChange={(e) => handleStyleChange('outlineColor', e.target.value)}
          />
          <input
            type="text"
            value={currentStyles.outlineColor || ''}
            onChange={(e) => handleStyleChange('outlineColor', e.target.value)}
            placeholder="#2563eb"
          />
        </div>
      </div>
    </>
  );

  const renderCardProperties = () => (
    <>
      <div className="property-section">
        <h4>Card Settings</h4>
      </div>
      <div className="property-group">
        <label>Content</label>
        <textarea
          value={component.content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Card content"
          rows={3}
        />
      </div>
      <div className="property-group">
        <label>Background</label>
        <div className="color-input">
          <input
            type="color"
            value={currentStyles.backgroundColor || '#ffffff'}
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
          />
          <input
            type="text"
            value={currentStyles.backgroundColor || ''}
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
            placeholder="#ffffff"
          />
        </div>
      </div>
      <div className="property-group">
        <Slider
          label="Padding"
          value={currentStyles.padding || '24px'}
          onChange={(value) => handleStyleChange('padding', value)}
          min={8}
          max={64}
          unit="px"
        />
      </div>
      <div className="property-group">
        <Slider
          label="Border Radius"
          value={currentStyles.borderRadius || '12px'}
          onChange={(value) => handleStyleChange('borderRadius', value)}
          min={0}
          max={32}
          unit="px"
        />
      </div>
      <div className="property-group">
        <label>Box Shadow</label>
        <select
          value={currentStyles.boxShadow || '0 2px 8px rgba(0,0,0,0.1)'}
          onChange={(e) => handleStyleChange('boxShadow', e.target.value)}
        >
          <option value="none">None</option>
          <option value="0 1px 3px rgba(0,0,0,0.1)">Small</option>
          <option value="0 2px 8px rgba(0,0,0,0.1)">Medium</option>
          <option value="0 4px 16px rgba(0,0,0,0.1)">Large</option>
          <option value="0 8px 32px rgba(0,0,0,0.15)">Extra Large</option>
        </select>
      </div>
      <div className="property-group">
        <label>Border</label>
        <input
          type="text"
          value={currentStyles.border || ''}
          onChange={(e) => handleStyleChange('border', e.target.value)}
          placeholder="1px solid #e0e0e0"
        />
      </div>
    </>
  );

  const renderComponentSpecificProperties = () => {
    switch (component.type) {
      case 'button':
        return renderButtonProperties();
      case 'text':
        return renderTextProperties();
      case 'heading':
        return renderTextProperties();
      case 'image':
        return renderImageProperties();
      case 'container':
      case 'navbar':
      case 'form':
      case 'grid':
        return renderContainerProperties();
      case 'input':
      case 'textarea':
        return renderInputProperties();
      case 'card':
        return renderCardProperties();
      default:
        return (
          <>
            <div className="property-group">
              <label>Content</label>
              <textarea
                value={component.content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Enter content"
                rows={3}
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="properties-panel">
      <div className="properties-header">
        <h3>Properties</h3>
        <button className="delete-btn" onClick={onDeleteComponent} title="Delete component">
          <Trash2 size={18} />
        </button>
      </div>

      <div className="properties-content">
        {renderStateToggle()}
        <div className="property-section">
          <h4>
            {component.type.charAt(0).toUpperCase() + component.type.slice(1)}
          </h4>
        </div>

        {renderComponentSpecificProperties()}

        <div className="property-section" style={{ marginTop: '16px', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
          <h4>Layout</h4>
        </div>

        <div className="property-group">
          <label>Display</label>
          <select
            value={currentStyles.display || 'block'}
            onChange={(e) => handleStyleChange('display', e.target.value)}
          >
            <option value="block">Block</option>
            <option value="flex">Flex</option>
            <option value="grid">Grid</option>
            <option value="inline-block">Inline Block</option>
            <option value="inline-flex">Inline Flex</option>
            <option value="none">None</option>
          </select>
        </div>

        {(currentStyles.display === 'flex' || currentStyles.display === 'inline-flex') && (
          <div className="layout-controls-group">
            <div className="property-group">
              <label>Flex Direction</label>
              <select
                value={currentStyles.flexDirection || 'row'}
                onChange={(e) => handleStyleChange('flexDirection', e.target.value)}
              >
                <option value="row">Row →</option>
                <option value="column">Column ↓</option>
                <option value="row-reverse">Row Reverse ←</option>
                <option value="column-reverse">Column Reverse ↑</option>
              </select>
            </div>
            <div className="property-group">
              <label>Justify Content</label>
              <select
                value={currentStyles.justifyContent || 'flex-start'}
                onChange={(e) => handleStyleChange('justifyContent', e.target.value)}
              >
                <option value="flex-start">Start</option>
                <option value="center">Center</option>
                <option value="flex-end">End</option>
                <option value="space-between">Space Between</option>
                <option value="space-around">Space Around</option>
                <option value="space-evenly">Space Evenly</option>
              </select>
            </div>
            <div className="property-group">
              <label>Align Items</label>
              <select
                value={currentStyles.alignItems || 'stretch'}
                onChange={(e) => handleStyleChange('alignItems', e.target.value)}
              >
                <option value="stretch">Stretch</option>
                <option value="flex-start">Start</option>
                <option value="center">Center</option>
                <option value="flex-end">End</option>
                <option value="baseline">Baseline</option>
              </select>
            </div>
            <div className="property-group">
              <label>Flex Wrap</label>
              <select
                value={currentStyles.flexWrap || 'nowrap'}
                onChange={(e) => handleStyleChange('flexWrap', e.target.value)}
              >
                <option value="nowrap">No Wrap</option>
                <option value="wrap">Wrap</option>
                <option value="wrap-reverse">Wrap Reverse</option>
              </select>
            </div>
            <div className="property-group">
              <label>Gap</label>
              <input
                type="text"
                value={currentStyles.gap || ''}
                onChange={(e) => handleStyleChange('gap', e.target.value)}
                placeholder="0px, 1rem"
              />
            </div>
          </div>
        )}

        {currentStyles.display === 'grid' && (
          <div className="layout-controls-group">
            <div className="property-group">
              <label>Grid Template Columns</label>
              <input
                type="text"
                value={currentStyles.gridTemplateColumns || ''}
                onChange={(e) => handleStyleChange('gridTemplateColumns', e.target.value)}
                placeholder="1fr 1fr, repeat(3, 1fr)"
              />
            </div>
            <div className="property-group">
              <label>Gap</label>
              <input
                type="text"
                value={currentStyles.gap || ''}
                onChange={(e) => handleStyleChange('gap', e.target.value)}
                placeholder="0px, 1rem"
              />
            </div>
          </div>
        )}

        <div className="property-section" style={{ marginTop: '16px', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
          <h4>Spacing & Size</h4>
        </div>

        <div className="size-inputs-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
          <div className="property-group" style={{ marginBottom: 0 }}>
            <label>Width</label>
            <input
              type="text"
              value={currentStyles.width || ''}
              onChange={(e) => handleStyleChange('width', e.target.value)}
              placeholder="auto, 100%, 200px"
              style={{ fontSize: '13px', padding: '6px' }}
            />
          </div>
          <div className="property-group" style={{ marginBottom: 0 }}>
            <label>Height</label>
            <input
              type="text"
              value={currentStyles.height || ''}
              onChange={(e) => handleStyleChange('height', e.target.value)}
              placeholder="auto, 100vh, 200px"
              style={{ fontSize: '13px', padding: '6px' }}
            />
          </div>
        </div>

        <div className="box-model-container" style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div className="property-group" style={{ marginBottom: '8px' }}>
            <label style={{ color: '#6b7280', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Margin</label>
            <input
              type="text"
              value={currentStyles.margin || ''}
              onChange={(e) => handleStyleChange('margin', e.target.value)}
              placeholder="0px auto (T R B L)"
            />
          </div>

          <div className="property-group" style={{ marginBottom: 0 }}>
            <label style={{ color: '#6b7280', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Padding</label>
            <input
              type="text"
              value={currentStyles.padding || ''}
              onChange={(e) => handleStyleChange('padding', e.target.value)}
              placeholder="16px 24px (T R B L)"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
