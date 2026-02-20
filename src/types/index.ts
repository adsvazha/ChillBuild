export interface Component {
  id: string;
  type: 'button' | 'text' | 'image' | 'container' | 'heading' | 'input' | 'card' | 'navbar' | 'footer' | 'form' | 'video' | 'grid' | 'list' | 'badge' | 'divider' | 'link' | 'textarea';
  content: string;
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
