import React, { useRef, useEffect } from 'react';
import { Search, X, Filter, LayoutGrid, List, Sparkles, Building2, Store as StoreIcon } from 'lucide-react';
import { Category, Store } from '../types';
import { useBrand } from '../context/BrandContext';

interface SearchAndFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  isNewFilter: number | undefined; // undefined = all, 1 = new, 0 = current
  onIsNewFilterChange: (value: number | undefined) => void;
  selectedCategoryId: string;
  onCategoryChange: (value: string) => void;
  selectedStoreId: string;
  onStoreChange: (value: string) => void;
  categories: Category[];
  stores: Store[];
  totalCount: number;
  newCount: number;
  currentCount: number;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  search,
  onSearchChange,
  isNewFilter,
  onIsNewFilterChange,
  selectedCategoryId,
  onCategoryChange,
  selectedStoreId,
  onStoreChange,
  categories,
  stores,
  totalCount,
  newCount,
  currentCount,
  viewMode,
  onViewModeChange
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { activeBrand } = useBrand();

  // Global shortcut "/" or "Ctrl+K" to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' || (e.ctrlKey && e.key === 'k')) &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="space-y-4">
      
      {/* Primary Row: Search Bar & View Mode Toggle */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <label htmlFor="search-input" className="sr-only">
            Buscar producto por código PLU, nombre o código de barras
          </label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5 text-brand-600 transition-colors" />
          </div>
          <input
            id="search-input"
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Buscar por código PLU (ej: 4011), nombre, o código de barras... (Presiona '/' para buscar)"
            className="w-full pl-11 pr-24 py-3 bg-white border border-slate-300 rounded-2xl text-slate-900 placeholder:text-slate-400 font-medium text-sm sm:text-base focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 shadow-xs transition-all outline-none"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1.5">
            {search && (
              <button
                onClick={() => onSearchChange('')}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono font-bold text-slate-500 bg-slate-100 border border-slate-200 rounded-md">
              /
            </kbd>
          </div>
        </div>

        {/* View Switcher (Cards vs Table) */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-2xl shadow-xs self-end md:self-auto shrink-0">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'grid'
                ? 'text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            style={viewMode === 'grid' ? { background: activeBrand.gradient } : undefined}
            aria-pressed={viewMode === 'grid'}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Tarjetas</span>
          </button>
          <button
            onClick={() => onViewModeChange('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'table'
                ? 'text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            style={viewMode === 'table' ? { background: activeBrand.gradient } : undefined}
            aria-pressed={viewMode === 'table'}
          >
            <List className="w-4 h-4" />
            <span>Tabla de Códigos</span>
          </button>
        </div>
      </div>

      {/* Secondary Row: Scope Filter Tabs (NUEVOS vs ACTUALES) and Dropdowns */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between border-t border-slate-200/80 pt-3">
        
        {/* Core Scope Tabs: Todos | Nuevos | Actuales */}
        <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Filtro de productos">
          
          <button
            role="tab"
            aria-selected={isNewFilter === undefined}
            onClick={() => onIsNewFilterChange(undefined)}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
              isNewFilter === undefined
                ? 'text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
            style={isNewFilter === undefined ? { background: activeBrand.gradient } : undefined}
          >
            <span>Todos los productos</span>
            <span className={`px-1.5 py-0.5 text-[11px] rounded-full font-extrabold ${
              isNewFilter === undefined ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {totalCount}
            </span>
          </button>

          {/* NUEVOS - El foco clave de la especificación */}
          <button
            role="tab"
            aria-selected={isNewFilter === 1}
            onClick={() => onIsNewFilterChange(1)}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-extrabold rounded-xl transition-all flex items-center gap-2 ${
              isNewFilter === 1
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500/40'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>NUEVOS (Novedades)</span>
            <span className={`px-1.5 py-0.5 text-[11px] rounded-full font-black ${
              isNewFilter === 1 ? 'bg-emerald-800 text-emerald-100' : 'bg-emerald-200 text-emerald-900'
            }`}>
              {newCount}
            </span>
          </button>

          <button
            role="tab"
            aria-selected={isNewFilter === 0}
            onClick={() => onIsNewFilterChange(0)}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
              isNewFilter === 0
                ? 'bg-slate-800 text-white shadow'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span>Actuales / Frecuentes</span>
            <span className={`px-1.5 py-0.5 text-[11px] rounded-full font-extrabold ${
              isNewFilter === 0 ? 'bg-slate-700 text-slate-100' : 'bg-slate-100 text-slate-600'
            }`}>
              {currentCount}
            </span>
          </button>
        </div>

        {/* Dropdown Filters: Store & Category */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Store Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs sm:text-sm shadow-xs flex-1 sm:flex-initial focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20">
            <StoreIcon className="w-4 h-4 text-brand-600 shrink-0" />
            <select
              value={selectedStoreId}
              onChange={e => onStoreChange(e.target.value)}
              className="bg-transparent border-none text-slate-800 font-semibold text-xs sm:text-sm focus:outline-none cursor-pointer w-full"
              aria-label="Filtrar por tienda multinacional"
            >
              <option value="">Todas las tiendas</option>
              {stores.map(store => (
                <option key={store.id} value={store.id}>
                  {store.city}: {store.name} ({store.code})
                </option>
              ))}
            </select>
          </div>

          {/* Category Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs sm:text-sm shadow-xs flex-1 sm:flex-initial focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20">
            <Filter className="w-4 h-4 text-slate-500 shrink-0" />
            <select
              value={selectedCategoryId}
              onChange={e => onCategoryChange(e.target.value)}
              className="bg-transparent border-none text-slate-800 font-semibold text-xs sm:text-sm focus:outline-none cursor-pointer w-full"
              aria-label="Filtrar por categoría"
            >
              <option value="">Todas las categorías</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.productCount || 0})
                </option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* Screen Reader Live Region */}
      <div className="sr-only" aria-live="polite">
        Mostrando resultados de productos.
      </div>
    </div>
  );
};
