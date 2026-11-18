import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Navbar } from './components/Navbar';
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
import { 
  Sparkles, 
  PackageOpen, 
  AlertCircle, 
  GraduationCap, 
  Building2, 
  RefreshCw,
  SearchX
} from 'lucide-react';

export const App: React.FC = () => {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();

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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      
      {/* Toast Notification Layer */}
      <ToastContainer />

      {/* Primary Header */}
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
        
        {/* Banner de Bienvenida y Foco para Cajeros */}
        <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-brand-950/20 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-8">
            <Building2 className="w-80 h-80 text-white" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold tracking-wide border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Sistema de Códigos PLU & Actualizaciones de Tienda</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              Aprende y consulta los códigos de productos al instante
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Diseñado para los cajeros de la multinacional. Olvídate de hacer hojas de códigos a mano: 
              encuentra códigos nuevos, revisa detalles en balanza y practica para memorizarlos.
            </p>

            {/* Quick Metrics Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold">
              <div 
                onClick={() => setIsNewFilter(1)}
                className="flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 px-3.5 py-1.5 rounded-xl cursor-pointer transition-all"
                title="Ver solo productos nuevos"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-extrabold text-emerald-300">{stats.newProducts} Códigos Nuevos</span>
                <span className="text-slate-300 text-xs">esta semana</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <span className="font-bold text-white">{stats.totalProducts}</span>
                <span>productos registrados</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <span className="font-bold text-white">{stats.totalStores}</span>
                <span>tiendas sincronizadas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search, Filter Bar and Scope Switcher */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
          <SearchAndFilters
            search={search}
            onSearchChange={setSearch}
            isNewFilter={isNewFilter}
            onIsNewFilterChange={setIsNewFilter}
            selectedCategoryId={selectedCategoryId}
            onCategoryChange={setSelectedCategoryId}
            selectedStoreId={selectedStoreId}
            onStoreChange={setSelectedStoreId}
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
              <p className="text-sm font-semibold text-slate-500">Cargando códigos de productos...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
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
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow"
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

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">ActInvent</span>
            <span>· Especificación Técnica según SKILLS.md</span>
          </div>
          <div className="flex items-center gap-4">
            <span>WCAG 2.2 AA Accesible</span>
            <span>·</span>
            <span>Monolito Modular SQLite</span>
            <span>·</span>
            <a href="/api/health" target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">
              API Health
            </a>
            <span>·</span>
            <a href="/api/openapi.json" target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">
              OpenAPI Spec
            </a>
          </div>
        </div>
      </footer>

      {/* MODAL 1: Product Details Modal (Requisito clave del usuario) */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onNext={currentIndex < products.length - 1 ? handleNextProduct : undefined}
        onPrevious={currentIndex > 0 ? handlePrevProduct : undefined}
      />

      {/* MODAL 2: Admin Add/Edit Product Modal */}
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

      {/* MODAL 3: Study Mode / Flashcards (Para que los cajeros memoricen códigos nuevos) */}
      <StudyModeModal
        isOpen={isStudyModalOpen}
        onClose={() => setIsStudyModalOpen(false)}
        products={products}
      />

      {/* MODAL 4: Printable Cheat-Sheet View (Para que no hagan tablas a mano) */}
      <CheatSheetModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        products={products}
        stores={stores}
        currentStoreId={selectedStoreId}
      />

      {/* MODAL 5: Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* MODAL 6: Audit Logs Modal */}
      <AuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />

      {/* Confirm Deactivate Dialog */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-100">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-full bg-rose-50 border border-rose-200">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">
                ¿Desactivar producto?
              </h3>
            </div>
            <p className="text-xs text-slate-600">
              ¿Seguro que deseas desactivar el producto <strong>{productToDelete.name}</strong> (Código {productToDelete.code})? Ya no aparecerá en las terminales de caja.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm"
              >
                Sí, Desactivar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
