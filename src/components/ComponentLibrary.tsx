import {
  Type,
  Square,
  Image,
  Box,
  CreditCard,
  Heading,
  FolderInput as FormInput,
  Navigation,
  FileText,
  FileInput,
  Video,
  Grid3x3,
  List,
  Tag,
  Minus,
  Link as LinkIcon,
  MessageSquare
} from 'lucide-react';
import { Component } from '../types';
import { createComponent } from '../utils/componentDefaults';

interface ComponentLibraryProps {
  onAddComponent: (component: Component) => void;
}

export default function ComponentLibrary({ onAddComponent }: ComponentLibraryProps) {
  const components = [
    { type: 'heading' as const, icon: Heading, label: 'Heading', color: 'icon-blue' },
    { type: 'text' as const, icon: Type, label: 'Text', color: 'icon-violet' },
    { type: 'button' as const, icon: Square, label: 'Button', color: 'icon-pink' },
    { type: 'image' as const, icon: Image, label: 'Image', color: 'icon-green' },
    { type: 'input' as const, icon: FormInput, label: 'Input', color: 'icon-orange' },
    { type: 'textarea' as const, icon: MessageSquare, label: 'Textarea', color: 'icon-amber' },
    { type: 'card' as const, icon: CreditCard, label: 'Card', color: 'icon-teal' },
    { type: 'container' as const, icon: Box, label: 'Container', color: 'icon-sky' },
    { type: 'navbar' as const, icon: Navigation, label: 'Navbar', color: 'icon-cyan' },
    { type: 'footer' as const, icon: FileText, label: 'Footer', color: 'icon-emerald' },
    { type: 'form' as const, icon: FileInput, label: 'Form', color: 'icon-violet' },
    { type: 'video' as const, icon: Video, label: 'Video', color: 'icon-red' },
    { type: 'grid' as const, icon: Grid3x3, label: 'Grid', color: 'icon-pink' },
    { type: 'list' as const, icon: List, label: 'List', color: 'icon-green' },
    { type: 'badge' as const, icon: Tag, label: 'Badge', color: 'icon-rose' },
    { type: 'divider' as const, icon: Minus, label: 'Divider', color: 'icon-teal' },
    { type: 'link' as const, icon: LinkIcon, label: 'Link', color: 'icon-blue' },
  ];

  const handleDragStart = (e: React.DragEvent, type: Component['type']) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('componentType', type);
  };

  return (
    <div className="component-library">
      <div className="library-header">
        <h3>Components</h3>
        <p>Drag to canvas</p>
      </div>
      <div className="library-grid">
        {components.map(({ type, icon: Icon, label, color }) => (
          <div
            key={type}
            className="library-item"
            draggable
            onDragStart={(e) => handleDragStart(e, type)}
            onClick={() => onAddComponent(createComponent(type))}
          >
            <div className={`library-item-icon ${color}`}>
              <Icon size={22} />
            </div>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
