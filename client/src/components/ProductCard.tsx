import React, { useState } from 'react';
import { Product } from '../types';
import { Copy, Check, Sparkles, Building2, Eye, Edit3, Trash2, Tag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onToggleNew?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  onEdit,
  onDelete,
  onToggleNew
}) => {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(product.code);
    setCopied(true);
    showToast(`Código ${product.code} copiado al portapapeles`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="article"
      tabIndex={0}
      onClick={() => onOpenDetails(product)}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenDetails(product);
        }
      }}
      className={`group relative bg-white rounded-2xl border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:border-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 flex flex-col justify-between overflow-hidden ${
        product.isNew === 1
          ? 'border-emerald-300 ring-1 ring-emerald-400/40 bg-gradient-to-b from-emerald-50/30 to-white'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      
      {/* Top Banner: Prominent Cashier Code & Badges */}
      <div className="p-4 pb-3 border-b border-slate-100/80 bg-slate-50/50">
        <div className="flex items-center justify-between gap-2">
          
          {/* Main PLU Code Badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              PLU
            </span>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-xl border border-slate-300 shadow-sm group-hover:border-brand-500 transition-colors">
              <span className="font-mono text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                {product.code}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-1 text-slate-400 hover:text-brand-600 rounded-md hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                title="Copiar código al portapapeles"
                aria-label={`Copiar código ${product.code}`}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New / Actual Badge */}
          <div>
            {product.isNew === 1 ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 tracking-wide uppercase animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                NUEVO
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-slate-500 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                Actual
              </span>
            )}
          </div>

        </div>
      </div>

      {/* Body: Product Name, Category & Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-brand-700 font-semibold mb-1">
            <Tag className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{product.categoryName}</span>
          </div>

          <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-brand-600 transition-colors">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Cashier Special Notes */}
          {product.notes && (
            <div className="mt-2.5 p-2 rounded-lg bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 font-medium">
              ⚠️ {product.notes}
            </div>
          )}
        </div>

        {/* Footer: Price, Unit and Stores */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-extrabold text-slate-900 font-mono">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              / {product.unit}
            </span>
          </div>

          {/* Store count / preview */}
          <div className="flex items-center gap-1 text-slate-500 text-xs" title={`Disponible en ${product.stores.length} tiendas de la multinacional`}>
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{product.stores.length} tiendas</span>
          </div>
        </div>
      </div>

      {/* Admin Action Bar (if Admin) or Cashier Quick Hint */}
      <div className="px-4 py-2 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 inline-flex items-center gap-1">
          <Eye className="w-3.5 h-3.5" />
          <span>Ver detalles (Modal)</span>
        </span>

        {isAdmin && (
          <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
            {onToggleNew && (
              <button
                onClick={() => onToggleNew(product)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                  product.isNew === 1
                    ? 'text-slate-600 hover:bg-slate-200'
                    : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                }`}
                title={product.isNew === 1 ? 'Marcar como producto Actual' : 'Marcar como producto Nuevo'}
              >
                {product.isNew === 1 ? 'Quitar Nuevo' : '+ Marcar Nuevo'}
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(product)}
                className="p-1 text-slate-500 hover:text-brand-600 rounded hover:bg-slate-200"
                title="Editar producto"
                aria-label={`Editar ${product.name}`}
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(product)}
                className="p-1 text-slate-500 hover:text-rose-600 rounded hover:bg-rose-50"
                title="Eliminar producto"
                aria-label={`Eliminar ${product.name}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
