import React from 'react';
import { useBrand } from '../context/BrandContext';
import { Store, GeneralStats } from '../types';
import { 
  Building2, 
  Leaf, 
  Zap, 
  Crown, 
  Monitor, 
  Sparkles, 
  MapPin, 
  Layers, 
  Keyboard
} from 'lucide-react';

interface BrandHeroProps {
  currentStore?: Store;
  stats: GeneralStats;
  filteredCount: number;
}

export const BrandHero: React.FC<BrandHeroProps> = ({ currentStore, stats, filteredCount }) => {
  const { activeBrand } = useBrand();

  const renderIcon = (className = "w-6 h-6") => {
    switch (activeBrand.iconName) {
      case 'Leaf': return <Leaf className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Crown': return <Crown className={className} />;
      case 'Monitor': return <Monitor className={className} />;
      case 'Building2':
      default:
        return <Building2 className={className} />;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-sm transition-all duration-300">
      {/* Dynamic Brand Accent Top Border */}
      <div 
        className="h-2 w-full transition-all duration-500" 
        style={{ background: activeBrand.gradient }}
      />

      <div className="p-5 sm:p-6 lg:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left: Brand Identity & Current Store */}
        <div className="flex items-start gap-4">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg transition-transform duration-300 group-hover:scale-105"
            style={{ 
              background: activeBrand.gradient,
              boxShadow: `0 10px 25px -5px ${activeBrand.glowRgba}`
            }}
          >
            {renderIcon("w-7 h-7")}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                {activeBrand.name}
              </span>
              <span 
                className="text-xs font-bold px-2.5 py-0.5 rounded-full border transition-colors shadow-xs"
                style={{
                  backgroundColor: 'var(--color-brand-50)',
                  color: 'var(--color-brand-700)',
                  borderColor: 'var(--color-brand-200)'
                }}
              >
                {activeBrand.badge}
              </span>
              {currentStore && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  <MapPin className="w-3 h-3 text-brand-600" />
                  {currentStore.name} ({currentStore.code})
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              {activeBrand.tagline}
            </p>
          </div>
        </div>

        {/* Right: Quick Operational Cashier Metrics */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
          
          <div className="flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="p-2 rounded-xl bg-white border border-slate-200 text-brand-600 shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">En Pantalla</p>
              <p className="text-base font-extrabold text-slate-900 leading-tight">
                {filteredCount} <span className="text-xs font-normal text-slate-500">códigos</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
            <div className="p-2 rounded-xl bg-white border border-emerald-200 text-emerald-600 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Nuevos</p>
              <p className="text-base font-extrabold text-emerald-900 leading-tight">
                {stats.newProducts} <span className="text-xs font-normal text-emerald-700">esta semana</span>
              </p>
            </div>
          </div>

          {/* Cashier Shortcut Hint */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-100/70 text-slate-600 text-xs border border-slate-200">
            <Keyboard className="w-4 h-4 text-slate-500" />
            <span>Presiona</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-white border border-slate-300 rounded shadow-xs text-slate-800">
              /
            </kbd>
            <span>para buscar PLU</span>
          </div>

        </div>

      </div>
    </div>
  );
};
