import React, { useEffect, useState, useRef } from 'react';
import { PluginConfig } from '../types';

interface PreviewProps {
  config: PluginConfig;
  fullscreen?: boolean;
}

const Preview: React.FC<PreviewProps> = ({ config, fullscreen = false }) => {
  const [timeLeft, setTimeLeft] = useState<{d: number, h: number, m: number, s: number} | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  
  const styleRef = useRef<HTMLStyleElement | null>(null);

  // Inject CSS for preview based on config
  useEffect(() => {
    if (!styleRef.current) {
        styleRef.current = document.createElement('style');
        document.head.appendChild(styleRef.current);
    }
    
    // Dynamic CSS logic
    const { 
        layout, 
        backgroundColor, 
        textColor, 
        numberBackgroundColor, 
        numberTextColor 
    } = config;

    const baseCSS = `
        .sct-container {
            font-family: 'Inter', sans-serif;
            width: 100%;
            max-width: ${layout === 'box' ? '600px' : '100%'};
            background-color: ${backgroundColor};
            color: ${textColor};
            display: flex;
            align-items: center;
            justify-content: ${layout === 'box' ? 'center' : 'space-between'};
            padding: ${layout === 'bar' ? '12px 24px' : '24px 32px'};
            border-radius: ${layout === 'box' ? '16px' : '0'};
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            position: relative;
            flex-wrap: wrap;
            gap: 20px;
            box-sizing: border-box;
            transition: all 0.3s ease;
        }

        /* Layout Specifics */
        .sct-layout-bar {
            flex-direction: row;
        }
        .sct-layout-banner {
            flex-direction: row;
        }
        .sct-layout-box {
            flex-direction: column;
            text-align: center;
        }

        /* Content Text */
        .sct-text-content {
            display: flex;
            flex-direction: ${layout === 'box' ? 'column' : 'row'};
            align-items: center;
            gap: 12px;
            font-weight: 600;
        }
        .sct-title {
            font-size: ${layout === 'bar' ? '1.1rem' : '1.5rem'};
            line-height: 1.2;
            font-weight: 700;
        }
        .sct-pre-date {
            font-size: 1rem;
            opacity: 0.9;
        }

        /* Timer Block */
        .sct-timer {
            display: flex;
            align-items: center;
            gap: ${layout === 'bar' ? '8px' : '16px'};
        }

        /* Digit Box */
        .sct-box {
            display: flex;
            flex-direction: ${layout === 'bar' ? 'row' : 'column'};
            align-items: center;
            justify-content: center;
            background-color: ${numberBackgroundColor};
            color: ${numberTextColor};
            padding: ${layout === 'bar' ? '6px 12px' : '12px 16px'};
            border-radius: ${layout === 'bar' ? '6px' : '8px'};
            min-width: ${layout === 'bar' ? 'auto' : '80px'};
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .sct-number {
            font-size: ${layout === 'bar' ? '1.1rem' : '2rem'};
            font-weight: 700;
            line-height: 1;
            font-variant-numeric: tabular-nums;
        }

        .sct-label {
            font-size: ${layout === 'bar' ? '0.75rem' : '0.7rem'};
            text-transform: uppercase;
            margin-left: ${layout === 'bar' ? '6px' : '0'};
            margin-top: ${layout === 'bar' ? '0' : '4px'};
            opacity: 0.8;
            font-weight: 500;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
            .sct-container {
                flex-direction: column;
                text-align: center;
                gap: 16px;
                padding: 16px;
                border-radius: ${layout === 'box' ? '16px' : '0'};
                justify-content: center;
            }
            
            .sct-text-content {
                flex-direction: column;
                gap: 4px;
                text-align: center;
            }
            
            .sct-box {
                min-width: ${layout === 'bar' ? 'auto' : '60px'};
                padding: ${layout === 'bar' ? '6px 10px' : '8px'};
            }
            .sct-number {
                font-size: ${layout === 'bar' ? '1rem' : '1.5rem'};
            }
            .sct-label {
                font-size: 0.65rem;
            }
        }
    `;
    styleRef.current.textContent = baseCSS;

    return () => {
        if (styleRef.current) {
            styleRef.current.remove();
            styleRef.current = null;
        }
    }
  }, [config]);

  useEffect(() => {
    const target = new Date(`${config.targetDate}T${config.targetTime}:00`).getTime();

    const update = () => {
        const now = new Date().getTime();
        const distance = target - now;

        if (distance < 0) {
            setIsExpired(true);
            setTimeLeft(null);
        } else {
            setIsExpired(false);
            setTimeLeft({
            d: Math.floor(distance / (1000 * 60 * 60 * 24)),
            h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            s: Math.floor((distance % (1000 * 60)) / 1000),
            });
        }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [config.targetDate, config.targetTime]);

  if (isExpired) {
      return (
        <div className="flex flex-col items-center justify-center animate-in fade-in duration-500 w-full px-4">
             <div className="text-center p-8 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl shadow-2xl max-w-md w-full">
                {config.expiryAction === 'hide' ? (
                    <span className="italic text-slate-400">Timer Hidden (Expired)</span>
                ) : config.expiryAction === 'redirect' ? (
                    <div className="space-y-3">
                        <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto"></div>
                        <span className="block text-slate-300 text-sm">Redirecting...</span>
                    </div>
                ) : (
                    <span className="text-xl font-bold text-red-400">
                        {config.expiryMessage}
                    </span>
                )}
            </div>
        </div>
      )
  }

  // Positioning container logic for preview
  const positionClass = config.position === 'top' ? 'self-start mb-auto' : config.position === 'bottom' ? 'self-end mt-auto' : '';
  const widthClass = config.layout === 'box' ? 'w-auto' : 'w-full';

  return (
    <div className={`flex flex-col items-center justify-center w-full h-full p-4 transition-all duration-500 ${positionClass}`}>
        <div className={`sct-container sct-layout-${config.layout} ${widthClass} shadow-2xl`}>
            
            {/* Text Content */}
            <div className="sct-text-content">
                {config.layout === 'banner' && config.titleText && (
                    <div className="sct-title">{config.titleText}</div>
                )}
                {config.preDateText && (
                    <div className="sct-pre-date">{config.preDateText}</div>
                )}
            </div>

            {/* Timer */}
            <div className="sct-timer">
                {config.showDays && timeLeft && (
                    <div className="sct-box">
                        <span className="sct-number">{timeLeft.d < 10 ? `0${timeLeft.d}` : timeLeft.d}</span>
                        <span className="sct-label">{config.layout === 'bar' ? 'Days' : 'Days'}</span>
                    </div>
                )}
                {config.showHours && timeLeft && (
                    <div className="sct-box">
                        <span className="sct-number">{timeLeft.h < 10 ? `0${timeLeft.h}` : timeLeft.h}</span>
                        <span className="sct-label">{config.layout === 'bar' ? 'Hr' : 'Hours'}</span>
                    </div>
                )}
                {config.showMinutes && timeLeft && (
                    <div className="sct-box">
                        <span className="sct-number">{timeLeft.m < 10 ? `0${timeLeft.m}` : timeLeft.m}</span>
                        <span className="sct-label">{config.layout === 'bar' ? 'Min' : 'Minutes'}</span>
                    </div>
                )}
                {config.showSeconds && timeLeft && (
                    <div className="sct-box">
                        <span className="sct-number">{timeLeft.s < 10 ? `0${timeLeft.s}` : timeLeft.s}</span>
                        <span className="sct-label">{config.layout === 'bar' ? 'Sec' : 'Seconds'}</span>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default Preview;