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
