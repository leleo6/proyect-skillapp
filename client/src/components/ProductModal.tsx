import React, { useEffect, useRef, useState } from 'react';
import { Product } from '../types';
import { X, Copy, Check, Sparkles, Building2, Calendar, Tag, AlertTriangle } from 'lucide-react';
import { BarcodeVisual } from './BarcodeVisual';
import { useToast } from '../context/ToastContext';
import { useBrand } from '../context/BrandContext';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onNext,
  onPrevious
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { showToast } = useToast();
  const { activeBrand } = useBrand();
  const [copied, setCopied] = useState(false);

  // Focus trap & Escape listener
  useEffect(() => {
    if (!product) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight' && onNext) {
        onNext();
      } else if (e.key === 'ArrowLeft' && onPrevious) {
        onPrevious();
      } else if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose, onNext, onPrevious]);

  if (!product) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(product.code);
    setCopied(true);
    showToast(`Código PLU ${product.code} copiado`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
      aria-describedby="modal-product-desc"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150 flex flex-col"
      >
        
        {/* Dynamic Brand Accent Top Stripe */}
        <div className="h-2 w-full shrink-0" style={{ background: activeBrand.gradient }} />

        {/* Header with Title and Close Button */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <span 
              className="p-2 rounded-xl border"
              style={{
                backgroundColor: 'var(--color-brand-50)',
                color: 'var(--color-brand-700)',
                borderColor: 'var(--color-brand-200)'
              }}
            >
              <Tag className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Ficha Técnica de Caja · {activeBrand.name}
              </span>
              <h2 id="modal-product-title" className="text-lg font-black text-slate-900">
                Detalles del Producto
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onPrevious && (
              <button
                onClick={onPrevious}
                className="px-2.5 py-1 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
                title="Producto anterior (Flecha Izquierda)"
              >
                ← Anterior
              </button>
            )}
            {onNext && (
              <button
                onClick={onNext}
                className="px-2.5 py-1 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
                title="Producto siguiente (Flecha Derecha)"
              >
                Siguiente →
              </button>
            )}
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              aria-label="Cerrar ventana modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">

          {/* Super Prominent Cashier Code Display */}
          <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left ${
            product.isNew === 1
              ? 'bg-gradient-to-r from-emerald-500/10 via-emerald-50 to-transparent border-emerald-300'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 font-mono">
                  CÓDIGO DE CAJA / PLU
                </span>
                {product.isNew === 1 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-600 text-white animate-pulse">
                    <Sparkles className="w-3 h-3 text-amber-200" />
                    ¡PRODUCTO NUEVO!
                  </span>
                )}
              </div>
              <div className="font-mono text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                {product.code}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Escribir este código en la terminal POS o balanza
              </p>
            </div>

            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 shrink-0"
              style={{
                background: activeBrand.gradient,
                boxShadow: `0 4px 12px 0 ${activeBrand.glowRgba}`
              }}
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              <span>{copied ? '¡Copiado!' : 'Copiar Código'}</span>
            </button>
          </div>

          {/* Product Name & Description */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span 
                className="px-2.5 py-0.5 rounded-lg text-xs font-bold border"
                style={{
                  backgroundColor: 'var(--color-brand-50)',
                  color: 'var(--color-brand-700)',
                  borderColor: 'var(--color-brand-200)'
                }}
              >
                {product.categoryName}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs font-bold text-slate-700">
                Precio: ${product.price.toFixed(2)} por {product.unit}
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {product.name}
            </h3>
            <p id="modal-product-desc" className="text-sm text-slate-600 mt-2 leading-relaxed">
              {product.description || 'Sin descripción adicional para este producto.'}
            </p>
          </div>

          {/* Cashier Alert / Special Instructions */}
          {product.notes && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-amber-900">
                  Nota Importante para el Cajero:
                </p>
                <p className="text-sm text-amber-950 font-semibold mt-0.5">
                  {product.notes}
                </p>
              </div>
            </div>
          )}

          {/* Barcode representation */}
          {product.barcode && (
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Código de Barras Escaneable (EAN/UPC)
              </span>
              <BarcodeVisual value={product.barcode} />
            </div>
          )}

          {/* Multinational Stores Availability */}
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <Building2 className="w-4 h-4 text-slate-600" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Disponible en las siguientes tiendas de la multinacional:
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {product.stores.map(store => (
                <div
                  key={store.id}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between text-xs font-medium"
                >
                  <span className="font-bold text-slate-800">{store.name}</span>
                  <span className="text-slate-500">{store.city}, {store.country}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Meta timestamps */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Ingresado: {new Date(product.createdAt).toLocaleDateString()}
            </span>
            <span>Última actualización: {new Date(product.updatedAt).toLocaleDateString()}</span>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            Cerrar (Esc)
          </button>
        </div>

      </div>
    </div>
  );
};
