import React, { useState, useRef, useEffect } from 'react';
import { useBrand, BrandTheme } from '../context/BrandContext';
import { 
  Building2, 
  Leaf, 
  Zap, 
  Crown, 
  Monitor, 
  Palette, 
  Check, 
  ChevronDown,
  Sparkles,
  SunMoon,
  Store as StoreIcon
} from 'lucide-react';

export const AdaptiveBrandSwitcher: React.FC = () => {
  const { 
    activeBrand, 
    brands, 
    setBrand, 
    autoAdaptToStore, 
    setAutoAdaptToStore,
    highContrast,
    toggleHighContrast 
  } = useBrand();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const renderIcon = (iconName: string, className = "w-4 h-4") => {
    switch (iconName) {
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
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        title="Diseño de Marca Adaptativo (Adaptive Brand Designs)"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span 
          className="w-3 h-3 rounded-full shadow-sm animate-pulse"
          style={{ backgroundColor: activeBrand.previewHex }}
        />
        <span className="hidden sm:inline font-bold tracking-tight">
          {activeBrand.name}
        </span>
        <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
          Brand
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-3 animate-in fade-in zoom-in-95 duration-150"
          role="menu"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100 px-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-brand-50 text-brand-600 border border-brand-200">
                <Palette className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Adaptive Brand Designs
                </h4>
                <p className="text-[11px] text-slate-500">
                  Identidad visual adaptativa para tiendas y POS
                </p>
              </div>
            </div>
            
            {/* High Contrast POS Toggle */}
            <button
              onClick={toggleHighContrast}
              className={`p-1.5 rounded-lg text-xs font-medium border flex items-center gap-1 transition-colors ${
                highContrast 
                  ? 'bg-slate-900 text-white border-slate-900' 
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title="Alternar modo de alto contraste para terminales de caja"
            >
              <SunMoon className="w-3.5 h-3.5" />
              <span className="text-[10px]">{highContrast ? 'Alto Contraste' : 'Contraste'}</span>
            </button>
          </div>

          {/* Auto-adapt to store toggle */}
          <div className="mb-3 px-2 py-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StoreIcon className="w-4 h-4 text-brand-600 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-800">Auto-adaptar según Tienda</p>
                <p className="text-[10px] text-slate-500">Cambia la marca al filtrar por tienda</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoAdaptToStore}
                onChange={e => setAutoAdaptToStore(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
            </label>
          </div>

          {/* Brand List */}
          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            {brands.map((b: BrandTheme) => {
              const isSelected = activeBrand.id === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => {
                    setBrand(b.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition-all border flex items-center justify-between gap-3 ${
                    isSelected 
                      ? 'bg-brand-50/80 border-brand-300 shadow-sm ring-1 ring-brand-400/40' 
                      : 'border-transparent hover:bg-slate-50 hover:border-slate-200'
                  }`}
                  role="menuitem"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div 
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
                      style={{ background: b.gradient }}
                    >
                      {renderIcon(b.iconName, "w-4 h-4")}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {b.name}
                        </span>
                        <span 
                          className="w-2 h-2 rounded-full shrink-0" 
                          style={{ backgroundColor: b.previewHex }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {b.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5">
                    {isSelected && (
                      <span className="p-1 rounded-full bg-brand-600 text-white shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 px-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-500" /> Sistema Multimarca POS
            </span>
            <span>WCAG 2.2 AA</span>
          </div>
        </div>
      )}
    </div>
  );
};
