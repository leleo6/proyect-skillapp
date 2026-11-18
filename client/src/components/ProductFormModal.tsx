import React, { useState, useEffect, useRef } from 'react';
import { Product, Category, Store } from '../types';
import { X, PlusCircle, Save, AlertCircle, Building2, Tag } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  productToEdit?: Product | null;
  categories: Category[];
  stores: Store[];
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  productToEdit,
  categories,
  stores
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const [code, setCode] = useState('');
  const [barcode, setBarcode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isNew, setIsNew] = useState(true);
  const [price, setPrice] = useState('0.00');
  const [unit, setUnit] = useState('und');
  const [notes, setNotes] = useState('');
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productToEdit) {
      setCode(productToEdit.code);
      setBarcode(productToEdit.barcode || '');
      setName(productToEdit.name);
      setDescription(productToEdit.description || '');
      setCategoryId(productToEdit.categoryId);
      setIsNew(productToEdit.isNew === 1);
      setPrice(productToEdit.price.toString());
      setUnit(productToEdit.unit);
      setNotes(productToEdit.notes || '');
      setSelectedStores(productToEdit.stores.map(s => s.id));
    } else {
      setCode('');
      setBarcode('');
      setName('');
      setDescription('');
      setCategoryId(categories[0]?.id || '');
      setIsNew(true); // By default, new additions are flagged as NEW!
      setPrice('1.50');
      setUnit('und');
      setNotes('');
      // Default to all active stores
      setSelectedStores(stores.map(s => s.id));
    }
    setError(null);
  }, [productToEdit, isOpen, categories, stores]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!code.trim()) {
      setError('El código es obligatorio para los cajeros.');
      return;
    }
    if (!name.trim()) {
      setError('El nombre del producto es obligatorio.');
      return;
    }
    if (!categoryId) {
      setError('Selecciona una categoría.');
      return;
    }

    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) {
      setError('El precio debe ser un número válido mayor o igual a 0.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        code: code.trim().toUpperCase(),
        barcode: barcode.trim() || undefined,
        name: name.trim(),
        description: description.trim() || undefined,
        categoryId,
        isNew,
        price: numPrice,
        unit,
        notes: notes.trim() || undefined,
        storeIds: selectedStores
      });
      showToast(
        productToEdit ? 'Producto actualizado correctamente' : '¡Nuevo producto registrado!',
        'success'
      );
      onClose();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStore = (storeId: string) => {
    setSelectedStores(prev =>
      prev.includes(storeId) ? prev.filter(id => id !== storeId) : [...prev, storeId]
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-150 flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-brand-50 text-brand-600 border border-brand-200">
              <PlusCircle className="w-5 h-5" />
            </span>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 font-mono">
                Módulo Administrador
              </span>
              <h2 id="form-modal-title" className="text-lg font-bold text-slate-900">
                {productToEdit ? 'Editar Producto / Código' : 'Agregar Nuevo Producto'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl"
            aria-label="Cerrar formulario"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Code and IsNew Checkbox */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="prod-code" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Código de Caja / PLU *
              </label>
              <input
                id="prod-code"
                ref={firstInputRef}
                type="text"
                required
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="Ej: 4988, 3010, PLU-12"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-base font-bold focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                El código que el cajero digita en la terminal POS.
              </p>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-emerald-300 bg-emerald-50/60 cursor-pointer hover:bg-emerald-50">
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={e => setIsNew(e.target.checked)}
                  className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <div>
                  <span className="text-sm font-bold text-emerald-950 block">
                    ¡Marcar como Producto NUEVO!
                  </span>
                  <span className="text-xs text-emerald-800">
                    Aparecerá destacado en la pestaña "Novedades" de los cajeros.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Name & Barcode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="prod-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nombre del Producto *
              </label>
              <input
                id="prod-name"
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej: Pitahaya Amarilla Importada"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
              />
            </div>

            <div>
              <label htmlFor="prod-barcode" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Código de Barras (Opcional)
              </label>
              <input
                id="prod-barcode"
                type="text"
                value={barcode}
                onChange={e => setBarcode(e.target.value)}
                placeholder="Ej: 7701234567890"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
              />
            </div>
          </div>

          {/* Category, Price, Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="prod-category" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Categoría *
              </label>
              <select
                id="prod-category"
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:bg-white focus:border-brand-500 outline-none"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="prod-price" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Precio *
              </label>
              <input
                id="prod-price"
                type="number"
                step="0.01"
                min="0"
                required
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm font-bold focus:bg-white focus:border-brand-500 outline-none"
              />
            </div>

            <div>
              <label htmlFor="prod-unit" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Unidad de Venta *
              </label>
              <select
                id="prod-unit"
                value={unit}
                onChange={e => setUnit(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:bg-white focus:border-brand-500 outline-none"
              >
                <option value="und">Unidad (und)</option>
                <option value="kg">Kilogramo (kg)</option>
                <option value="paquete">Paquete</option>
                <option value="malla">Malla</option>
                <option value="litro">Litro</option>
              </select>
            </div>
          </div>

          {/* Description & Cashier Notes */}
          <div>
            <label htmlFor="prod-notes" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Notas e Instrucciones para el Cajero
            </label>
            <input
              id="prod-notes"
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ej: Nuevo código esta semana. No confundir con la variedad roja."
              className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:border-brand-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="prod-desc" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Descripción General
            </label>
            <textarea
              id="prod-desc"
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Detalles sobre presentación, sabor, origen o conservación..."
              className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-normal focus:bg-white focus:border-brand-500 outline-none"
            />
          </div>

          {/* Multinational Stores Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-500" />
                <span>Tiendas de la Multinacional donde estará disponible:</span>
              </label>
              <button
                type="button"
                onClick={() => setSelectedStores(stores.map(s => s.id))}
                className="text-xs text-brand-600 hover:underline font-semibold"
              >
                Seleccionar todas ({stores.length})
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
              {stores.map(store => {
                const isSelected = selectedStores.includes(store.id);
                return (
                  <label
                    key={store.id}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-xs border transition-colors ${
                      isSelected ? 'bg-white border-brand-300 shadow-sm' : 'border-transparent text-slate-500'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleStore(store.id)}
                      className="rounded text-brand-600 focus:ring-brand-500"
                    />
                    <div className="truncate">
                      <span className="font-semibold text-slate-900 block truncate">{store.name}</span>
                      <span className="text-[10px] text-slate-500">{store.city}, {store.country}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-600/30 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Guardando...' : productToEdit ? 'Guardar Cambios' : 'Registrar Producto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
