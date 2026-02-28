export interface Component {
  id: string;
  type: 'button' | 'text' | 'image' | 'container' | 'heading' | 'input' | 'card' | 'navbar' | 'footer' | 'form' | 'video' | 'grid' | 'list' | 'badge' | 'divider' | 'link' | 'textarea';
  content: string;
  className?: string;
  customId?: string;
  position?: {
    x: number;
    y: number;
  };
  size?: {
    width: number;
    height: number;
  };
  styles: {
    width?: string;
    height?: string;
    backgroundColor?: string;
    color?: string;
    fontSize?: string;
    fontWeight?: string;
    padding?: string;
    margin?: string;
    borderRadius?: string;
    border?: string;
    display?: string;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    gap?: string;
    lineHeight?: string;
    textAlign?: string;
    objectFit?: string;
    boxShadow?: string;
    gridTemplateColumns?: string;
    listStylePosition?: string;
    textDecoration?: string;
    cursor?: string;
    minHeight?: string;
    maxWidth?: string;
    resize?: string;
    [key: string]: string | undefined;
  };
  children?: Component[];
}

export interface CSSRule {
  selector: string;
  properties: Record<string, string>;
}

export interface OnboardingTip {
  id: string;
  title: string;
  message: string;
  trigger: 'first-component' | 'first-css-edit' | 'first-class-create' | 'first-export';
  shown: boolean;
}

// === NEW: Multi-page support ===

export interface Page {
  id: string;
  name: string;
  components: Component[];
  cssCode: string;
  canvasBg: string;
}

// === NEW: Workspace panel system ===

export type PanelId = 'components' | 'canvas' | 'properties' | 'html-editor' | 'css-editor' | 'layers';

export interface PanelConfig {
  id: PanelId;
  title: string;
  visible: boolean;
  width: number;       // percentage or pixels
  minWidth: number;
  collapsed: boolean;
}

export type LayoutPreset = 'design' | 'code' | 'preview';

export interface WorkspaceState {
  panels: PanelConfig[];
  activePreset: LayoutPreset;
  focusMode: boolean;
}
