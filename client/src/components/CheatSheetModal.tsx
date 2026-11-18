import React, { useState } from 'react';
import { Product, Store } from '../types';
import { X, Printer, Sparkles, Building2, CheckSquare, Square } from 'lucide-react';

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
        
        {/* Modal Controls (Hidden during print) */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/70 print:hidden">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-slate-900 text-white shadow-sm">
              <Printer className="w-5 h-5" />
            </span>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Plantilla para Caja Registradora
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Hoja de Códigos Imprimible (Cheat-Sheet)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-sm shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Hoja (Ctrl+P)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl"
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
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
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
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
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
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 font-medium text-slate-800"
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
                ActInvent · Hoja de Códigos para Cajero
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                {currentStoreObj ? `${currentStoreObj.name} (${currentStoreObj.city}, ${currentStoreObj.country})` : 'Todas las tiendas de la multinacional'}
                {' · '}
                {filterMode === 'new' ? '🌟 TABLA DE NOVEDADES Y PRODUCTOS NUEVOS' : 'TABLA COMPLETA DE CÓDIGOS'}
              </p>
            </div>
            <div className="text-right text-xs font-mono text-slate-500">
              <p>Fecha: {new Date().toLocaleDateString()}</p>
              <p className="font-bold text-slate-900">{filteredProducts.length} productos</p>
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-slate-800 bg-slate-100 font-black uppercase text-[10px] tracking-wider">
                <th className="py-2 px-2 w-16">Tipo</th>
                <th className="py-2 px-2 w-24">CÓDIGO PLU</th>
                <th className="py-2 px-2">Producto</th>
                <th className="py-2 px-2 w-32">Categoría</th>
                <th className="py-2 px-2 w-24 text-right">Precio</th>
                <th className="py-2 px-2">Nota de Caja</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProducts.map(p => (
                <tr key={p.id} className={p.isNew === 1 ? 'bg-emerald-50/40 font-semibold' : ''}>
                  <td className="py-2 px-2">
                    {p.isNew === 1 ? (
                      <span className="font-black text-emerald-800 uppercase text-[9px] px-1 py-0.5 bg-emerald-100 rounded">
                        NUEVO
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">Actual</span>
                    )}
                  </td>
                  <td className="py-2 px-2 font-mono text-sm font-black text-slate-900">
                    {p.code}
                  </td>
                  <td className="py-2 px-2 font-bold text-slate-900">
                    {p.name}
                  </td>
                  <td className="py-2 px-2 text-slate-600 font-medium">
                    {p.categoryName}
                  </td>
                  <td className="py-2 px-2 text-right font-mono font-bold">
                    ${p.price.toFixed(2)} / {p.unit}
                  </td>
                  <td className="py-2 px-2 text-slate-500 text-[11px] italic">
                    {p.notes || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pt-4 border-t border-slate-200 flex justify-between text-[10px] text-slate-500 font-mono">
            <span>ActInvent POS System · Multinacional Retail</span>
            <span>Documento generado para apoyo en puesto de caja</span>
          </div>

        </div>

      </div>
    </div>
  );
};
