import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { BrandHero } from './components/BrandHero';
import { SearchAndFilters } from './components/SearchAndFilters';
import { ProductCard } from './components/ProductCard';
import { ProductTable } from './components/ProductTable';
import { ProductModal } from './components/ProductModal';
import { ProductFormModal } from './components/ProductFormModal';
import { StudyModeModal } from './components/StudyModeModal';
import { CheatSheetModal } from './components/CheatSheetModal';
import { LoginModal } from './components/LoginModal';
import { AuditModal } from './components/AuditModal';
import { ToastContainer } from './components/Toast';
import { Product, Category, Store, GeneralStats } from './types';
import { api } from './services/api';
import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';
import { useBrand } from './context/BrandContext';
import { 
  Sparkles, 
  RefreshCw,
  SearchX,
  AlertCircle
} from 'lucide-react';

export const App: React.FC = () => {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  const { adaptToStoreCode } = useBrand();

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [stats, setStats] = useState<GeneralStats>({
    totalProducts: 0,
    newProducts: 0,
    currentProducts: 0,
    totalStores: 0,
    totalCategories: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState('');
  const [isNewFilter, setIsNewFilter] = useState<number | undefined>(undefined);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Fetch initial master data
  const loadMasterData = useCallback(async () => {
    try {
      const [catsRes, storesRes, statsRes] = await Promise.all([
        api.getCategories(),
        api.getStores(),
        api.getStats()
      ]);
      setCategories(catsRes.categories);
      setStores(storesRes.stores);
      setStats(statsRes);
    } catch (err) {
      console.error('Error al cargar datos maestros:', err);
    }
  }, []);

  // Fetch products according to filters
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.getProducts({
        search: search.trim() || undefined,
        is_new: isNewFilter,
        category_id: selectedCategoryId || undefined,
        store_id: selectedStoreId || undefined
      });
      setProducts(res.items);
    } catch (err: unknown) {
      showToast((err as Error).message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [search, isNewFilter, selectedCategoryId, selectedStoreId, showToast]);

  useEffect(() => {
    loadMasterData();
  }, [loadMasterData]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Handle store change and auto-adapt brand
  const handleStoreChange = (storeId: string) => {
    setSelectedStoreId(storeId);
    const foundStore = stores.find(s => s.id === storeId);
    if (foundStore) {
      adaptToStoreCode(foundStore.code);
    }
  };

  // Find currently selected store object
  const currentStore = useMemo(() => {
    return stores.find(s => s.id === selectedStoreId);
  }, [stores, selectedStoreId]);

  // Modal Next & Previous product navigation
  const currentIndex = useMemo(() => {
    if (!selectedProduct) return -1;
    return products.findIndex(p => p.id === selectedProduct.id);
  }, [selectedProduct, products]);

  const handleNextProduct = useCallback(() => {
    if (currentIndex >= 0 && currentIndex + 1 < products.length) {
      setSelectedProduct(products[currentIndex + 1]);
    }
  }, [currentIndex, products]);

  const handlePrevProduct = useCallback(() => {
    if (currentIndex > 0) {
      setSelectedProduct(products[currentIndex - 1]);
    }
  }, [currentIndex, products]);

  // Admin actions
  const handleCreateOrUpdateProduct = async (formData: any) => {
    if (productToEdit) {
      await api.updateProduct(productToEdit.id, formData);
    } else {
      await api.createProduct(formData);
    }
    await loadProducts();
    await loadMasterData();
  };

  const handleToggleNew = async (product: Product) => {
    try {
      const updated = await api.toggleProductNew(product.id);
      showToast(
        updated.product.isNew === 1
          ? `Producto ${updated.product.code} marcado como NUEVO`
          : `Producto ${updated.product.code} marcado como ACTUAL`,
        'info'
      );
      await loadProducts();
      await loadMasterData();
    } catch (err: unknown) {
      showToast((err as Error).message, 'error');
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await api.deleteProduct(productToDelete.id);
      showToast(`Producto ${productToDelete.code} desactivado`, 'info');
      setProductToDelete(null);
      await loadProducts();
      await loadMasterData();
    } catch (err: unknown) {
      showToast((err as Error).message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-brand-500 selection:text-white transition-colors">
      
      {/* Toast Notification Layer */}
      <ToastContainer />

      {/* Primary Header with Adaptive Brand Selector */}
      <Navbar
        onOpenAddModal={() => {
          setProductToEdit(null);
          setIsAddModalOpen(true);
        }}
        onOpenStudyModal={() => setIsStudyModalOpen(true)}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Adaptive Brand Hero Banner */}
        <BrandHero
          currentStore={currentStore}
          stats={stats}
          filteredCount={products.length}
        />

        {/* Search, Filter Bar and Scope Switcher */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <SearchAndFilters
            search={search}
            onSearchChange={setSearch}
            isNewFilter={isNewFilter}
            onIsNewFilterChange={setIsNewFilter}
            selectedCategoryId={selectedCategoryId}
            onCategoryChange={setSelectedCategoryId}
            selectedStoreId={selectedStoreId}
            onStoreChange={handleStoreChange}
            categories={categories}
            stores={stores}
            totalCount={stats.totalProducts}
            newCount={stats.newProducts}
            currentCount={stats.currentProducts}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>

        {/* Products Results List / Grid */}
        <div>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <RefreshCw className="w-8 h-8 text-brand-600 animate-spin" />
              <p className="text-sm font-bold text-slate-500">Cargando catálogo adaptativo de códigos...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <SearchX className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                No se encontraron productos
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                No hay productos que coincidan con los filtros seleccionados
                {search ? ` ("${search}")` : ''}.
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setIsNewFilter(undefined);
                  setSelectedCategoryId('');
                  setSelectedStoreId('');
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                Limpiar todos los filtros
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenDetails={setSelectedProduct}
                  onEdit={p => {
                    setProductToEdit(p);
                    setIsAddModalOpen(true);
                  }}
                  onDelete={setProductToDelete}
                  onToggleNew={handleToggleNew}
                />
              ))}
            </div>
          ) : (
            <ProductTable
              products={products}
              onOpenDetails={setSelectedProduct}
              onEdit={p => {
                setProductToEdit(p);
                setIsAddModalOpen(true);
              }}
              onDelete={setProductToDelete}
              onToggleNew={handleToggleNew}
            />
          )}
        </div>

      </main>

      {/* Modals Layer */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onNext={handleNextProduct}
        onPrevious={handlePrevProduct}
      />

      <ProductFormModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setProductToEdit(null);
        }}
        onSubmit={handleCreateOrUpdateProduct}
        productToEdit={productToEdit}
        categories={categories}
        stores={stores}
      />

      <StudyModeModal
        isOpen={isStudyModalOpen}
        onClose={() => setIsStudyModalOpen(false)}
        products={products}
      />

      <CheatSheetModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        products={products}
        stores={stores}
        currentStoreId={selectedStoreId}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <AuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />

      {/* Delete Confirmation Dialog */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600">
              <span className="p-2 rounded-2xl bg-rose-50 border border-rose-200">
                <AlertCircle className="w-6 h-6" />
              </span>
              <h3 className="text-base font-black text-slate-900">¿Desactivar producto?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              ¿Estás seguro de que deseas desactivar el producto{' '}
              <strong className="text-slate-900 font-mono">[{productToDelete.code}] {productToDelete.name}</strong>?
              Ya no aparecerá en las consultas de los cajeros.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-colors"
              >
                Sí, desactivar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cashier Footer with WCAG notice */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 print:hidden transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-semibold text-slate-600">
            ActInvent © 2026 · Solución de Consulta y Novedades de Códigos para Cajeros
          </p>
          <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400">
            <span>Accesibilidad WCAG 2.2 AA</span>
            <span>•</span>
            <span>Diseño Multimarca Adaptativo</span>
            <span>•</span>
            <span>Monolito Modular</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
