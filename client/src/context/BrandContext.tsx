import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface BrandTheme {
  id: 'hyper' | 'fresh' | 'express' | 'gourmet' | 'terminal';
  name: string;
  badge: string;
  tagline: string;
  iconName: 'Building2' | 'Leaf' | 'Zap' | 'Crown' | 'Monitor';
  previewHex: string;
  accentHex: string;
  storeCodes: string[];
  gradient: string;
  palette: Record<string, string>;
  paletteRgb: Record<string, string>;
  glowRgba: string;
}

export const BRAND_THEMES: Record<string, BrandTheme> = {
  hyper: {
    id: 'hyper',
    name: 'ActInvent Hyper',
    badge: 'Hipermercado Multinacional',
    tagline: 'Gran superficie, catálogo maestro y consulta ultrarrápida',
    iconName: 'Building2',
    previewHex: '#0284c7',
    accentHex: '#06b6d4',
    storeCodes: ['BOG-01', 'BCN-01'],
    gradient: 'linear-gradient(135deg, #0369a1 0%, #0284c7 50%, #38bdf8 100%)',
    palette: {
      '50': '#f0f9ff',
      '100': '#e0f2fe',
      '200': '#bae6fd',
      '300': '#7dd3fc',
      '400': '#38bdf8',
      '500': '#0284c7',
      '600': '#0369a1',
      '700': '#075985',
      '800': '#0c4a6e',
      '900': '#082f49',
      '950': '#041d2d'
    },
    paletteRgb: {
      '50': '240 249 255',
      '100': '224 242 254',
      '200': '186 230 253',
      '300': '125 211 252',
      '400': '56 189 248',
      '500': '2 132 199',
      '600': '3 105 161',
      '700': '7 89 133',
      '800': '12 74 110',
      '900': '8 47 73',
      '950': '4 29 45'
    },
    glowRgba: 'rgba(2, 132, 199, 0.25)',
  },
  fresh: {
    id: 'fresh',
    name: 'EcoFresh Market',
    badge: 'Supermercado Orgánico & Frescos',
    tagline: 'Especialistas en frutas, verduras, panadería artesanal y carnes',
    iconName: 'Leaf',
    previewHex: '#059669',
    accentHex: '#10b981',
    storeCodes: ['MED-01'],
    gradient: 'linear-gradient(135deg, #047857 0%, #059669 50%, #34d399 100%)',
    palette: {
      '50': '#f0fdf4',
      '100': '#dcfce7',
      '200': '#bbf7d0',
      '300': '#86efac',
      '400': '#4ade80',
      '500': '#22c55e',
      '600': '#16a34a',
      '700': '#15803d',
      '800': '#166534',
      '900': '#14532d',
      '950': '#052e16'
    },
    paletteRgb: {
      '50': '240 253 244',
      '100': '220 252 231',
      '200': '187 247 208',
      '300': '134 239 172',
      '400': '74 222 128',
      '500': '34 197 94',
      '600': '22 163 74',
      '700': '21 128 61',
      '800': '22 101 52',
      '900': '20 83 45',
      '950': '5 46 22'
    },
    glowRgba: 'rgba(22, 163, 74, 0.25)',
  },
  express: {
    id: 'express',
    name: 'SuperFlash Express',
    badge: 'Conveniencia 24/7 & Alta Velocidad',
    tagline: 'Caja rápida, rotación continua y digitación instantánea',
    iconName: 'Zap',
    previewHex: '#ea580c',
    accentHex: '#f59e0b',
    storeCodes: ['MEX-01'],
    gradient: 'linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #fb923c 100%)',
    palette: {
      '50': '#fff7ed',
      '100': '#ffedd5',
      '200': '#fed7aa',
      '300': '#fdba74',
      '400': '#fb923c',
      '500': '#f97316',
      '600': '#ea580c',
      '700': '#c2410c',
      '800': '#9a3412',
      '900': '#7c2d12',
      '950': '#431407'
    },
    paletteRgb: {
      '50': '255 247 237',
      '100': '255 237 213',
      '200': '254 215 170',
      '300': '253 186 116',
      '400': '251 146 60',
      '500': '249 115 22',
      '600': '234 88 12',
      '700': '194 65 12',
      '800': '154 52 18',
      '900': '124 45 18',
      '950': '67 20 7'
    },
    glowRgba: 'rgba(234, 88, 12, 0.25)',
  },
  gourmet: {
    id: 'gourmet',
    name: 'Prestige Gourmet',
    badge: 'Delicatessen & Selección Premium',
    tagline: 'Quesos madurados, vinos selectos y carnes especiales',
    iconName: 'Crown',
    previewHex: '#9333ea',
    accentHex: '#ec4899',
    storeCodes: ['MAD-01', 'BUE-01'],
    gradient: 'linear-gradient(135deg, #7e22ce 0%, #9333ea 50%, #c084fc 100%)',
    palette: {
      '50': '#faf5ff',
      '100': '#f3e8ff',
      '200': '#e9d5ff',
      '300': '#d8b4fe',
      '400': '#c084fc',
      '500': '#a855f7',
      '600': '#9333ea',
      '700': '#7e22ce',
      '800': '#6b21a8',
      '900': '#581c87',
      '950': '#3b0764'
    },
    paletteRgb: {
      '50': '250 245 255',
      '100': '243 232 255',
      '200': '233 213 255',
      '300': '216 180 254',
      '400': '192 132 252',
      '500': '168 85 247',
      '600': '147 51 234',
      '700': '126 34 206',
      '800': '107 33 168',
      '900': '88 28 135',
      '950': '59 7 100'
    },
    glowRgba: 'rgba(147, 51, 234, 0.25)',
  },
  terminal: {
    id: 'terminal',
    name: 'POS Terminal Pro',
    badge: 'Modo Antirreflejo Cajeros (Alta Legibilidad)',
    tagline: 'Máximo contraste visual diseñado para turnos intensivos',
    iconName: 'Monitor',
    previewHex: '#0f172a',
    accentHex: '#10b981',
    storeCodes: [],
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #334155 100%)',
    palette: {
      '50': '#f8fafc',
      '100': '#f1f5f9',
      '200': '#e2e8f0',
      '300': '#cbd5e1',
      '400': '#94a3b8',
      '500': '#0284c7',
      '600': '#0369a1',
      '700': '#1e293b',
      '800': '#0f172a',
      '900': '#020617',
      '950': '#000000'
    },
    paletteRgb: {
      '50': '248 250 252',
      '100': '241 245 249',
      '200': '226 232 240',
      '300': '203 213 225',
      '400': '148 163 184',
      '500': '2 132 199',
      '600': '3 105 161',
      '700': '30 41 59',
      '800': '15 23 42',
      '900': '2 6 23',
      '950': '0 0 0'
    },
    glowRgba: 'rgba(15, 23, 42, 0.35)',
  }
};

