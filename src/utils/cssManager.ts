import { Component } from '../types';

export class CSSManager {
  private rules: Map<string, Record<string, string>> = new Map();
  private classCounter: Map<string, number> = new Map();

  generateClassName(type: string): string {
    const count = this.classCounter.get(type) || 0;
    this.classCounter.set(type, count + 1);
    return `cb-${type}-${count + 1}`;
  }

  generateId(type: string): string {
    const count = this.classCounter.get(`${type}-id`) || 0;
    this.classCounter.set(`${type}-id`, count + 1);
    return `${type}-${count + 1}`;
  }

  addRule(selector: string, properties: Record<string, string>): void {
    this.rules.set(selector, properties);
  }

  updateRule(selector: string, properties: Record<string, string>): void {
    const existing = this.rules.get(selector) || {};
    this.rules.set(selector, { ...existing, ...properties });
  }

  deleteRule(selector: string): void {
    this.rules.delete(selector);
  }

  getRule(selector: string): Record<string, string> | undefined {
    return this.rules.get(selector);
  }

  renameSelector(oldSelector: string, newSelector: string): void {
    const properties = this.rules.get(oldSelector);
    if (properties) {
      this.rules.delete(oldSelector);
      this.rules.set(newSelector, properties);
    }
  }

  generateCSS(): string {
    let css = '';
    this.rules.forEach((properties, selector) => {
      css += `${selector} {\n`;
      Object.entries(properties).forEach(([key, value]) => {
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        css += `  ${cssKey}: ${value};\n`;
      });
      css += '}\n\n';
    });
    return css;
  }

  parseCSS(cssText: string): void {
    this.rules.clear();

    const ruleRegex = /([^{]+)\{([^}]+)\}/g;
    let match;

    while ((match = ruleRegex.exec(cssText)) !== null) {
      const selector = match[1].trim();
      const propertiesText = match[2].trim();

      const properties: Record<string, string> = {};
      const propRegex = /([^:]+):([^;]+)/g;
      let propMatch;

      while ((propMatch = propRegex.exec(propertiesText)) !== null) {
        const key = propMatch[1].trim();
        const value = propMatch[2].trim();
        const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        properties[camelKey] = value;
      }

      this.rules.set(selector, properties);
    }
  }

  componentToCSS(component: Component): void {
    if (component.className) {
      const cleanStyles: Record<string, string> = {};
      Object.entries(component.styles).forEach(([key, value]) => {
        if (value !== undefined) {
          cleanStyles[key] = value;
        }
      });
      this.addRule(`.${component.className}`, cleanStyles);
    }
    if (component.customId) {
      this.addRule(`#${component.customId}`, {});
    }
    if (component.children) {
      component.children.forEach(child => this.componentToCSS(child));
    }
  }

  getAllSelectors(): string[] {
    return Array.from(this.rules.keys());
  }
}

export const stylesToCSS = (styles: Record<string, string>): string => {
  return Object.entries(styles)
    .map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `  ${cssKey}: ${value};`;
    })
    .join('\n');
};

/**
 * Apply CSS string back to matching components by className.
 * Parses the CSS and updates component.styles for components whose
 * .className matches a CSS selector.
 */
export const applyCSSToComponents = (cssText: string, components: Component[]): Component[] => {
  const manager = new CSSManager();
  manager.parseCSS(cssText);

  const applyToComponent = (comp: Component): Component => {
    const updated = { ...comp };

    if (comp.className) {
      // Look for matching CSS rule
      const rule = manager.getRule(`.${comp.className}`);
      if (rule) {
        updated.styles = { ...comp.styles, ...rule };
      }

      // Also check wrapper rule for position/size
      const wrapperRule = manager.getRule(`.${comp.className}-wrapper`);
      if (wrapperRule) {
        if (wrapperRule.left) {
          const x = parseFloat(wrapperRule.left);
          if (!isNaN(x)) updated.position = { ...(updated.position || { x: 0, y: 0 }), x };
        }
        if (wrapperRule.top) {
          const y = parseFloat(wrapperRule.top);
          if (!isNaN(y)) updated.position = { ...(updated.position || { x: 0, y: 0 }), y };
        }
        if (wrapperRule.width) {
          const w = parseFloat(wrapperRule.width);
          if (!isNaN(w)) updated.size = { ...(updated.size || { width: 200, height: 100 }), width: w };
        }
        if (wrapperRule.height) {
          const h = parseFloat(wrapperRule.height);
          if (!isNaN(h)) updated.size = { ...(updated.size || { width: 200, height: 100 }), height: h };
        }
      }
    }

    if (comp.children) {
      updated.children = comp.children.map(applyToComponent);
    }

    return updated;
  };

  return components.map(applyToComponent);
};

/**
 * Merge user-edited CSS with generated CSS.
 * User CSS rules take precedence for matching selectors.
 */
export const mergeCSS = (generatedCSS: string, userCSS: string): string => {
  const genManager = new CSSManager();
  genManager.parseCSS(generatedCSS);

  const userManager = new CSSManager();
  userManager.parseCSS(userCSS);

  // User rules override generated rules
  userManager.getAllSelectors().forEach(selector => {
    const userRule = userManager.getRule(selector);
    if (userRule) {
      genManager.addRule(selector, userRule);
    }
  });

  return genManager.generateCSS();
};
