
import React, { useEffect, useState, useRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  status: 'safe' | 'warning' | 'danger';
  insight: string;
  Icon: LucideIcon;
  delay?: number;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, prefix = '', suffix = '', trend, trendValue, status, insight, Icon, delay = 0 }) => {
  
  const [displayValue, setDisplayValue] = useState(0);
  
  // Odometer Effect
  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1500; // ms
    const startValue = displayValue;
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function (easeOutExpo)
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const current = Math.floor(startValue + (value - startValue) * ease);
      setDisplayValue(current);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [value]);

  const statusColors = {
    safe: 'text-emerald-400 border-emerald-500/20',
    warning: 'text-amber-400 border-amber-500/20',
    danger: 'text-rose-400 border-rose-500/20',
  };

  const trendColors = {
    up: 'text-emerald-400',
    down: 'text-rose-400',
    neutral: 'text-slate-400',
  };

  // Format number with commas
  const formattedValue = new Intl.NumberFormat('en-US').format(displayValue);

  return (
    <div 
      className={`glass-panel p-6 rounded-xl relative overflow-hidden group transition-all duration-500 hover:-translate-y-1 ${statusColors[status].split(' ')[1]}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background Pulse */}
      <div className={`absolute -right-10 -top-10 w-32 h-32 bg-current opacity-5 blur-[80px] rounded-full group-hover:opacity-10 transition-opacity ${statusColors[status].split(' ')[0]}`}></div>

      <div className="flex justify-between items-start mb-4">
        <h3 className="text-slate-400 text-sm font-medium tracking-wider uppercase">{title}</h3>
        <Icon className={`w-5 h-5 ${statusColors[status].split(' ')[0]}`} />
      </div>

      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-4xl font-bold font-tech text-white tracking-tight tabular-nums">
            {prefix}{formattedValue}{suffix}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className={`text-xs font-bold px-1.5 py-0.5 rounded bg-white/5 ${trendColors[trend]}`}>
          {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '—'} {trendValue}
        </span>
        <span className="text-xs text-slate-500">geçen döneme göre</span>
      </div>

      <div className="border-t border-white/5 pt-3 mt-auto">
        <p className="text-xs text-slate-300 italic opacity-80 leading-relaxed animate-glow-in" key={insight}>
          <span className="text-cyan-400 font-semibold mr-1">Guardian Öngörüsü:</span>
          {insight}
        </p>
      </div>
    </div>
  );
};

export default KPICard;
