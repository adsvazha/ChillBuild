import { useState } from 'react';
import { Key, ArrowRight } from 'lucide-react';
import { AIConfig, AIProvider } from '../services/aiService';

interface APIConfigProps {
  onConfigured: (config: AIConfig) => void;
}

export default function APIConfig({ onConfigured }: APIConfigProps) {
  const [provider, setProvider] = useState<AIProvider>('gemini');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  const [customEndpoint, setCustomEndpoint] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      const config: AIConfig = {
        provider,
        apiKey,
        model: model || undefined,
        customEndpoint: customEndpoint || undefined,
      };
      onConfigured(config);
    }
  };

  const getDefaultModel = () => {
    switch (provider) {
      case 'gemini':
        return 'gemini-pro';
      case 'openai':
        return 'gpt-4o';
      case 'anthropic':
        return 'claude-3-5-sonnet-20241022';
      default:
        return '';
    }
  };

  return (
    <div className="api-config-container">
      <div className="api-config-content">
        <div className="api-config-header">
          <Key size={48} />
          <h1>Configure AI Provider</h1>
          <p>Enter your API key to start using AI-powered design generation</p>
        </div>

        <form className="api-config-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="provider">AI Provider</label>
            <select
              id="provider"
              value={provider}
              onChange={(e) => setProvider(e.target.value as AIProvider)}
            >
              <option value="gemini">Google Gemini</option>
              <option value="openai">OpenAI (GPT-4)</option>
              <option value="anthropic">Anthropic (Claude)</option>
              <option value="custom">Custom Endpoint</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="apiKey">API Key *</label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="model">Model (optional)</label>
            <input
              type="text"
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder={`Default: ${getDefaultModel()}`}
            />
          </div>

          {provider === 'custom' && (
            <div className="form-group">
              <label htmlFor="endpoint">Custom Endpoint *</label>
              <input
                type="url"
                id="endpoint"
                value={customEndpoint}
                onChange={(e) => setCustomEndpoint(e.target.value)}
                placeholder="https://your-api-endpoint.com"
                required
              />
            </div>
          )}

          <button type="submit" className="api-config-submit" disabled={!apiKey.trim()}>
            Continue
            <ArrowRight size={20} />
          </button>
        </form>

        <div className="api-config-footer">
          <p>Your API key is stored locally and never sent to our servers.</p>
        </div>
      </div>
    </div>
  );
}
