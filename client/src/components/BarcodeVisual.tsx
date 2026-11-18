import React from 'react';

interface BarcodeVisualProps {
  value: string;
  className?: string;
}

export const BarcodeVisual: React.FC<BarcodeVisualProps> = ({ value, className = '' }) => {
  // Generate pseudo-deterministic barcode bar widths based on code characters
  const clean = value.replace(/[^0-9A-Za-z]/g, '') || '00000000';
  const bars: number[] = [];

  for (let i = 0; i < clean.length; i++) {
    const charCode = clean.charCodeAt(i);
    bars.push(1 + (charCode % 3));
    bars.push(1 + ((charCode >> 1) % 2));
    bars.push(1 + ((charCode >> 2) % 3));
  }

  return (
    <div className={`flex flex-col items-center bg-white p-3 rounded border border-slate-200 ${className}`}>
      <div className="flex items-end justify-center h-12 gap-[2px] w-full max-w-[240px] px-2 overflow-hidden" aria-hidden="true">
        {bars.map((w, idx) => (
          <div
            key={idx}
            className={`bg-slate-900 h-full`}
            style={{ width: `${w * 2}px` }}
          />
        ))}
      </div>
      <span className="font-mono text-xs tracking-widest text-slate-700 mt-1 font-semibold">
        {value}
      </span>
    </div>
  );
};
