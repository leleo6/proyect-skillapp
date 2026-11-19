import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBrand } from '../context/BrandContext';
import { AdaptiveBrandSwitcher } from './AdaptiveBrandSwitcher';
import { 
  Building2, 
  Leaf, 
  Zap, 
  Crown, 
  Monitor,
  PlusCircle, 
  GraduationCap, 
  Printer, 
  ShieldCheck, 
  LogOut, 
  LogIn, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  onOpenAddModal: () => void;
  onOpenStudyModal: () => void;
  onOpenPrintModal: () => void;
  onOpenAuditModal: () => void;
  onOpenLoginModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddModal,
  onOpenStudyModal,
  onOpenPrintModal,
  onOpenAuditModal,
  onOpenLoginModal
}) => {
  const { user, isAdmin, logout, quickLogin } = useAuth();
  const { activeBrand } = useBrand();
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const renderBrandIcon = (className = "w-5 h-5") => {
    switch (activeBrand.iconName) {
      case 'Leaf': return <Leaf className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Crown': return <Crown className={className} />;
      case 'Monitor': return <Monitor className={className} />;
      case 'Building2':
      default:
        return <Building2 className={className} />;
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Multinational Info with Adaptive Brand Gradient */}
          <div className="flex items-center gap-3 shrink-0">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md transition-all duration-300"
              style={{ 
                background: activeBrand.gradient,
                boxShadow: `0 4px 14px 0 ${activeBrand.glowRgba}` 
              }}
            >
              {renderBrandIcon("w-5 h-5")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  ActInvent
                </span>
                <span 
                  className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border transition-all"
                  style={{
                    backgroundColor: 'var(--color-brand-50)',
                    color: 'var(--color-brand-700)',
                    borderColor: 'var(--color-brand-200)'
                  }}
                >
                  {activeBrand.name.split(' ')[1] || 'POS'}
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Diseño de Marca Adaptativo · Terminal Cajeros
              </p>
            </div>
          </div>

          {/* Quick Actions & Navigation */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Adaptive Brand Switcher */}
            <AdaptiveBrandSwitcher />

            {/* Memorizar Códigos (Quiz / Flashcards para cajeros) */}
            <button
              onClick={onOpenStudyModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-xl text-emerald-800 bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 shadow-xs"
              title="Aprende y memoriza los códigos nuevos con tarjetas de práctica"
            >
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline">Modo Estudio</span>
            </button>

            {/* Imprimir Hoja de Códigos (Para no escribirla a mano) */}
            <button
              onClick={onOpenPrintModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 shadow-xs"
              title="Genera e imprime una tabla de códigos lista para pegar en la caja registradora"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span className="hidden lg:inline">Hoja Imprimible</span>
            </button>

            {/* Admin only: Auditoría */}
            {isAdmin && (
              <button
                onClick={onOpenAuditModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 shadow-xs"
                title="Historial de cambios y auditoría"
              >
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span className="hidden md:inline">Auditoría</span>
              </button>
            )}

            {/* Admin only: Agregar Producto */}
            {isAdmin && (
              <button
                onClick={onOpenAddModal}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl text-white shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                style={{
                  background: activeBrand.gradient,
                  boxShadow: `0 4px 12px 0 ${activeBrand.glowRgba}`
                }}
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Nuevo Producto</span>
              </button>
            )}

            {/* User / Session Switcher */}
            <div className="relative ml-1">
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-xs font-bold text-slate-900 leading-tight">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-500">
                      {user.role === 'admin' ? '🛡️ Admin' : '🏷️ Cajero'}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 border border-transparent hover:border-rose-200"
                    title="Cerrar sesión"
                    aria-label="Cerrar sesión"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={onOpenLoginModal}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  >
                    <LogIn className="w-4 h-4 text-slate-600" />
                    <span>Ingresar</span>
                  </button>

                  {/* Fast Demo Role Switcher */}
                  <div className="relative">
                    <button
                      onClick={() => setShowDemoMenu(!showDemoMenu)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-xl border transition-all"
                      style={{
                        backgroundColor: 'var(--color-brand-50)',
                        color: 'var(--color-brand-700)',
                        borderColor: 'var(--color-brand-200)'
                      }}
                      title="Cambiar rol de demostración rápidamente"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                      <span className="hidden sm:inline">Demo</span>
                      <ChevronDown className="w-3 h-3 text-brand-600" />
                    </button>

                    {showDemoMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Acceso Rápido de Prueba
                        </div>
                        <button
                          onClick={() => {
                            quickLogin('admin');
                            setShowDemoMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between text-slate-800"
                        >
                          <div>
                            <p className="font-semibold text-brand-700">🛡️ Administrador</p>
                            <p className="text-[11px] text-slate-500">Puede agregar y editar productos</p>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            quickLogin('cajero');
                            setShowDemoMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between text-slate-800"
                        >
                          <div>
                            <p className="font-semibold text-emerald-700">🏷️ Cajero</p>
                            <p className="text-[11px] text-slate-500">Consulta códigos y estudia</p>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
