import { Component } from '../types';

export const generateHTMLFromComponents = (components: Component[], canvasBg: string = '#ffffff'): string => {
  const renderComponent = (component: Component): string => {
    const position = component.position || { x: 0, y: 0 };
    const size = component.size || { width: 200, height: 100 };

    const wrapperStyle = `position: absolute; left: ${position.x}px; top: ${position.y}px; width: ${size.width}px; height: ${size.height}px;`;

    const componentStyleEntries = Object.entries(component.styles)
      .map(([key, value]) => {
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `${cssKey}: ${value}`;
      })
      .join('; ');

    const componentStyle = `${componentStyleEntries}; width: 100%; height: 100%; box-sizing: border-box;`;

    let innerContent = '';
    switch (component.type) {
      case 'button':
        innerContent = `<button style="${componentStyle}">${component.content}</button>`;
        break;

      case 'text':
        innerContent = `<p style="${componentStyle}">${component.content}</p>`;
        break;

      case 'heading':
        innerContent = `<h1 style="${componentStyle}">${component.content}</h1>`;
        break;

      case 'image':
        innerContent = `<img src="${component.content}" alt="Image" style="${componentStyle}" />`;
        break;

      case 'input':
        innerContent = `<input type="text" placeholder="${component.content || 'Enter text...'}" style="${componentStyle}" />`;
        break;

      case 'textarea':
        innerContent = `<textarea placeholder="${component.content || 'Enter text...'}" style="${componentStyle}"></textarea>`;
        break;

      case 'container':
        const childrenHTML = component.children?.map(renderComponent).join('\n') || '';
        innerContent = `<div style="${componentStyle}">${childrenHTML}</div>`;
        break;

      case 'card':
        innerContent = `<div style="${componentStyle}">${component.content}</div>`;
        break;

      case 'navbar':
        const navChildren = component.children?.map(renderComponent).join('\n') || '';
        innerContent = `<nav style="${componentStyle}">${navChildren}</nav>`;
        break;

      case 'footer':
        innerContent = `<footer style="${componentStyle}">${component.content}</footer>`;
        break;

      case 'form':
        const formChildren = component.children?.map(renderComponent).join('\n') || '';
        innerContent = `<form style="${componentStyle}">${formChildren}</form>`;
        break;

      case 'video':
        innerContent = `<video controls style="${componentStyle}"><source src="${component.content}" type="video/mp4"></video>`;
        break;

      case 'grid':
        const gridChildren = component.children?.map(renderComponent).join('\n') || '';
        innerContent = `<div style="${componentStyle}">${gridChildren}</div>`;
        break;

      case 'list':
        const items = component.content.split('\n').filter(item => item.trim());
        const listItems = items.map(item => `<li>${item}</li>`).join('\n');
        innerContent = `<ul style="${componentStyle}">${listItems}</ul>`;
        break;

      case 'badge':
        innerContent = `<span style="${componentStyle}">${component.content}</span>`;
        break;

      case 'divider':
        innerContent = `<hr style="${componentStyle}" />`;
        break;

      case 'link':
        innerContent = `<a href="#" style="${componentStyle}">${component.content}</a>`;
        break;

      default:
        innerContent = '';
    }

    return `<div style="${wrapperStyle}">${innerContent}</div>`;
  };

  const componentsHTML = components.map(renderComponent).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ChillBuild Project</title>
  <style>
    * {
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
  </style>
</head>
<body>
<div class="canvas-container">
${componentsHTML}
</div>
</body>
</html>`;
};
