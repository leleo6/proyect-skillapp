import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { X, GraduationCap, Sparkles, CheckCircle2, RotateCcw, ArrowRight, Eye, Trophy } from 'lucide-react';

interface StudyModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

export const StudyModeModal: React.FC<StudyModeModalProps> = ({ isOpen, onClose, products }) => {
  // Focus primarily on new products, or fallback to all
  const studyList = products.filter(p => p.isNew === 1).length > 0
    ? products.filter(p => p.isNew === 1)
    : products;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [cashierInput, setCashierInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setShowAnswer(false);
      setCashierInput('');
      setFeedback(null);
      setScore(0);
      setIsCompleted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentProduct = studyList[currentIndex];

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!cashierInput.trim()) return;

    if (cashierInput.trim().toUpperCase() === currentProduct.code.toUpperCase()) {
      setFeedback('correct');
      setScore(s => s + 1);
    } else {
      setFeedback('wrong');
    }
    setShowAnswer(true);
  };

  const handleNext = () => {
    if (currentIndex + 1 < studyList.length) {
      setCurrentIndex(i => i + 1);
      setShowAnswer(false);
      setCashierInput('');
      setFeedback(null);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setCashierInput('');
    setFeedback(null);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-emerald-50/80">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                Capacitación de Caja
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Aprende y Memoriza los Códigos Nuevos
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-emerald-100 rounded-xl"
            aria-label="Cerrar modo estudio"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isCompleted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                ¡Entrenamiento Completado!
              </h3>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                Has repasado todos los productos nuevos de esta semana. Puntuación obtenida:
              </p>
              <div className="font-mono text-3xl font-extrabold text-emerald-600">
                {score} / {studyList.length} Aciertos
              </div>
              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 shadow"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Repetir Práctica</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Terminar
                </button>
              </div>
            </div>
          ) : currentProduct ? (
            <div className="space-y-6">
              
              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
                  <span>Producto {currentIndex + 1} de {studyList.length}</span>
                  <span className="text-emerald-700 font-bold">{score} Acertados</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2 transition-all duration-300 rounded-full"
                    style={{ width: `${((currentIndex + 1) / studyList.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Flashcard Box */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200 shadow-sm text-center space-y-3">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                  {currentProduct.categoryName}
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {currentProduct.name}
                </h3>
                {currentProduct.notes && (
                  <p className="text-xs text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                    💡 Pista / Nota: {currentProduct.notes}
                  </p>
                )}

                {/* Answer Display */}
                {showAnswer ? (
                  <div className={`mt-4 p-4 rounded-xl border text-center animate-in zoom-in-95 duration-150 ${
                    feedback === 'correct'
                      ? 'bg-emerald-50 border-emerald-300'
                      : feedback === 'wrong'
                      ? 'bg-rose-50 border-rose-300'
                      : 'bg-slate-100 border-slate-300'
                  }`}>
                    {feedback === 'correct' && (
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                        ¡Correcto! Excelente memoria de cajero
                      </span>
                    )}
                    {feedback === 'wrong' && (
                      <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block mb-1">
                        Respuesta incorrecta. El código oficial es:
                      </span>
                    )}
                    <div className="font-mono text-4xl font-black text-slate-900 tracking-wider">
                      {currentProduct.code}
                    </div>
                    <span className="text-xs text-slate-500 block mt-1 font-medium">
                      Precio: ${currentProduct.price.toFixed(2)} por {currentProduct.unit}
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleVerify} className="mt-4 flex flex-col items-center gap-3">
                    <label htmlFor="quiz-code-input" className="text-xs font-bold text-slate-600">
                      Digita el código de este producto:
                    </label>
                    <div className="flex items-center gap-2 max-w-xs w-full">
                      <input
                        id="quiz-code-input"
                        type="text"
                        autoFocus
                        value={cashierInput}
                        onChange={e => setCashierInput(e.target.value.toUpperCase())}
                        placeholder="Ej: 4988"
                        className="w-full text-center font-mono text-xl font-bold py-2 px-3 border border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      />
                      <button
                        type="submit"
                        disabled={!cashierInput.trim()}
                        className="px-4 py-2.5 font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow disabled:opacity-50"
                      >
                        Verificar
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                {!showAnswer ? (
                  <button
                    onClick={() => setShowAnswer(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800"
                  >
                    <Eye className="w-4 h-4" />
                    <span>No me acuerdo (Revelar código)</span>
                  </button>
                ) : (
                  <div />
                )}

                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white shadow ml-auto"
                >
                  <span>{currentIndex + 1 < studyList.length ? 'Siguiente Producto' : 'Ver Resultados'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : (
            <p className="text-center text-slate-500 py-6">No hay productos para repasar.</p>
          )}
        </div>

      </div>
    </div>
  );
};
