import { Component } from '../types';

export const generateCSSFromComponents = (components: Component[]): string => {
  const cssRules: Map<string, Record<string, string>> = new Map();

  const processComponent = (component: Component) => {
    if (component.className) {
      const position = component.position || { x: 0, y: 0 };
      const size = component.size || { width: 200, height: 100 };

      const positionStyles = {
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
      };

      const innerStyles = {
        ...component.styles,
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
      };

      cssRules.set(`.${component.className}-wrapper`, positionStyles);
      cssRules.set(`.${component.className}`, innerStyles);
    }

    if (component.children) {
      component.children.forEach(processComponent);
    }
  };

  components.forEach(processComponent);

  let css = '';
  cssRules.forEach((properties, selector) => {
    css += `${selector} {\n`;
    Object.entries(properties).forEach(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      css += `  ${cssKey}: ${value};\n`;
    });
    css += '}\n\n';
  });

  return css;
};

export const generateHTMLFromComponents = (
  components: Component[],
  _canvasBg: string = '#ffffff',
  _customCSS?: string
): string => {
  const renderComponent = (component: Component): string => {
    const className = component.className || '';
    const customId = component.customId || '';
    const wrapperClass = className ? `${className}-wrapper` : '';

    let innerContent = '';
    switch (component.type) {
      case 'button':
        innerContent = `<button class="${className}" id="${customId}">${component.content}</button>`;
        break;

      case 'text':
        innerContent = `<p class="${className}" id="${customId}">${component.content}</p>`;
        break;

      case 'heading':
        innerContent = `<h1 class="${className}" id="${customId}">${component.content}</h1>`;
        break;

      case 'image':
        innerContent = `<img src="${component.content}" alt="Image" class="${className}" id="${customId}" />`;
        break;

      case 'input':
        innerContent = `<input type="text" placeholder="${component.content || 'Enter text...'}" class="${className}" id="${customId}" />`;
        break;

      case 'textarea':
        innerContent = `<textarea placeholder="${component.content || 'Enter text...'}" class="${className}" id="${customId}"></textarea>`;
        break;

      case 'container':
        const childrenHTML = component.children?.map(renderComponent).join('\n') || '';
        innerContent = `<div class="${className}" id="${customId}">${childrenHTML}</div>`;
        break;

      case 'card':
        innerContent = `<div class="${className}" id="${customId}">${component.content}</div>`;
        break;

      case 'navbar':
        const navChildren = component.children?.map(renderComponent).join('\n') || '';
        innerContent = `<nav class="${className}" id="${customId}">${navChildren}</nav>`;
        break;

      case 'footer':
        innerContent = `<footer class="${className}" id="${customId}">${component.content}</footer>`;
        break;

      case 'form':
        const formChildren = component.children?.map(renderComponent).join('\n') || '';
        innerContent = `<form class="${className}" id="${customId}">${formChildren}</form>`;
        break;

      case 'video':
        innerContent = `<video controls class="${className}" id="${customId}"><source src="${component.content}" type="video/mp4"></video>`;
        break;

      case 'grid':
        const gridChildren = component.children?.map(renderComponent).join('\n') || '';
        innerContent = `<div class="${className}" id="${customId}">${gridChildren}</div>`;
        break;

      case 'list':
        const items = component.content.split('\n').filter((item) => item.trim());
        const listItems = items.map((item) => `<li>${item}</li>`).join('\n');
        innerContent = `<ul class="${className}" id="${customId}">${listItems}</ul>`;
        break;

      case 'badge':
        innerContent = `<span class="${className}" id="${customId}">${component.content}</span>`;
        break;

      case 'divider':
        innerContent = `<hr class="${className}" id="${customId}" />`;
        break;

      case 'link':
        innerContent = `<a href="#" class="${className}" id="${customId}">${component.content}</a>`;
        break;

      default:
        innerContent = '';
    }

    return `<div class="${wrapperClass}">${innerContent}</div>`;
  };

  const componentsHTML = components.map(renderComponent).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ChillBuild Project</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
<div class="canvas-container">
${componentsHTML}
</div>
</body>
</html>`;
};

export const generateSeparateCSS = (components: Component[], canvasBg: string = '#ffffff', customCSS?: string): string => {
  const generatedCSS = customCSS || generateCSSFromComponents(components);

  return `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  margin: 0;
  padding: 0;
  overflow: auto;
}

.canvas-container {
  position: relative;
  background-color: ${canvasBg};
  min-width: 1200px;
  min-height: 800px;
}

${generatedCSS}`;
};
