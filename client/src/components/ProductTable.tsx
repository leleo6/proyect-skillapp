import React, { useState } from 'react';
import { Product } from '../types';
import { Copy, Check, Sparkles, Eye, Edit3, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface ProductTableProps {
  products: Product[];
  onOpenDetails: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onToggleNew?: (product: Product) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onOpenDetails,
  onEdit,
  onDelete,
  onToggleNew
}) => {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Código ${code} copiado`, 'success');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider">
              <th scope="col" className="py-3.5 px-4 w-28">Estado</th>
              <th scope="col" className="py-3.5 px-4 w-36">Código PLU</th>
              <th scope="col" className="py-3.5 px-4">Producto</th>
              <th scope="col" className="py-3.5 px-4">Categoría</th>
              <th scope="col" className="py-3.5 px-4 text-right">Precio</th>
              <th scope="col" className="py-3.5 px-4 hidden md:table-cell">Código de Barras</th>
              <th scope="col" className="py-3.5 px-4 hidden lg:table-cell">Tiendas</th>
              <th scope="col" className="py-3.5 px-4 text-center w-28">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {products.map(p => {
              const isCopied = copiedCode === p.code;

              return (
                <tr
                  key={p.id}
                  onClick={() => onOpenDetails(p)}
                  className={`hover:bg-slate-50/80 cursor-pointer transition-colors group ${
                    p.isNew === 1 ? 'bg-emerald-50/20' : ''
                  }`}
                >
                  {/* Status */}
                  <td className="py-3 px-4">
                    {p.isNew === 1 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-600 text-white uppercase tracking-wider">
                        <Sparkles className="w-3 h-3 text-amber-200" />
                        Nuevo
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-medium px-2 py-0.5 rounded-full bg-slate-100">
                        Actual
                      </span>
                    )}
                  </td>

                  {/* Code with Copy Button */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-base font-black text-slate-900 group-hover:text-brand-600">
                        {p.code}
                      </span>
                      <button
                        onClick={e => handleCopy(p.code, e)}
                        className="p-1 text-slate-400 hover:text-brand-600 rounded hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                        title="Copiar código"
                        aria-label={`Copiar código ${p.code}`}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>

                  {/* Name and notes preview */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{p.name}</div>
                    {p.notes && (
                      <div className="text-[11px] text-amber-700 font-normal truncate max-w-xs">
                        ⚠️ {p.notes}
                      </div>
                    )}
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 text-xs text-slate-600">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200/60 font-semibold text-slate-700">
                      {p.categoryName}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    ${p.price.toFixed(2)}
                    <span className="text-xs text-slate-500 font-normal ml-1">/{p.unit}</span>
                  </td>

                  {/* Barcode */}
                  <td className="py-3 px-4 hidden md:table-cell font-mono text-xs text-slate-600">
                    {p.barcode || '—'}
                  </td>

                  {/* Stores */}
                  <td className="py-3 px-4 hidden lg:table-cell text-xs text-slate-600">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {p.stores.slice(0, 2).map(s => (
                        <span key={s.id} className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-600 font-medium">
                          {s.city}
                        </span>
                      ))}
                      {p.stores.length > 2 && (
                        <span className="text-[10px] text-slate-400 font-medium">
                          +{p.stores.length - 2}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-center" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onOpenDetails(p)}
                        className="p-1.5 text-slate-500 hover:text-brand-600 rounded-lg hover:bg-slate-100"
                        title="Ver detalles en modal"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {isAdmin && onEdit && (
                        <button
                          onClick={() => onEdit(p)}
                          className="p-1.5 text-slate-500 hover:text-brand-600 rounded-lg hover:bg-slate-100"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}

                      {isAdmin && onDelete && (
                        <button
                          onClick={() => onDelete(p)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
