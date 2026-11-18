import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  PlusCircle, 
  GraduationCap, 
  Printer, 
  ShieldCheck, 
  LogOut, 
  LogIn, 
  User as UserIcon,
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
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Multinational Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-slate-900">ActInvent</span>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                  Multinacional POS
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Códigos de productos y novedades para cajeros
              </p>
            </div>
          </div>

          {/* Quick Actions & Navigation */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Memorizar Códigos (Quiz / Flashcards para cajeros) */}
            <button
              onClick={onOpenStudyModal}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              title="Aprende y memoriza los códigos nuevos con tarjetas de práctica"
            >
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline">Modo Estudio</span>
              <span className="inline-flex items-center px-1.5 py-0.2 text-[10px] bg-emerald-200 text-emerald-800 rounded font-bold">
                Aprender
              </span>
            </button>

            {/* Imprimir Hoja de Códigos (Para no escribirla a mano) */}
            <button
              onClick={onOpenPrintModal}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              title="Genera e imprime una tabla de códigos lista para pegar en la caja registradora"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span className="hidden lg:inline">Hoja Imprimible</span>
            </button>

            {/* Admin only: Auditoría */}
            {isAdmin && (
              <button
                onClick={onOpenAuditModal}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
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
                className="inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg text-white bg-brand-600 hover:bg-brand-700 shadow-sm shadow-brand-600/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Agregar Producto</span>
              </button>
            )}

            {/* User / Session Switcher */}
            <div className="relative ml-1">
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-xs font-semibold text-slate-900 leading-tight">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-500">
                      {user.role === 'admin' ? '🛡️ Admin' : '🏷️ Cajero'}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                    title="Cerrar sesión"
                    aria-label="Cerrar sesión"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={onOpenLoginModal}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  >
                    <LogIn className="w-4 h-4 text-slate-600" />
                    <span>Ingresar</span>
                  </button>

                  {/* Fast Demo Role Switcher */}
                  <div className="relative">
                    <button
                      onClick={() => setShowDemoMenu(!showDemoMenu)}
                      className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-lg"
                      title="Cambiar rol de demostración rápidamente"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                      <span>Roles Demo</span>
                      <ChevronDown className="w-3 h-3 text-brand-600" />
                    </button>

                    {showDemoMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
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
