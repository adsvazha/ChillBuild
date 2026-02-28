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

      const innerStyles: Record<string, string> = {};
      Object.entries(component.styles).forEach(([key, value]) => {
        if (value !== undefined) {
          innerStyles[key] = value;
        }
      });
      innerStyles['width'] = '100%';
      innerStyles['height'] = '100%';
      innerStyles['boxSizing'] = 'border-box';

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

/**
 * Generate clean HTML body content from components.
 * No inline styles — uses class and id attributes only.
 */
export const generateBodyHTML = (components: Component[]): string => {
  const renderComponent = (component: Component, indent: number = 2): string => {
    const pad = ' '.repeat(indent);
    const className = component.className || '';
    const customId = component.customId || '';
    const wrapperClass = className ? `${className}-wrapper` : '';
    const idAttr = customId ? ` id="${customId}"` : '';

    let innerContent = '';
    switch (component.type) {
      case 'button':
        innerContent = `${pad}  <button class="${className}"${idAttr}>${component.content}</button>`;
        break;
      case 'text':
        innerContent = `${pad}  <p class="${className}"${idAttr}>${component.content}</p>`;
        break;
      case 'heading':
        innerContent = `${pad}  <h1 class="${className}"${idAttr}>${component.content}</h1>`;
        break;
      case 'image':
        innerContent = `${pad}  <img src="${component.content}" alt="Image" class="${className}"${idAttr} />`;
        break;
      case 'input':
        innerContent = `${pad}  <input type="text" placeholder="${component.content || 'Enter text...'}" class="${className}"${idAttr} />`;
        break;
      case 'textarea':
        innerContent = `${pad}  <textarea placeholder="${component.content || 'Enter text...'}" class="${className}"${idAttr}></textarea>`;
        break;
      case 'container': {
        const children = component.children?.map(c => renderComponent(c, indent + 4)).join('\n') || '';
        innerContent = children
          ? `${pad}  <div class="${className}"${idAttr}>\n${children}\n${pad}  </div>`
          : `${pad}  <div class="${className}"${idAttr}></div>`;
        break;
      }
      case 'card':
        innerContent = `${pad}  <div class="${className}"${idAttr}>${component.content}</div>`;
        break;
      case 'navbar': {
        const navChildren = component.children?.map(c => renderComponent(c, indent + 4)).join('\n') || '';
        innerContent = navChildren
          ? `${pad}  <nav class="${className}"${idAttr}>\n${navChildren}\n${pad}  </nav>`
          : `${pad}  <nav class="${className}"${idAttr}></nav>`;
        break;
      }
      case 'footer':
        innerContent = `${pad}  <footer class="${className}"${idAttr}>${component.content}</footer>`;
        break;
      case 'form': {
        const formChildren = component.children?.map(c => renderComponent(c, indent + 4)).join('\n') || '';
        innerContent = formChildren
          ? `${pad}  <form class="${className}"${idAttr}>\n${formChildren}\n${pad}  </form>`
          : `${pad}  <form class="${className}"${idAttr}></form>`;
        break;
      }
      case 'video':
        innerContent = `${pad}  <video controls class="${className}"${idAttr}><source src="${component.content}" type="video/mp4"></video>`;
        break;
      case 'grid': {
        const gridChildren = component.children?.map(c => renderComponent(c, indent + 4)).join('\n') || '';
        innerContent = gridChildren
          ? `${pad}  <div class="${className}"${idAttr}>\n${gridChildren}\n${pad}  </div>`
          : `${pad}  <div class="${className}"${idAttr}></div>`;
        break;
      }
      case 'list': {
        const items = component.content.split('\n').filter(item => item.trim());
        const listItems = items.map(item => `${pad}    <li>${item}</li>`).join('\n');
        innerContent = `${pad}  <ul class="${className}"${idAttr}>\n${listItems}\n${pad}  </ul>`;
        break;
      }
      case 'badge':
        innerContent = `${pad}  <span class="${className}"${idAttr}>${component.content}</span>`;
        break;
      case 'divider':
        innerContent = `${pad}  <hr class="${className}"${idAttr} />`;
        break;
      case 'link':
        innerContent = `${pad}  <a href="#" class="${className}"${idAttr}>${component.content}</a>`;
        break;
      default:
        innerContent = '';
    }

    return `${pad}<div class="${wrapperClass}">\n${innerContent}\n${pad}</div>`;
  };

  return components.map(c => renderComponent(c)).join('\n');
};

export const generateHTMLFromComponents = (
  components: Component[],
  _canvasBg: string = '#ffffff',
  _customCSS?: string
): string => {
  const bodyHTML = generateBodyHTML(components);

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
${bodyHTML}
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
