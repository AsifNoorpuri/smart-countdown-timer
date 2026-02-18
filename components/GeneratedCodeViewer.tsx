import React, { useState } from 'react';
import { PluginConfig } from '../types';
import { generatePHPMain, generateShortcodePHP, generateCSS, generateJS } from '../utils/pluginTemplates';
import { Copy, Check } from 'lucide-react';

interface Props {
  config: PluginConfig;
}

const GeneratedCodeViewer: React.FC<Props> = ({ config }) => {
  const [activeTab, setActiveTab] = useState('main');
  const [copied, setCopied] = useState(false);

  const files = {
    main: { name: 'smart-countdown.php', content: generatePHPMain(config) },
    shortcode: { name: 'shortcode.php', content: generateShortcodePHP(config) },
    css: { name: 'style.css', content: generateCSS(config) },
    js: { name: 'script.js', content: generateJS() },
  };

  const currentContent = files[activeTab as keyof typeof files].content;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
      <div className="flex items-center bg-slate-900 border-b border-slate-800">
        {Object.entries(files).map(([key, file]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === key
                ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {file.name}
          </button>
        ))}
        <div className="ml-auto pr-4">
             <button onClick={handleCopy} className="text-slate-400 hover:text-white transition-colors">
                 {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
             </button>
        </div>
      </div>
      <div className="relative flex-1 overflow-auto bg-[#0d1117] p-4">
        <pre className="text-xs font-mono leading-relaxed text-slate-300">
          <code>{currentContent}</code>
        </pre>
      </div>
    </div>
  );
};

export default GeneratedCodeViewer;