interface BrandContextType {
  activeBrand: BrandTheme;
  brands: BrandTheme[];
  setBrand: (brandId: string) => void;
  autoAdaptToStore: boolean;
  setAutoAdaptToStore: (enabled: boolean) => void;
  adaptToStoreCode: (storeCode?: string) => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const BrandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brandId, setBrandId] = useState<string>(() => {
    return localStorage.getItem('actinvent_brand') || 'hyper';
  });

  const [autoAdaptToStore, setAutoAdaptToStoreState] = useState<boolean>(() => {
    const saved = localStorage.getItem('actinvent_auto_brand');
    return saved !== null ? saved === 'true' : true;
  });

  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('actinvent_high_contrast') === 'true';
  });

  const activeBrand = BRAND_THEMES[brandId] || BRAND_THEMES.hyper;
  const brands = Object.values(BRAND_THEMES);

  // Apply CSS custom properties dynamically
  useEffect(() => {
    const root = document.documentElement;

    for (const [key, val] of Object.entries(activeBrand.palette)) {
      root.style.setProperty(`--color-brand-${key}`, val);
    }
    for (const [key, val] of Object.entries(activeBrand.paletteRgb)) {
      root.style.setProperty(`--color-brand-${key}-rgb`, val);
    }

    root.style.setProperty('--brand-accent', activeBrand.accentHex);
    root.style.setProperty('--brand-glow', activeBrand.glowRgba);
    root.style.setProperty('--brand-gradient', activeBrand.gradient);

    root.setAttribute('data-brand', activeBrand.id);

    if (highContrast) {
      root.classList.add('pos-high-contrast');
    } else {
      root.classList.remove('pos-high-contrast');
    }
  }, [activeBrand, highContrast]);

  const setBrand = useCallback((newId: string) => {
    if (BRAND_THEMES[newId]) {
      setBrandId(newId);
      localStorage.setItem('actinvent_brand', newId);
    }
  }, []);

  const setAutoAdaptToStore = useCallback((enabled: boolean) => {
    setAutoAdaptToStoreState(enabled);
    localStorage.setItem('actinvent_auto_brand', String(enabled));
  }, []);

  const adaptToStoreCode = useCallback((storeCode?: string) => {
    if (!autoAdaptToStore || !storeCode) return;
    const found = Object.values(BRAND_THEMES).find(b => b.storeCodes.includes(storeCode));
    if (found) {
      setBrandId(found.id);
      localStorage.setItem('actinvent_brand', found.id);
    } else {
      setBrandId('hyper');
    }
  }, [autoAdaptToStore]);

  const toggleHighContrast = useCallback(() => {
    setHighContrast(prev => {
      const next = !prev;
      localStorage.setItem('actinvent_high_contrast', String(next));
      return next;
    });
  }, []);

  return (
    <BrandContext.Provider
      value={{
        activeBrand,
        brands,
        setBrand,
        autoAdaptToStore,
        setAutoAdaptToStore,
        adaptToStoreCode,
        highContrast,
        toggleHighContrast
      }}
    >
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
};
