import { Component } from '../types';

export const componentDefaults: Record<Component['type'], Partial<Component>> = {
  button: {
    type: 'button',
    content: 'Get Started',
    styles: {
      base: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        color: '#ffffff',
        padding: '12px 24px',
        borderRadius: '8px',
        border: 'none',
        fontSize: '15px',
        fontWeight: '600',
        letterSpacing: '0.02em',
        cursor: 'pointer',
        boxShadow: '0 4px 14px -2px rgba(37, 99, 235, 0.4)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      }
    },
  },
  text: {
    type: 'text',
    content: 'This is a beautifully styled text block. Use it to convey your message clearly and elegantly.',
    styles: {
      base: {
        fontSize: '16px',
        color: '#4b5563',
        lineHeight: '1.7',
        fontWeight: '400',
      }
    },
  },
  heading: {
    type: 'heading',
    content: 'Building the Future',
    styles: {
      base: {
        fontSize: '48px',
        fontWeight: '800',
        color: '#111827',
        lineHeight: '1.1',
        letterSpacing: '-0.02em',
        marginBottom: '16px',
      }
    },
  },
  image: {
    type: 'image',
    content: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2400&auto=format&fit=crop',
    styles: {
      base: {
        width: '100%',
        height: 'auto',
        borderRadius: '16px',
        objectFit: 'cover',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  input: {
    type: 'input',
    content: '',
    styles: {
      base: {
        width: '100%',
        padding: '12px 16px',
        fontSize: '15px',
        color: '#111827',
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        transition: 'all 0.2s ease',
        outline: 'none',
      }
    },
  },
  container: {
    type: 'container',
    content: '',
    styles: {
      base: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        padding: '48px 24px',
        backgroundColor: 'transparent',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
      }
    },
    children: [],
  },
  card: {
    type: 'card',
    content: 'Premium Card Design',
    styles: {
      base: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: '32px',
        borderRadius: '24px',
        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)',
        border: '1px solid rgba(229, 231, 235, 0.5)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }
    },
  },
  navbar: {
    type: 'navbar',
    content: '',
    styles: {
      base: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 48px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
        width: '100%',
        position: 'sticky',
        top: '0',
        zIndex: '50',
      }
    },
    children: [],
  },
  footer: {
    type: 'footer',
    content: '© 2024 ChillBuild. Beautifully crafted.',
    styles: {
      base: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        backgroundColor: '#0f172a',
        color: '#94a3b8',
        width: '100%',
        fontSize: '15px',
        gap: '24px',
      }
    },
  },
  form: {
    type: 'form',
    content: '',
    styles: {
      base: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '40px',
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(229, 231, 235, 0.5)',
        width: '100%',
        maxWidth: '480px',
      }
    },
    children: [],
  },
  video: {
    type: 'video',
    content: 'https://www.w3schools.com/html/mov_bbb.mp4',
    styles: {
      base: {
        width: '100%',
        height: 'auto',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  grid: {
    type: 'grid',
    content: '',
    styles: {
      base: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '32px',
        width: '100%',
      }
    },
    children: [],
  },
  list: {
    type: 'list',
    content: 'Premium Feature One\nCutting-edge Technology\nIntuitive Design',
    styles: {
      base: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        color: '#4b5563',
        fontSize: '16px',
        lineHeight: '1.6',
        listStylePosition: 'inside',
      }
    },
  },
  badge: {
    type: 'badge',
    content: 'New Feature',
    styles: {
      base: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '6px 14px',
        backgroundColor: '#eff6ff',
        color: '#2563eb',
        fontSize: '13px',
        fontWeight: '600',
        letterSpacing: '0.02em',
        borderRadius: '9999px',
        border: '1px solid #bfdbfe',
      }
    },
  },
  divider: {
    type: 'divider',
    content: '',
    styles: {
      base: {
        width: '100%',
        height: '1px',
        backgroundColor: '#e5e7eb',
        margin: '32px 0',
        border: 'none',
      }
    },
  },
  link: {
    type: 'link',
    content: 'Learn more →',
    styles: {
      base: {
        color: '#2563eb',
        textDecoration: 'none',
        fontSize: '15px',
        fontWeight: '500',
        transition: 'color 0.2s ease',
      }
    },
  },
  textarea: {
    type: 'textarea',
    content: '',
    styles: {
      base: {
        width: '100%',
        padding: '16px',
        fontSize: '15px',
        color: '#111827',
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        minHeight: '120px',
        resize: 'vertical',
        transition: 'all 0.2s ease',
        outline: 'none',
      }
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
