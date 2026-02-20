import { Component } from '../types';
import { Trash2, Upload } from 'lucide-react';
import Slider from './Slider';

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

  const handleContentChange = (content: string) => {
    onUpdateComponent({ ...component, content });
  };

  const handleStyleChange = (key: string, value: string) => {
    onUpdateComponent({
      ...component,
      styles: { ...component.styles, [key]: value },
    });
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
          value={component.styles.fontSize || '16px'}
          onChange={(value) => handleStyleChange('fontSize', value)}
          min={10}
          max={48}
          unit="px"
        />
      </div>
      <div className="property-group">
        <label>Font Weight</label>
        <select
          value={component.styles.fontWeight || '600'}
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
            value={component.styles.backgroundColor || '#2563eb'}
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
          />
          <input
            type="text"
            value={component.styles.backgroundColor || ''}
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
            value={component.styles.color || '#ffffff'}
            onChange={(e) => handleStyleChange('color', e.target.value)}
          />
          <input
            type="text"
            value={component.styles.color || ''}
            onChange={(e) => handleStyleChange('color', e.target.value)}
            placeholder="#ffffff"
          />
        </div>
      </div>
      <div className="property-group">
        <Slider
          label="Border Radius"
          value={component.styles.borderRadius || '8px'}
          onChange={(value) => handleStyleChange('borderRadius', value)}
          min={0}
          max={50}
          unit="px"
        />
      </div>
      <div className="property-group">
        <Slider
          label="Padding"
          value={component.styles.padding || '12px'}
          onChange={(value) => handleStyleChange('padding', value)}
          min={0}
          max={50}
          unit="px"
        />
      </div>
      <div className="property-group">
        <label>Hover Effect</label>
        <select
          value={component.styles.transition || 'all 0.2s'}
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
          value={component.styles.boxShadow || ''}
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
          value={component.styles.fontSize || '16px'}
          onChange={(value) => handleStyleChange('fontSize', value)}
          min={8}
          max={72}
          unit="px"
        />
      </div>
      <div className="property-group">
        <label>Font Weight</label>
        <select
          value={component.styles.fontWeight || '400'}
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
          value={component.styles.textAlign || 'left'}
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
            value={component.styles.color || '#333333'}
            onChange={(e) => handleStyleChange('color', e.target.value)}
          />
          <input
            type="text"
            value={component.styles.color || ''}
            onChange={(e) => handleStyleChange('color', e.target.value)}
            placeholder="#333333"
          />
        </div>
      </div>
      <div className="property-group">
        <Slider
          label="Line Height"
          value={component.styles.lineHeight || '1.6'}
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
          value={component.styles.letterSpacing || ''}
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
          value={component.styles.objectFit || 'cover'}
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
          value={component.styles.borderRadius || '8px'}
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
          value={component.styles.filter || ''}
          onChange={(e) => handleStyleChange('filter', e.target.value)}
          placeholder="brightness(1.1) contrast(1.1)"
        />
      </div>
      <div className="property-group">
        <Slider
          label="Opacity"
          value={component.styles.opacity || '1'}
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
          value={component.styles.display || 'flex'}
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
          value={component.styles.flexDirection || 'column'}
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
          value={component.styles.justifyContent || 'flex-start'}
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
          value={component.styles.alignItems || 'flex-start'}
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
          value={component.styles.gap || '16px'}
          onChange={(value) => handleStyleChange('gap', value)}
          min={0}
          max={50}
          unit="px"
        />
      </div>
      <div className="property-group">
        <Slider
          label="Padding"
          value={component.styles.padding || '24px'}
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
            value={component.styles.backgroundColor || '#ffffff'}
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
          />
          <input
            type="text"
            value={component.styles.backgroundColor || ''}
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
            placeholder="#ffffff"
          />
        </div>
      </div>
      <div className="property-group">
        <label>Border</label>
        <input
          type="text"
          value={component.styles.border || ''}
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
          value={component.styles.fontSize || '16px'}
          onChange={(value) => handleStyleChange('fontSize', value)}
          min={12}
          max={24}
          unit="px"
        />
      </div>
      <div className="property-group">
        <Slider
          label="Padding"
          value={component.styles.padding || '12px'}
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
          value={component.styles.border || ''}
          onChange={(e) => handleStyleChange('border', e.target.value)}
          placeholder="2px solid #e0e0e0"
        />
      </div>
      <div className="property-group">
        <Slider
          label="Border Radius"
          value={component.styles.borderRadius || '8px'}
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
            value={component.styles.outlineColor || '#2563eb'}
            onChange={(e) => handleStyleChange('outlineColor', e.target.value)}
          />
          <input
            type="text"
            value={component.styles.outlineColor || ''}
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
            value={component.styles.backgroundColor || '#ffffff'}
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
          />
          <input
            type="text"
            value={component.styles.backgroundColor || ''}
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
            placeholder="#ffffff"
          />
        </div>
      </div>
      <div className="property-group">
        <Slider
          label="Padding"
          value={component.styles.padding || '24px'}
          onChange={(value) => handleStyleChange('padding', value)}
          min={8}
          max={64}
          unit="px"
        />
      </div>
      <div className="property-group">
        <Slider
          label="Border Radius"
          value={component.styles.borderRadius || '12px'}
          onChange={(value) => handleStyleChange('borderRadius', value)}
          min={0}
          max={32}
          unit="px"
        />
      </div>
      <div className="property-group">
        <label>Box Shadow</label>
        <select
          value={component.styles.boxShadow || '0 2px 8px rgba(0,0,0,0.1)'}
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
          value={component.styles.border || ''}
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
        <div className="property-section">
          <h4>
            {component.type.charAt(0).toUpperCase() + component.type.slice(1)}
          </h4>
        </div>

        {renderComponentSpecificProperties()}

        <div className="property-section">
          <h4>Advanced</h4>
        </div>

        <div className="property-group">
          <label>Width</label>
          <input
            type="text"
            value={component.styles.width || ''}
            onChange={(e) => handleStyleChange('width', e.target.value)}
            placeholder="auto, 100px, 50%"
          />
        </div>

        <div className="property-group">
          <label>Height</label>
          <input
            type="text"
            value={component.styles.height || ''}
            onChange={(e) => handleStyleChange('height', e.target.value)}
            placeholder="auto, 100px, 50%"
          />
        </div>

        <div className="property-group">
          <Slider
            label="Margin"
            value={component.styles.margin || '0px'}
            onChange={(value) => handleStyleChange('margin', value)}
            min={0}
            max={100}
            unit="px"
          />
        </div>
      </div>
    </div>
  );
}
