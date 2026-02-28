import { Component } from '../types';

export const componentDefaults: Record<Component['type'], Partial<Component>> = {
  button: {
    type: 'button',
    content: 'Click Me',
    styles: {
      backgroundColor: '#2563eb',
      color: '#ffffff',
      padding: '14px 28px',
      borderRadius: '12px',
      border: 'none',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
      transition: 'all 0.3s ease',
    },
  },
  text: {
    type: 'text',
    content: 'Edit this text',
    styles: {
      fontSize: '16px',
      color: '#333333',
      padding: '8px',
      lineHeight: '1.6',
    },
  },
  heading: {
    type: 'heading',
    content: 'Heading Text',
    styles: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#1a1a1a',
      padding: '8px',
      lineHeight: '1.2',
    },
  },
  image: {
    type: 'image',
    content: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=600',
    styles: {
      width: '300px',
      height: '200px',
      borderRadius: '8px',
      objectFit: 'cover',
    },
  },
  input: {
    type: 'input',
    content: 'Enter text...',
    styles: {
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      border: '2px solid #e0e0e0',
      borderRadius: '8px',
    },
  },
  container: {
    type: 'container',
    content: '',
    styles: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '24px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      border: '1px solid #e0e0e0',
      minHeight: '100px',
    },
    children: [],
  },
  card: {
    type: 'card',
    content: 'Card Content',
    styles: {
      backgroundColor: '#ffffff',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid #e0e0e0',
    },
  },
  navbar: {
    type: 'navbar',
    content: '',
    styles: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 32px',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      width: '100%',
    },
    children: [],
  },
  footer: {
    type: 'footer',
    content: '© 2024 Your Company. All rights reserved.',
    styles: {
      padding: '32px',
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      textAlign: 'center',
      width: '100%',
      fontSize: '14px',
    },
  },
  form: {
    type: 'form',
    content: '',
    styles: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '24px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      border: '1px solid #e0e0e0',
      maxWidth: '500px',
    },
    children: [],
  },
  video: {
    type: 'video',
    content: 'https://www.w3schools.com/html/mov_bbb.mp4',
    styles: {
      width: '100%',
      maxWidth: '640px',
      height: 'auto',
      borderRadius: '8px',
    },
  },
  grid: {
    type: 'grid',
    content: '',
    styles: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px',
      padding: '16px',
    },
    children: [],
  },
  list: {
    type: 'list',
    content: 'Item 1\nItem 2\nItem 3',
    styles: {
      padding: '16px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      listStylePosition: 'inside',
    },
  },
  badge: {
    type: 'badge',
    content: 'New',
    styles: {
      display: 'inline-block',
      padding: '4px 12px',
      backgroundColor: '#2563eb',
      color: '#ffffff',
      fontSize: '12px',
      fontWeight: '600',
      borderRadius: '12px',
    },
  },
  divider: {
    type: 'divider',
    content: '',
    styles: {
      width: '100%',
      height: '1px',
      backgroundColor: '#e0e0e0',
      margin: '16px 0',
      border: 'none',
    },
  },
  link: {
    type: 'link',
    content: 'Click here',
    styles: {
      color: '#2563eb',
      textDecoration: 'none',
      fontSize: '16px',
      cursor: 'pointer',
    },
  },
  textarea: {
    type: 'textarea',
    content: 'Enter your message...',
    styles: {
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      border: '2px solid #e0e0e0',
      borderRadius: '8px',
      minHeight: '120px',
      resize: 'vertical',
    },
  },
};

let componentCounters: Record<string, number> = {};

export const createComponent = (type: Component['type']): Component => {
  if (!componentCounters[type]) {
    componentCounters[type] = 0;
  }
  componentCounters[type]++;

  const className = `cb-${type}-${componentCounters[type]}`;
  const customId = `${type}-${componentCounters[type]}`;

  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    className,
    customId,
    position: { x: 50, y: 50 },
    size: { width: 200, height: 100 },
    ...componentDefaults[type],
  } as Component;
};

export const resetComponentCounters = () => {
  componentCounters = {};
};
