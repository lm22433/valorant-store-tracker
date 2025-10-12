import React, { useState, useCallback } from 'react';
import { ProcessedStoreItem } from '../../store/types';

const StoreItemCard: React.FC<{ item: ProcessedStoreItem }> = ({ item }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:-translate-y-2 hover:border-[#ff4655]/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] before:absolute before:inset-y-0 before:left-[-100%] before:w-full before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:transition-all before:duration-500 before:content-[''] group-hover:before:left-[100%]">
      <div className="relative z-10">
        <div className="mb-6 flex h-40 w-full items-center justify-center overflow-hidden rounded-2xl bg-black/20">
          {!imageError && item.displayIcon ? (
            <img
              src={item.displayIcon}
              alt={item.displayName}
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white/5 text-sm font-medium uppercase tracking-widest text-white/50">
              No Image
            </div>
          )}
        </div>
        <div className="text-center">
          <h4 className="text-lg font-semibold text-white" title={item.displayName}>
            {item.displayName}
          </h4>
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-white/60">
            {item.category}
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#ff4655] to-[#ff6b35] px-6 py-3 font-semibold text-white">
            <span className="text-sm uppercase opacity-90">{item.currencyLabel || 'VP'}</span>
            <span className="text-base">{item.cost.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreItemCard;
