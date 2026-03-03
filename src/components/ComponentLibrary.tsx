import { useState, useEffect } from 'react';
import {
  Type,
  Square,
  Image as ImageIcon,
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
  MessageSquare,
  Search,
  Layout,
  Star,
  X,
  Loader2
} from 'lucide-react';
import { Component } from '../types';
import { createComponent } from '../utils/componentDefaults';
import { AssetService, Asset } from '../services/assetService';

interface ComponentLibraryProps {
  onAddComponent: (component: Component) => void;
}

type LibraryTab = 'components' | 'assets';

export default function ComponentLibrary({ onAddComponent }: ComponentLibraryProps) {
  const [activeTab, setActiveTab] = useState<LibraryTab>('components');
  const [searchQuery, setSearchQuery] = useState('');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const components = [
    { type: 'heading' as const, icon: Heading, label: 'Heading', color: 'icon-blue' },
    { type: 'text' as const, icon: Type, label: 'Text', color: 'icon-violet' },
    { type: 'button' as const, icon: Square, label: 'Button', color: 'icon-pink' },
    { type: 'image' as const, icon: ImageIcon, label: 'Image', color: 'icon-green' },
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

  useEffect(() => {
    if (activeTab === 'assets' && searchQuery.length >= 2) {
      const delaySearch = setTimeout(() => {
        handleSearch();
      }, 500);
      return () => clearTimeout(delaySearch);
    }
  }, [searchQuery, activeTab]);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const [images, stickers] = await Promise.all([
        AssetService.searchImages(searchQuery || 'nature'),
        AssetService.searchStickers(searchQuery)
      ]);
      setAssets([...stickers, ...images]);
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, type: Component['type']) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('componentType', type);
  };

  const handleAssetDragStart = (e: React.DragEvent, asset: Asset) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('componentType', 'image');
    e.dataTransfer.setData('assetUrl', asset.url);
  };

  const handleAssetClick = (asset: Asset) => {
    const component = createComponent('image');
    component.content = asset.url;
    onAddComponent(component);
  };

  return (
    <div className="component-library">
      <div className="library-header">
        <h3>Library</h3>
        <p>Explore elements</p>
      </div>

      <div className="library-tabs">
        <button
          className={`tab-btn ${activeTab === 'components' ? 'active' : ''}`}
          onClick={() => setActiveTab('components')}
        >
          <Layout size={14} />
          Components
        </button>
        <button
          className={`tab-btn ${activeTab === 'assets' ? 'active' : ''}`}
          onClick={() => setActiveTab('assets')}
        >
          <Star size={14} />
          Assets
        </button>
      </div>

      <div className="search-container">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder={activeTab === 'components' ? "Search components..." : "Search travel, coffee, etc."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="library-content">
        {activeTab === 'components' ? (
          <div className="library-grid">
            {components
              .filter(c => c.label.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(({ type, icon: Icon, label, color }) => (
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
        ) : (
          <div className="assets-grid">
            {isLoading ? (
              <div className="loading-state">
                <Loader2 size={24} className="animate-spin" />
                <span>Finding assets...</span>
              </div>
            ) : assets.length > 0 ? (
              <div className="thumbnail-grid">
                {assets.map((asset) => (
                  <div
                    key={asset.id}
                    className="asset-thumbnail"
                    draggable
                    onDragStart={(e) => handleAssetDragStart(e, asset)}
                    onClick={() => handleAssetClick(asset)}
                    title={`Click or drag to add ${asset.alt}`}
                  >
                    <img src={asset.thumbnail} alt={asset.alt} />
                    <div className="asset-overlay">
                      <ImageIcon size={16} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <ImageIcon size={32} />
                <p>{searchQuery ? "No results found" : "Search to explore assets"}</p>
                <span>Try "travel", "coffee" or "technology"</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
