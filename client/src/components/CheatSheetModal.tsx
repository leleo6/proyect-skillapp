import React, { useState } from 'react';
import { Product, Store } from '../types';
import { X, Printer, Sparkles, Building2 } from 'lucide-react';
import { useBrand } from '../context/BrandContext';

interface CheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  stores: Store[];
  currentStoreId?: string;
}

export const CheatSheetModal: React.FC<CheatSheetModalProps> = ({
  isOpen,
  onClose,
  products,
  stores,
  currentStoreId
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'new'>('new');
  const [selectedStore, setSelectedStore] = useState<string>(currentStoreId || '');
  const { activeBrand } = useBrand();

  if (!isOpen) return null;

  const filteredProducts = products.filter(p => {
    if (filterMode === 'new' && p.isNew !== 1) return false;
    if (selectedStore) {
      return p.stores.some(s => s.id === selectedStore);
    }
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  const currentStoreObj = stores.find(s => s.id === selectedStore);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-150 flex flex-col">
        
        {/* Dynamic Brand Accent Top Stripe */}
        <div className="h-2 w-full shrink-0 print:hidden" style={{ background: activeBrand.gradient }} />

        {/* Modal Controls (Hidden during print) */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/70 print:hidden">
          <div className="flex items-center gap-2.5">
            <span 
              className="p-2 rounded-xl text-white shadow-sm"
              style={{ background: activeBrand.gradient }}
            >
              <Printer className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Plantilla para Caja Registradora · {activeBrand.name}
              </span>
              <h2 className="text-lg font-black text-slate-900">
                Hoja de Códigos Imprimible (Cheat-Sheet)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-xl font-bold text-sm shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              style={{
                background: activeBrand.gradient,
                boxShadow: `0 4px 12px 0 ${activeBrand.glowRgba}`
              }}
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Hoja (Ctrl+P)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
              aria-label="Cerrar vista imprimible"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter bar for cheat sheet (Hidden during print) */}
        <div className="p-4 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Contenido a incluir:</span>
            <button
              onClick={() => setFilterMode('new')}
              className={`px-3 py-1.5 rounded-xl font-extrabold flex items-center gap-1.5 transition-colors ${
                filterMode === 'new'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Solo Códigos Nuevos ({products.filter(p => p.isNew === 1).length})</span>
            </button>
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                filterMode === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-300'
              }`}
            >
              <span>Todos los Códigos ({products.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-500" />
            <select
              value={selectedStore}
              onChange={e => setSelectedStore(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-3 py-1 font-semibold text-slate-800 focus:outline-none"
            >
              <option value="">Todas las Tiendas</option>
              {stores.map(s => (
                <option key={s.id} value={s.id}>
                  {s.city}: {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* The Printable Page Content */}
        <div className="p-8 print:p-0 space-y-4 font-sans text-slate-900">
          
          {/* Printable Header */}
          <div className="border-b-2 border-slate-900 pb-3 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                {activeBrand.name} · Hoja de Códigos para Cajero
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                {currentStoreObj ? `${currentStoreObj.name} (${currentStoreObj.city}, ${currentStoreObj.country})` : 'Todas las tiendas de la multinacional'}
                {' · '}
                {filterMode === 'new' ? '🌟 TABLA DE NOVEDADES Y PRODUCTOS NUEVOS' : 'TABLA COMPLETA DE CÓDIGOS'}
              </p>
            </div>
            <div className="text-right text-xs font-mono text-slate-500">
              <p>Fecha: {new Date().toLocaleDateString()}</p>
              <p>{filteredProducts.length} Códigos</p>
            </div>
          </div>

          {/* High-density Cashier Cheat Sheet Table */}
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-slate-800 text-slate-900 font-extrabold uppercase tracking-wider">
                <th className="py-2 px-2 w-24">PLU / CÓDIGO</th>
                <th className="py-2 px-2">PRODUCTO</th>
                <th className="py-2 px-2 w-32">CATEGORÍA</th>
                <th className="py-2 px-2 text-right w-20">PRECIO</th>
                <th className="py-2 px-2 w-28">ESTADO</th>
                <th className="py-2 px-2">NOTA / BALANZA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {filteredProducts.map(p => (
                <tr key={p.id} className={p.isNew === 1 ? 'font-semibold bg-slate-50/50' : ''}>
                  <td className="py-2 px-2 font-mono text-sm font-black text-slate-900">
                    {p.code}
                  </td>
                  <td className="py-2 px-2 font-bold text-slate-900">
                    {p.name}
                  </td>
                  <td className="py-2 px-2 text-slate-600">
                    {p.categoryName}
                  </td>
                  <td className="py-2 px-2 text-right font-mono font-bold">
                    ${p.price.toFixed(2)}
                  </td>
                  <td className="py-2 px-2">
                    {p.isNew === 1 ? (
                      <span className="font-extrabold text-[10px] uppercase text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                        ★ NUEVO
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500">Actual</span>
                    )}
                  </td>
                  <td className="py-2 px-2 text-[11px] text-slate-600 italic">
                    {p.notes || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-sm">
              No hay productos para mostrar en este filtro.
            </div>
          )}

          {/* Printable Footer Notice */}
          <div className="pt-4 border-t border-slate-300 flex items-center justify-between text-[10px] text-slate-500">
            <span>ActInvent POS · Solución oficial para cajeros y puntos de venta</span>
            <span>Documento generado para fijación física en caja registradora</span>
          </div>

        </div>

      </div>
    </div>
  );
};
