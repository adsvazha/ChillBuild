import { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { Copy, Check, Plus, FileCode } from 'lucide-react';
import { Component } from '../types';

interface CSSEditorProps {
  css: string;
  onChange: (css: string) => void;
  selectedComponent: Component | null;
  onCreateClass: () => void;
}

export default function CSSEditor({ css, onChange, selectedComponent, onCreateClass }: CSSEditorProps) {
  const [copied, setCopied] = useState(false);
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null);

  useEffect(() => {
    if (selectedComponent?.className) {
      const lines = css.split('\n');
      const lineIndex = lines.findIndex(line => line.includes(`.${selectedComponent.className}`));
      if (lineIndex !== -1) {
        setHighlightedLine(lineIndex + 1);
      }
    } else {
      setHighlightedLine(null);
    }
  }, [selectedComponent, css]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditorDidMount = (editor: any) => {
    if (highlightedLine) {
      editor.revealLineInCenter(highlightedLine);
      editor.setPosition({ lineNumber: highlightedLine, column: 1 });
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#1e1e1e' }}>
      <div
        style={{
          background: '#2d2d2d',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #404040',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileCode size={18} style={{ color: '#ffffff' }} />
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', margin: 0 }}>
            CSS Editor
          </h3>
          {selectedComponent && (
            <span
              style={{
                fontSize: '12px',
                color: '#2563eb',
                background: 'rgba(37, 99, 235, 0.2)',
                padding: '2px 8px',
                borderRadius: '4px',
              }}
            >
              .{selectedComponent.className}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onCreateClass}
            style={{
              padding: '6px 12px',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            title="Create new CSS class"
          >
            <Plus size={16} />
            New Class
          </button>
          <button
            onClick={handleCopy}
            style={{
              padding: '6px 12px',
              background: '#404040',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            title="Copy CSS to clipboard"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <Editor
          height="100%"
          defaultLanguage="css"
          value={css}
          theme="vs-dark"
          onChange={(value) => onChange(value || '')}
          onMount={handleEditorDidMount}
          options={{
            readOnly: false,
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            formatOnPaste: true,
            formatOnType: true,
            suggest: {
              showProperties: true,
              showKeywords: true,
              showSnippets: true,
            },
            quickSuggestions: {
              other: true,
              comments: false,
              strings: true,
            },
          }}
        />
      </div>
      <div
        style={{
          background: '#2d2d2d',
          padding: '8px 16px',
          borderTop: '1px solid #404040',
          fontSize: '12px',
          color: '#888',
        }}
      >
        Press Ctrl+S to save • Use Ctrl+Space for suggestions
      </div>
    </div>
  );
}
