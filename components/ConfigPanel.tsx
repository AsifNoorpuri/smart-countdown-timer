import React from 'react';
import { PluginConfig, LayoutType, PositionType } from '../types';
import { Clock, Palette, Layout, Type, MousePointerClick, AlignVerticalJustifyCenter } from 'lucide-react';

interface Props {
  config: PluginConfig;
  onChange: (newConfig: PluginConfig) => void;
}

const ConfigPanel: React.FC<Props> = ({ config, onChange }) => {
  const handleChange = (key: keyof PluginConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Layout Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Layout size={18} />
            <h3 className="font-semibold uppercase tracking-wider text-xs">Layout Type</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
            {['bar', 'banner', 'box'].map((type) => (
                <button
                    key={type}
                    onClick={() => handleChange('layout', type)}
                    className={`p-3 rounded-lg border text-sm capitalize flex flex-col items-center justify-center gap-2 transition-all ${
                        config.layout === type
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm ring-1 ring-blue-500/50'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                    }`}
                >
                    <span className="font-medium">{type}</span>
                </button>
            ))}
        </div>

        {config.layout !== 'box' && (
            <div className="pt-2">
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-2">Position</label>
                <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                    {['top', 'bottom', 'inline'].map((pos) => (
                        <button
                            key={pos}
                            onClick={() => handleChange('position', pos)}
                            className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium capitalize transition-all ${
                                config.position === pos
                                ? 'bg-slate-600 text-white shadow'
                                : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            {pos}
                        </button>
                    ))}
                </div>
            </div>
        )}
      </section>

      {/* Content Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-green-400 mb-2">
            <Type size={18} />
            <h3 className="font-semibold uppercase tracking-wider text-xs">Content</h3>
        </div>
        
        {config.layout === 'banner' && (
            <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">Banner Title</label>
                <input
                    type="text"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:ring-2 focus:ring-green-500 outline-none"
                    value={config.titleText}
                    onChange={(e) => handleChange('titleText', e.target.value)}
                    placeholder="e.g. 🔥 Cyber Monday Sale"
                />
            </div>
        )}

        {config.layout !== 'box' && (
            <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">Text Before Timer</label>
                <input
                    type="text"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:ring-2 focus:ring-green-500 outline-none"
                    value={config.preDateText}
                    onChange={(e) => handleChange('preDateText', e.target.value)}
                    placeholder="e.g. Sale ends in:"
                />
            </div>
        )}

        <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-2">Date & Time</label>
            <div className="grid grid-cols-2 gap-2">
                <input
                    type="date"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white outline-none"
                    value={config.targetDate}
                    onChange={(e) => handleChange('targetDate', e.target.value)}
                />
                <input
                    type="time"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white outline-none"
                    value={config.targetTime}
                    onChange={(e) => handleChange('targetTime', e.target.value)}
                />
            </div>
        </div>
      </section>

      {/* Colors Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-purple-400 mb-2">
            <Palette size={18} />
            <h3 className="font-semibold uppercase tracking-wider text-xs">Colors</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">Background</label>
                <div className="flex items-center gap-2">
                    <input
                        type="color"
                        value={config.backgroundColor}
                        onChange={(e) => handleChange('backgroundColor', e.target.value)}
                        className="h-8 w-8 rounded cursor-pointer bg-transparent border-0 p-0"
                    />
                    <span className="text-xs font-mono text-slate-400">{config.backgroundColor}</span>
                </div>
            </div>
            <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">Text Color</label>
                <div className="flex items-center gap-2">
                    <input
                        type="color"
                        value={config.textColor}
                        onChange={(e) => handleChange('textColor', e.target.value)}
                        className="h-8 w-8 rounded cursor-pointer bg-transparent border-0 p-0"
                    />
                    <span className="text-xs font-mono text-slate-400">{config.textColor}</span>
                </div>
            </div>
            <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">Digit Bg</label>
                <div className="flex items-center gap-2">
                    <input
                        type="color"
                        value={config.numberBackgroundColor}
                        onChange={(e) => handleChange('numberBackgroundColor', e.target.value)}
                        className="h-8 w-8 rounded cursor-pointer bg-transparent border-0 p-0"
                    />
                    <span className="text-xs font-mono text-slate-400">{config.numberBackgroundColor}</span>
                </div>
            </div>
            <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">Digit Color</label>
                <div className="flex items-center gap-2">
                    <input
                        type="color"
                        value={config.numberTextColor}
                        onChange={(e) => handleChange('numberTextColor', e.target.value)}
                        className="h-8 w-8 rounded cursor-pointer bg-transparent border-0 p-0"
                    />
                    <span className="text-xs font-mono text-slate-400">{config.numberTextColor}</span>
                </div>
            </div>
        </div>
      </section>

      {/* Expiry Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-amber-400 mb-2">
            <MousePointerClick size={18} />
            <h3 className="font-semibold uppercase tracking-wider text-xs">Behavior</h3>
        </div>
        <div className="space-y-3">
             <select
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:ring-2 focus:ring-amber-500 outline-none"
                value={config.expiryAction}
                onChange={(e) => handleChange('expiryAction', e.target.value)}
            >
                <option value="message">Show Message</option>
                <option value="hide">Hide Timer</option>
                <option value="redirect">Redirect to URL</option>
            </select>
        
            {config.expiryAction === 'message' && (
                <input
                    type="text"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:ring-2 focus:ring-amber-500 outline-none"
                    value={config.expiryMessage}
                    onChange={(e) => handleChange('expiryMessage', e.target.value)}
                    placeholder="Expiry Message"
                />
            )}
            
            {config.expiryAction === 'redirect' && (
                <input
                    type="url"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:ring-2 focus:ring-amber-500 outline-none"
                    value={config.redirectUrl}
                    onChange={(e) => handleChange('redirectUrl', e.target.value)}
                    placeholder="https://"
                />
            )}
        </div>
      </section>
    </div>
  );
};

export default ConfigPanel;