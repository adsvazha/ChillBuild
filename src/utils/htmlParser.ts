import { Component } from '../types';

export const parseHTMLToComponents = (html: string): Component[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const components: Component[] = [];

  let componentIdCounter = 0;

  const parseElement = (element: Element): Component | null => {
    componentIdCounter++;
    const id = `parsed-${componentIdCounter}`;

    const computedStyles = window.getComputedStyle(element);
    const styles: Record<string, string> = {};

    const styleProperties = [
      'backgroundColor',
      'color',
      'fontSize',
      'fontWeight',
      'padding',
      'margin',
      'borderRadius',
      'border',
      'width',
      'height',
      'display',
      'flexDirection',
      'justifyContent',
      'alignItems',
      'gap',
      'textAlign',
      'lineHeight',
    ];

    styleProperties.forEach((prop) => {
      const value = computedStyles.getPropertyValue(
        prop.replace(/([A-Z])/g, '-$1').toLowerCase()
      );
      if (value && value !== 'none' && value !== 'normal') {
        styles[prop] = value;
      }
    });

    const inlineStyle = element.getAttribute('style');
    if (inlineStyle) {
      inlineStyle.split(';').forEach((style) => {
        const [key, value] = style.split(':').map((s) => s.trim());
        if (key && value) {
          const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
          styles[camelKey] = value;
        }
      });
    }

    const tagName = element.tagName.toLowerCase();
    let type: Component['type'] = 'container';
    let content = '';

    switch (tagName) {
      case 'button':
        type = 'button';
        content = element.textContent || 'Button';
        break;
      case 'p':
        type = 'text';
        content = element.textContent || '';
        break;
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        type = 'heading';
        content = element.textContent || '';
        break;
      case 'img':
        type = 'image';
        content = element.getAttribute('src') || '';
        break;
      case 'input':
        type = 'input';
        content = element.getAttribute('placeholder') || '';
        break;
      case 'div':
      case 'section':
      case 'article':
      case 'main':
      case 'aside':
      case 'header':
      case 'footer':
      case 'nav':
        type = 'container';
        content = '';
        break;
      default:
        return null;
    }

    const component: Component = {
      id,
      type,
      content,
      styles,
      position: { x: 0, y: 0 },
      size: { width: 200, height: 100 },
    };

    if (type === 'container') {
      const children: Component[] = [];
      Array.from(element.children).forEach((child) => {
        const childComponent = parseElement(child);
        if (childComponent) {
          children.push(childComponent);
        }
      });
      if (children.length > 0) {
        component.children = children;
      }
    }

    return component;
  };

  const bodyChildren = Array.from(doc.body.children);
  bodyChildren.forEach((element) => {
    const component = parseElement(element);
    if (component) {
      components.push(component);
    }
  });

  return components;
};
