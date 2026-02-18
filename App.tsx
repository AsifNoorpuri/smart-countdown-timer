import React, { useState } from 'react';
import { PluginConfig, defaultConfig } from './types';
import ConfigPanel from './components/ConfigPanel';
import Preview from './components/Preview';
import { downloadPlugin } from './utils/zipGenerator';
import { Download, Settings2, X, Share2, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [config, setConfig] = useState<PluginConfig>(defaultConfig);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleDownload = async () => {
    setIsGenerating(true);
    await downloadPlugin(config);
    setIsGenerating(false);
  };

  return (
    <div className="relative flex h-screen w-full bg-slate-950 text-slate-200 font-sans overflow-hidden selection:bg-blue-500/30">
      
      {/* Main Fullscreen Timer Area */}
      <main className="flex-1 relative flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        
        {/* Top Bar (Mobile/overlay) */}
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
          <div className="flex items-center gap-3 opacity-80">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="font-bold text-white text-lg">S</span>
             </div>
             <span className="font-semibold tracking-tight text-white hidden sm:inline-block">Smart Countdown</span>
          </div>

          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-3 bg-slate-800/50 backdrop-blur-md hover:bg-slate-700/50 text-white rounded-full transition-all ring-1 ring-white/10 shadow-xl"
          >
            {isSidebarOpen ? <X size={20} /> : <Settings2 size={20} />}
          </button>
        </div>

        {/* The Timer */}
        <div className="w-full max-w-5xl px-4 scale-110 sm:scale-125 transition-transform duration-500">
            <Preview config={config} fullscreen={true} />
        </div>

        {/* Footer info */}
        <div className="absolute bottom-8 text-center opacity-40 text-sm font-light tracking-widest">
            PREVIEW MODE
        </div>
      </main>

      {/* Floating Configuration Sidebar */}
      <aside 
        className={`fixed inset-y-0 right-0 w-full sm:w-[400px] bg-slate-900/95 backdrop-blur-xl border-l border-slate-700/50 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] z-20 flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/5">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Settings2 size={18} className="text-blue-400" />
                Configure Timer
            </h2>
            <button onClick={() => setSidebarOpen(false)} className="sm:hidden text-slate-400">
                <X size={24} />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            <ConfigPanel config={config} onChange={setConfig} />
        </div>

        <div className="p-6 border-t border-white/5 bg-slate-900/50 space-y-4">
            {/* WordPress Export Action */}
           <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5 space-y-3">
               <div className="flex items-center gap-3 text-sm text-slate-300">
                   <Globe size={16} className="text-blue-400" />
                   <span>Want this on your website?</span>
               </div>
               <button
                onClick={handleDownload}
                disabled={isGenerating}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-lg shadow-lg shadow-blue-900/20 transition-all transform hover:translate-y-[-1px] active:translate-y-[1px] flex items-center justify-center gap-2"
                >
                {isGenerating ? (
                    <span className="animate-pulse">Building Package...</span>
                ) : (
                    <>
                        <Download size={18} />
                        <span>Download WordPress Plugin</span>
                    </>
                )}
                </button>
                <div className="text-[10px] text-center text-slate-500 flex justify-center gap-4">
                    <span>v1.0.0 Stable</span>
                    <span>•</span>
                    <span>No Coding Required</span>
                </div>
           </div>
        </div>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10 sm:hidden"
            onClick={() => setSidebarOpen(false)}
          />
      )}
    </div>
  );
};

export default App;